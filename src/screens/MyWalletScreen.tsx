import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export const MyWalletScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wallet</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content}>
        {/* Connected Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Cards</Text>
          <View style={styles.cardItem}>
            <View style={styles.cardHeader}>
              <Icon name="card" size={28} color={theme.colors.primary} />
              <Text style={styles.cardBrand}>Visa</Text>
            </View>
            <Text style={styles.cardNumber}>**** **** **** 4242</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardBalance}>₹8,450.00</Text>
              <Text style={styles.cardExpiry}>12/28</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.addCardBtn}>
            <Icon name="add" size={20} color={theme.colors.primary} />
            <Text style={styles.addCardText}>Add New Card</Text>
          </TouchableOpacity>
        </View>

        {/* Other Wallets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accounts</Text>
          {[
            { id: 1, name: 'Main Bank Account', balance: '₹12,450.00', icon: 'business-outline' },
            { id: 2, name: 'Cash', balance: '₹450.00', icon: 'cash-outline' },
            { id: 3, name: 'Savings', balance: '₹35,000.00', icon: 'safe-outline' },
          ].map(acc => (
            <View key={acc.id} style={styles.accountRow}>
              <View style={styles.accountIconBox}>
                <Icon name={acc.icon} size={20} color={theme.colors.textSecondary} />
              </View>
              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>{acc.name}</Text>
              </View>
              <Text style={styles.accountBalance}>{acc.balance}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
  cardItem: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.m,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.m },
  cardBrand: { color: theme.colors.text, fontSize: 16, fontWeight: 'bold' },
  cardNumber: { color: theme.colors.textSecondary, fontSize: 18, letterSpacing: 2, marginBottom: theme.spacing.m },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardBalance: { color: theme.colors.text, fontSize: 20, fontWeight: 'bold' },
  cardExpiry: { color: theme.colors.textSecondary, fontSize: 14 },
  addCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.primary,
  },
  addCardText: { color: theme.colors.primary, fontSize: 16, fontWeight: '600', marginLeft: theme.spacing.s },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.s,
  },
  accountIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  accountInfo: { flex: 1 },
  accountName: { color: theme.colors.text, fontSize: 16, fontWeight: '500' },
  accountBalance: { color: theme.colors.text, fontSize: 16, fontWeight: 'bold' },
});
