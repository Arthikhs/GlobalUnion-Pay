import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  userId?: string;
  phone: string;
  fullName: string;
  email: string;
  profileImageUrl?: string;
  kycStatus: string;
  phoneVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        set({ user, token: accessToken, accessToken, refreshToken, isAuthenticated: true });
      },
      logout: () => {
        localStorage.clear();
        set({ user: null, token: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    { name: 'auth-store' }
  )
);

interface WalletState {
  balance: number;
  walletBalance: number;
  bankBalance: number;
  setBalance: (balance: number) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 0,
  walletBalance: 0,
  bankBalance: 0,
  setBalance: (balance) => set({ balance }),
}));
