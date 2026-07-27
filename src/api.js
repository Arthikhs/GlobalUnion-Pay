const BASE = 'http://localhost:8080/api';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
});

export const loginApi = (employeeId, password) =>
  fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeId, password }),
  });

export const createAccountApi = (data) =>
  fetch(`${BASE}/accounts`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

export const depositApi = (data) =>
  fetch(`${BASE}/transactions/deposit`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

export const getAccountsApi = () =>
  fetch(`${BASE}/accounts`, { headers: authHeaders() });

export const getTransactionsApi = () =>
  fetch(`${BASE}/transactions`, { headers: authHeaders() });

export const getAccountByNumberApi = (accNumber) =>
  fetch(`${BASE}/accounts/by-number/${accNumber}`, { headers: authHeaders() });

export const updateAccountApi = (id, data) =>
  fetch(`${BASE}/accounts/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) });

export const deleteAccountApi = (id) =>
  fetch(`${BASE}/accounts/${id}`, { method: 'DELETE', headers: authHeaders() });

export const getLoansApi = () =>
  fetch(`${BASE}/loans`, { headers: authHeaders() });

export const createLoanApi = (data) =>
  fetch(`${BASE}/loans`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) });

export const closeLoanApi = (id) =>
  fetch(`${BASE}/loans/${id}/close`, { method: 'PUT', headers: authHeaders() });
