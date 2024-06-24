import { useContext, useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { StatusBar, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { renderIconByName } from './scripts/util';

import SettingsScreen from './screens/SettingsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import WalletScreen from './screens/WalletScreen';
import SearchButton from './components/SearchButton';
import { ThemeContext } from './context/ThemeContext';
import LoginScreen from './screens/LoginScreen';
import HomeStack from './screens/stacks/HomeStack';
import RequestCredentialScreen from './screens/RequestCredentialScreen';
import { getCoordinates } from './components/Geocoding';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainApp = () => {
  const [credentials, setCredentials] = useState([]);
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

    // TODO: GET CREDENTIALS HERE
    const fetchCredentials = async () => {
      setCredentials([
        {
          id: '1',
          iss: 'NSW Government',
          cred: {
            credName: 'NSW Drivers License',
            fullName: 'Jessica Brown',
            expiryDate: new Date(),
            licenseNumber: '0123456789',
          },
        },
      ]);
    };

    fetchNotifications();
    fetchCredentials();
  }, []);

  const styles = StyleSheet.create({
    navBar: {
      backgroundColor: theme.nav,
    },
    header: {
      backgroundColor: theme.background,
      height: 100,
    },
    headerTitle: {
      color: theme.text,
      fontWeight: 'bold',
      paddingTop: 25,
      fontSize: 20,

    },
    headerLeft: {
      paddingTop: 25,
      size: 30,
      color: theme.text,
    },
    /*
    headerRight: {
      paddingTop: 25,
    },
    */
  });

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ navigation }) => ({
        tabBarShowLabel: false,
        headerShown: true,
        tabBarStyle: styles.navBar,
        headerStyle: styles.header,
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerTitleStyle: styles.headerTitle,
        headerLeft: renderIconByName('arrow-left', () => navigation.goBack(), styles.headerLeft),
      })}
      backBehavior="history"
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: renderIconByName('home'),
          headerShown: false,
          headerTitleAlign: 'center',
        }}
      >
        {() => <HomeStack credentials={credentials} notifications={notifications} />}
      </Tab.Screen>
      <Tab.Screen
        name="Request Credentials"
        component={RequestCredentialScreen}
        options={{
          // headerShown: false,
          tabBarIcon: renderIconByName('card-plus'),
        }}
      />
      <Tab.Screen
        name="Wallet"
        options={{
          tabBarIcon: renderIconByName('wallet'),
          headerRight: SearchButton(),
        }}
      >
        {() => <WalletScreen credentials={credentials} />}
      </Tab.Screen>
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
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Hide header for login screen
        />
        <Stack.Screen
          name="MainApp"
          component={MainApp}
          options={{ headerShown: false }} // Hide header for main app container
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// const MainNavigation = () => (
//   <NavigationContainer
//     theme={navTheme}
//   >
//     <ExpoStatusBar style="dark" />
//     <StatusBar barStyle="dark-content" />

//     <Tab.Navigator
//       initialRouteName="Home"
//       screenOptions={({ navigation }) => ({
//         tabBarShowLabel: false,
//         headerShown: true,
//         tabBarStyle: styles.navBar,
//         headerStyle: styles.header,
//         headerShadowVisible: false,
//         headerTitleAlign: 'center',
//         headerTitleStyle: styles.headerTitle,
//         headerLeft: renderIconByName('arrow-left', () => navigation.goBack(), { size: 30 }),
//       })}
//       backBehavior="history"
//     >
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           tabBarIcon: renderIconByName('home'),
//           headerShown: false,
//           headerTitleAlign: 'center',
//         }}
//       />
//       <Tab.Screen
//         name="RequestCredentialTab"
//         component={RequestStack}
//         options={{
//           headerShown: false,
//           tabBarIcon: renderIconByName('card-plus'),
//         }}
//       />
//       <Tab.Screen
//         name="Wallet"
//         component={WalletScreen}
//         options={{
//           tabBarIcon: renderIconByName('wallet'),
//           headerRight: SearchButton(),
//         }}
//       />
//       <Tab.Screen
//         name="Notifications"
//         component={NotificationsScreen}
//         options={{
//           tabBarIcon: renderIconByName('bell'),
//           headerRight: SearchButton(),
//         }}
//       />
//       <Tab.Screen
//         name="Settings"
//         component={SettingsScreen}
//         options={{
//           tabBarIcon: renderIconByName('cog'),
//         }}
//       />
//     </Tab.Navigator>
//   </NavigationContainer>
// );

export default MainNavigation;
