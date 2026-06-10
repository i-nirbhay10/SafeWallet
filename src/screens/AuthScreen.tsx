import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
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

  const handleLogin = () => {
    if (pin === storedPin) {
      setError('');
      dispatch(login());
    } else {
      setError('Incorrect PIN. Try again.');
      setPin('');
    }
  };

  const handleForgotPin = () => {
    setShowResetModal(true);
  };

  const confirmReset = () => {
    setShowResetModal(false);
    dispatch(resetAuth());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Icon name="shield-checkmark" size={60} color={theme.colors.primary} />
        </View>
        <Text style={styles.title}>SafeWallet</Text>
        <Text style={styles.subtitle}>Enter your PIN to access your wallet</Text>

        <TextInput
          style={[styles.pinInput, error ? styles.pinInputError : null]}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={4}
          value={pin}
          onChangeText={(text) => {
            setPin(text);
            setError('');
          }}
          placeholder="* * * *"
          placeholderTextColor={theme.colors.textSecondary}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity 
          style={[styles.loginBtn, pin.length < 4 && styles.loginBtnDisabled]} 
          onPress={handleLogin}
          disabled={pin.length < 4}
        >
          <Text style={styles.loginBtnText}>Unlock</Text>
        </TouchableOpacity>

        {biometricEnabled && (
          <TouchableOpacity style={styles.biometricBtn} onPress={() => dispatch(login())}>
            <Icon name="finger-print" size={32} color={theme.colors.primary} />
            <Text style={styles.biometricText}>Use Biometrics</Text>
          </TouchableOpacity>
        )}

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
  pinInput: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontSize: 24,
    letterSpacing: 8,
    textAlign: 'center',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    width: '100%',
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  loginBtn: {
    backgroundColor: theme.colors.primary,
    width: '100%',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
  },
  loginBtnDisabled: {
    backgroundColor: theme.colors.border,
  },
  loginBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  pinInputError: {
    borderColor: theme.colors.danger,
    color: theme.colors.danger,
  },
  errorText: {
    color: theme.colors.danger,
    marginBottom: theme.spacing.l,
    marginTop: -theme.spacing.m,
  },
  biometricBtn: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
  },
  biometricText: {
    color: theme.colors.primary,
    marginTop: theme.spacing.s,
    fontWeight: '600',
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
