import { createContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { getValueFor, save } from '../scripts/util';

const AccountContext = createContext();

const AccountProvider = ({ children }) => {
  const [bindedEmail, setBindedEmail] = useState('');

  /**
   * Binds the email to the device.
   * @param {string} newEmail - the email of the account being bound
   */
  const bindEmail = (newEmail) => {
    setBindedEmail(newEmail);
    save('email', newEmail);
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

    loadEmail();
  }, []);

  const contextValues = useMemo(() => ({
    bindedEmail, bindEmail,
  }), [bindedEmail]);

  return (
    <AccountContext.Provider value={contextValues}>
      {children}
    </AccountContext.Provider>
  );
};

AccountProvider.propType = {
  children: PropTypes.node.isRequired,
};

export { AccountContext, AccountProvider };
