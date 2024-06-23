import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Notification from '../components/Activity';
import { getCoordinates } from '../components/Geocoding';

const ActivityHistory = () => {
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
        })
      );

      setNotifications(notificationsWithCoordinates);
    };

    fetchNotifications();
  }, []);

  return (
    <ScrollView style={styles.view}>
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  view: {
    marginTop: 20,
    gap: 24,
    marginHorizontal: 21,
  },
});

export default ActivityHistory;
