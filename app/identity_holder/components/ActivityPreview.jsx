import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import Activity from './Activity';
import { notificationPropType } from '../scripts/util';

const ActivityPreview = ({ activities }) => {
  const [displayed, setDisplayed] = useState([]);

  // Mapping the activities

  useEffect(() => {
    const newDisplayed = activities.filter((activity) => activity.type === 'location')
      .map((activity) => ({
        ...activity,
        type: 'location-preview',
      }))
      .slice(0, 5);
    setDisplayed(newDisplayed);
  }, [activities]);
  return (
    <ScrollView style={styles.container}>
      {displayed.map((activity) => (
        <Activity key={activity.id} notification={activity} />
      ))}
    </ScrollView>
  );
};

ActivityPreview.propTypes = {
  activities: PropTypes.arrayOf(notificationPropType).isRequired,
};

const styles = StyleSheet.create({
  container: {
    height: 150,
  },
});

export default ActivityPreview;
