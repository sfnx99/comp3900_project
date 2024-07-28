import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainNavigation from './MainNavigation';
import { ThemeProvider } from './context/ThemeContext';
import { UserPreferenceProvider } from './context/UserPreferencesContext';
import { AccountProvider } from './context/AccountContext';

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
