import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainNavigation from './MainNavigation';
import { ThemeProvider } from './context/ThemeContext';
import { CredentialsProvider } from './context/CredentialsContext';
import { UserPreferenceProvider } from './context/UserPreferencesContext';

const App = () => (
  <GestureHandlerRootView>
    <ThemeProvider>
      <UserPreferenceProvider>
        <CredentialsProvider>
          <MainNavigation />
        </CredentialsProvider>
      </UserPreferenceProvider>
    </ThemeProvider>
  </GestureHandlerRootView>
);

export default App;
