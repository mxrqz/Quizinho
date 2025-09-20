import { NextRequest, NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebase';
import { stripeService } from '@/lib/stripe';
import { StripeWebhookEvent } from '@/types/server/quiz';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const event = stripeService.verifyWebhookSignature(body, signature);
    if (!event) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const { type, data } = event as StripeWebhookEvent;

    switch (type) {
      case 'checkout.session.completed':
        // Payment was successful
        const clientReferenceId = data.object.client_reference_id;
        if (clientReferenceId) {
          await firebaseAdmin.updateQuizinho(clientReferenceId, 'paid', true);
        }
        break;

      case 'checkout.session.expired':
        // Payment session expired
        const expiredClientId = data.object.client_reference_id;
        if (expiredClientId) {
          const quizinho = await firebaseAdmin.quizinhoExists(expiredClientId);
          const paid = quizinho?.paid;
          const plan = quizinho?.plan;

          if (paid === false && plan === 'premium') {
            console.log('Deleting expired unpaid premium quiz:', expiredClientId);
            await firebaseAdmin.deleteQuizinho(expiredClientId);
          }
        }
        break;

      default:
        console.log('Unhandled event type:', type);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}