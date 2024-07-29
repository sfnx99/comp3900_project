import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { renderIconByName } from '../../scripts/util';
import WalletScreen from '../WalletScreen';
import SearchButton from '../../components/SearchButton'; // Ensure SearchButton is imported
import CredentialInformation from '../CredentialInformation';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();

const WalletStack = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    header: {
      backgroundColor: theme.background,
      height: 100,
    },
    text: {
      color: 'black',
      fontWeight: 'bold',
      paddingTop: 25,
      fontSize: 20,
    },
  });

  return (
    <Stack.Navigator
      screenOptions={styles.header}
      cardStyle
      initialRouteName="Wallet"
    >
      <Stack.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          headerShown: true,
          tabBarStyle: '#F1F2EC',
          headerStyle: styles.header,
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerTitleStyle: styles.text,
          headerLeft: renderIconByName('arrow-left', () => navigation.goBack(), {
            paddingTop: 25,
            size: 30,
            color: 'black',
          }),
          headerRight: () => <SearchButton onPress={() => navigation.navigate('Search')} />, 
        }}
      />
      <Stack.Screen
        name="CredentialInformation"
        component={CredentialInformation}
        options={({ navigation }) => ({
          headerShown: true,
          headerStyle: styles.header,
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerTitleStyle: styles.text,
          headerLeft: renderIconByName('arrow-left', () => navigation.navigate('Wallet'), {
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
