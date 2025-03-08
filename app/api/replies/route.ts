import { NextResponse } from 'next/server';
import { getLetterReplies } from '@/lib/firebase-admin';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const letterId = searchParams.get('letterId');

    if (!letterId) {
        return NextResponse.json({ error: 'Letter ID is required' }, { status: 400 });
    }

    try {
        const replies = await getLetterReplies(letterId);
        return NextResponse.json({ replies });
    } catch (error) {
        console.error('Error fetching replies:', error);
        return NextResponse.json({ error: 'Failed to fetch replies' }, { status: 500 });
    }
} 