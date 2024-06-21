import { StyleSheet } from "react-native";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { renderIconByName } from "./scripts/util";
import theme from "./styles/colors";

import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import WalletScreen from "./screens/WalletScreen";
import RequestCredentialScreen from "./screens/RequestCredentialScreen";

const Tab = createBottomTabNavigator();

export default App = () => {
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
