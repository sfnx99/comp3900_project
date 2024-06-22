import * as React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Button } from 'react-native';

import theme from './styles/colors';
import { renderIconByName } from './scripts/util';

import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import WalletScreen from './screens/WalletScreen';
import RequestCredentialScreen from './screens/RequestCredentialScreen';
import EditInfo from './screens/EditInfo';
import SearchButton from './components/SearchButton';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const RequestStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="RequestCredential" 
      component={RequestCredentialScreen} 
      options={({ navigation }) => ({
        title: 'Request Credential',
        headerLeft: renderIconByName('arrow-left', () => navigation.goBack(), { size: 30 }),
        headerTitleAlign: 'center',
        headerTitleStyle: { fontSize: 24, fontWeight: 'normal' },
      })} 
    />
    <Stack.Screen 
      name="EditInfo" 
      component={EditInfo} 
      options={({ navigation }) => ({
        title: 'Edit Info',
        headerLeft: renderIconByName('arrow-left', () => navigation.goBack(), { size: 30 }),
        headerTitleAlign: 'center',
        headerTitleStyle: { fontSize: 18, fontWeight: 'thin' },
      })}
    />
  </Stack.Navigator>
);

const MainNavigation = () => (
  <NavigationContainer
    theme={navTheme}
  >
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
        headerLeft: renderIconByName('arrow-left', () => navigation.goBack(), { size: 30 }),
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
        name="RequestCredential"
        component={RequestStack}
        options={{
          headerShown: false,
          tabBarIcon: renderIconByName('card-plus'),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: renderIconByName('wallet'),
          headerRight: SearchButton(),
        }}
      />
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
  </NavigationContainer>
);

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.primaryVariant,
    background: theme.background,
  },
};

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: theme.nav,
  },
  header: {
    backgroundColor: theme.background,
    height: 80,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
});

export default MainNavigation;
