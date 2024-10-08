import crypto from 'crypto'
import fs, { PathOrFileDescriptor, PathLike } from 'fs'
import config from '../../config/default'

// KEY GENERATION FOR ISSUER - will generate keys if none exist. If keys exist will not overwrite
export function generateIssuerKeys() {
    // Check if key files already exist - prevent overwriting
    if (!fs.existsSync(config['PATH_TO_PRIVATE_KEY']) || !fs.existsSync(config['PATH_TO_PUBLIC_KEY'])) {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
        });
        // Save the keys to files
        fs.writeFileSync(config['PATH_TO_PRIVATE_KEY'], privateKey.export({ type: 'pkcs1', format: 'pem' }));
        fs.writeFileSync(config['PATH_TO_PUBLIC_KEY'], publicKey.export({ type: 'spki', format: 'pem' }));
        console.log('Keys generated and saved to files.');
    } else {
        console.log('Keys already exist. Skipping generation.');
    }
}

export function getPrivateKey(): number[] {
    const keyPem = fs.readFileSync(config['PATH_TO_PRIVATE_KEY'], 'utf-8');
    const keyObject = crypto.createPrivateKey(keyPem); // Use createPrivateKey for private key
    // Convert key to Buffer and then to numbers
    const keyBuffer = keyObject.export({ type: 'pkcs8', format: 'der' });
    return Array.from(keyBuffer);
}

export function getPublicKey(): number[] {
    const keyPem = fs.readFileSync(config['PATH_TO_PUBLIC_KEY'], 'utf-8');
    const keyObject = crypto.createPublicKey(keyPem); // Use createPrivateKey for private key
    // Convert key to Buffer and then to numbers
    const keyBuffer = keyObject.export({ type: 'spki', format: 'der' });
    return Array.from(keyBuffer);
}

