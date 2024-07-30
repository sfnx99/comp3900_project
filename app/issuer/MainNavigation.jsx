import { useContext } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { renderIconByName } from './scripts/util';
import { ThemeContext } from './context/ThemeContext';
import { headerOptions } from './styles/headerOptions';
import HomeStack from './screens/stacks/HomeStack';
import AuthenticationStack from './screens/stacks/AuthenticationStack';
import SettingsScreen from './screens/SettingsScreen';
import RequestCredentialScreen from './screens/RequestCredentialScreen';
import { CredentialsProvider } from './context/CredentialsContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainApp = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <CredentialsProvider>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ navigation }) => ({
          ...headerOptions(theme, navigation),
        })}
        backBehavior="history"
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: renderIconByName('home'),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Register User"
          component={RequestCredentialScreen}
          options={{
            tabBarIcon: renderIconByName('card-plus'),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: renderIconByName('cog'),
          }}
        />
      </Tab.Navigator>
    </CredentialsProvider>
  );
};

const MainNavigation = () => {
  const { theme, darkMode } = useContext(ThemeContext);

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.primaryVariant,
      background: '#6c9897',
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor="#6c9897"
      />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Authentication"
          component={AuthenticationStack}
        />
        <Stack.Screen
          name="MainApp"
          component={MainApp}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;
