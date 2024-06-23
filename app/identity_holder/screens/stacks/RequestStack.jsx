import { createStackNavigator } from '@react-navigation/stack';
import RequestCredentialScreen from '../RequestCredentialScreen';
import { renderIconByName } from '../../scripts/util';
import SuccessfullySubmitted from '../SuccessfullySubmitted';

const Stack = createStackNavigator();

const RequestStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="RequestCredential"
      component={RequestCredentialScreen}
      options={({ navigation }) => ({
        title: 'Request Credential',
        headerLeft: renderIconByName('arrow-left', () => navigation.goBack(), { size: 30 }),
        headerTitleAlign: 'center',
        headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
      })}
    />
    <Stack.Screen
      name="SuccessfullySubmitted"
      component={SuccessfullySubmitted}
      options={({ navigation }) => ({
        headerTitle: '',
        headerLeft: renderIconByName('arrow-left', () => navigation.goBack(), { size: 30 }),
        headerTitleAlign: 'center',
        headerTitleStyle: { fontSize: 18, fontWeight: 'thin' },
      })}
    />
  </Stack.Navigator>
);

export default RequestStack;
