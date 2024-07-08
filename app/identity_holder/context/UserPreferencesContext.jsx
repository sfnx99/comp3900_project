import {
  createContext,
  useCallback,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';

const UserPreferenceContext = createContext();

const UserPreferenceProvider = ({ children }) => {
  const [notificationsOn, setNotificationsOn] = useState(false);

  const toggleNotifications = useCallback(() => {
    setNotificationsOn((prevState) => {
      const newState = !prevState;
      return newState;
    });
  }, []);

  const contextValues = useMemo(() => (
    { notificationsOn, toggleNotifications }
  ), [notificationsOn]);

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
