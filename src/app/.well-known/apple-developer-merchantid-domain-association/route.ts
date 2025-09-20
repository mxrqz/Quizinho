import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { readFileSync } from 'fs';

export async function GET(request: NextRequest) {
  try {
    // Note: You'll need to add the apple-developer-merchantid-domain-association file to your public folder
    const filePath = path.join(process.cwd(), 'public', 'apple-developer-merchantid-domain-association');
    const fileContent = readFileSync(filePath);

    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error serving Apple Pay domain association file:', error);
    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    );
  }
}