import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { deleteItem, getValueFor, save } from '../scripts/util';

const UserPreferenceContext = createContext();

const UserPreferenceProvider = ({ children }) => {
  const [notificationsOn, setNotificationsOn] = useState(false);
  const [displayName, setDisplayName] = useState('User');

  useEffect(() => {
    const fetchDisplayName = async () => {
      const name = await getValueFor('displayName');
      if (name) {
        setDisplayName(name);
      } else {
        setDisplayName('User');
      }
    };

    const fetchNotifications = async () => {
      const notifications = await getValueFor('notificationsOn');
      if (notifications) {
        setNotificationsOn(notifications === 'true');
      } else {
        setNotificationsOn(false);
      }
    };

    fetchDisplayName();
    fetchNotifications();
  }, []);

  const toggleNotifications = useCallback(() => {
    setNotificationsOn((prevState) => {
      const newState = !prevState;
      save('notificationsOn', newState ? 'true' : 'false');
      return newState;
    });
  }, []);

  const updateDisplayName = async (name) => {
    setDisplayName(name);
    await save('displayName', name);
  };
  
  /**
   * Wipes the preference data from the device.
   */
  const wipePreferenceData = async () => {
    setNotificationsOn(false);
    setDisplayName('User');
    await deleteItem('notificationsOn');
    await deleteItem('displayName');
  };

  const contextValues = useMemo(() => ({
    notificationsOn,
    toggleNotifications,
    displayName,
    updateDisplayName,
    wipePreferenceData,
  }), [notificationsOn, displayName]);

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
