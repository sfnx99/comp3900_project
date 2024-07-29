import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import { dark, light } from '../styles/themes';
import { getValueFor, save } from '../scripts/util';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = useCallback(() => {
    setDarkMode((prevState) => {
      const newState = !prevState;
      save('darkMode', newState ? 'true' : 'false');
      return newState;
    });
  }, []);

  const theme = darkMode ? dark : light;

  useEffect(() => {
    const fetchTheme = async () => {
      const savedTheme = await getValueFor('darkMode');
      setDarkMode(savedTheme === 'true');
    };

    fetchTheme();
  }, []);

  const contextValue = useMemo(() => ({ theme, darkMode, toggleTheme }), [darkMode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useTheme = () => useContext(ThemeContext);

export { ThemeContext, ThemeProvider, useTheme };
