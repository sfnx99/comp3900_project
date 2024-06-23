import PropType from 'prop-types';
import { StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';

import { credentialPropType } from '../scripts/util';
import CredentialCard from './CredentialCard';

const CredentialsCarousel = ({ credentials }) => (
  <PagerView style={styles.pagerView} initialPage={0}>
    {credentials.map((credential) => (
      <CredentialCard credential={credential} />
    ))}
  </PagerView>
);

const styles = StyleSheet.create({
  pagerView: {
    height: 230,
  },
});

CredentialsCarousel.propTypes = {
  credentials: PropType.arrayOf(credentialPropType),
};

export default CredentialsCarousel;
