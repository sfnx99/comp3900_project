import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SettingsScreen from '../SettingsScreen';
import SelectiveDisclosure from '../SelectiveDisclosure';

const Stack = createStackNavigator();

const SettingsNavigator = () => {
  return (
    <Stack.Navigator>
    <Stack.Screen
      name="Settingss"
      component={SettingsScreen}
      options={() => ({
        headerShown: false,
      })}
    />
    <Stack.Screen
      name="Selective Disclosure"
      component={SelectiveDisclosure}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);
}

export default SettingsNavigator;
