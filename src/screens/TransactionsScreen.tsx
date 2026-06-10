import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { deleteTransaction, Transaction } from '../store/slices/transactionSlice';
import { EmptyState } from '../components/EmptyState';

export const TransactionsScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const transactions = useSelector((state: RootState) => state.transactions.transactions);

  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter(t => filter === 'all' || t.type === filter);

  const handleDelete = () => {
    if (selectedTransaction) {
      dispatch(deleteTransaction(selectedTransaction.id));
      setSelectedTransaction(null);
    }
  };

  const handleEdit = () => {
    if (selectedTransaction) {
      navigation.navigate('EditTransaction', { editItem: selectedTransaction });
      setSelectedTransaction(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transactions</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.filterContainer}>
        {['all', 'income', 'expense'].map((f) => (
          <TouchableOpacity 
            key={f} 
            style={[styles.filterPill, filter === f && { backgroundColor: theme.colors.primary }]}
            onPress={() => setFilter(f as any)}
          >
            <Text style={[styles.filterText, filter === f && { color: '#FFF' }]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {filteredTransactions.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.transactionItem}
            onLongPress={() => setSelectedTransaction(item)}
            delayLongPress={400}
          >
            <View style={styles.transactionIconBox}>
              <Icon name={item.icon || 'cash'} size={24} color={item.type === 'income' ? theme.colors.secondary : theme.colors.danger} />
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionTitle}>{item.title}</Text>
              <Text style={styles.transactionDate}>{item.date}</Text>
            </View>
            <View style={styles.transactionRight}>
              <Text style={[styles.transactionAmount, { color: item.type === 'income' ? theme.colors.secondary : theme.colors.text }]}>
                {item.type === 'income' ? '+' : '-'}₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        {filteredTransactions.length === 0 && (
          <EmptyState 
            icon="list-outline" 
            title="History is Empty" 
            message="Your transaction history will appear here once you start tracking." 
          />
        )}
      </ScrollView>

      {/* Options Modal */}
      <Modal visible={!!selectedTransaction} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSelectedTransaction(null)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Options</Text>
            
            <TouchableOpacity style={styles.modalOptionBtn} onPress={handleEdit}>
              <Icon name="pencil" size={20} color={theme.colors.text} />
              <Text style={styles.modalOptionText}>Edit Transaction</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modalOptionBtn, styles.modalOptionDanger]} onPress={handleDelete}>
              <Icon name="trash" size={20} color={theme.colors.danger} />
              <Text style={[styles.modalOptionText, { color: theme.colors.danger }]}>Delete Transaction</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterPill: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.surface,
    marginRight: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
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
  transactionRight: { alignItems: 'flex-end', justifyContent: 'center' },
  transactionAmount: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
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
    paddingBottom: theme.spacing.xxl,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: theme.spacing.l,
  },
  modalTitle: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: theme.spacing.l,
  },
  modalOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalOptionDanger: {
    borderBottomWidth: 0,
  },
  modalOptionText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: theme.spacing.m,
  },
});
