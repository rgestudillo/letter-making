import { format } from 'date-fns'
import { Typewriter } from '@/components/Typewriter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

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

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/letter/${params.id}`
  );
  const data = await response.json();

  if (!data.content) {
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

  const formattedDate = data.timestamp
    ? format(new Date(data.timestamp), 'MMMM d, yyyy HH:mm')
    : 'Unknown Date';

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
                <Typewriter text={data.content} delay={80} />
              </div>
            </div>
          </ScrollArea>
          <Separator className="my-4" />
          <div className="flex flex-col space-y-2 text-sm text-gray-600">
            {data.author && (
              <p>
                <span className="font-semibold">From:</span> {data.author}
              </p>
            )}
            {data.timestamp && (
              <p>
                <span className="font-semibold">Written on:</span> {formattedDate}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

