import { NextResponse } from 'next/server';
import { saveLetter } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  const { content, author, createdBy } = await request.json();

  // Check for required fields: content and createdBy
  if (!content) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }
  if (!createdBy) {
    return NextResponse.json({ error: 'Creator information is required' }, { status: 400 });
  }

  try {
    // Pass the createdBy information to the saveLetter function
    const id = await saveLetter(content, author, createdBy);
    return NextResponse.json({ id });
  } catch (error) {
    console.error('Error saving letter:', error);
    return NextResponse.json({ error: 'Failed to save letter' }, { status: 500 });
  }
}
