# T11A Bookworms Installation Manual
## Installation
### Prerequisites
`Docker` must be installed.
`npm` must be installed.
A mobile device is required in order to run the frontend applications.
A stable network is required for communication between agents.
### Set up the emulator
Download the `expo go` app on your mobile device.

Your mobile device must be on the same network as your PC/Laptop.
### Set up local files
#### Find private IP address
Configuration of the frontend agents requires you to enter your private IP address. 
The address will likely start with `192.168...`. 
You can find guides [here](https://whatismyipaddress.com/private-ip) on how to find this address if needed.

The rest of this manual assumes you know your private IP address.
#### Unzip the provided files
Unzip the provided archive with the following command:
```bash
unzip vc.zip
```
#### Ensure backend is operational
Run the integration tests to ensure that the API agents are working.

Navigate to `services/`.

Run the following commands (allow 45 seconds for the integration tests):
```bash
npm install
npm run test
```
#### Configure issuer frontend
Configure the issuer frontend with your private IP address.

Open the file `app/issuer/.env` and edit it to contain the following (replace `{YOUR_PRIVATE_IP}` with the IP address found earlier):
```
ISSUER_HOST={YOUR_PRIVATE_IP}
ISSUER_PORT=8082
```
#### Configure service provider frontend
Configure the service provider frontend with your private IP address.

Open the file `app/ServiceProvider/.env` and edit it to contain the following (replace `{YOUR_PRIVATE_IP}` with the IP address found earlier):
```
SERVICE_PROVIDER_HOST={YOUR_PRIVATE_IP}
SERVICE_PROVIDER_PORT=8083
```
#### Configure identity holder frontend
Configure the identity holder frontend with your private IP address.

Open the file `app/identity_holder/.env` and edit it to contain the following (replace `{YOUR_PRIVATE_IP}` with the IP address found earlier):
```
WALLET_HOST={YOUR_PRIVATE_IP}
WALLET_PORT=8081
ISSUER_HOST={YOUR_PRIVATE_IP}
```
#### Sanity check: ensure private IP is visible to mobile
Navigate to `services/issuer/`.
Run the following command:
```bash
docker-compose up --build --force-recreate
```
On your mobile device (which must be connected to the same network as your PC/laptop), attempt to visit `{YOUR_PRIVATE_IP}:8082` (replace `{YOUR_PRIVATE_IP}` with the IP address found earlier).

You should see a page containing JSON similar to:
```json
{"did_uri":"did:ion:EiaTy..."}
```

If the page does not load, try a different network, or a different private IP. If you cannot get this to work, it will not be possible to run the frontend agents.

To terminate the issuer agent, press `ctrl + c`.
## Start agents
Start each agent below in its own terminal.
### Run the issuer API
Navigate to `services/issuer/`.
Run the following command:
```bash
docker-compose up --build --force-recreate
```
### Run the identity holder API
Navigate to `services/identity_holder/`.
Run the following command:
```bash
docker-compose up --build --force-recreate
```
### Run the service provider API
Navigate to `services/service_provider/`.
Run the following command:
```bash
docker-compose up --build --force-recreate
```
### Run the issuer frontend
Navigate to `app/issuer/`.
Run the follwing commands:
```bash
npm install
npm start
```
### Run the identity holder frontend
Navigate to `app/identity_holder/`.
Run the follwing commands:
```bash
npm install
npm start
```
When prompted `Use port 8000 instead?`, enter `y`.
### Run the service provider frontend
Navigate to `app/ServiceProvider/`.
Run the follwing commands:
```bash
npm install --force
npm start
```
When prompted `Use port 8001 instead?`, enter `y`.
## Successful flow
### Register user using issuer app
Scan the QR code found in the issuer frontend's terminal with your mobile device to open the app in `expo`.
Press `Login`.
Press `Register User to Receive Credential`.
Fill in the fields. For example:
```
Email: test@test.com
Password: hunter2!

First Name: harry
Last Name: ross
dob: 01/02/1997
```
Press `Register User`.
Press `Supply Information`.
### Request credential using identity holder app
Scan the QR code found in the identity holder frontend's terminal with your mobile device to open the app in `expo`.
Press `Register`.
Fill in the fields. For example:
```
Display Name: test
Email: test@test.com
Password: hunter2!
Confirm Password: hunter2!
```
Press `Submit`.
You will be prompted to set up a PIN.
Fill in the fields. For example:
```
Enter 4-digit PIN: 1234
Confirm PIN: 1234
```
Press `Set PIN`.
Press the second icon from the left on the bottom navbar.
You should see a `Request Credentials` page.
Press `Consent to Being Issued a Credential`.
Fill in the fields. These details MUST match the login details used to register with the issuer in the previous step. For example:
```
Email: test@test.com
Password: hunter2!
```
Press `Submit`.
Press the yellow field `Select an issuer...`.
Drag the list up slightly and let it rest back on the only option to select the issuer.
Press the yellow field `Select a credential...`.
Drag the list up slightly and let it rest back on the only option to select the credential type.
Press `Submit Request`.
You will be redirected to a web page.
Fill in the fields. These details MUST match the login details used to register with the issuer in the previous step. For example:
```
Email: test@test.com
Password: hunter2!
```
Press `Submit`, and consent to open the link in an external app if required.
You will see a screen stating the credential request was successful.
Press `Go Home`.
### View issued credential using identity holder app
Press the centre button on the bottom navbar to view the credential.
Press `Refresh Wallet`.
Press on the card symbol to view the credential details.
### View issued credential using issuer app
Scan the QR code found in the issuer frontend's terminal with your mobile device to open the app in `expo`.
Press `Login`.
A record of issuing the credential will appear under `Recent Issued Credentials`.
### Trust issuer using service provider app
Scan the QR code found in the service provider frontend's terminal with your mobile device to open the app in `expo`.
Press `Register`.
Fill in the fields. For example:
```
Display Name: test
Location: test
Email: test2@test.com // NOTE: this cannot be the same as the identity holder's email
Password: hunter2!
Confirm Password: hunter2!
```
Press `Submit`.
Press `Trust A New Credential Issuer`.
Select to trust `NSW Government`.
Choose to enable `First Name` and/or `Last Name`.
`Date of Birth` cannot be enabled, since the credential issued does not contain a `dob` field by default.
Choose `Driver's Licence` as the credential type, as this must match the issued credential.
Press `Supply Information`.
### Make presentation using identity holder app
Scan the QR code found in the identity holder frontend's terminal with your mobile device to open the app in `expo`.
Enter the password from your earlier registration:
```
Password: hunter2!
```
Select the small circular QR button in the bottom right of the screen.
You will be taken to a `Verify` screen.
Enter the verifier URL as `http://host.docker.internal:8083`.
Press `Submit`.
Select the credential to present by pressing on it.
Press `Submit` to agree to present the required fields.
Authenticate using your phone passcode/biometrics.
A message `Verification Success` should appear.
### View presentation using service provider app
Scan the QR code found in the service provider frontend's terminal with your mobile device to open the app in `expo`.
Fill in the fields. For example:
```
Email: test2@test.com
Password: hunter2!
```
Press `Login`.
A record of the presentation will appear under `Recently Presented Crendetials`.