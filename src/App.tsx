import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme-provider';
import { AdminProvider } from './contexts/AdminContext';
import Layout from './components/layout';
import AppRoutes from './routes';
import ErrorBoundary from './components/error-boundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <AdminProvider>
          <ErrorBoundary>
            <BrowserRouter>
              <Layout>
                <AppRoutes />
              </Layout>
            </BrowserRouter>
          </ErrorBoundary>
        </AdminProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;