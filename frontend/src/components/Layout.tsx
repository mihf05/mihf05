import React from 'react';
import { Box, Container, Flex, Button, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <Box minH="100vh">
      <Box as="nav" bg="blue.500" color="white" py={4}>
        <Container maxW="container.xl">
          <Flex alignItems="center">
            <Text fontSize="xl" fontWeight="bold">
              <RouterLink to="/">Employee Management System</RouterLink>
            </Text>
            <Flex ml="auto" gap={4} alignItems="center">
              {isAuthenticated ? (
                <>
                  <Text>Welcome, {user?.full_name}</Text>
                  <Button colorScheme="whiteAlpha" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <RouterLink to="/login">Login</RouterLink>
              )}
            </Flex>
          </Flex>
        </Container>
      </Box>
      <Container maxW="container.xl" py={8}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
