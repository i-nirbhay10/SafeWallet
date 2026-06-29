import { Animated } from 'react-native';

Animated.timing = jest.fn(() => ({
  start: jest.fn((callback) => callback && callback({ finished: true })),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock Biometrics
jest.mock('react-native-biometrics', () => {
  return jest.fn().mockImplementation(() => {
    return {
      simplePrompt: jest.fn(() => Promise.resolve({ success: true })),
      isSensorAvailable: jest.fn(() => Promise.resolve({ available: true, biometryType: 'TouchID' })),
    };
  });
});

jest.mock('react-native-vector-icons/Ionicons', () => {
  return {
    __esModule: true,
    default: 'Icon',
  };
});

// Mock Navigation
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

// Mock Redux Persist
jest.mock('redux-persist', () => {
  const real = jest.requireActual('redux-persist');
  return {
    ...real,
    persistReducer: jest.fn().mockImplementation((config, reducers) => reducers),
  };
});
jest.mock('redux-persist/integration/react', () => ({
  PersistGate: (props) => props.children,
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
    SafeAreaView: 'SafeAreaView',
  };
});

jest.mock('react-native-splash-screen', () => ({
  hide: jest.fn(),
}));

jest.mock('sp-react-native-in-app-updates', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      checkNeedsUpdate: jest.fn(() => Promise.resolve({ shouldUpdate: false })),
      startUpdate: jest.fn(() => Promise.resolve()),
    })),
    IAUUpdateKind: { FLEXIBLE: 0, IMMEDIATE: 1 }
  };
});

jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(() => '1.0.0'),
  getBuildNumber: jest.fn(() => '1'),
  getUniqueId: jest.fn(() => 'unique-id'),
}));

jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
  getString: jest.fn(),
}));

jest.mock('react-native-share', () => ({
  default: jest.fn(),
  open: jest.fn(),
}));

jest.mock('react-native-linear-gradient', () => ({
  __esModule: true,
  default: 'LinearGradient',
}));

jest.mock('react-native-chart-kit', () => ({
  PieChart: 'PieChart',
  LineChart: 'LineChart',
  BarChart: 'BarChart',
}));
