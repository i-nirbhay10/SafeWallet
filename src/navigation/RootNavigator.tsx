import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { AppNavigator } from './AppNavigator';
import { AuthScreen } from '../screens/AuthScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';

export const RootNavigator = () => {
  const { isAuthenticated, hasCompletedOnboarding } = useSelector((state: RootState) => state.auth);

  if (!hasCompletedOnboarding) {
    return <OnboardingScreen />;
  }

  return isAuthenticated ? <AppNavigator /> : <AuthScreen />;
};
