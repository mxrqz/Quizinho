import { NextRequest, NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebase';
import { stripeService } from '@/lib/stripe';
import { qrCodeService } from '@/lib/qr-code';
import { generateId } from '@/lib/nanoid';
import { CreateQuizinhoRequest, CreateQuizinhoResponse } from '@/types/server/quiz';

export async function POST(request: NextRequest) {
  try {
    const body: CreateQuizinhoRequest = await request.json();
    const { questions, customURL, plan, id: oldId, theme } = body;

    // Generate new ID
    const nanoID = generateId();

    // Determine final ID (custom URL or generated)
    let id: string;
    if (customURL) {
      const existingQuiz = await firebaseAdmin.quizinhoExists(customURL);
      id = existingQuiz?.docExists ? `${customURL}_${nanoID}` : customURL;
    } else {
      id = generateId();
    }

    const quizinhoURL = `${process.env.NEXT_PUBLIC_URL}/${id}`;

    // Check if oldId exists (for updates)
    const oldIdData = oldId ? await firebaseAdmin.quizinhoExists(oldId) : undefined;
    const isOldIdOnDB = oldIdData?.docExists === true;

    // Generate QR code
    const qrCodeURL = await qrCodeService.createAndUploadQrCode(quizinhoURL, id, plan);
    if (!qrCodeURL) {
      return NextResponse.json(
        { error: 'Failed to generate QR code' },
        { status: 500 }
      );
    }

    if (plan === 'free') {
      if (isOldIdOnDB && oldId) {
        const { paid, plan: existingPlan } = oldIdData;
        if (paid === false && existingPlan === 'premium') {
          await firebaseAdmin.updateQuizinho(oldId, 'plan', 'free');
          const response: CreateQuizinhoResponse = {
            quizinho: `${process.env.NEXT_PUBLIC_URL}/${oldId}`
          };
          return NextResponse.json(response);
        } else {
          return NextResponse.json(
            { error: 'Invalid operation' },
            { status: 400 }
          );
        }
      } else {
        await firebaseAdmin.addQuizinho(id, questions, qrCodeURL, plan, false);
        const response: CreateQuizinhoResponse = {
          quizinho: quizinhoURL
        };
        return NextResponse.json(response);
      }
    } else if (plan === 'premium') {
      // Create Stripe checkout session
      const payment = await stripeService.createCheckoutSession(id);
      if (!payment) {
        return NextResponse.json(
          { error: 'Failed to create payment session' },
          { status: 500 }
        );
      }

      // Save quizinho as unpaid premium
      await firebaseAdmin.addQuizinho(id, questions, qrCodeURL, plan, false, theme);

      const response: CreateQuizinhoResponse = {
        payment: payment.url || undefined
      };
      return NextResponse.json(response);
    }

    return NextResponse.json(
      { error: 'Invalid plan' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error creating quizinho:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}