import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import ActivityHistory from '../ActivityHistory';
import { notificationPropType, renderIconByName } from '../../scripts/util';
import HomeScreen from '../HomeScreen';
import { useTheme } from '../../context/ThemeContext';
import { headerOptions } from '../../styles/headerOptions';
import CredentialHistoryScreen from '../CredentialHistoryScreen';
import CredentialInformation from '../CredentialInformation';

const Stack = createStackNavigator();

const HomeStack = ({ notifications }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    header: {
      backgroundColor: theme.background,
      height: 100,
    },
    text: {
      color: theme.text,
      fontWeight: 'bold',
      paddingTop: 25,
      fontSize: 20,
    },
  });

  return (
    <Stack.Navigator
      screenOptions={styles.header}
      cardStyle
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          tabBarIcon: renderIconByName('home'),
          headerShown: false,
          headerStyle: styles.header,
          headerTitleStyle: styles.text,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="CredentialHistory"
        component={CredentialHistoryScreen}
        options={({ navigation }) => ({
          ...headerOptions(theme, navigation),
          title: 'Issued Credential History',
        })}
      />
      <Stack.Screen
        name="CredentialInformation"
        component={CredentialInformation}
        options={({ navigation }) => ({
          ...headerOptions(theme, navigation),
          title: 'Credential Information',
        })}
      />
    </Stack.Navigator>
  );
};

HomeStack.propTypes = {
  notifications: PropTypes.arrayOf(notificationPropType),
};

export default HomeStack;
