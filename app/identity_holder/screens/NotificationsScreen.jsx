// screens/NotificationsScreen.jsx

import React, { useState } from 'react';
import { ScrollView, StyleSheet, Dimensions } from 'react-native';
import Notification from '../components/Notification';
import SearchBar from '../components/SearchNotiBar';
import { notificationPropType } from '../scripts/util';
import PropTypes from 'prop-types';


const NotificationsScreen = ({ notifications }) => {
  const [filteredNotifications, setFilteredNotifications] = useState(notifications);

  const handleSearch = (query) => {
    const filtered = notifications.filter((notification) =>
      notification.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredNotifications(filtered);
  };

  return (
    <>
      <SearchBar onChange={handleSearch} />
      <ScrollView style={styles.view}>
        {filteredNotifications.map((notification) => (
          <Notification key={notification.id} notification={notification} />
        ))}
      </ScrollView>
    </>
  );
};

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  view: {
    marginTop: height * 0.04,
    gap: 24,
    marginHorizontal: 21,
  },
});

NotificationsScreen.propTypes = {
  notifications: PropTypes.arrayOf(notificationPropType),
};

export default NotificationsScreen;
