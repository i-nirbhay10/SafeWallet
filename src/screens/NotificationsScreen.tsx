import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export const NotificationsScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content}>
        {[
          { id: 1, title: 'Salary Received', desc: 'Your salary of ₹3,200.00 has been credited.', time: '2 hours ago', icon: 'cash', color: theme.colors.secondary },
          { id: 2, title: 'Subscription Renewed', desc: 'Netflix subscription (₹15.99) was auto-renewed.', time: 'Yesterday', icon: 'film', color: theme.colors.danger },
          { id: 3, title: 'Budget Alert', desc: 'You have used 80% of your Food & Dining budget.', time: '2 days ago', icon: 'warning', color: '#F59E0B' },
          { id: 4, title: 'New Login', desc: 'New login detected from a Mac device.', time: '3 days ago', icon: 'laptop', color: theme.colors.primary },
        ].map(notif => (
          <View key={notif.id} style={styles.notifCard}>
            <View style={[styles.iconBox, { backgroundColor: notif.color + '20' }]}>
              <Icon name={notif.icon} size={24} color={notif.color} />
            </View>
            <View style={styles.notifInfo}>
              <Text style={styles.notifTitle}>{notif.title}</Text>
              <Text style={styles.notifDesc}>{notif.desc}</Text>
              <Text style={styles.notifTime}>{notif.time}</Text>
            </View>
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
  notifCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.m,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  notifInfo: { flex: 1 },
  notifTitle: { color: theme.colors.text, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  notifDesc: { color: theme.colors.textSecondary, fontSize: 14, marginBottom: 8, lineHeight: 20 },
  notifTime: { color: theme.colors.textSecondary, fontSize: 12 },
});
