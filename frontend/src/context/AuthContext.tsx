import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/api';

export type UserRole = 'CLIENT' | 'TASKER' | 'ADMIN';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
  semester?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole;
  walletBalance: number;
  login: (user: User, token: string) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => Promise<void>;
  refreshWallet: () => Promise<void>;
  updateBalance: (deltaOrAmount: number, isAbsolute?: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('CLIENT');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(12500);

  // Authenticate role with backend
  const authenticateForRole = async (targetRole: UserRole) => {
    let email = 'junaid@ucp.edu.pk';
    if (targetRole === 'TASKER') email = 'hamza.malik@ucp.edu.pk';
    if (targetRole === 'ADMIN') email = 'admin@ucp.edu.pk';

    try {
      const res = await apiClient.post(`/auth/${targetRole.toLowerCase()}/login`, {
        email,
        password: 'password123',
      });

      const jwtToken = res.data.access_token;
      setToken(jwtToken);
      localStorage.setItem('campus_gig_token', jwtToken);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;

      const userData: User = {
        id: res.data.user.id,
        fullName: res.data.user.fullName,
        email: res.data.user.email,
        role: targetRole,
        department: targetRole === 'ADMIN' ? 'Administration' : 'Computer Science',
        semester: targetRole === 'CLIENT' ? 6 : targetRole === 'TASKER' ? 7 : undefined,
        avatarUrl:
          targetRole === 'CLIENT'
            ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80'
            : targetRole === 'TASKER'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'
            : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80',
      };
      setUser(userData);
      localStorage.setItem('campus_gig_user', JSON.stringify(userData));

      // Fetch real wallet
      await fetchWalletBalance(targetRole, jwtToken);
    } catch {
      // In case of network error, use active offline fallback
    }
  };

  const fetchWalletBalance = async (userRole: UserRole, currentToken?: string) => {
    try {
      const authHeader = currentToken ? { Authorization: `Bearer ${currentToken}` } : undefined;
      if (userRole === 'CLIENT') {
        const res = await apiClient.get('/wallet/client/my-wallet', { headers: authHeader });
        if (res.data && res.data.balance !== undefined) {
          setWalletBalance(res.data.balance);
        }
      } else if (userRole === 'TASKER') {
        const res = await apiClient.get('/wallet/tasker/my-wallet', { headers: authHeader });
        if (res.data && res.data.wallet && res.data.wallet.balance !== undefined) {
          setWalletBalance(res.data.wallet.balance);
        }
      }
    } catch {
      // Keep state
    }
  };

  useEffect(() => {
    authenticateForRole('CLIENT');
  }, []);

  const login = (userData: User, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    setRole(userData.role);
    localStorage.setItem('campus_gig_token', jwtToken);
    localStorage.setItem('campus_gig_user', JSON.stringify(userData));
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    fetchWalletBalance(userData.role, jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('campus_gig_user');
    localStorage.removeItem('campus_gig_token');
    delete apiClient.defaults.headers.common['Authorization'];
  };

  const switchRole = async (newRole: UserRole) => {
    setRole(newRole);
    await authenticateForRole(newRole);
  };

  const refreshWallet = async () => {
    await fetchWalletBalance(role, token || undefined);
  };

  const updateBalance = (deltaOrAmount: number, isAbsolute = false) => {
    setWalletBalance((prev) => {
      const next = isAbsolute ? deltaOrAmount : prev + deltaOrAmount;
      return Math.max(0, next);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        walletBalance,
        login,
        logout,
        switchRole,
        refreshWallet,
        updateBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
