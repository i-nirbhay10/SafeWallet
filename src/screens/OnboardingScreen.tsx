import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { setPin, completeOnboarding } from '../store/slices/authSlice';



export const OnboardingScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const dispatch = useDispatch();
  
  const [step, setStep] = useState(0);
  const [pin, setLocalPin] = useState('');

  const slides = [
    {
      title: "Welcome to SafeWallet",
      subtitle: "The most secure and elegant way to track your personal finances.",
      icon: "wallet",
    },
    {
      title: "Powerful Insights",
      subtitle: "Visualize your spending habits and take control of your wealth.",
      icon: "pie-chart",
    },
    {
      title: "Secure Your Data",
      subtitle: "Let's set up a 4-digit PIN to keep your financial data private.",
      icon: "lock-closed",
    }
  ];

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Final step: set PIN
      if (pin.length === 4) {
        dispatch(setPin(pin));
        dispatch(completeOnboarding());
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Icon name={slides[step].icon} size={80} color={theme.colors.primary} />
            </View>
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>{slides[step].title}</Text>
            <Text style={styles.subtitle}>{slides[step].subtitle}</Text>
          </View>

          {step === 2 && (
            <View style={styles.pinContainer}>
              <TextInput
                style={styles.pinInput}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
                value={pin}
                onChangeText={setLocalPin}
                placeholder="* * * *"
                placeholderTextColor={theme.colors.textSecondary}
                autoFocus
              />
            </View>
          )}

          <View style={styles.footer}>
            <View style={styles.dotsContainer}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={[styles.dot, step === i && styles.activeDot]} />
              ))}
            </View>

            <TouchableOpacity 
              style={[
                styles.button, 
                (step === 2 && pin.length < 4) && styles.buttonDisabled
              ]} 
              onPress={handleNext}
              disabled={step === 2 && pin.length < 4}
            >
              <Text style={styles.buttonText}>
                {step === 2 ? "Get Started" : "Next"}
              </Text>
              <Icon name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'space-between',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pinContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  pinInput: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontSize: 24,
    letterSpacing: 12,
    textAlign: 'center',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    width: '100%',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  footer: {
    paddingBottom: theme.spacing.l,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: theme.colors.primary,
  },
  button: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.border,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
