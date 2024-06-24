import PropTypes from 'prop-types';
import { createStackNavigator } from '@react-navigation/stack';
import ActivityHistory from '../ActivityHistory';
import { credentialPropType, notificationPropType, renderIconByName } from '../../scripts/util';
import HomeScreen from '../HomeScreen';

const Stack = createStackNavigator();

const HomeStack = ({ credentials, notifications }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeMain"
      options={{
        tabBarIcon: renderIconByName('home'),
        headerShown: false,
        headerStyle: { backgroundColor: 'black' },
        headerTitleAlign: 'center',
      }}
    >
      {() => <HomeScreen credentials={credentials} activities={notifications} />}
    </Stack.Screen>
    <Stack.Screen
      name="ActivityHistory"
      options={({ navigation }) => ({
        headerShown: true,
        tabBarStyle: '#F1F2EC',
        headerStyle: {
          backgroundColor: '#F6F8FA',
          height: 100,
        },
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#000000',
          fontWeight: 'bold',
          paddingTop: 25,
          fontSize: 20,
        },
        headerLeft: renderIconByName('arrow-left', () => navigation.goBack(), {
          paddingTop: 25,
          size: 30,
          color: '#000000',
        }),
      })}
    >
      {() => <ActivityHistory notifications={notifications} />}
    </Stack.Screen>
  </Stack.Navigator>
);

HomeStack.propTypes = {
  credentials: PropTypes.arrayOf(credentialPropType),
  notifications: PropTypes.arrayOf(notificationPropType),
};

export default HomeStack;
