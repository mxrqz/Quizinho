import { NextRequest, NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const invalidIds = await firebaseAdmin.getAllQuizinhosIds();
    return NextResponse.json(invalidIds);
  } catch (error) {
    console.error('Error getting invalid URLs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}