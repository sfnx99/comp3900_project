import PropTypes from 'prop-types';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { getCoordinates } from '../../components/Geocoding';
import ActivityHistory from '../ActivityHistory';
import { credentialPropType, renderIconByName } from '../../scripts/util';
import HomeScreen from '../HomeScreen';

const Stack = createStackNavigator();

const HomeStack = ({ credentials }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const initialNotifications = [
        {
          id: 1,
          name: 'Medicare Card',
          type: 'location',
          timestamp: new Date(),
          detail: 'UNSW Medical Centre',
        },
        {
          id: 2,
          name: 'NSW Drivers License',
          type: 'location',
          timestamp: new Date(),
          detail: 'Joe Bar, Newtown',
        },
        {
          id: 3,
          name: 'NSW Drivers License',
          type: 'location',
          timestamp: new Date(),
          detail: 'Woolworths, Newtown',
        },
      ];

      const notificationsWithCoordinates = await Promise.all(
        initialNotifications.map(async (notification) => {
          if (notification.type === 'location' && notification.detail) {
            const coordinates = await getCoordinates(notification.detail);
            return { ...notification, coordinates };
          }
          return notification;
        }),
      );

      setNotifications(notificationsWithCoordinates);
    };

    fetchNotifications();
  }, []);

  return (
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
};

HomeStack.propTypes = {
  credentials: PropTypes.arrayOf(credentialPropType),
};

export default HomeStack;
