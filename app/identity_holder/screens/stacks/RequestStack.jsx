import { createStackNavigator } from '@react-navigation/stack';
import RequestCredentialScreen from '../RequestCredentialScreen';
import { renderIconByName } from '../../scripts/util';
import SuccessfullySubmitted from '../SuccessfullySubmitted';

const Stack = createStackNavigator();

const RequestStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Request Credential"
      component={RequestCredentialScreen}
      options={({ navigation }) => ({
        headerShown: false
      })}
    />
    <Stack.Screen
      name="SuccessfullySubmitted"
      component={SuccessfullySubmitted}
      options={({ navigation }) => ({
        headerShown: false,
      })}
    />
  </Stack.Navigator>
);

export default RequestStack;
