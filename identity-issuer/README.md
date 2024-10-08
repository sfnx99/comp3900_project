BACKEND
This is going to be a summary of how the backend system is currently implemented for DemoA. Written mostly for the purpose of frontend devs connecting the systems and for identity owner to look at how credentials are currently handled.

src/app.ts src/routes.ts
These files are the routes and server itself. Currently there is only one route to create a credential. Modelled as if this server is UNSW and issuing Ids (currently not security in who gets an ID).

Route /create/credential/:
This route is a POST reques that takes a 'information' JSON object in and uses it to create an ID.

src/utils keyManagement.ts
This handles creation of public and private keys for now. Service provider will at a later stage be able to access the publicKey through DID web.

src/utils credentialCreation.ts
This handles the creation of credentials. Implemented as a dummy so far with two fields:
1. Information - literally a JSON object with some key value pairs
2. Signature - This is a random number at the moment. Sprint 2 will deal with protocol.
Identity Holder should expect this object ^ when it is given to them as a credential.