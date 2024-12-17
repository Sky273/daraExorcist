import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SignJWT } from 'jose';
import { tables, UserRecord, UserRole, UserStatus, usersTable } from '../config/airtable';
import { hashPassword, verifyPassword } from '../utils/password';

const JWT_SECRET = import.meta.env.VITE_JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not configured');
}

const secret = new TextEncoder().encode(JWT_SECRET);

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  status: UserStatus;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
  signInWithOAuth: (provider: string, token: string) => Promise<{ user: User; token: string }>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      signIn: async (email, password) => {
        try {
          set({ loading: true, error: null });

          const user = await usersTable.findByEmail(email);
          if (!user) {
            throw new Error('Invalid email or password');
          }

          const isValid = await verifyPassword(password, user.fields.password);
          if (!isValid) {
            throw new Error('Invalid email or password');
          }

          const token = await new SignJWT({ 
            id: user.id,
            email: user.fields.email,
            role: user.fields.role
          })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(secret);

          set({ 
            user: {
              id: user.id,
              email: user.fields.email,
              name: user.fields.name,
              role: user.fields.role,
              status: user.fields.status
            },
            token,
            error: null
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
          set({ 
            error: errorMessage,
            user: null,
            token: null
          });
          throw new Error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },
      signInWithOAuth: async (provider: string, token: string) => {
        try {
          set({ loading: true, error: null });

          // Fetch user info from OAuth provider
          let userInfo;
          if (provider === 'google') {
            try {
              const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${token}` }
              });
              
              if (!response.ok) {
                throw new Error('Failed to fetch user information from Google');
              }
              
              userInfo = await response.json();
            } catch (error) {
              console.error('Error fetching Google user info:', error);
              throw new Error('Failed to authenticate with Google');
            }
          }

          if (!userInfo?.email) {
            throw new Error('Failed to get user information');
          }

          // Check if user exists
          let user = await usersTable.findByEmail(userInfo.email);

          if (!user) {
            // Create new user with inactive status
            user = await usersTable.create({
              email: userInfo.email,
              name: userInfo.name,
              password: await hashPassword(Math.random().toString(36)), // Random password for OAuth users
              role: UserRole.User,
              status: UserStatus.Inactive // Set new OAuth users as inactive by default
            });
          }

          // Generate JWT
          const jwtToken = await new SignJWT({ 
            id: user.id,
            email: user.fields.email,
            role: user.fields.role
          })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(secret);

          const authUser = {
            id: user.id,
            email: user.fields.email,
            name: user.fields.name,
            role: user.fields.role,
            status: user.fields.status
          };

          set({ 
            user: authUser,
            token: jwtToken,
            error: null
          });

          return { user: authUser, token: jwtToken };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'OAuth authentication failed';
          set({ 
            error: errorMessage,
            user: null,
            token: null
          });
          throw new Error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },
      signUp: async (email, password, name) => {
        try {
          set({ loading: true, error: null });

          // Check if user already exists
          const existing = await usersTable.findByEmail(email);
          if (existing) {
            throw new Error('Email already registered');
          }

          // Hash password before storing
          const hashedPassword = await hashPassword(password);

          // Create new user with inactive status
          const newUser = await usersTable.create({
            email,
            password: hashedPassword,
            name,
            role: UserRole.User,
            status: UserStatus.Inactive,
            createdAt: new Date().toISOString()
          });

          // Generate JWT token
          const token = await new SignJWT({ 
            id: newUser.id,
            email: newUser.fields.email,
            role: newUser.fields.role
          })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(secret);

          set({ 
            user: {
              id: newUser.id,
              email: newUser.fields.email,
              name: newUser.fields.name,
              role: newUser.fields.role,
              status: newUser.fields.status
            },
            token,
            error: null
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          set({ 
            error: errorMessage,
            user: null,
            token: null
          });
          throw new Error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },
      signOut: async () => {
        set({ user: null, token: null, error: null });
      },
      setUser: (user) => set({ user }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token })
    }
  )
);
