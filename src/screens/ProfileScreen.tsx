import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import Icon from 'react-native-vector-icons/Ionicons';

export const ProfileScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={toggleTheme}>
          <Icon name={isDark ? "moon" : "sunny"} size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* User Info */}
        <View style={styles.userInfoSection}>
          <View style={styles.avatarPlaceholder}>
            <Icon name="person" size={40} color={theme.colors.textSecondary} />
          </View>
          <Text style={styles.userName}>Nirbhay</Text>
          <Text style={styles.userEmail}>nirbhay@example.com</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {[
            { id: 1, title: 'My Wallet', icon: 'wallet-outline', color: theme.colors.primary, route: 'MyWallet' },
            { id: 2, title: 'Notifications', icon: 'notifications-outline', color: theme.colors.secondary, route: 'Notifications' },
            { id: 3, title: 'Security', icon: 'lock-closed-outline', color: theme.colors.danger, route: 'Security' },
            { id: 4, title: 'Help & Support', icon: 'help-circle-outline', color: theme.colors.textSecondary, route: 'HelpSupport' },
          ].map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.route)}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                <Icon name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Icon name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => dispatch(logout())}>
          <Icon name="log-out-outline" size={20} color={theme.colors.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  userInfoSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  userName: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  menuSection: {
    padding: theme.spacing.m,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.s,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  menuTitle: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.m,
    marginHorizontal: theme.spacing.m,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: theme.colors.danger,
  },
  logoutText: {
    color: theme.colors.danger,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: theme.spacing.s,
  },
});
