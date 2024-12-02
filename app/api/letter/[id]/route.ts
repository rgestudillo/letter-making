import { NextResponse } from 'next/server';
import { getLetter } from '@/lib/firebase-admin';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const letter = await getLetter(id);
    if (letter) {
      return NextResponse.json({
        content: letter.content,
        author: letter.author,
        timestamp: letter.timestamp,
      });
    } else {
      return NextResponse.json({ error: 'Letter not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error retrieving letter:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve letter' },
      { status: 500 }
    );
  }
}
