import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export const TransactionsScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Transactions</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {[
          { id: 1, title: 'Netflix Subscription', date: 'Today', amount: '-₹15.99', type: 'expense', icon: 'film' },
          { id: 2, title: 'Salary', date: 'Yesterday', amount: '+₹3,200.00', type: 'income', icon: 'cash' },
          { id: 3, title: 'Grocery Store', date: 'Oct 12', amount: '-₹124.50', type: 'expense', icon: 'cart' },
          { id: 4, title: 'Electric Bill', date: 'Oct 10', amount: '-₹45.00', type: 'expense', icon: 'flash' },
          { id: 5, title: 'Freelance Work', date: 'Oct 05', amount: '+₹800.00', type: 'income', icon: 'briefcase' },
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
  transactionDetails: { flex: 1 },
  transactionTitle: { color: theme.colors.text, fontSize: 16, fontWeight: '500', marginBottom: 4 },
  transactionDate: { color: theme.colors.textSecondary, fontSize: 12 },
  transactionAmount: { fontSize: 16, fontWeight: 'bold' },
});
