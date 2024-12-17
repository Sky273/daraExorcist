import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SubscriptionPlan = 'starter' | 'professional' | 'enterprise';

interface SubscriptionState {
  currentPlan: SubscriptionPlan | null;
  isActive: boolean;
  expiresAt: string | null;
  setPlan: (plan: SubscriptionPlan, expiresAt: string) => void;
  clearPlan: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      currentPlan: null,
      isActive: false,
      expiresAt: null,
      setPlan: (plan, expiresAt) => 
        set({ currentPlan: plan, isActive: true, expiresAt }),
      clearPlan: () => 
        set({ currentPlan: null, isActive: false, expiresAt: null }),
    }),
    {
      name: 'subscription-storage',
    }
  )
);
