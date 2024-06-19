import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SettingsScreen from "./screens/SettingsScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import WalletScreen from "./screens/WalletScreen";

const Tab = createBottomTabNavigator();

const renderIconByName = (name) => {
  return ({ color, size }) => (
    <MaterialCommunityIcons
      name={name}
      color={color}
      size={size}
    />
  )
}

export default App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
        }}
        backBehavior="order"
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarIcon: renderIconByName("home") }}
        />
        <Tab.Screen
          name="Wallet"
          component={WalletScreen}
          options={{ tabBarIcon: renderIconByName("wallet") }}
        />
        <Tab.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ tabBarIcon: renderIconByName("bell") }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ tabBarIcon: renderIconByName("cog") }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
