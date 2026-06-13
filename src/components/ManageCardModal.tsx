import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeContext';
import { PaymentCard } from './PaymentCardItem';

const CARD_NETWORKS = ['Visa', 'Mastercard', 'RuPay', 'American Express', 'Other'];
const CARD_TYPES = ['Credit', 'Debit'];

interface ManageCardModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (cardData: Partial<PaymentCard>, editingCardId: string | null) => void;
  initialCard: PaymentCard | null;
}

export const ManageCardModal: React.FC<ManageCardModalProps> = ({ isVisible, onClose, onSave, initialCard }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [form, setForm] = useState<Partial<PaymentCard>>({
    cardType: 'Debit',
    network: 'Visa',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isVisible) {
      if (initialCard) {
        setForm({ ...initialCard });
      } else {
        setForm({ cardType: 'Debit', network: 'Visa', bankName: '', cardholderName: '', cardNumber: '', expiryDate: '', cvv: '', notes: '' });
      }
      setErrors({});
    }
  }, [isVisible, initialCard]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let valid = true;

    if (!form.bankName?.trim()) { newErrors.bankName = 'Bank name required'; valid = false; }
    if (!form.cardholderName?.trim()) { newErrors.cardholderName = 'Name required'; valid = false; }
    
    const cNum = (form.cardNumber || '').replace(/\s+/g, '');
    const network = form.network;
    
    if (!cNum) {
      newErrors.cardNumber = 'Card number required'; valid = false;
    } else {
      let isNumValid = false;
      let errorMsg = 'Invalid card number';
      if (network === 'Visa') {
        isNumValid = cNum.startsWith('4') && (cNum.length === 13 || cNum.length === 16);
        errorMsg = 'Visa must start with 4 and be 13 or 16 digits';
      } else if (network === 'Mastercard') {
        isNumValid = (cNum.startsWith('5') || cNum.startsWith('2')) && cNum.length === 16;
        errorMsg = 'Mastercard must start with 5 or 2 and be 16 digits';
      } else if (network === 'American Express') {
        isNumValid = (cNum.startsWith('34') || cNum.startsWith('37')) && cNum.length === 15;
        errorMsg = 'Amex must start with 34 or 37 and be 15 digits';
      } else if (network === 'RuPay') {
        isNumValid = cNum.length === 16;
        errorMsg = 'RuPay must be 16 digits';
      } else {
        isNumValid = cNum.length >= 13;
        errorMsg = 'Card number is too short';
      }

      if (!isNumValid) {
        newErrors.cardNumber = errorMsg;
        valid = false;
      }
    }
    
    if (!form.expiryDate?.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
      newErrors.expiryDate = 'Format MM/YY'; valid = false;
    } else {
      let parts = form.expiryDate.split('/');
      if (parts.length === 1 && form.expiryDate.length === 4) {
        parts = [form.expiryDate.substring(0,2), form.expiryDate.substring(2,4)];
      }
      if (parts.length === 2) {
        const month = parseInt(parts[0], 10);
        const year = parseInt(parts[1], 10) + 2000;
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
          newErrors.expiryDate = 'Card is expired';
          valid = false;
        }
      }
    }

    if (form.cvv) {
      if (network === 'American Express') {
        if (!form.cvv.match(/^\d{4}$/)) {
          newErrors.cvv = 'Must be 4 digits';
          valid = false;
        }
      } else {
        if (!form.cvv.match(/^\d{3}$/)) {
          newErrors.cvv = 'Must be 3 digits';
          valid = false;
        }
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(form, initialCard ? initialCard.id : null);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{initialCard ? 'Edit Card' : 'Add New Card'}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            
            <Text style={styles.sectionLabel}>Card Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bank Name *</Text>
              <TextInput style={[styles.input, errors.bankName ? styles.inputError : null]} placeholder="e.g. Chase, HDFC" placeholderTextColor={theme.colors.textSecondary} value={form.bankName} onChangeText={t => setForm({...form, bankName: t})} />
              {errors.bankName && <Text style={styles.errorText}>{errors.bankName}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cardholder Name *</Text>
              <TextInput style={[styles.input, errors.cardholderName ? styles.inputError : null]} placeholder="Name on card" placeholderTextColor={theme.colors.textSecondary} value={form.cardholderName} onChangeText={t => setForm({...form, cardholderName: t})} />
              {errors.cardholderName && <Text style={styles.errorText}>{errors.cardholderName}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Card Number *</Text>
              <TextInput style={[styles.input, errors.cardNumber ? styles.inputError : null]} placeholder="XXXX XXXX XXXX XXXX" placeholderTextColor={theme.colors.textSecondary} keyboardType="numeric" value={form.cardNumber} onChangeText={t => setForm({...form, cardNumber: t})} />
              {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Expiry (MM/YY) *</Text>
                <TextInput style={[styles.input, errors.expiryDate ? styles.inputError : null]} placeholder="MM/YY" placeholderTextColor={theme.colors.textSecondary} value={form.expiryDate} onChangeText={t => setForm({...form, expiryDate: t})} />
                {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate}</Text>}
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>CVV (Optional)</Text>
                <TextInput style={[styles.input, errors.cvv ? styles.inputError : null]} placeholder="123" placeholderTextColor={theme.colors.textSecondary} keyboardType="numeric" secureTextEntry maxLength={4} value={form.cvv} onChangeText={t => setForm({...form, cvv: t})} />
                {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
              </View>
            </View>

            <Text style={styles.sectionLabel}>Card Information</Text>

            <Text style={styles.inputLabel}>Card Type</Text>
            <View style={styles.segmentContainer}>
              {CARD_TYPES.map(type => (
                <TouchableOpacity key={type} style={[styles.segmentBtn, form.cardType === type && styles.segmentBtnActive]} onPress={() => setForm({...form, cardType: type as any})}>
                  <Text style={[styles.segmentBtnText, form.cardType === type && styles.segmentBtnTextActive]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Card Network</Text>
            <View style={styles.networkGrid}>
              {CARD_NETWORKS.map(net => (
                <TouchableOpacity key={net} style={[styles.networkBtn, form.network === net && styles.networkBtnActive]} onPress={() => setForm({...form, network: net})}>
                  <Text style={[styles.networkBtnText, form.network === net && styles.networkBtnTextActive]}>{net}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Custom Notes</Text>
              <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} placeholder="Used for online shopping..." placeholderTextColor={theme.colors.textSecondary} multiline value={form.notes} onChangeText={t => setForm({...form, notes: t})} />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Card</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: theme.colors.text, fontSize: 20, fontWeight: 'bold' },
  sectionLabel: { color: theme.colors.text, fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 12 },
  inputGroup: { marginBottom: 16 },
  rowInputs: { flexDirection: 'row' },
  inputLabel: { color: theme.colors.textSecondary, fontSize: 13, marginBottom: 6 },
  input: { backgroundColor: theme.colors.surface, color: theme.colors.text, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, padding: 14, fontSize: 15 },
  inputError: { borderColor: theme.colors.danger },
  errorText: { color: theme.colors.danger, fontSize: 12, marginTop: 4 },
  segmentContainer: { flexDirection: 'row', backgroundColor: theme.colors.surface, borderRadius: 12, padding: 4, marginBottom: 16 },
  segmentBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  segmentBtnActive: { backgroundColor: theme.colors.primary },
  segmentBtnText: { color: theme.colors.text, fontWeight: '500' },
  segmentBtnTextActive: { color: '#FFF' },
  networkGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  networkBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
  networkBtnActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  networkBtnText: { color: theme.colors.textSecondary, fontWeight: '500' },
  networkBtnTextActive: { color: '#FFF' },
  saveBtn: { backgroundColor: theme.colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
