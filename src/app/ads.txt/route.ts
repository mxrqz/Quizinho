import { NextResponse } from 'next/server';

export async function GET() {
  const adsTxt = `google.com, pub-7551677366710429, DIRECT, f08c47fec0942fa0`;

  return new NextResponse(adsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
