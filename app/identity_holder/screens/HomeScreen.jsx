import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import TextButton from '../components/TextButton';
import CredentialsCarousel from '../components/CredentialsCarousel';
import ActivityPreview from '../components/ActivityPreview';

const HomeScreen = ({ credentials, activities }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <Text>Welcome back,</Text>
      <Text>Jessica</Text>
      <CredentialsCarousel />
      <TextButton
        text="View All Credentials"
        onPress={() => console.log('Hello World')}
      />
      <ActivityPreview
        activities={activities}
      />
      <TextButton
        text="View All Activity History"
        onPress={() => navigation.navigate('ActivityHistory')}
        inverted
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
