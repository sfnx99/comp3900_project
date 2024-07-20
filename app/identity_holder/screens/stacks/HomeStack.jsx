import PropTypes from 'prop-types';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import ActivityHistory from '../ActivityHistory';
import HomeScreen from '../HomeScreen';
import { notificationPropType, renderIconByName } from '../../scripts/util';
import { ThemeContext } from '../../context/ThemeContext';
import PresentationScreen from '../PresentationScreen';
import SelectCredentialScreen from '../SelectCredentialScreen';
import PresentCredentialScreen from '../PresentCredentialScreen';

const Stack = createStackNavigator();

const HomeStack = ({ notifications }) => {
  const { theme } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    header: {
      backgroundColor: theme.background,
      height: 100,
    },
    text: {
      color: theme.text,
      fontWeight: 'bold',
      paddingTop: 25,
      fontSize: 20,
    },
  });

  return (
    <Stack.Navigator
      screenOptions={styles.header}
      cardStyle
      initialRouteName="HomeMain"
    >
      <Stack.Screen
        name="HomeMain"
        options={{
          tabBarIcon: renderIconByName('home'),
          headerShown: false,
          headerStyle: styles.header,
          headerTitleStyle: styles.text,
          headerTitleAlign: 'center',
        }}
      >
        {() => <HomeScreen activities={notifications} />}
      </Stack.Screen>
      <Stack.Screen
        name="ActivityHistory"
        options={({ navigation }) => ({
          headerShown: true,
          tabBarStyle: '#F1F2EC',
          headerStyle: styles.header,
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerTitleStyle: styles.text,
          headerLeft: renderIconByName('arrow-left', () => navigation.goBack(), {
            paddingTop: 25,
            size: 30,
            color: theme.text,
          }),
        })}
      >
        {() => <ActivityHistory notifications={notifications} />}
      </Stack.Screen>
      <Stack.Screen
        name="PresentationScreen"
        component={PresentationScreen}
        options={{
          tabBarIcon: renderIconByName('home'),
          headerShown: true,
          headerStyle: styles.header,
          headerTitleStyle: styles.text,
          headerTitleAlign: 'center',
          title: 'Verify',
        }}
      />
      <Stack.Screen
        name="SelectCredentialScreen"
        component={SelectCredentialScreen}
        options={({ navigation }) => ({
          title: 'Select Credential',
          headerShown: true,
          tabBarStyle: '#F1F2EC',
          headerStyle: styles.header,
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerTitleStyle: styles.text,
          headerLeft: renderIconByName('arrow-left', () => navigation.navigate('Home', {screen: 'PresentationScreen'}), {
            paddingTop: 25,
            size: 30,
            color: theme.text,
          }),
        })}
      />
      <Stack.Screen
        name="PresentCredentialScreen"
        component={PresentCredentialScreen}
        options={({ navigation }) => ({
          title: 'Present Credential',
          headerShown: true,
          tabBarStyle: '#F1F2EC',
          headerStyle: styles.header,
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerTitleStyle: styles.text,
          headerLeft: renderIconByName('arrow-left', () => navigation.navigate('Home', {screen: 'PresentationScreen'}), {
            paddingTop: 25,
            size: 30,
            color: theme.text,
          }),
        })}
      />
    </Stack.Navigator>
  );
};

HomeStack.propTypes = {
  notifications: PropTypes.arrayOf(notificationPropType),
};

export default HomeStack;
