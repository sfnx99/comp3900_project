import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextButton from '../components/TextButton';
import CredentialsCarousel from '../components/CredentialsCarousel';
import ActivityPreview from '../components/ActivityPreview';

const HomeScreen = () => (
  <SafeAreaView>
    <Text>Welcome back,</Text>
    <Text>Jessica</Text>
    <CredentialsCarousel />
    <TextButton
      text="View All Credentials"
      onPress={() => console.log('Hello World')}
    />
    <ActivityPreview />
    <TextButton
      text="View All Activity History"
      onPress={() => console.log('Hello World')}
      inverted
    />
  </SafeAreaView>
);

export default HomeScreen;
