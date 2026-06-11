import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  pinCode: string | null;
  biometricEnabled: boolean;
  hasCompletedOnboarding: boolean;
  userName: string;
  userEmail: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  pinCode: null,
  biometricEnabled: false,
  hasCompletedOnboarding: false,
  userName: 'User',
  userEmail: 'user@example.com',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
    setPin: (state, action: PayloadAction<string>) => {
      state.pinCode = action.payload;
    },
    toggleBiometric: (state, action: PayloadAction<boolean>) => {
      state.biometricEnabled = action.payload;
    },
    completeOnboarding: (state) => {
      state.hasCompletedOnboarding = true;
      state.isAuthenticated = true; // Auto-login after onboarding
    },
    updateProfile: (state, action: PayloadAction<{ name: string; email: string }>) => {
      state.userName = action.payload.name;
      state.userEmail = action.payload.email;
    },
    resetAuth: (state) => {
      state.isAuthenticated = false;
      state.pinCode = null;
      state.hasCompletedOnboarding = false;
      state.biometricEnabled = false;
      state.userName = 'User';
      state.userEmail = 'user@example.com';
    },
  },
});

export const { login, logout, setPin, toggleBiometric, completeOnboarding, updateProfile, resetAuth } = authSlice.actions;
export default authSlice.reducer;
