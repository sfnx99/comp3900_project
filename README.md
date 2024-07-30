# Self-Soverign Identity
This repo contains three seperate agents, capable of implementing protocol **Protocol Name**.
The agents are:
- Identity Holders
- Issuers
- Service Providers


## Usage
To begin, clone this repository using

```bash
git clone https://github.com/unsw-cse-comp99-3900-24t1/capstone-project-3900t11abookworms.git
```

### Issuer API

Navigate to `capstone-project-3900t11abookworms/services/issuer`.

Configure the `src/did.json` file to contain the desired information for the issuer:
- `uri` should not be edited manually
- `credential_endpoint` should be set to `http://host.docker.internal:8082` for local testing, or to `http://myserver.com:8082` for usage on a public server.
- `credential_configurations_supported` should match the format `"type": {"format": "ldp_vc"}` where `type` is the type of credential that the issuer will initially issue.
- `name` should be set to the desired public name for the issuer API

Replace the dummy secrets in `.env` with real public keys and private keys if desired (dummy values may be used for testing purposes)

Run the issuer with the following command:

```bash
docker-compose up
```

### Service Provider API

Navigate to `capstone-project-3900t11abookworms/services/service_provider`.

Configure the `presentationDefinition.json` file to contain the desired information for the service provider:
- `id` should be set to the type of credential that the service provider accepts
- `fields` should contain a list of objects similar to `{"path": ["$.attributeName"]},`, where each object's `attributeName` represents an additional attribute required to be present on submitted credentials.

Run the service provider with the following command:

```bash
docker-compose up
```

### Identity Holder API

Navigate to `capstone-project-3900t11abookworms/services/identity_holder`.

Run the identity holder with the following command:

```bash
docker-compose up
```


### Frontend Usage

Note that the frontend apps require a local installation of the emulator `expo`, as well as a mobile device with `expo` installed in order to view the frontend.

### Issuer Frontend

Navigate to `capstone-project-3900t11abookworms/app/issuer`.

Run the issuer frontend with the following command:
```bash
npm i; npm start
```

### Service Provider Frontend

Navigate to `capstone-project-3900t11abookworms/app/ServiceProvider`.

Run the issuer frontend with the following command:
```bash
npm i; npm start
```

### Identity Holder Frontend

Navigate to `capstone-project-3900t11abookworms/app/identity_holder`.

Run the issuer frontend with the following command:
```bash
npm i; npm start
```

### Notes

`docker-compose up` will not reflect local changes after the first time an API is run. If you wish to update the config files for a certain API, it is required to run instead:

```bash
docker-compose up --build --force-recreate
```

## Credits

This project was developed by the following students:
 - Alexander Blackmore (z5420273)
 - Chanikan Palanusitthepa (z5361235)
 - Daniel Field (z5416299)
 - Jayden Hunter (z5416114)
 - Mitchell Gayfer (z5420468)
 - Fadi Hatu (z5309136)
