import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';

export const QuickActions = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const handleAction = (actionId: string, actionLabel: string) => {
    switch (actionId) {
      case 'send':
        navigation.navigate('Send' as never);
        break;
      case 'receive':
        navigation.navigate('Receive' as never);
        break;
      case 'topup':
        navigation.navigate('TopUp' as never);
        break;
      case 'more':
        navigation.navigate('MoreFeatures' as never);
        break;
      case 'manageCard':
        (navigation.navigate as any)('Profile', { screen: 'ManageCards' });
        break;
      default:
        Alert.alert(actionLabel, `This would open the ${actionLabel} screen.`);
    }
  };

  const quickActions = [
    { id: 'receive', icon: 'qr-code', label: 'Add QR', color: theme.colors.secondary },
    { id: 'manageCard', icon: 'card', label: 'Cards', color: theme.colors.danger },
    { id: 'more', icon: 'grid', label: 'More', color: theme.colors.textSecondary },
  ];

  const styles = StyleSheet.create({
    quickActionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: theme.spacing.xl,
    },
    actionButton: {
      alignItems: 'center',
    },
    actionIconBg: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    actionLabel: {
      color: theme.colors.textSecondary,
      fontSize: 12,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.quickActionsContainer}>
      {quickActions.map(action => (
        <TouchableOpacity
          key={action.id}
          style={styles.actionButton}
          onPress={() => handleAction(action.id, action.label)}
        >
          <View style={[styles.actionIconBg, { backgroundColor: action.color + '20' }]}>
            <Icon name={action.icon} size={24} color={action.color} />
          </View>
          <Text style={styles.actionLabel}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
