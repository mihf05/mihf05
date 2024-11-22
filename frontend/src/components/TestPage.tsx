import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { getCurrentUser } from '../utils/api';
import { APIConnectionError } from '../utils/api';

const TestPage: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        await getCurrentUser();
        setApiStatus('connected');
        setErrorMessage(null);
      } catch (error) {
        setApiStatus('error');
        if (error instanceof APIConnectionError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('An unexpected error occurred while connecting to the server.');
        }
        console.error('API Connection Error:', error);
      }
    };

    checkApiConnection();
  }, []);

  return (
    <VStack spacing={4} p={5}>
      <Text fontSize="2xl">System Status</Text>
      <Box>
        <Text>Environment: {process.env.NODE_ENV}</Text>
        <Text>API URL: {process.env.REACT_APP_API_URL}</Text>
      </Box>

      {apiStatus === 'loading' && (
        <Alert status="info">
          <AlertIcon />
          <AlertTitle>Checking Connection</AlertTitle>
          <AlertDescription>Verifying connection to the backend server...</AlertDescription>
        </Alert>
      )}

      {apiStatus === 'connected' && (
        <Alert status="success">
          <AlertIcon />
          <AlertTitle>Connected</AlertTitle>
          <AlertDescription>Successfully connected to the backend server.</AlertDescription>
        </Alert>
      )}

      {apiStatus === 'error' && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </VStack>
  );
};

export default TestPage;
