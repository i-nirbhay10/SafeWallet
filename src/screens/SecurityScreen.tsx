import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReactNativeBiometrics from 'react-native-biometrics';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { toggleBiometric, setPin } from '../store/slices/authSlice';

export const SecurityScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const biometricEnabled = useSelector((state: RootState) => state.auth.biometricEnabled);
  
  const [isPinModalVisible, setPinModalVisible] = useState(false);
  const [newPin, setNewPin] = useState('');
  
  const handleSavePin = () => {
    if (newPin.length === 4) {
      dispatch(setPin(newPin));
      setNewPin('');
      setPinModalVisible(false);
    }
  };

  const handleToggleBiometrics = async (val: boolean) => {
    if (val) {
      try {
        const rnBiometrics = new ReactNativeBiometrics();
        const { available } = await rnBiometrics.isSensorAvailable();
        if (available) {
          dispatch(toggleBiometric(true));
        } else {
          Alert.alert('Not Available', 'Biometrics are not set up or available on this device.');
          dispatch(toggleBiometric(false));
        }
      } catch (error) {
        Alert.alert('Error', 'Could not access biometric sensors.');
        dispatch(toggleBiometric(false));
      }
    } else {
      dispatch(toggleBiometric(false));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Login & Access</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Biometric Login</Text>
              <Text style={styles.settingDesc}>Use Face ID or Fingerprint</Text>
            </View>
            <Switch 
              value={biometricEnabled} 
              onValueChange={handleToggleBiometrics} 
              trackColor={{ true: theme.colors.primary }} 
            />
          </View>
          <TouchableOpacity style={styles.settingRow} onPress={() => setPinModalVisible(true)}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Change PIN</Text>
              <Text style={styles.settingDesc}>Update your 4-digit security PIN</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Two-Factor Auth</Text>
              <Text style={styles.settingDesc}>Additional layer of security</Text>
            </View>
            <Switch value={false} onValueChange={() => {}} trackColor={{ true: theme.colors.primary }} />
          </View>
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Device Management</Text>
              <Text style={styles.settingDesc}>Log out of other devices</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Change PIN Modal */}
      <Modal visible={isPinModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set New PIN</Text>
              <TouchableOpacity onPress={() => setPinModalVisible(false)}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalDesc}>Enter a new 4-digit PIN to secure your wallet.</Text>
            <TextInput
              style={styles.pinInput}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={4}
              value={newPin}
              onChangeText={setNewPin}
              placeholder="* * * *"
              placeholderTextColor={theme.colors.textSecondary}
              autoFocus
            />
            <TouchableOpacity 
              style={[styles.saveBtn, newPin.length < 4 && styles.saveBtnDisabled]} 
              onPress={handleSavePin}
              disabled={newPin.length < 4}
            >
              <Text style={styles.saveBtnText}>Save PIN</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: { color: theme.colors.text, fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, padding: theme.spacing.m },
  section: { marginBottom: theme.spacing.xl },
  sectionTitle: { color: theme.colors.text, fontSize: 18, fontWeight: '600', marginBottom: theme.spacing.m },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.s,
  },
  settingInfo: { flex: 1, marginRight: theme.spacing.m },
  settingName: { color: theme.colors.text, fontSize: 16, fontWeight: '500', marginBottom: 4 },
  settingDesc: { color: theme.colors.textSecondary, fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  modalTitle: { color: theme.colors.text, fontSize: 20, fontWeight: 'bold' },
  modalDesc: { color: theme.colors.textSecondary, fontSize: 16, marginBottom: theme.spacing.l },
  pinInput: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontSize: 24,
    letterSpacing: 8,
    textAlign: 'center',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
  },
  saveBtn: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
  },
  saveBtnDisabled: { backgroundColor: theme.colors.border },
  saveBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
