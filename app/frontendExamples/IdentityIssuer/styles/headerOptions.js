import { StyleSheet } from 'react-native';
import { renderIconByName } from '../scripts/util';

const createHeaderScreenOptions = (theme) => (
  StyleSheet.create({
    navBar: {
      backgroundColor: theme.nav,
    },
    header: {
      backgroundColor: '#6c9897',
      height: 100,
    },
    headerTitle: {
      fontWeight: 'bold',
      paddingTop: 25,
      fontSize: 20,
    },
    headerLeft: {
      paddingTop: 25,
      size: 30,
    },
  })
);

export const headerOptions = (theme, navigation) => {
  const styles = createHeaderScreenOptions(theme);
  return {
    tabBarShowLabel: false,
    headerShown: true,
    tabBarStyle: styles.navBar,
    headerStyle: styles.header,
    headerShadowVisible: false,
    headerTitleAlign: 'center',
    headerTitleStyle: styles.headerTitle,
    headerLeft: renderIconByName('arrow-left', () => navigation.goBack(), styles.headerLeft),
  };
};
