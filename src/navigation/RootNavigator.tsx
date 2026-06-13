import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { AppNavigator } from './AppNavigator';
import { AuthScreen } from '../screens/AuthScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { View, StyleSheet, Animated } from 'react-native';

export const RootNavigator = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(1));
  const dispatch = useDispatch();
  const { isAuthenticated, hasCompletedOnboarding } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Force user to authenticate every time the app is opened
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setIsSplashVisible(false));
    }, 2000);

    return () => clearTimeout(timer);
  }, [fadeAnim]);

  const renderContent = () => {
    if (!hasCompletedOnboarding) {
      return <OnboardingScreen />;
    }
    return isAuthenticated ? <AppNavigator /> : <AuthScreen />;
  };

  return (
    <View style={styles.container}>
      {renderContent()}
      
      {isSplashVisible && (
        <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
          <SplashScreen />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashContainer: {
    ...StyleSheet.absoluteFill as any,
    zIndex: 999,
  },
});
