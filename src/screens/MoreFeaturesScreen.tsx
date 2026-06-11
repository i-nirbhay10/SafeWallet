import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { EmptyState } from '../components/EmptyState';

export const MoreFeaturesScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles(theme).header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles(theme).headerTitle}>More Features</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={{ flex: 1, padding: theme.spacing.m }}>
        <EmptyState 
          icon="apps-outline" 
          title="Explore Services" 
          message="Discover bills, utilities, investments, and more upcoming features." 
        />
        <TouchableOpacity 
          style={styles(theme).gameButton} 
          onPress={() => navigation.navigate('MiniGame' as never)}
        >
          <Icon name="game-controller-outline" size={24} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles(theme).gameButtonText}>Play Tic Tac Toe</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles(theme).gameButton} 
          onPress={() => navigation.navigate('MemoryGame' as never)}
        >
          <Icon name="extension-puzzle-outline" size={24} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles(theme).gameButtonText}>Play Memory Match</Text>
        </TouchableOpacity>
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
  gameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.l,
    marginTop: theme.spacing.xl,
    marginHorizontal: theme.spacing.xl,
  },
  gameButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
