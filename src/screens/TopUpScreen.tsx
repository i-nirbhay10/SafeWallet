import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { EmptyState } from '../components/EmptyState';

export const TopUpScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles(theme).header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles(theme).headerTitle}>Top Up Wallet</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={{ flex: 1, padding: theme.spacing.m }}>
        <EmptyState 
          icon="wallet-outline" 
          title="Add Funds" 
          message="Link a bank account or credit card to top up your SafeWallet balance." 
        />
      </View>
    </SafeAreaView>
  );
};

const styles = (theme: any) => StyleSheet.create({
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
});
