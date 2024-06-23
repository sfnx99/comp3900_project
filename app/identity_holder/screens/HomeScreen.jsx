import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import TextButton from '../components/TextButton';
import CredentialsCarousel from '../components/CredentialsCarousel';
import ActivityPreview from '../components/ActivityPreview';
import { credentialPropType, notificationPropType } from '../scripts/util';

const HomeScreen = ({ credentials, activities }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <Text>Welcome back,</Text>
      <Text>Jessica</Text>
      <CredentialsCarousel
        credentials={credentials}
      />
      <TextButton
        text="View All Credentials"
        onPress={() => navigation.navigate('Wallet')}
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

HomeScreen.propTypes = {
  credentials: PropTypes.arrayOf(credentialPropType),
  activities: PropTypes.arrayOf(notificationPropType),
};

export default HomeScreen;
