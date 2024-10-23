import PropTypes from 'prop-types';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import ActivityHistory from '../ActivityHistory';
import { notificationPropType, renderIconByName } from '../../scripts/util';
import HomeScreen from '../HomeScreen';
import { ThemeContext } from '../../context/ThemeContext';

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
    </Stack.Navigator>
  );
};

HomeStack.propTypes = {
  notifications: PropTypes.arrayOf(notificationPropType),
};

export default HomeStack;
