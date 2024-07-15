import { createStackNavigator } from '@react-navigation/stack';

import { headerOptions } from '../../styles/headerOptions';
import LoginScreen from '../LoginScreen';
import RegisterScreen from '../RegisterScreen';
import { useTheme } from '../../context/ThemeContext';

const Stack = createStackNavigator();

const AuthenticationStack = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        ...headerOptions(theme, navigation),
      })}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthenticationStack;
