import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { EmptyState } from '../components/EmptyState';
import { QuickActions } from '../components/QuickActions';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { balance, totalIncome, totalExpense, transactions } = useSelector((state: RootState) => state.transactions);
  const userName = useSelector((state: RootState) => state.auth.userName);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 18) return 'Good afternoon,';
    return 'Good evening,';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate('Profile' as never)}>
            <Icon name="person" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Total Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
          <View style={styles.balanceRow}>
            <View style={styles.incomeBox}>
              <Icon name="arrow-down-outline" size={20} color={theme.colors.secondary} />
              <View style={styles.incomeTextCol}>
                <Text style={styles.incomeLabel}>Income</Text>
                <Text style={styles.incomeValue}>₹{totalIncome.toLocaleString('en-IN')}</Text>
              </View>
            </View>
            <View style={styles.expenseBox}>
              <Icon name="arrow-up-outline" size={20} color={theme.colors.danger} />
              <View style={styles.incomeTextCol}>
                <Text style={styles.incomeLabel}>Expenses</Text>
                <Text style={styles.expenseValue}>₹{totalExpense.toLocaleString('en-IN')}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions (Hidden for now) */}
        <QuickActions />

        {/* Actionable Alert (Hidden for now) */}
        {/* <AlertBanner 
          title="Approaching limit" 
          description="You've spent 80% of your Food budget." 
        /> */}

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions' as never)}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        {transactions.slice(0, 3).map((item) => (
          <View key={item.id} style={styles.transactionItem}>
            <View style={styles.transactionIconBox}>
              <Icon name={item.icon || 'cash'} size={24} color={item.type === 'income' ? theme.colors.secondary : theme.colors.danger} />
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionTitle}>{item.title}</Text>
              <Text style={styles.transactionDate}>{item.date}</Text>
            </View>
            <Text style={[styles.transactionAmount, { color: item.type === 'income' ? theme.colors.secondary : theme.colors.text }]}>
              {item.type === 'income' ? '+' : '-'}₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        ))}
        {transactions.length === 0 && (
          <EmptyState
            icon="receipt-outline"
            title="No Transactions"
            message="You haven't made any transactions yet. Tap the Add button to get started!"
          />
        )}

        {/* Footer Markings */}
        <View style={styles.footer}>
          <View style={styles.hashtagContainer}>
            <Text style={[styles.largeHashtag, { color: theme.colors.primary, opacity: 0.8 }]}>#</Text>
            <Text style={styles.largeHashtag}>goSafeWallet</Text>
          </View>

          <View style={styles.footerContent}>
            <View style={styles.footerRow}>
              <Text style={styles.footerEmoji}>🇮🇳</Text>
              <Text style={styles.footerSubText}>Made for India</Text>
            </View>
            {/* <View style={styles.footerRow}>
              <Text style={styles.footerEmoji}>❤️</Text>
              <Text style={styles.footerSubText}>Crafted in Patna</Text>
            </View> */}
            <View style={styles.footerRow}>
              <Text style={styles.footerEmoji}>🛡️</Text>
              <Text style={styles.footerSubText}>Bank-grade Security</Text>
            </View>
          </View>


        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  greeting: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  userName: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileIcon: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.s,
    borderRadius: theme.borderRadius.round,
  },
  balanceCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.l,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginBottom: theme.spacing.xs,
  },
  balanceAmount: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: theme.spacing.l,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  incomeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: theme.spacing.s,
    borderRadius: theme.borderRadius.m,
    flex: 0.48,
  },
  expenseBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: theme.spacing.s,
    borderRadius: theme.borderRadius.m,
    flex: 0.48,
  },
  incomeTextCol: {
    marginLeft: theme.spacing.s,
  },
  incomeLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  incomeValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  expenseValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  seeAll: {
    color: theme.colors.primary,
    fontSize: 14,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.l,
    marginBottom: theme.spacing.s,
  },
  transactionIconBox: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.s,
    borderRadius: theme.borderRadius.m,
    marginRight: theme.spacing.m,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionDate: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    paddingVertical: theme.spacing.xl,
    marginTop: theme.spacing.l,
    alignItems: 'stretch',
  },
  hashtagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  largeHashtag: {
    color: theme.colors.textSecondary,
    fontSize: 54,
    fontWeight: '900',
    fontStyle: 'italic',
    opacity: 0.15,
    letterSpacing: -2,
    marginLeft: -4,
  },
  footerContent: {
    paddingLeft: 4,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  footerEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  footerSubText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },

});
