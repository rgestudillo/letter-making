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
  recipient_email?: string,
  author?: string,
  createdBy: string = 'Guest',
  image?: string,
  parentId?: string
): Promise<string> {
  // Create letter object with required fields
  const letterData: Record<string, string | number> = {
    id: Date.now().toString(),
    title,
    content,
    timestamp: Date.now(),
    createdBy,
  };

  // Add optional fields only if they have values
  if (recipient_email) letterData.recipient_email = recipient_email;
  if (author) letterData.author = author;
  if (image) letterData.image = image;
  if (parentId) letterData.parentId = parentId;

  // Ensure id is defined
  const id = letterData.id as string;

  // Save to Firestore
  await firestore.collection('letters').doc(id).set(letterData);
  return id;
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
    const newUser: User = createUser(userId, userEmail);
    await userRef.set({
      ...newUser,
      dateCreated: admin.firestore.FieldValue.serverTimestamp()
    });
  }
}

export async function getLettersByUser(userId: string): Promise<Letter[]> {
  const snapshot = await firestore.collection('letters')
    .where('createdBy', '==', userId)
    .orderBy('timestamp', 'desc')
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Letter));
}

export async function getLettersByEmail(userEmail: string): Promise<Letter[]> {
  const snapshot = await firestore.collection('letters')
    .where('recipient_email', '==', userEmail)
    .orderBy('timestamp', 'desc')
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Letter));
}

// Function to get replies to a letter
export async function getLetterReplies(letterId: string): Promise<Letter[]> {
  if (!letterId) {
    return [];
  }

  const snapshot = await firestore.collection('letters')
    .where('parentId', '==', letterId)
    .orderBy('timestamp', 'asc')
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Letter));
}

export { firestore, auth };

