import { useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';

import Notification from '../components/Activity';
import { notificationPropType } from '../scripts/util';

const ActivityHistory = ({ notifications }) => {
  const navigation = useNavigation();
  const [activities, setActivities] = useState([]);
  // Function to load all previous notifications as activities
  useEffect(() => {
    setActivities(notifications.filter((notification) => notification.type === 'location'));
  }, [notifications]);
  //Layout correctly
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Activity History',
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.view}>
      {activities.map((notification) => (
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

ActivityHistory.propTypes = {
  notifications: PropTypes.arrayOf(notificationPropType).isRequired,
};

export default ActivityHistory;
