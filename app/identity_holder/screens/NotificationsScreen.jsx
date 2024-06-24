import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Dimensions } from 'react-native';
import Notification from '../components/Notification';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications([
      {
        id: 1,
        name: 'Credential Approved',
        type: 'approval',
        timestamp: new Date(),
        detail: 'Your NSW Drivers License has been verified.',
      },
      {
        id: 2,
        name: 'Credential Pending',
        type: 'pending',
        timestamp: new Date(),
        detail: 'Request for UNSW ID card pending approval.',
      },
      {
        id: 3,
        name: 'Medicare Card',
        type: 'location',
        timestamp: new Date(),
        detail: 'Used at UNSW Medical Centre',
      },
    ]);
  }, []);

  return (
    <ScrollView style={styles.view}>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
        />
      ))}
    </ScrollView>
  );
};

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  view: {
    marginTop: height*0.04,
    gap: 24,
    marginHorizontal: 21,
  },
});

export default NotificationsScreen;
