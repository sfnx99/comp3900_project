import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { deleteItem, getValueFor, save } from '../scripts/util';

const AccountContext = createContext();

const AccountProvider = ({ children }) => {
  const [bindedEmail, setBindedEmail] = useState('');
  const [authMethod, setAuthMethod] = useState('passcode');
  const [pin, setPin] = useState('pin');

  /**
   * Binds the email to the device.
   * @param {string} newEmail - the email of the account being bound
   */
  const bindEmail = (newEmail) => {
    setBindedEmail(newEmail);
    save('email', newEmail);
  };

  /**
   * Updates and binds the pin to the device.
   * @param {string} newPin - the new pin used for authentication.
   */
  const updatePin = (newPin) => {
    setPin(newPin);
    save('pin', newPin);
  };

  /**
   * Updates and binds the authentication method to the device.
   * @param {string} newAuthMethod - the new authentication method, either biometrics or passcode.
   */
  const updateAuthMethod = (newAuthMethod) => {
    setAuthMethod(newAuthMethod);
    save('authMethod', newAuthMethod);
  };

  /**
   * Wipes the account data from the device.
   */
  const wipeAccountData = async () => {
    setBindedEmail('');
    setAuthMethod('');
    await deleteItem('email');
    await deleteItem('authMethod');
  };

  useEffect(() => {
    const loadEmail = async () => {
      const localEmail = await getValueFor('email');
      if (localEmail) {
        setBindedEmail(localEmail);
      } else {
        setBindedEmail('');
      }
    };

    const loadAuthMethod = async () => {
      const localAuthMethod = await getValueFor('authMethod');
      if (localAuthMethod) {
        setAuthMethod(localAuthMethod);
      } else {
        setAuthMethod('passcode');
      }
    };

    const loadPin = async () => {
      const localPin = await getValueFor('pin');
      if (localPin) {
        setPin(localPin);
      } else {
        setPin('');
      }
    };

    loadEmail();
    loadAuthMethod();
    loadPin();
  }, []);

  const contextValues = useMemo(() => ({
    bindedEmail, bindEmail, wipeAccountData, authMethod, updateAuthMethod, pin, updatePin,
  }), [bindedEmail, authMethod, pin]);

  return (
    <AccountContext.Provider value={contextValues}>
      {children}
    </AccountContext.Provider>
  );
};

AccountProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AccountContext, AccountProvider };
