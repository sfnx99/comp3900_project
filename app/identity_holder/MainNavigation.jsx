import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { StyleSheet } from "react-native";
import { DefaultTheme } from "@react-navigation/native";

import theme from "./styles/colors";
import { renderIconByName } from "./scripts/util";

import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import WalletScreen from "./screens/WalletScreen";
import RequestCredentialScreen from "./screens/RequestCredentialScreen";
import SearchButton from "./components/SearchButton";

const Tab = createBottomTabNavigator();

const MainNavigation = () => {
  return (
    <NavigationContainer
      theme={navTheme}
    >
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: true,
          tabBarStyle: styles.navBar,
          headerStyle: styles.header,
          headerShadowVisible: false,
        }}
        backBehavior="history"
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: renderIconByName("home"),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Wallet"
          component={WalletScreen}
          options={{
            tabBarIcon: renderIconByName("wallet"),
            headerRight: SearchButton(),
          }}
        />
        <Tab.Screen
          name="Request"
          component={RequestCredentialScreen}
          options={{
            tabBarIcon: renderIconByName("card-plus"),
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            tabBarIcon: renderIconByName("bell"),
            headerRight: SearchButton(),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: renderIconByName("cog"),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.primaryVariant,
    background: theme.background,
  }
}

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: theme.nav,
  },
  header: {
    backgroundColor: theme.background,
    height: 100,
  }
});

export default MainNavigation;
