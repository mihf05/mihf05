import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Add global error handler
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', { message, source, lineno, colno, error });
  return false;
};

// Add unhandled promise rejection handler
window.onunhandledrejection = function(event) {
  console.error('Unhandled promise rejection:', event.reason);
};

console.log('Starting application initialization...');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

try {
  console.log('Rendering React application...');
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
  console.log('React application rendered successfully');
} catch (error) {
  console.error('Failed to render React application:', error);
}
