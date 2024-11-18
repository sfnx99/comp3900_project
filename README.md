This project focuses on the front-end demonstration of Self Sovereign Identities (SSI). Therefore, the novelty of this project stems from the navigation of the front-end UI to obtain a valid UNSW identity that can be used to authenticate the user's identity in three separate use cases. This includes  
- UNSW exams: Where UNSW examiner can present a QR code for students to scan and verify that they are eligible to sit the exam 
- UNSW housing: Where UNSW students can use their SSI to verify that they are a UNSW student and apply for university housing 
- UNSW employer: Where UNSW students can apply on the UNSW employability website to become a casual academic 
 
Backend was provided by the capstone-project-3900t11abookworms, which implemented all necessary protocols associated with SSIs.  
 
To run the project, first run 
 
1) `python change.py` 
 
and enter your IPaddress that will be used. And then run 
 
2) `docker-compose up -d --force-recreate --build` 
 
1.1. Running front-end interfaces 
Then each interface can be reached via the following links: 
 
issuer webapp: 
http://localhost:3000 
 
use-case 1: unsw-housing  
http://localhost:3002 
 
use-case 2: unsw-exams 
http://localhost:3003 
 
use-case 3: unsw-employer website 
http://localhost:3001 
 
1.1.1. Running wallet app 
The wallet is hosted on expo go. This could not be dockerised and will need to be initialised with the following instructions. To run the wallet app, go to the walletapp directory with  
 
`cd app/IdentityOwner/walletapp` 
 
and then run 
 
`npm install` 
 
then 
 
`npm expo start` 
 
1.1.2. Bugs 
 
If the expo app says incompatible version, run the command  
 
`npx expo install expo@^52.0.7 --fix` 
 
1.2 Setting up 
 
1.2.1. Setting up a UNSW credential 
 
1) Go to the issuer webpage @ http://localhost:3000 
 
2) Log in with the admin login/password combination 
e.g. 
login: unsw@gmail.com 
password: 1234 
 
4) Go to add credentials 
Currently, only bob@test.com works as the email for an issued credential due to the constraints of the backend being built around a hard coded user. Refactoring the code is not within the scope of this report. 
 
You can then fill out the fields in any other way you want. 
Once the code is submitted, there will be a prompt that displays a QR code. 
 
## Setting up Identity Owner wallet app 
 
1) Download the expo-go app from the app store/google play store 
2) Once you run `npm start`in the `app/IdentityOwner/walletapp` directory, scan the qr-code 
with your phone camera (ios) or expo-go scanner feature (android) 
3) This will display the sign-in/sign-up page on your phone  
4) Sign up as a user with the same email you used to register for the UNSW credential page 
5) Once signed up, press the scan feature and scan the qr code that the issuer generated 
 
This will a credential to the user's wallet. This credential will be used in the subsequent scenarios to verify the user's identity. 
 
## Workflow 1: UNSW-housing 
 
1) Go to the UNSW housing @ http://localhost:3002.
2) This will display a list of housing options. Select one that you wish to live in. 
3) Select apply and scan the qr code with you wallet scan feature.
4) This will present you with the information that the University-Housing requires for proof of studentship. Clicking accept will send these fields to University-Housing, verifying your identity. 
5) Going to the service provider backend in Docker will highlight that an application has been received in big block letters. 
 
## Workflow 2: UNSW-exam 
 
1) Go to the UNSW Exams @ http://localhost:3003 
2) This will take you to a user interface with a QR code.
3) Scanning the QR code from your wallet app will allow you to send your SSI credential to the UNSW examiners with the same interface as previous applications. Clicking accept will send these fields to University-Housing, verifying your identity. 
 
## Workflow 3: UNSW-employers 
 
1) Go to the UNSW housing @ http://localhost:3031 
2) This will display a list of casual academic options to apply for. Choose UNSW-engineering 
All other pages are the same, but without the QR code implemented. They are dummy aesthetic pages to illustrate the overall UI. 
3) Click apply at the bottom of the page.
4) Scanning the QR code from your wallet app will allow you to send your SSI credential to UNSW-employability. Clicking accept will send these fields to UNSW employability, sending your application to the UNSW temporary database. 
 