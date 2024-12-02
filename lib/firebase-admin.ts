import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { Letter, createLetter } from './models/Letter';
import { createUser, User } from './models/User';
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
const auth = getAuth();

export async function saveLetter(
  title: string,
  content: string,
  author?: string,
  createdBy: string = 'Guest'
): Promise<string> {
  const letter = createLetter(title, content, author, createdBy);
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

// Function to add or update a user in Firestore
export async function addUser(userId: string, userEmail: string): Promise<void> {
  const userRef = firestore.collection('users').doc(userId);
  const doc = await userRef.get();
  if (!doc.exists) {
    const newUser: User = createUser(userId, userEmail);  // Use the createUser function to structure the user data
    await userRef.set({
      ...newUser,
      dateCreated: admin.firestore.FieldValue.serverTimestamp()  // Replace JavaScript Date with Firestore serverTimestamp for consistency
    });
  }
}

export { firestore, auth };

