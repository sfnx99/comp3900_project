import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { format } from 'date-fns';
import MapView, { Marker } from 'react-native-maps';

import { isValidDate } from '../scripts/util';
import CircleIcon from './CircleIcon';

const Activity = ({ notification }) => {
  const formattedTimestamp = format(new Date(notification.timestamp), 'dd/MM/yyyy');

  const getIconName = () => {
    switch (notification.type) {
      case 'approval':
        return 'check';
      case 'pending':
        return 'upload';
      case 'location':
      case 'location-preview':
        return 'map-marker-radius-outline';
      default:
        return null;
    }
  };

  const styles = StyleSheet.create({
    notification: {
      flexDirection: 'row',
      backgroundColor: '#F5FFB9',
      alignItems: 'center',
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
    },
    iconContainer: {
      marginRight: 12,
      alignSelf: 'flex-start',
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      flex: 1,
      marginRight: 8,
    },
    timestamp: {
      color: '#686858',
      fontSize: 12,
    },
    detail: {
      fontSize: 14,
    },
    map: {
      height: 200,
      width: '100%',
      marginTop: 10,
    },
  });

  return (
    <View style={styles.notification}>
      <View style={styles.iconContainer}>
        <CircleIcon name={getIconName()} size={16} color="black" backgroundColor="#D6EE41" />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{notification.name}</Text>
          <Text style={styles.timestamp}>{formattedTimestamp}</Text>
        </View>
        <Text style={styles.detail}>{notification.detail}</Text>
        {notification.type === 'location' && notification.coordinates && (
          <MapView
            style={styles.map}
            initialRegion={{
              ...notification.coordinates,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={notification.coordinates}
              title={notification.name}
              description={notification.detail}
            />
          </MapView>
        )}
      </View>
    </View>
  );
};

Activity.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    detail: PropTypes.string,
    timestamp: isValidDate,
    type: PropTypes.oneOf(['approval', 'pending', 'location', 'location-preview']),
    coordinates: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }),
  }).isRequired,
};

export default Activity;
