import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TransactionProvider } from './TransactionContext';
import { AccountProvider } from './AccountContext';
import LoginPage from './pages/LoginPage';
import Dashboard, { DashboardLayout } from './pages/Dashboard';
import BankDetails from './components/BankDetails';
import CreateAccount from './components/CreateAccount';
import Deposit from './components/Deposit';

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/" />;
}

function App() {
  return (
    <TransactionProvider>
      <AccountProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="bank-details" element={<BankDetails onBack={null} />} />
              <Route path="create-account" element={<CreateAccount onBack={null} />} />
              <Route path="deposit" element={<Deposit onBack={null} />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </AccountProvider>
    </TransactionProvider>
  );
}

export default App;
