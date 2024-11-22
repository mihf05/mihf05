import axios, { AxiosError } from 'axios';

// Use environment variable for API URL with fallback
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://employee-management-system-vbqpcwle.fly.dev/api/v1';

console.log('API Base URL:', API_BASE_URL);

// Custom error class for API connection issues
export class APIConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIConnectionError';
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 second timeout
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  console.log('Request Config:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data
  });
  return config;
}, (error) => {
  console.error('Request Interceptor Error:', error);
  return Promise.reject(error);
});

// Handle token expiration, retries, and log responses
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  async (error) => {
    console.error('Response Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });

    const config = error.config;

    // Initialize retry count if it doesn't exist
    config.retryCount = config.retryCount || 0;

    // Only retry on network errors or 5xx errors, up to 2 times
    if (!error.response && config.retryCount < 2) {
      config.retryCount += 1;
      const delayMs = 1000 * config.retryCount; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delayMs));
      return api(config);
    }

    // Handle different types of errors
    if (!error.response) {
      throw new APIConnectionError(
        'Unable to connect to the server. Please check your internet connection or try again later.'
      );
    }

    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Your session has expired. Please log in again.');
    }

    if (error.response.status === 503 || error.response.status === 502) {
      throw new APIConnectionError('The server is currently unavailable. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append('username', email);  // OAuth2 expects 'username', not 'email'
  formData.append('password', password);

  console.log('Login request details:', {
    url: `${API_BASE_URL}/auth/login`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    formData: Object.fromEntries(formData),
  });

  try {
    console.log('Sending login request...');
    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
      try {
        const response = await api.post('/auth/login', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          withCredentials: true,
        });
        console.log('Login response received:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          headers: response.headers,
        });
        return response.data;
      } catch (retryError: any) {
        if (retryError.response || retryCount === maxRetries) {
          throw retryError;
        }
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }
  } catch (error: unknown) {
    console.error('Login error caught:', error);
    if (error instanceof AxiosError) {
      console.error('Login error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data,
        },
      });
    }
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    if (error instanceof APIConnectionError) {
      throw error;
    }
    if (error instanceof AxiosError && !error.response) {
      throw new APIConnectionError('Unable to fetch user data. Please check your connection.');
    }
    throw error;
  }
};

// Employee endpoints
export const getSalaries = async () => {
  const response = await api.get('/salary/user/me');
  return response.data;
};

export const getLoans = async () => {
  const response = await api.get('/salary/loans/user/me');
  return response.data;
};

export const requestLoan = async (amount: number) => {
  const response = await api.post('/salary/loans/create', { amount });
  return response.data;
};

// HR endpoints
export const getEmployees = async () => {
  const response = await api.get('/users/');
  return response.data;
};

export const createEmployee = async (data: {
  email: string;
  password: string;
  full_name: string;
}) => {
  const response = await api.post('/users/', data);
  return response.data;
};

export const getAllLoans = async () => {
  const response = await api.get('/salary/loans/');
  return response.data;
};

export const updateLoanStatus = async (loanId: number, status: string) => {
  const response = await api.put(`/salary/loans/${loanId}`, { status });
  return response.data;
};

export default api;
