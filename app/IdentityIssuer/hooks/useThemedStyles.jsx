import { useTheme } from '../context/ThemeContext';

const useThemedStyles = (styleFunction) => {
  const theme = useTheme();
  return styleFunction(theme);
};

export default useThemedStyles;
