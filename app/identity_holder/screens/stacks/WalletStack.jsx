import { createStackNavigator } from '@react-navigation/stack';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';

import { ThemeContext } from '../../context/ThemeContext';
import { renderIconByName } from '../../scripts/util';
import WalletScreen from '../WalletScreen';
import SearchButton from '../../components/SearchButton';
import CredentialInformation from '../CredentialInformation';

const Stack = createStackNavigator();

const WalletStack = ({ credentials }) => {
  const { theme } = useContext(ThemeContext);

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
        name="WalletMain"
        options={({ navigation }) => ({
          headerShown: true,
          tabBarStyle: '#F1F2EC',
          headerStyle: styles.header,
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerTitleStyle: styles.text,
          headerLeft: renderIconByName('arrow-left', () => navigation.goBack(), {
            paddingTop: 25,
            size: 30,
            color: theme.text,
          }),
          headerRight: SearchButton(),
        })}
      >
        {() => <WalletScreen credentials={credentials} />}
      </Stack.Screen>
      <Stack.Screen
        name="CredentialDetail"
        component={CredentialInformation}
        options={({ navigation }) => ({
          headerShown: true,
          headerStyle: styles.header,
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerTitleStyle: styles.text,
          headerLeft: renderIconByName('arrow-left', () => navigation.goBack(), {
            paddingTop: 25,
            size: 30,
            color: theme.text,
          }),
        })}
      />
    </Stack.Navigator>
  );
};

export default WalletStack;
