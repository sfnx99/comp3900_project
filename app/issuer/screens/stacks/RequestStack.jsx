import { createStackNavigator } from '@react-navigation/stack';
import RequestCredentialScreen from '../RequestCredentialScreen';
import SuccessfullySubmitted from '../SuccessfullySubmitted';

const Stack = createStackNavigator();

const RequestStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Request Credential"
      component={RequestCredentialScreen}
      options={() => ({
        headerShown: false,
      })}
    />
    <Stack.Screen
      name="SuccessfullySubmitted"
      component={SuccessfullySubmitted}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

export default RequestStack;
