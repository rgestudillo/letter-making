import { format } from 'date-fns'
import { Typewriter } from '@/components/Typewriter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getLetter } from '@/lib/firebase-admin'

export default async function Letter({ params }: { params?: { id: string } }) {
  if (!params || !params.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-purple-600">Invalid Letter ID</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">No valid letter ID was provided.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const letter = await getLetter(params.id);

  if (!letter) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-purple-600">Letter Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">The letter you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formattedDate = format(new Date(letter.timestamp), 'MMMM d, yyyy HH:mm');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="bg-purple-100 rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-purple-600">Your Letter</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4">
              <div className="bg-yellow-50 p-6 rounded-lg shadow-inner">
                <Typewriter text={letter.content} delay={30} />
              </div>
              <Separator className="my-4" />
              <div className="flex flex-col space-y-2 text-sm text-gray-600">
                {letter.author && (
                  <p>
                    <span className="font-semibold">From:</span> {letter.author}
                  </p>
                )}
                <p>
                  <span className="font-semibold">Written on:</span> {formattedDate}
                </p>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

