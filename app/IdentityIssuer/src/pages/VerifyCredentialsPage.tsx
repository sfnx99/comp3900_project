import React, { useState, useEffect, CSSProperties } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

interface CredentialField {
  name: string;
  value: string;
}

interface Credential {
  id: string;
  fields: CredentialField[];
  validityPeriod: string;
}

function VerifyCredentialsPage() {
  const { id } = useParams<{ id: string }>();
  // const [credential, setCredential] = useState<Credential | null>(null);

  // useEffect(() => {
  //   const fetchCredential = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:8000/issuer/requests/validateCredential/${id}`, {
  //         headers: {
  //           'Cache-Control': 'no-cache',
  //         },
  //       });
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       const data: Credential = await response.json();
  //       setCredential(data);
  //     } catch (error) {
  //       console.error('Error fetching credential:', error);
  //     }
  //   };

  //   fetchCredential();
  // }, [id]);

  // if (!credential) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      <h1>Verify Credential Page</h1>
      <p>Page for issuers to recieve requests and validate credentials requested by identity owners
      </p>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    margin: '20px auto',
  },
  header: {
    fontSize: '2.5em',
    color: '#001f3f',
    textAlign: 'center',
    marginBottom: '20px',
  },
  fieldContainer: {
    marginBottom: '15px',
  },
  qrCodeContainer: {
    marginTop: '20px',
    textAlign: 'center',
  },
};

export default VerifyCredentialsPage;