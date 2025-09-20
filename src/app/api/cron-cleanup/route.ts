import { NextRequest, NextResponse } from 'next/server';
import { scheduleQuizinhoDeletion } from '@/lib/cron-cleanup';

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await scheduleQuizinhoDeletion();

    return NextResponse.json({
      success: true,
      message: 'Cleanup completed successfully'
    });

  } catch (error) {
    console.error('Error in cron cleanup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}