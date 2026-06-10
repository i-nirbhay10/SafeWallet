# 🛡️ SafeWallet

**SafeWallet** is a modern, premium fintech mobile application built with React Native. It provides a sleek, highly intuitive user interface for tracking income and expenses, visualizing financial insights, and managing your digital wallet securely. 

Designed with user experience in mind, SafeWallet features dynamic theming, a comprehensive navigation flow, and meticulously crafted screens that mimic production-ready banking applications.

---

## 🌟 Key Features

- **Dynamic Dark/Light Mode**: Full support for both aesthetics with a seamless, real-time toggle built into the Profile screen. Powered by a custom React Context engine.
- **Complete Navigation Flow**: Integrated Bottom Tabs and Stack Navigators to ensure smooth, natural transitions between sections.
- **Financial Dashboard**: View total balances, track rapid income/expense changes, and quickly navigate to recent transactions.
- **Transaction Management**: Add new transactions on the fly with a clean, categorised form interface.
- **Insights & Analytics**: Visualise your spending habits via a dedicated Insights tab.
- **Robust Profile & Settings**: Explore multiple dedicated sub-screens including My Wallet, Notifications, Security settings, and Help & Support.
- **Cross-Platform Compatibility**: Fully optimised safe areas ensuring flawless layout rendering on both iOS and Android devices, including edge-to-edge screens.

---

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev) (v0.86.0) CLI
- **Language**: TypeScript
- **Navigation**: [React Navigation](https://reactnavigation.org/) (v7) 
  - `@react-navigation/native`
  - `@react-navigation/bottom-tabs`
  - `@react-navigation/native-stack`
- **UI & Layout**: `react-native-safe-area-context`
- **Iconography**: `react-native-vector-icons/Ionicons`
- **Architecture**: Context API for State/Theme Management

---

## 📱 Screen Architecture

The app uses a modular structure to split complex navigation flows:

1. **Home Stack (`HomeStackScreen`)**
   - `HomeScreen`: The main dashboard.
   - `TransactionsScreen`: Deep-dive list of all historical transactions.
2. **Insights (`InsightsScreen`)**: Visual charts and category breakdowns.
3. **Add Transaction (`AddTransactionScreen`)**: Input form for tracking finances.
4. **Profile Stack (`ProfileStackScreen`)**
   - `ProfileMain`: The profile menu hub, featuring the theme toggle switch.
   - `MyWalletScreen`: Connected cards and bank accounts breakdown.
   - `NotificationsScreen`: Activity feed.
   - `SecurityScreen`: Biometric and 2FA settings.
   - `HelpSupportScreen`: FAQ and contact resources.

---

## 🚀 Getting Started

Follow these instructions to get the project up and running locally.

### Prerequisites
- Node.js (v22.11+)
- Android Studio / Android SDK (for Android builds)
- Xcode (for iOS builds, macOS required)
- CocoaPods (for iOS)

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Install iOS Pods (macOS only):**
   ```bash
   cd ios && bundle install && bundle exec pod install && cd ..
   ```

### Running the App

1. **Start the Metro Bundler:**
   ```bash
   npm start
   ```

2. **Run on Android:**
   ```bash
   npm run android
   ```

3. **Run on iOS:**
   ```bash
   npm run ios
   ```

---

## 🎨 Theming & Styling

SafeWallet utilizes a strictly typed, centralized theme object (`src/theme/theme.ts`) consisting of predefined spacing, border radii, and dual color palettes (`lightColors` and `darkColors`). 

Components use a dynamic `getStyles(theme)` factory hooked directly into the custom `ThemeContext`, ensuring 100% style consistency and zero manual refresh requirements when switching color modes.
