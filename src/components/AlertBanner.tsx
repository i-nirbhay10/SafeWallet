import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeContext';

interface AlertBannerProps {
  title: string;
  description: string;
  iconName?: string;
  color?: string;
  onDismiss?: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ 
  title, 
  description, 
  iconName = 'warning', 
  color = '#F59E0B',
  onDismiss 
}) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!isVisible) return null;

  const styles = StyleSheet.create({
    alertBanner: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.m,
      borderRadius: theme.borderRadius.l,
      marginBottom: theme.spacing.xl,
      alignItems: 'center',
      borderLeftWidth: 4,
      borderLeftColor: color,
    },
    alertIconBg: {
      backgroundColor: color + '20',
      padding: theme.spacing.s,
      borderRadius: theme.borderRadius.round,
      marginRight: theme.spacing.m,
    },
    alertContent: {
      flex: 1,
    },
    alertTitle: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 2,
    },
    alertDesc: {
      color: theme.colors.textSecondary,
      fontSize: 12,
    },
    dismissBtn: {
      padding: theme.spacing.xs,
    }
  });

  return (
    <View style={styles.alertBanner}>
      <View style={styles.alertIconBg}>
        <Icon name={iconName} size={20} color={color} />
      </View>
      <View style={styles.alertContent}>
        <Text style={styles.alertTitle}>{title}</Text>
        <Text style={styles.alertDesc}>{description}</Text>
      </View>
      <TouchableOpacity onPress={handleDismiss} style={styles.dismissBtn}>
        <Icon name="close" size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};
