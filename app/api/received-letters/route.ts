import { NextResponse } from 'next/server'
import { getLettersByEmail } from '@/lib/firebase-admin'
import { auth } from '@/lib/firebase-admin'

export async function GET(request: Request) {
    try {
        const idToken = request.headers.get('Authorization')?.split('Bearer ')[1]

        if (!idToken) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 })
        }

        const decodedToken = await auth.verifyIdToken(idToken)
        const userEmail = decodedToken.email

        if (!userEmail) {
            return NextResponse.json({ error: 'User email not found' }, { status: 400 })
        }

        const letters = await getLettersByEmail(userEmail)
        return NextResponse.json(letters)
    } catch (error) {
        console.error('Error fetching letters:', error)
        return NextResponse.json({ error: 'Failed to fetch letters' }, { status: 500 })
    }
}

