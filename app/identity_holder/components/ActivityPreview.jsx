import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';

import Activity from './Activity';

const ActivityPreview = ({ activities }) => {
  const [displayed, setDisplayed] = useState([]);

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
    <View style={styles.component}>
      <Text style={styles.text}>Recent Activity</Text>
      {displayed.map((activity) => (
        <Activity notification={activity} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  component: {
    height: 173,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

ActivityPreview.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default ActivityPreview;
