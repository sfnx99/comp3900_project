import { StyleSheet, Text, View } from 'react-native';
import CircleIcon from './CircleIcon';
import { credentialPropType, formatCamelCase } from '../scripts/util';

const Credential = ({ credential }) => (
  <View style={styles.notification}>
    <View style={styles.iconContainer}>
      <CircleIcon name="card-account-details" size={16} color="black" backgroundColor="#D6EE41" />
    </View>
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.name}>{formatCamelCase(credential.type)}</Text>
      </View>
      <Text style={styles.detail}>{` ${credential.credential.firstName} - ${credential.credential.lastName}`}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  notification: {
    flexDirection: 'row',
    backgroundColor: '#F5FFB9',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
});

Credential.propTypes = {
  credential: credentialPropType,
};

export default Credential;
