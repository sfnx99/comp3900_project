import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

import Activity from './Activity';
import { notificationPropType } from '../scripts/util';

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
    <ScrollView>
      {displayed.map((activity) => (
        <Activity key={activity.id} notification={activity} />
      ))}
    </ScrollView>
  );
};

ActivityPreview.propTypes = {
  activities: PropTypes.arrayOf(notificationPropType).isRequired,
};

export default ActivityPreview;
