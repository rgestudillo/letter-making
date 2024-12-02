import { NextResponse } from 'next/server';
import { saveLetter } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  const { content, author } = await request.json();

  if (!content || !author) {
    return NextResponse.json({ error: 'Content and Author are required' }, { status: 400 });
  }

  try {
    const id = await saveLetter(content, author);
    return NextResponse.json({ id });
  } catch (error) {
    console.error('Error saving letter:', error);
    return NextResponse.json({ error: 'Failed to save letter' }, { status: 500 });
  }
}
