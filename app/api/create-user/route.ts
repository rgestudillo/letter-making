import { NextResponse } from 'next/server';
import { addUser } from '@/lib/firebase-admin';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, userEmail } = body;

        if (!userId || !userEmail) {
            return NextResponse.json({ error: 'Missing userId or userEmail' }, { status: 400 });
        }

        await addUser(userId, userEmail);
        return NextResponse.json({ message: 'User added/verified in Firestore' });
    } catch (error) {
        console.error('Error in create-user route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
