import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const COOKIE_CONSENT_KEY = 'batman_cookie_consent';

const useCookieStore = create(
  persist(
    (set) => ({
      consent: null,
      setConsent: (value) => set({ consent: value }),
      resetConsent: () => set({ consent: null }),
    }),
    {
      name: COOKIE_CONSENT_KEY,
      getStorage: () => localStorage,
    }
  )
);

export default useCookieStore;