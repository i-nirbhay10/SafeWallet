import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import ReactNativeBiometrics from 'react-native-biometrics';
import { useDispatch, useSelector } from 'react-redux';
import { login, resetAuth } from '../store/slices/authSlice';
import { RootState } from '../store/store';

export const AuthScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const dispatch = useDispatch();
  const storedPin = useSelector((state: RootState) => state.auth.pinCode) || '1234';
  const biometricEnabled = useSelector((state: RootState) => state.auth.biometricEnabled);

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    if (pin.length === 4) {
      handleLogin();
    }
  }, [pin]);

  const handleLogin = () => {
    if (pin === storedPin) {
      setError('');
      dispatch(login());
    } else {
      setError('Incorrect PIN. Try again.');
      setPin('');
    }
  };

  const handleBiometricLogin = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    try {
      const { success } = await rnBiometrics.simplePrompt({ promptMessage: 'Authenticate to access SafeWallet' });
      if (success) {
        dispatch(login());
      } else {
        // Just cancel quietly or show a toast if preferred
      }
    } catch (error) {
      Alert.alert('Error', 'Biometric authentication failed.');
    }
  };

  useEffect(() => {
    if (biometricEnabled) {
      handleBiometricLogin();
    }
  }, []);

  const handleForgotPin = () => {
    setShowResetModal(true);
  };

  const confirmReset = () => {
    setShowResetModal(false);
    dispatch(resetAuth());
  };

  const handleNumpadPress = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Icon name="shield-checkmark" size={60} color={theme.colors.primary} />
        </View>
        <Text style={styles.title}>SafeWallet</Text>
        <Text style={styles.subtitle}>Enter your PIN to access your wallet</Text>

        {/* Custom PIN Dots */}
        <View style={styles.pinDotsContainer}>
          {[0, 1, 2, 3].map(i => (
            <View 
              key={i} 
              style={[
                styles.pinDot, 
                pin.length > i && styles.pinDotFilled,
                error ? styles.pinDotError : null
              ]} 
            />
          ))}
        </View>

        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error ? error : ''}</Text>
        </View>

        {/* Custom Numpad */}
        <View style={styles.numpadContainer}>
          {['1','2','3','4','5','6','7','8','9'].map(num => (
            <TouchableOpacity key={num} style={styles.numpadBtn} onPress={() => handleNumpadPress(num)}>
              <Text style={styles.numpadText}>{num}</Text>
            </TouchableOpacity>
          ))}
          {biometricEnabled ? (
            <TouchableOpacity style={styles.numpadBtn} onPress={handleBiometricLogin}>
              <Icon name="finger-print" size={32} color={theme.colors.primary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.numpadBtn} />
          )}
          <TouchableOpacity style={styles.numpadBtn} onPress={() => handleNumpadPress('0')}>
            <Text style={styles.numpadText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.numpadBtn} onPress={handleBackspace}>
            <Icon name="backspace-outline" size={32} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotBtn} onPress={handleForgotPin}>
          <Text style={styles.forgotText}>Forgot PIN?</Text>
        </TouchableOpacity>
      </View>

      {/* Modern Reset Alert Modal */}
      <Modal visible={showResetModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconBox}>
              <Icon name="warning-outline" size={32} color={theme.colors.danger} />
            </View>
            <Text style={styles.modalTitle}>Forgot PIN?</Text>
            <Text style={styles.modalMessage}>
              Resetting your PIN will require you to complete the setup process again. Do you want to proceed?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowResetModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={confirmReset}>
                <Text style={styles.modalConfirmText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl },
  iconBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  title: { color: theme.colors.text, fontSize: 32, fontWeight: 'bold', marginBottom: theme.spacing.s },
  subtitle: { color: theme.colors.textSecondary, fontSize: 16, marginBottom: theme.spacing.xxl, textAlign: 'center' },
  pinDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.l,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: 'transparent',
    marginHorizontal: 12,
  },
  pinDotFilled: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  pinDotError: {
    borderColor: theme.colors.danger,
    backgroundColor: theme.colors.danger,
  },
  errorContainer: {
    height: 24,
    justifyContent: 'center',
    marginBottom: theme.spacing.l,
  },
  errorText: {
    color: theme.colors.danger,
    fontWeight: '500',
    textAlign: 'center',
  },
  numpadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: 280,
    marginTop: theme.spacing.s,
  },
  numpadBtn: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
    borderRadius: 40,
    backgroundColor: theme.colors.surface,
  },
  numpadText: {
    fontSize: 28,
    fontWeight: '500',
    color: theme.colors.text,
  },
  forgotBtn: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.s,
  },
  forgotText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.danger + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  modalTitle: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: theme.spacing.s,
    textAlign: 'center',
  },
  modalMessage: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    marginRight: theme.spacing.s,
  },
  modalConfirmBtn: {
    flex: 1,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    backgroundColor: theme.colors.danger,
    alignItems: 'center',
    marginLeft: theme.spacing.s,
  },
  modalCancelText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  modalConfirmText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
