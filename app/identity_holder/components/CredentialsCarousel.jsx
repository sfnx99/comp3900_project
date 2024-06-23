import PropType from 'prop-types';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

import { credentialPropType } from '../scripts/util';

const CredentialsCarousel = ({ credentials }) => {
  const { width } = Dimensions.get('window');

  return (
    <View style={styles.carousel}>
      <Carousel
        loop
        width={width}
        height={width / 2}
        data={[...new Array(6).keys()]}
        scrollAnimationDuration={1000}
        onSnapToItem={(index) => console.log('current index:', index)}
        renderItem={({ index }) => (
          <View
            style={styles.view}
          >
            <Text style={styles.text}>
              {index}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carousel: {
    flex: 1,
  },
  view: {
    flex: 1,
    borderWidth: 1,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 30,
  },
});

CredentialsCarousel.propType = {
  credentials: PropType.arrayOf(credentialPropType),
};

export default CredentialsCarousel;
