import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainNavigation from './MainNavigation';
import { ThemeProvider } from './context/ThemeContext';
import { CredentialsProvider } from './context/CredentialsContext';

const App = () => (
  <GestureHandlerRootView>
    <ThemeProvider>
      <CredentialsProvider>
        <MainNavigation />
      </CredentialsProvider>
    </ThemeProvider>
  </GestureHandlerRootView>
);

export default App;
