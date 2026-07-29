import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TransactionProvider } from './TransactionContext';
import { AccountProvider } from './AccountContext';
import LoginPage from './pages/LoginPage';
import Dashboard, { DashboardLayout } from './pages/Dashboard';
import BankDetails from './components/BankDetails';
import CreateAccount from './components/CreateAccount';
import Deposit from './components/Deposit';
import CustomerDetails from './components/CustomerDetails';
import LoanDetails from './components/LoanDetails';
import ATMCard from './components/ATMCard';
import ATMMachine from './components/ATMMachine';
import FundTransfer from './components/FundTransfer';

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
            <Route path="/atm" element={<ATMMachine />} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="bank-details" element={<BankDetails />} />
              <Route path="create-account" element={<CreateAccount />} />
              <Route path="deposit" element={<Deposit />} />
              <Route path="customer-details" element={<CustomerDetails />} />
              <Route path="loan-details" element={<LoanDetails />} />
              <Route path="atm-card" element={<ATMCard />} />
              <Route path="fund-transfer" element={<FundTransfer />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </AccountProvider>
    </TransactionProvider>
  );
}

export default App;
