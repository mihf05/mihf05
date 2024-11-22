import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { login as apiLogin } from '../../utils/api';

interface DebugInfo {
  formData?: {
    email: string;
    password: string;
  };
  response?: any;
  error?: {
    message: string;
    response?: any;
    status?: number;
  };
}

const LoginForm = (): React.ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    setDebugInfo({
      formData: {
        email,
        password: '***'
      }
    });

    try {
      console.log('Attempting login with API URL:', process.env.REACT_APP_API_URL);
      const response = await apiLogin(email, password);

      setDebugInfo((prev: DebugInfo | null) => ({
        ...prev,
        response
      }));

      if (response?.access_token) {
        login(response.access_token);
        toast({
          title: 'Success',
          description: 'Login successful',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      let message = 'Unable to connect to the server. Please try again later.';

      if (err.response) {
        message = err.response.data?.detail || 'Login failed. Please check your credentials.';
      } else if (err.request) {
        message = 'Network error. Please check your internet connection.';
      }

      setDebugInfo((prev: DebugInfo | null) => ({
        ...prev,
        error: {
          message,
          response: err.response?.data,
          status: err.response?.status,
          connectionError: !err.response
        }
      }));

      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <Heading mb={6} textAlign="center">Login to Employee Portal</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              autoComplete="email"
              disabled={isLoading}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              autoComplete="current-password"
              disabled={isLoading}
            />
          </FormControl>
          {error && (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          )}
          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={isLoading}
            loadingText="Logging in..."
          >
            Login
          </Button>

          {debugInfo && (
            <Box mt={4} p={4} bg="gray.100" borderRadius="md">
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </Box>
          )}
        </VStack>
      </form>
    </Box>
  );
};

export default LoginForm;
