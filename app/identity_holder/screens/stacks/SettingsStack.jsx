import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../SettingsScreen';
import SelectiveDisclosure from '../SelectiveDisclosure';
import SecurityScreen from '../SecurityScreen';

const Stack = createStackNavigator();

const SettingsNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
    />
    <Stack.Screen
      name="Selective Disclosure"
      component={SelectiveDisclosure}
    />
    <Stack.Screen
      name="Security"
      component={SecurityScreen}
    />
  </Stack.Navigator>
);

export default SettingsNavigator;
