import PropTypes from 'prop-types';
import { useContext, useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../context/ThemeContext';
import { credentialPropType, formatCamelCase, renderIconByName } from '../scripts/util';
import TextButton from '../components/TextButton';
import { CredentialsContext } from '../context/CredentialsContext';
import CredentialModal from '../components/modals/CredentialModal';

const CredentialInformation = ({ route, navigation }) => {
  const { credential } = route.params;
  const { toggleFavourite } = useContext(CredentialsContext);
  const { theme } = useContext(ThemeContext);

  const [modalOpen, setModalOpen] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: formatCamelCase(credential.type[0]),
      headerRight: renderIconByName('dots-vertical', () => setModalOpen(true), {
        paddingTop: 25,
        size: 30,
        color: theme.text,
      }),
    });
  }, [navigation, credential.type]);

  const credentialDetails = credential.credential;

  const handlePress = () => {
    toggleFavourite(credential.id);
    credential.favourite = !credential.favourite;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
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
    button: {
      flex: 1,
    },
  });

  return (
    <>
    <CredentialModal
      modalVisible={modalOpen}
      handleModalClose={() => setModalOpen(false)}
      credentialId={credential.id}
    />
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {Object.entries(credentialDetails)
          .filter(([key]) => !['fullName', 'expiryDate'].includes(key))
          .map(([key, item]) => (
            <View key={key} style={styles.field}>
              <Text style={[styles.fieldName, styles.text]}>{`${formatCamelCase(key)}:`}</Text>
              <Text style={styles.text}>{item}</Text>
            </View>
          ))}
        <TextButton
          text={credential.favourite ? 'Remove from Favourites' : 'Add to Favourites'}
          onPress={handlePress}
          style={styles.button}
          inverted={credential.favourite}
        />
      </ScrollView>
    </SafeAreaView>
    </>
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
