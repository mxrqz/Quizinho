import { firebaseAdmin } from './firebase';

interface QuizinhoData {
  paid: boolean;
  plan: string;
  created: string;
}

export async function scheduleQuizinhoDeletion() {
  try {
    // Get all quizinhos
    const allQuizinhosIds = await firebaseAdmin.getAllQuizinhosIds();

    const currentDate = new Date();
    const deletionPromises: Promise<any>[] = [];

    for (const id of allQuizinhosIds) {
      try {
        const quizinhoData = await firebaseAdmin.quizinhoExists(id) as { docExists: boolean } & QuizinhoData;

        if (!quizinhoData?.docExists) continue;

        const createdDate = new Date(quizinhoData.created);
        const daysDifference = Math.floor((currentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

        let shouldDelete = false;

        // Check deletion criteria
        if (quizinhoData.plan === 'free' && daysDifference >= 7) {
          shouldDelete = true;
        } else if (quizinhoData.plan === 'premium' && quizinhoData.paid === false && daysDifference >= 1) {
          shouldDelete = true;
        } else if (quizinhoData.plan === 'premium' && quizinhoData.paid === true && daysDifference >= 30) {
          shouldDelete = true;
        }

        if (shouldDelete) {
          console.log(`Scheduling deletion for quizinho: ${id} (${quizinhoData.plan}, paid: ${quizinhoData.paid}, age: ${daysDifference} days)`);
          deletionPromises.push(firebaseAdmin.deleteQuizinho(id));
        }
      } catch (error) {
        console.error(`Error processing quizinho ${id}:`, error);
      }
    }

    // Execute all deletions
    if (deletionPromises.length > 0) {
      await Promise.all(deletionPromises);
      console.log(`Successfully deleted ${deletionPromises.length} expired quizinhos`);
    } else {
      console.log('No expired quizinhos found for deletion');
    }

  } catch (error) {
    console.error('Error in scheduled quizinho cleanup:', error);
    throw error;
  }
}