import React from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainNavigation from './MainNavigation';
import { ThemeProvider } from './context/ThemeContext';
import { UserPreferenceProvider } from './context/UserPreferencesContext';
import { AccountProvider } from './context/AccountContext';

LogBox.ignoreLogs([
  'Value being stored in SecureStore is larger than 2048 bytes',
]);

const App = () => (
  <GestureHandlerRootView>
    <ThemeProvider>
      <UserPreferenceProvider>
        <AccountProvider>
          <MainNavigation />
        </AccountProvider>
      </UserPreferenceProvider>
    </ThemeProvider>
  </GestureHandlerRootView>
);

export default App;
