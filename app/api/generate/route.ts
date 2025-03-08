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
    // Extract all fields with proper type handling
    const title = letterData.title;
    const content = letterData.content;
    const recipient_email = letterData.recipient_email || undefined;
    const author = letterData.author || undefined;
    const createdBy = letterData.createdBy;
    const image = letterData.image || undefined;
    const parentId = letterData.parentId || undefined;

    const id = await saveLetter(
      title,
      content,
      recipient_email,
      author,
      createdBy,
      image,
      parentId
    );
    return NextResponse.json({ id });
  } catch (error) {
    console.error('Error saving letter:', error);
    return NextResponse.json({ error: 'Failed to save letter' }, { status: 500 });
  }
}

