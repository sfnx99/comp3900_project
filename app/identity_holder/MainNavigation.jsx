import { useContext, useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { StatusBar, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { renderIconByName } from './scripts/util';

import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import WalletScreen from './screens/WalletScreen';
import RequestCredentialScreen from './screens/RequestCredentialScreen';
// import EditInfo from './screens/EditInfo';
import SearchButton from './components/SearchButton';
import { ThemeContext } from './context/ThemeContext';
import SuccessfullySubmitted from './screens/SuccessfullySubmitted';
import ActivityHistory from './screens/ActivityHistory';
import LoginScreen from './screens/LoginScreen';
import { getCoordinates } from './components/Geocoding';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const RequestStack = () => {
  const [notifications, setNotifications] = useState([]);

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
    <Stack.Navigator>
      <Stack.Screen
        name="RequestCredential"
        component={RequestCredentialScreen}
        options={({ navigation }) => ({
          title: 'Request Credential',
          headerLeft: renderIconByName('arrow-left', () => navigation.goBack(), { size: 30 }),
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
        })}
      />
      <Stack.Screen
        name="SuccessfullySubmitted"
        component={SuccessfullySubmitted}
        options={({ navigation }) => ({
          headerTitle: '',
          headerLeft: renderIconByName('arrow-left', () => navigation.goBack(), { size: 30 }),
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 18, fontWeight: 'thin' },
        })}
      />
      <Stack.Screen
        name="ActivityHistory"
        options={({ navigation }) => ({
          headerTitle: 'Activity History',
          headerLeft: renderIconByName('arrow-left', () => navigation.goBack(), { size: 30 }),
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
        })}
      >
        {() => <ActivityHistory notifications={notifications} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const MainApp = () => {
  const [credentials, setCredentials] = useState([]);

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
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

    fetchCredentials();
  }, []);

  const styles = StyleSheet.create({
    navBar: {
      backgroundColor: theme.nav,
    },
    header: {
      backgroundColor: theme.background,
      height: 80,
    },
    headerTitle: {
      color: theme.text,
      fontWeight: 'bold',
    },
    headerLeft: {
      size: 30,
      color: theme.text,
    },
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
        component={HomeScreen}
        options={{
          tabBarIcon: renderIconByName('home'),
          headerShown: false,
          headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen
        name="RequestCredentialTab"
        component={RequestStack}
        options={{
          headerShown: false,
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
        component={NotificationsScreen}
        options={{
          tabBarIcon: renderIconByName('bell'),
          headerRight: SearchButton(),
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
