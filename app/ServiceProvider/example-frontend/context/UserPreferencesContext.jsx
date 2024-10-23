import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { getValueFor, save } from '../scripts/util';
import { getCoordinates } from '../components/Geocoding';

const UserPreferenceContext = createContext();

const UserPreferenceProvider = ({ children }) => {
  const [notificationsOn, setNotificationsOn] = useState(false);
  const [displayName, setDisplayName] = useState('User');
  const [location, setLocation] = useState('Sydney');
  const [coordinates, setCoordinates] = useState({ latitude: -33.8688, longitude: 151.2093 }); // Default to Sydney

  useEffect(() => {
    const fetchPreferences = async () => {
      const name = await getValueFor('displayName');
      setDisplayName(name || 'User');

      const loc = await getValueFor('location');
      const locationName = loc || 'Sydney';
      setLocation(locationName);

      const coords = await getCoordinates(locationName);
      setCoordinates(coords || { latitude: -33.8688, longitude: 151.2093 });

      const notifications = await getValueFor('notificationsOn');
      setNotificationsOn(notifications === 'true');
    };

    fetchPreferences();
  }, []);

  const toggleNotifications = useCallback(() => {
    const newState = !notificationsOn;
    save('notificationsOn', newState ? 'true' : 'false');
    setNotificationsOn(newState);
  }, [notificationsOn]);

  const updateDisplayName = async (name) => {
    setDisplayName(name);
    await save('displayName', name);
  };

  const updateLocation = async (loc) => {
    setLocation(loc);
    const coords = await getCoordinates(loc);
    setCoordinates(coords || { latitude: -33.8688, longitude: 151.2093 });
    await save('location', loc);
  };

  const contextValues = useMemo(() => ({
    notificationsOn,
    toggleNotifications,
    displayName,
    location,
    coordinates,
    updateDisplayName,
    updateLocation,
  }), [notificationsOn, displayName, location, coordinates]);

  return (
    <UserPreferenceContext.Provider value={contextValues}>
      {children}
    </UserPreferenceContext.Provider>
  );
};

UserPreferenceProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserPreferenceContext, UserPreferenceProvider };
