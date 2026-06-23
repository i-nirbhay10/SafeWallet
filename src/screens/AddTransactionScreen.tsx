import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addTransaction, updateTransaction, Transaction } from '../store/slices/transactionSlice';

export const AddTransactionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const dispatch = useDispatch();

  const editItem: Transaction | undefined = route.params?.editItem;

  const [amount, setAmount] = useState(editItem ? editItem.amount.toString() : '');
  const [category, setCategory] = useState(editItem ? editItem.category : '');
  const [note, setNote] = useState(editItem?.note ? editItem.note : '');
  const [type, setType] = useState<'income' | 'expense'>(editItem ? editItem.type : 'expense');
  const [selectedIcon, setSelectedIcon] = useState(editItem?.icon ? editItem.icon : '');

  const expenseCategories = [
    { name: 'Food & Dining', icon: 'restaurant' },
    { name: 'Transport', icon: 'car' },
    { name: 'Shopping', icon: 'bag-handle' },
    { name: 'Bills', icon: 'receipt' },
    { name: 'Entertainment', icon: 'game-controller' },
  ];

  const incomeCategories = [
    { name: 'Salary', icon: 'cash' },
    { name: 'Freelance', icon: 'briefcase' },
    { name: 'Gift', icon: 'gift' },
    { name: 'Investment', icon: 'trending-up' },
    { name: 'Refund', icon: 'refresh-circle' },
  ];

  const currentCategories = type === 'expense' ? expenseCategories : incomeCategories;

  const handleSelectCategory = (name: string, icon: string) => {
    setCategory(name);
    setSelectedIcon(icon);
  };

  const handleSave = () => {
    if (!amount || !category) return;
    const newTransaction: Transaction = {
      id: editItem ? editItem.id : Math.random().toString(),
      title: category,
      amount: parseFloat(amount),
      type,
      date: editItem ? editItem.date : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      category,
      note,
      icon: selectedIcon || (type === 'income' ? 'cash' : 'cart'),
      timestamp: editItem?.timestamp ? editItem.timestamp : Date.now(),
    };

    if (editItem) {
      dispatch(updateTransaction(newTransaction));
    } else {
      dispatch(addTransaction(newTransaction));
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Icon name="close" size={28} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{editItem ? 'Edit Transaction' : 'New Transaction'}</Text>
          <View style={{ width: 28, padding: theme.spacing.xs }} />
        </View>

        <ScrollView style={styles.content}>
          {/* Type Selector */}
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeButton, type === 'expense' && styles.typeButtonExpenseActive]}
              onPress={() => setType('expense')}
            >
              <Text style={[styles.typeButtonText, type === 'expense' && styles.typeButtonTextActive]}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, type === 'income' && styles.typeButtonIncomeActive]}
              onPress={() => setType('income')}
            >
              <Text style={[styles.typeButtonText, type === 'income' && styles.typeButtonTextActive]}>Income</Text>
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </View>

          {/* Category Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              value={category}
              onChangeText={(text) => {
                setCategory(text);
                setSelectedIcon(''); // Reset icon if custom text
              }}
              placeholder="e.g. Groceries, Salary"
              placeholderTextColor={theme.colors.textSecondary}
            />

            {/* Quick Picks */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickPicksContainer}>
              {currentCategories.map((cat, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.quickPickChip,
                    category === cat.name && { backgroundColor: theme.colors.primary + '30', borderColor: theme.colors.primary }
                  ]}
                  onPress={() => handleSelectCategory(cat.name, cat.icon)}
                >
                  <Icon name={cat.icon} size={16} color={category === cat.name ? theme.colors.primary : theme.colors.textSecondary} style={{ marginRight: 4 }} />
                  <Text style={[
                    styles.quickPickText,
                    category === cat.name && { color: theme.colors.primary, fontWeight: 'bold' }
                  ]}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Note Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Note</Text>
            <TextInput
              style={[styles.input, styles.noteInput]}
              value={note}
              onChangeText={setNote}
              placeholder="Add a note..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
            />
          </View>

        </ScrollView>
        
        {/* Fixed Footer for Confirm Button */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.confirmButton, 
              (!amount || !category) && styles.confirmButtonDisabled
            ]} 
            onPress={handleSave}
            disabled={!amount || !category}
          >
            <Text style={styles.confirmButtonText}>
              {editItem ? 'Update Transaction' : 'Confirm Transaction'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  iconButton: {
    padding: theme.spacing.xs,
  },
  content: {
    flex: 1,
    padding: theme.spacing.m,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.xl,
  },
  typeButton: {
    flex: 1,
    paddingVertical: theme.spacing.s,
    alignItems: 'center',
    borderRadius: theme.borderRadius.s,
  },
  typeButtonExpenseActive: {
    backgroundColor: theme.colors.danger,
  },
  typeButtonIncomeActive: {
    backgroundColor: theme.colors.secondary,
  },
  typeButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: theme.spacing.l,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginBottom: theme.spacing.s,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
    paddingBottom: theme.spacing.xs,
  },
  currencySymbol: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: theme.spacing.xs,
  },
  amountInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: 'bold',
    padding: 0,
  },
  input: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontSize: 16,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  noteInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  quickPicksContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.m,
  },
  quickPickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.borderRadius.xl,
    marginRight: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quickPickText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  footer: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
