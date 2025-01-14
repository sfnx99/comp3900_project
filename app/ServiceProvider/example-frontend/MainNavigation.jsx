import { useContext, useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { renderIconByName } from './scripts/util';
import { ThemeContext } from './context/ThemeContext';
import { getCoordinates } from './components/Geocoding';
import { headerOptions } from './styles/headerOptions';
import HomeStack from './screens/stacks/HomeStack';
import WalletStack from './screens/stacks/WalletStack';
import AuthenticationStack from './screens/stacks/AuthenticationStack';
import SettingsScreen from './screens/SettingsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import SearchButton from './components/SearchButton';
import RequestCredentialScreen from './screens/RequestCredentialScreen';
import { CredentialsProvider } from './context/CredentialsContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainApp = () => {
  const [notifications, setNotifications] = useState([]);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchNotifications = async () => {
      const initialNotifications = [
        {
          id: 1,
          name: 'bob smith',
          type: 'location',
          timestamp: new Date(),
          detail: 'Joes Bar',
        },
      ];

      const notificationsWithCoordinates = await Promise.all(
        initialNotifications.map(async (notification) => {
          if (notification.type === 'location' && notification.detail) {
            const coordinates = await getCoordinates(notification.detail);
            return { ...notification, coordinates };
          }
          return notification;
        }),
      );

      setNotifications(notificationsWithCoordinates);
    };

    fetchNotifications();
  }, []);

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
          options={{
            tabBarIcon: renderIconByName('home'),
            headerShown: false,
          }}
        >
          {() => <HomeStack notifications={notifications} />}
        </Tab.Screen>
        <Tab.Screen
          name="Trust Issuer"
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
        backgroundColor={'#6c9897'}
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
