import PropTypes from 'prop-types';
import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../context/ThemeContext';
import { credentialPropType } from '../scripts/util';

const CredentialInformation = ({ route }) => {
  const { credential } = route.params;
  const { theme } = useContext(ThemeContext);

  const credentialDetails = credential.cred;

  // deserialise expiry date - temporary measure
  const expiryDate = credential.cred.expiryDate ? new Date(credentialDetails.expiryDate) : null;
  // Function to format field names
  const formatFieldName = (name) => name.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
    },
    text: {
      color: theme.text,
      fontSize: 16,
      marginBottom: 10,
    },
    field: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    fieldName: {
      fontWeight: 'bold',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.field}>
        <Text style={[styles.fieldName, styles.text]}>Expiry Date:</Text>
        <Text style={styles.text}>{expiryDate ? expiryDate.toLocaleDateString() : 'N/A'}</Text>
      </View>
      {/*Object.entries(credentialDetails)
        .filter(([key]) => !['fullName', 'expiryDate'].includes(key))
        .map(([key, item]) => (
          <View key={key} style={styles.field}>
            <Text style={[styles.fieldName, styles.text]}>{`${formatFieldName(key)}:`}</Text>
            <Text style={styles.text}>{item}</Text>
          </View>
        ))*/}
    </SafeAreaView>
  );
};

CredentialInformation.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape(credentialPropType.isRequired),
  }).isRequired,
};

export default CredentialInformation;
