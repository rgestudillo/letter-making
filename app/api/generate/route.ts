import { NextResponse } from 'next/server';
import { saveLetter } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  const { title, content, author, createdBy } = await request.json();

  // Check for required fields: title, content, and createdBy
  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }
  if (!content) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }
  if (!createdBy) {
    return NextResponse.json({ error: 'Creator information is required' }, { status: 400 });
  }

  try {
    // Pass all fields to the saveLetter function
    const id = await saveLetter(title, content, author, createdBy);
    return NextResponse.json({ id });
  } catch (error) {
    console.error('Error saving letter:', error);
    return NextResponse.json({ error: 'Failed to save letter' }, { status: 500 });
  }
}
