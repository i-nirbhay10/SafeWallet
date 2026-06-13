import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeContext';
import Clipboard from '@react-native-clipboard/clipboard';

export interface PaymentCard {
  id: string;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardType: 'Credit' | 'Debit';
  bankName: string;
  network: string;
  notes: string;
  createdAt: number;
}

interface PaymentCardItemProps {
  card: PaymentCard;
  isVisible: boolean;
  onToggleVisibility: (id: string) => void;
  onEdit: (card: PaymentCard) => void;
  onDelete: (id: string) => void;
}

export const PaymentCardItem: React.FC<PaymentCardItemProps> = ({ card, isVisible, onToggleVisibility, onEdit, onDelete }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const formatCardNumber = (num: string) => {
    const cleaned = num.replace(/\s+/g, '');
    let formatted = '';
    for (let i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += cleaned[i];
    }
    return formatted;
  };

  const renderCardNetworkIcon = (network: string) => {
    switch (network) {
      case 'Visa': return <Text style={styles.networkLogoText}>VISA</Text>;
      case 'Mastercard': return <View style={styles.mcCircles}><View style={[styles.mcCircle, { backgroundColor: '#EB001B', right: 8 }]} /><View style={[styles.mcCircle, { backgroundColor: '#F79E1B', left: 8, opacity: 0.9 }]} /></View>;
      case 'American Express': return <Text style={styles.networkLogoText}>AMEX</Text>;
      case 'RuPay': return <Text style={styles.networkLogoText}>RuPay</Text>;
      default: return <Icon name="card" size={24} color="#FFF" />;
    }
  };

  const getCardGradientColors = (network: string, type: string) => {
    if (type === 'Credit') {
      if (network === 'Visa') return ['#1A1F71', '#1A1F71'];
      if (network === 'Mastercard') return ['#232526', '#414345']; // Dark
      if (network === 'American Express') return ['#006FCF', '#006FCF'];
      return ['#4A00E0', '#8E2DE2']; // Purple
    } else {
      if (network === 'Visa') return ['#0f2027', '#203a43'];
      if (network === 'Mastercard') return ['#ff9966', '#ff5e62']; // Orange/Red
      if (network === 'RuPay') return ['#11998e', '#38ef7d']; // Green
      return ['#3a7bd5', '#3a6073']; // Blue
    }
  };

  const handleCopy = () => {
    Clipboard.setString(card.cardNumber);
    Alert.alert('Copied', 'Card details copied to clipboard.');
  };

  const colors = getCardGradientColors(card.network, card.cardType);
  const maskedNumber = '•••• •••• •••• ' + card.cardNumber.slice(-4);
  const displayNum = isVisible ? formatCardNumber(card.cardNumber) : maskedNumber;
  const displayCvv = isVisible ? card.cvv : '•••';

  return (
    <View style={styles.cardWrapper}>
      <View style={[styles.paymentCard, { backgroundColor: colors[0] }]}>
        <View style={[styles.gradientOverlay, { backgroundColor: colors[1], opacity: 0.8 }]} />

        <View style={styles.cardTopRow}>
          <Text style={styles.bankName} numberOfLines={1}>{card.bankName}</Text>
          {renderCardNetworkIcon(card.network)}
        </View>

        <View style={styles.cardChipRow}>
          <Icon name="hardware-chip" size={36} color="#FFD700" />
          <Icon name="wifi" size={26} color="#FFF" style={{ transform: [{ rotate: '90deg' }], marginLeft: 12 }} />
          <View style={{ flex: 1 }} />
          <Text style={styles.cardTypeLabel}>{card.cardType}</Text>
        </View>

        <Text style={styles.cardNumberText} numberOfLines={1} adjustsFontSizeToFit>{displayNum}</Text>

        <View style={styles.cardBottomRow}>
          <View style={{ flex: 2 }}>
            <Text style={styles.cardLabel}>Cardholder</Text>
            <Text style={styles.cardValue} numberOfLines={1}>{card.cardholderName.toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={styles.cardLabel}>Expires</Text>
            <Text style={styles.cardValue}>{card.expiryDate}</Text>
          </View>
          {card.cvv ? (
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={styles.cardLabel}>CVV</Text>
              <Text style={styles.cardValue}>{displayCvv}</Text>
            </View>
          ) : <View style={{ flex: 1 }} />}
        </View>
      </View>

      <View style={styles.actionRowBelow}>
        <TouchableOpacity style={styles.actionBtnBelow} onPress={() => onToggleVisibility(card.id)}>
          <Icon name={isVisible ? "eye-off" : "eye"} size={20} color={theme.colors.textSecondary} />
          <Text style={styles.actionBtnText}>{isVisible ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
        {isVisible && (
          <TouchableOpacity style={styles.actionBtnBelow} onPress={handleCopy}>
            <Icon name="copy" size={20} color={theme.colors.primary} />
            <Text style={[styles.actionBtnText, { color: theme.colors.primary }]}>Copy</Text>
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.actionBtnBelow} onPress={() => onEdit(card)}>
          <Icon name="create" size={20} color={theme.colors.textSecondary} />
          <Text style={styles.actionBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtnBelow} onPress={() => onDelete(card.id)}>
          <Icon name="trash" size={20} color={theme.colors.danger} />
          <Text style={[styles.actionBtnText, { color: theme.colors.danger }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  cardWrapper: {
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  paymentCard: {
    width: '100%',
    aspectRatio: 1.85, // Increased aspect ratio makes it shorter
    padding: 16,
    overflow: 'hidden',
    position: 'relative'
  },
  gradientOverlay: { position: 'absolute', left: -50, right: -50, bottom: -50, transform: [{ skewY: '-10deg' }], top: '-30%' },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 },
  bankName: { color: '#FFF', fontSize: 18, fontWeight: 'bold', letterSpacing: 1, flex: 1, marginRight: 10 },
  networkLogoText: { color: '#FFF', fontSize: 18, fontWeight: '900', fontStyle: 'italic' },
  mcCircles: { flexDirection: 'row', width: 40, height: 24, alignItems: 'center', justifyContent: 'center' },
  mcCircle: { width: 24, height: 24, borderRadius: 12, position: 'absolute' },
  cardChipRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, zIndex: 1 },
  cardTypeLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 },
  cardNumberText: { color: '#FFF', fontSize: 22, fontWeight: '600', letterSpacing: 2, marginTop: 10, zIndex: 1, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', zIndex: 1, alignItems: 'flex-end' },
  cardLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, textTransform: 'uppercase', marginBottom: 4 },
  cardValue: { color: '#FFF', fontSize: 14, fontWeight: '600', letterSpacing: 1 },
  actionRowBelow: { flexDirection: 'row', padding: 12, backgroundColor: theme.colors.surface, alignItems: 'center' },
  actionBtnBelow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  actionBtnText: { color: theme.colors.textSecondary, fontSize: 14, fontWeight: '500', marginLeft: 6 },
});
