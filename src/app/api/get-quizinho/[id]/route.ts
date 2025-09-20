import { NextRequest, NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const quizinho = await firebaseAdmin.getQuizinho(id);

    if (!quizinho) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(quizinho);

  } catch (error) {
    console.error('Error getting quizinho:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}