module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native(-community)?|react-redux|@reduxjs/toolkit|redux-persist|@react-navigation|react-native-vector-icons|react-native-biometrics|react-native-chart-kit|react-native-device-info|react-native-linear-gradient|react-native-safe-area-context|react-native-screens|react-native-splash-screen|react-native-siren|sp-react-native-in-app-updates)/'
  ],
  setupFiles: ['./jest.setup.js'],
};
