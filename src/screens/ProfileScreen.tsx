import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Linking, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import SpInAppUpdates, { IAUUpdateKind, StartUpdateOptions } from 'sp-react-native-in-app-updates';
import DeviceInfo from 'react-native-device-info';
import { RootState } from '../store/store';
import { EditProfileModal } from '../components/EditProfileModal';

export const ProfileScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const { userName, userEmail } = useSelector((state: RootState) => state.auth);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleShare = async () => {
    const bundleId = DeviceInfo.getBundleId();
    const androidLink = `https://play.google.com/store/apps/details?id=${bundleId}`;

    try {
      await Share.share({
        message: `Check out SafeWallet - The best app to track your expenses and manage your money securely! Download it now:\n\n${androidLink}`,
        url: androidLink,
        title: 'Download SafeWallet',
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleRateUs = () => {
    const bundleId = DeviceInfo.getBundleId();
    const url = `market://details?id=${bundleId}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open app store.');
      }
    });
  };

  const handleCheckUpdate = () => {
    const inAppUpdates = new SpInAppUpdates(false);
    inAppUpdates.checkNeedsUpdate().then((result) => {
      if (result.shouldUpdate) {
        let updateOptions: StartUpdateOptions = {};
        if (Platform.OS === 'android') {
          updateOptions = {
            updateType: IAUUpdateKind.FLEXIBLE,
          };
        }
        inAppUpdates.startUpdate(updateOptions);
      } else {
        Alert.alert('Up to date', 'You are already on the latest version of SafeWallet.');
      }
    }).catch(err => {
      console.log('In-App Update Error:', err);
      Alert.alert('Error', 'Could not check for updates at this time.');
    });
  };

  const menuItems = [
    { id: 2, title: 'Manage Cards', icon: 'card-outline', color: '#8E2DE2', route: 'ManageCards' },
    { id: 3, title: 'Notifications', icon: 'notifications-outline', color: theme.colors.secondary, route: 'Notifications' },
    { id: 4, title: 'Security', icon: 'lock-closed-outline', color: theme.colors.danger, route: 'Security' },
    { id: 5, title: 'Help & Support', icon: 'help-circle-outline', color: theme.colors.textSecondary, route: 'HelpSupport' },
    { id: 6, title: 'Rate Us', icon: 'star-outline', color: '#FFD700', action: handleRateUs },
    { id: 7, title: 'Share App', icon: 'share-social-outline', color: '#1DA1F2', action: handleShare },
    { id: 8, title: 'Check for Updates', icon: 'refresh-outline', color: '#34A853', action: handleCheckUpdate },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={toggleTheme}>
          <Icon name={isDark ? "moon" : "sunny"} size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.userInfoSection}>
          <View style={styles.avatarPlaceholder}>
            <Icon name="person" size={40} color={theme.colors.textSecondary} />
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
          <TouchableOpacity style={styles.editProfileBtn} onPress={() => setIsEditModalVisible(true)}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => {
                if (item.action) {
                  item.action();
                } else if (item.route) {
                  navigation.navigate(item.route);
                }
              }}
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

      <EditProfileModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        initialName={userName}
        initialEmail={userEmail}
      />
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
  editProfileBtn: {
    marginTop: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
    borderRadius: theme.borderRadius.m,
    backgroundColor: theme.colors.primary + '20',
  },
  editProfileText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
