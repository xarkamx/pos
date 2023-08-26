import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import { PopUpContextProvider } from './context/PopUpContext';
import { AuthProvider } from './context/authContext';
// ----------------------------------------------------------------------
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 20000,
    }
  },
})
export default function App () {

  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <PopUpContextProvider>
            <ThemeProvider>
              <ScrollToTop />
              <StyledChart />
              <QueryClientProvider client={queryClient}>
                <Router />
                <ReactQueryDevtools initialIsOpen />
              </QueryClientProvider>
            </ThemeProvider>
          </PopUpContextProvider>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}
