import admin, { ServiceAccount } from 'firebase-admin';
import { Question, QuizinhoData } from '@/types/server/quiz';
import path from 'path';
import fs from 'fs';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  let serviceAccount: ServiceAccount;

  // Try to use environment variable first (for production)
  if (process.env.FIREBASE_ADMIN_CREDENTIALS) {
    serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS) as ServiceAccount;
  } else {
    // Fall back to service account file (for development)
    const serviceAccountPath = path.join(process.cwd(), 'quizinho-8472a-firebase-adminsdk-qtpcy-34204edf37.json');
    const serviceAccountData = fs.readFileSync(serviceAccountPath, 'utf8');
    serviceAccount = JSON.parse(serviceAccountData) as ServiceAccount;
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

export const firebaseAdmin = {
  // Add a new quizinho to Firestore
  async addQuizinho(
    id: string,
    quizinho: Question[],
    imgBB: string,
    plan: string,
    paid: boolean,
    theme?: string
  ): Promise<void> {
    try {
      const questionRef = db.collection('quizinhos').doc(id);
      await questionRef.set({
        quizinho,
        img: imgBB,
        plan,
        paid,
        theme: theme || 'undefined',
        creationTime: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding quizinho:', error);
      throw error;
    }
  },

  // Get a quizinho by ID
  async getQuizinho(id: string): Promise<QuizinhoData | null> {
    try {
      const questionRef = db.collection('quizinhos').doc(id);
      const doc = await questionRef.get();

      if (!doc.exists) {
        return null;
      } else {
        return doc.data() as QuizinhoData;
      }
    } catch (error) {
      console.error('Error getting quizinho:', error);
      throw error;
    }
  },

  // Check if a quizinho exists and return status info
  async quizinhoExists(id: string): Promise<{ docExists: boolean; paid?: boolean; plan?: string } | null> {
    try {
      const questionRef = db.collection('quizinhos').doc(id);
      const doc = await questionRef.get();

      const data = doc.data();
      const paid = data?.paid;
      const plan = data?.plan;
      const docExists = doc.exists;

      return { docExists, paid, plan };
    } catch (error) {
      console.error('Error checking quizinho exists:', error);
      throw error;
    }
  },

  // Get all quizinho IDs (for invalid URLs)
  async getAllQuizinhosIds(): Promise<string[]> {
    try {
      const invalid_ids: string[] = [];
      const invalid = await db.collection('quizinhos').get();

      invalid.forEach(doc => {
        invalid_ids.push(doc.id.toLowerCase());
      });

      return invalid_ids;
    } catch (error) {
      console.error('Error getting all quizinho IDs:', error);
      throw error;
    }
  },

  // Get all quizinhos (for cron job)
  async getAllQuizinhos() {
    try {
      const quizinhos = await db.collection('quizinhos').get();
      return quizinhos;
    } catch (error) {
      console.error('Error getting all quizinhos:', error);
      throw error;
    }
  },

  // Update a quizinho field
  async updateQuizinho(id: string, item: string, value: string | boolean): Promise<void> {
    try {
      const updateQuizinhoRef = db.collection('quizinhos').doc(id);

      if (updateQuizinhoRef) {
        await updateQuizinhoRef.update({
          [item]: value
        });
      }
    } catch (error) {
      console.error('Error updating quizinho:', error);
      throw error;
    }
  },

  // Delete a quizinho
  async deleteQuizinho(id: string): Promise<void> {
    try {
      const deleteQuizinhoRef = db.collection('quizinhos').doc(id);

      if (deleteQuizinhoRef) {
        await deleteQuizinhoRef.delete();
      }
    } catch (error) {
      console.error('Error deleting quizinho:', error);
      throw error;
    }
  }
};