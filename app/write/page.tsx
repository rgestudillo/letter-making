'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function WriteLetter() {
  const [title, setTitle] = useState('');
  const [letter, setLetter] = useState('');
  const [author, setAuthor] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !letter.trim() || !recipientEmail.trim()) {
      alert('Title, content, and recipient email are required.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: letter,
          author,
          createdBy: user ? user.uid : 'Guest',
          recipient_email: recipientEmail,
        }),
      });
      const data = await response.json();
      if (data.id) {
        router.push(`/generate/${data.id}`);
      } else {
        throw new Error('Failed to generate link');
      }
    } catch (error) {
      console.error('Error generating link:', error);
      alert('Failed to generate link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 p-4">
      <h1 className="text-3xl font-bold text-white mb-8">Write Your Letter</h1>
      <div className="w-full max-w-2xl space-y-4">
        <div>
          <Label htmlFor="title" className="text-white">Title</Label>
          <Input
            id="title"
            placeholder="Title of your letter"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <div>
          <Label htmlFor="author" className="text-white">Your Name (optional)</Label>
          <Input
            id="author"
            placeholder="Your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="recipientEmail" className="text-white">Recipient's Email</Label>
          <Input
            id="recipientEmail"
            type="email"
            placeholder="Recipient's email address"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <div>
          <Label htmlFor="letter" className="text-white">Your Letter</Label>
          <Textarea
            id="letter"
            className="w-full h-64 p-4 rounded-lg"
            placeholder="Write your letter here..."
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
            required
          />
        </div>
        <Button
          onClick={handleSubmit}
          size="lg"
          className="w-full bg-white text-purple-600 hover:bg-purple-100"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Link'}
        </Button>
      </div>
    </div>
  );
}

