import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainNavigation from './MainNavigation';
import { ThemeProvider } from './context/ThemeContext';

const App = () => (
  <GestureHandlerRootView>
    <ThemeProvider>
      <MainNavigation />
    </ThemeProvider>
  </GestureHandlerRootView>
);

export default App;
