import { NextResponse } from 'next/server';
import { saveLetter } from '@/lib/firebase-admin';
import { Letter } from '@/lib/models/Letter';

export async function POST(request: Request) {
  const letterData: Partial<Letter> = await request.json();

  // Check for required fields
  if (!letterData.title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }
  if (!letterData.content) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }
  if (!letterData.createdBy) {
    return NextResponse.json({ error: 'Creator information is required' }, { status: 400 });
  }

  try {
    const id = await saveLetter(
      letterData.title,
      letterData.content,
      letterData.recipient_email,
      letterData.author,
      letterData.createdBy,
      letterData.image
    );
    return NextResponse.json({ id });
  } catch (error) {
    console.error('Error saving letter:', error);
    return NextResponse.json({ error: 'Failed to save letter' }, { status: 500 });
  }
}

