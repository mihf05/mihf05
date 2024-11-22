import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LoginForm from './components/auth/LoginForm';
import EmployeeDashboard from './components/dashboard/EmployeeDashboard';
import HRDashboard from './components/dashboard/HRDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import TestPage from './components/TestPage';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isHR, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginForm /> : <Navigate to="/dashboard" />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              isHR ? <HRDashboard /> : <EmployeeDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  console.log('App component rendering');
  return (
    <ErrorBoundary>
      <ChakraProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<TestPage />} />
              <Route path="/*" element={<AppRoutes />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ChakraProvider>
    </ErrorBoundary>
  );
};

export default App;
