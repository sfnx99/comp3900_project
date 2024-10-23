import PropTypes from 'prop-types';
import { useLayoutEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { credentialPropType, formatCamelCase } from '../scripts/util';

const CredentialInformation = ({ route, navigation }) => {
  const { credential } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: formatCamelCase(credential.type),
    });
  }, [navigation, credential.type]);

  const credentialDetails = credential.credential;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
    },
    text: {
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
      <ScrollView>
        {Object.entries(credentialDetails)
          .map(([key, item]) => (
            <View key={key} style={styles.field}>
              <Text style={[styles.fieldName, styles.text]}>{`${formatCamelCase(key)}:`}</Text>
              <Text style={styles.text}>{item}</Text>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

CredentialInformation.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape(credentialPropType.isRequired),
  }).isRequired,
  navigation: PropTypes.shape({
    setOptions: PropTypes.func.isRequired,
  }),
};

export default CredentialInformation;
