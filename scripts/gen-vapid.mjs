// Generates the two keys needed for phone push notifications. Run:  npm run vapid
import { generateKeyPairSync } from 'crypto';
const { publicKey, privateKey } = generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
const pub = publicKey.export({ format: 'jwk' });
const priv = privateKey.export({ format: 'jwk' });
const point = Buffer.concat([Buffer.from([4]), Buffer.from(pub.x, 'base64url'), Buffer.from(pub.y, 'base64url')]);
console.log('\nCopy these two into Vercel > Settings > Environment Variables:\n');
console.log('VAPID_PUBLIC_KEY=' + point.toString('base64url'));
console.log('VAPID_PRIVATE_KEY=' + priv.d + '\n');
