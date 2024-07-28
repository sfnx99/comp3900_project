import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainNavigation from './MainNavigation';
import { ThemeProvider } from './context/ThemeContext';
import { UserPreferenceProvider } from './context/UserPreferencesContext';

const App = () => (
  <GestureHandlerRootView>
    <ThemeProvider>
      <UserPreferenceProvider>
        <MainNavigation />
      </UserPreferenceProvider>
    </ThemeProvider>
  </GestureHandlerRootView>
);

export default App;
