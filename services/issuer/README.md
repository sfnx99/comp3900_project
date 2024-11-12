# Self-Sovereign Identity (Issuer)

The Issuer is responsible for providing credentials to Identity Holders (IH).

To setup an Issuer, see [Setup]

## Setup

<ins>run backend</ins>
- npm install
- docker-compose up -d --force-recreate --build // docker-compose up

<ins>run frontend</ins>
- npm install
- npm start
- if you get frontend error (react script error), run this in frontend folder 'npm install -g react-scripts'


<ins>flow</ins>
- login for issuer -> un - unsw@gmail.com , pw - 1234
- mock registered user -> bob@test.com (in db.ts)

- once user has been registered in wallet app, also register with same email via register on the issuer platform
- then login with issuer un and pw 

- UNSWCredential can be created via add credential
- created credential can be accessed via {issuer_url}/credential/unswcredential
- once qr code is scanned, holder will need to provide client id (email) and scope (UNSWCredential).
- Once request has been sent, issuer will generate an auth code, which is sent to the wallet app for issuance.
- NOTE: (current implementation sends mock username bob@test.com to generate auth code)
