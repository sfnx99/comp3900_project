import { useContext } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { StatusBar, StyleSheet } from 'react-native';

import { renderIconByName } from './scripts/util';

import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import WalletScreen from './screens/WalletScreen';
import RequestCredentialScreen from './screens/RequestCredentialScreen';
import SearchButton from './components/SearchButton';
import { ThemeContext } from './context/ThemeContext';

const Tab = createBottomTabNavigator();

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
  });

  return (
    <>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
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
            name="Wallet"
            component={WalletScreen}
            options={{
              tabBarIcon: renderIconByName('wallet'),
              headerRight: SearchButton(),
            }}
          />
          <Tab.Screen
            name="Request"
            component={RequestCredentialScreen}
            options={{
              tabBarIcon: renderIconByName('card-plus'),
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
    </>
  );
};

export default MainNavigation;
