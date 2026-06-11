import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import SpInAppUpdates, {
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { HomeScreen } from '../screens/HomeScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { InsightsScreen } from '../screens/InsightsScreen';
import { AddTransactionScreen } from '../screens/AddTransactionScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { MyWalletScreen } from '../screens/MyWalletScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { SecurityScreen } from '../screens/SecurityScreen';
import { HelpSupportScreen } from '../screens/HelpSupportScreen';
import { useTheme } from '../theme/ThemeContext';

import { SendScreen } from '../screens/SendScreen';
import { ReceiveScreen } from '../screens/ReceiveScreen';
import { TopUpScreen } from '../screens/TopUpScreen';
import { MoreFeaturesScreen } from '../screens/MoreFeaturesScreen';
import { MiniGameScreen } from '../screens/MiniGameScreen';
import { MemoryGameScreen } from '../screens/MemoryGameScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStackScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Transactions" component={TransactionsScreen} />
      <Stack.Screen name="EditTransaction" component={AddTransactionScreen} />
      <Stack.Screen name="Send" component={SendScreen} />
      <Stack.Screen name="Receive" component={ReceiveScreen} />
      <Stack.Screen name="TopUp" component={TopUpScreen} />
      <Stack.Screen name="MoreFeatures" component={MoreFeaturesScreen} />
      <Stack.Screen name="MiniGame" component={MiniGameScreen} />
      <Stack.Screen name="MemoryGame" component={MemoryGameScreen} />
    </Stack.Navigator>
  );
};

const ProfileStackScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="MyWallet" component={MyWalletScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
    </Stack.Navigator>
  );
};

export const AppNavigator = () => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  useEffect(() => {
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
      }
    }).catch(err => console.log('In-App Update Error:', err));
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 5,
            paddingTop: 5,
            height: insets.bottom > 0 ? 60 + insets.bottom : 60,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'home';

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Transact') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if (route.name === 'Insights') {
              iconName = focused ? 'pie-chart' : 'pie-chart-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Insights" component={InsightsScreen} />
        <Tab.Screen name="Transact" component={AddTransactionScreen} />
        <Tab.Screen name="Profile" component={ProfileStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
