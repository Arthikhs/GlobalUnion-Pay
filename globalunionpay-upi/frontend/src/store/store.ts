import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id?: number;
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
  bankName: string | null;
  setBankName: (name: string) => void;
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
      bankName: null,
      setBankName: (name) => set({ bankName: name }),
      setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        set({ user, token: accessToken, accessToken, refreshToken, isAuthenticated: true });
      },
      logout: () => {
        localStorage.clear();
        set({ user: null, token: null, accessToken: null, refreshToken: null, isAuthenticated: false, bankName: null });
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

// ── Real-time Notification Store ──────────────────────────────
export interface AppNotification {
  id: string;
  icon: string;
  title: string;
  time: string;
  read: boolean;
}

interface NotifState {
  notifications: AppNotification[];
  addNotification: (n: Omit<AppNotification, 'id' | 'time' | 'read'>) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

export const useNotifStore = create<NotifState>((set) => ({
  notifications: [],
  addNotification: (n) => set((s) => ({
    notifications: [
      { ...n, id: Date.now().toString(), time: 'Just now', read: false },
      ...s.notifications.slice(0, 19),
    ],
  })),
  markAllRead: () => set((s) => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) })),
  clearAll: () => set({ notifications: [] }),
}));
