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
          name: 'Medicare Card',
          type: 'location',
          timestamp: new Date(),
          detail: 'UNSW Medical Centre',
        },
        {
          id: 2,
          name: 'NSW Drivers License',
          type: 'location',
          timestamp: new Date(),
          detail: 'Joe Bar, Newtown',
        },
        {
          id: 3,
          name: 'NSW Drivers License',
          type: 'location',
          timestamp: new Date(),
          detail: 'Woolworths, Newtown',
        },
        {
          id: 4,
          name: 'Credential Approved',
          type: 'approval',
          timestamp: new Date(),
          detail: 'Your NSW Drivers License has been verified.',
        },
        {
          id: 5,
          name: 'Credential Pending',
          type: 'pending',
          timestamp: new Date(),
          detail: 'Request for UNSW ID card pending approval.',
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
          name="Request Credentials"
          component={RequestCredentialScreen}
          options={{
            tabBarIcon: renderIconByName('card-plus'),
          }}
        />
        <Tab.Screen
          name="WalletStack"
          component={WalletStack}
          options={{
            tabBarIcon: renderIconByName('wallet'),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Notifications"
          options={{
            tabBarIcon: renderIconByName('bell'),
            headerRight: SearchButton(),
          }}
        >
          {() => <NotificationsScreen notifications={notifications} />}
        </Tab.Screen>
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
      background: theme.background,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
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
