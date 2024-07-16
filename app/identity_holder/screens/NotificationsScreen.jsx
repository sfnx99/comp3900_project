import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, Dimensions } from 'react-native';
import Notification from '../components/Notification';
import { notificationPropType } from '../scripts/util';

const NotificationsScreen = ({ notifications }) => (
  <ScrollView style={styles.view}>
    {notifications.map((notification) => (
      <Notification
        key={notification.id}
        notification={notification}
      />
    ))}
  </ScrollView>
);

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
