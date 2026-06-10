import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>Nirbhay</Text>
          </View>
          <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate('Profile' as never)}>
            <Icon name="person" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Total Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>₹12,450.00</Text>
          <View style={styles.balanceRow}>
            <View style={styles.incomeBox}>
              <Icon name="arrow-down-outline" size={20} color={theme.colors.secondary} />
              <View style={styles.incomeTextCol}>
                <Text style={styles.incomeLabel}>Income</Text>
                <Text style={styles.incomeValue}>₹4,250</Text>
              </View>
            </View>
            <View style={styles.expenseBox}>
              <Icon name="arrow-up-outline" size={20} color={theme.colors.danger} />
              <View style={styles.incomeTextCol}>
                <Text style={styles.incomeLabel}>Expenses</Text>
                <Text style={styles.expenseValue}>₹1,840</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions' as never)}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Dummy Transactions List */}
        {[
          { id: 1, title: 'Netflix Subscription', date: 'Today', amount: '-₹15.99', type: 'expense', icon: 'film' },
          { id: 2, title: 'Salary', date: 'Yesterday', amount: '+₹3,200.00', type: 'income', icon: 'cash' },
          { id: 3, title: 'Grocery Store', date: 'Oct 12', amount: '-₹124.50', type: 'expense', icon: 'cart' },
        ].map((item) => (
          <View key={item.id} style={styles.transactionItem}>
            <View style={styles.transactionIconBox}>
              <Icon name={item.icon} size={24} color={item.type === 'income' ? theme.colors.secondary : theme.colors.danger} />
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionTitle}>{item.title}</Text>
              <Text style={styles.transactionDate}>{item.date}</Text>
            </View>
            <Text style={[styles.transactionAmount, { color: item.type === 'income' ? theme.colors.secondary : theme.colors.text }]}>
              {item.amount}
            </Text>
          </View>
        ))}

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
    marginBottom: theme.spacing.xl,
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
});
