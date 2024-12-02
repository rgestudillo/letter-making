import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { Letter, createLetter } from './models/Letter';

const firebaseConfig = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
  });
}

const firestore = getFirestore();

export async function saveLetter(content: string, author?: string): Promise<string> {
  const letter = createLetter(content, author);
  await firestore.collection('letters').doc(letter.id).set(letter);
  return letter.id;
}

export async function getLetter(id: string): Promise<Letter | null> {
  const doc = await firestore.collection('letters').doc(id).get();
  if (doc.exists) {
    return doc.data() as Letter;
  } else {
    return null;
  }
}

export { firestore };

