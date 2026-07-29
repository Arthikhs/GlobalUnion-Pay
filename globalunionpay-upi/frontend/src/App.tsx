import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/store';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Dashboard from './components/dashboard/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import UpiPage from './pages/UpiPage';
import WalletPage from './pages/WalletPage';
import ProfilePage from './pages/ProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';
import MerchantPage from './pages/MerchantPage';
import ContactsPage from './pages/ContactsPage';
import CardsPage from './pages/CardsPage';
import RewardsPage from './pages/RewardsPage';
import RechargePage from './pages/RechargePage';
import QRPage from './pages/QRPage';
import FraudPage from './pages/FraudPage';
import SettingsPage from './pages/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
  },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/" element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="upi" element={<UpiPage />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="merchant" element={<MerchantPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="cards" element={<CardsPage />} />
            <Route path="rewards" element={<RewardsPage />} />
            <Route path="recharge" element={<RechargePage />} />
            <Route path="qr" element={<QRPage />} />
            <Route path="fraud" element={<FraudPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
