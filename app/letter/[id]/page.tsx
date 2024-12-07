import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FaEnvelope } from 'react-icons/fa'
import { getLetter } from '@/lib/firebase-admin'
import { LetterContent } from '@/components/LetterContent'

export default async function Letter({ params }: { params?: { id: string } }) {
  if (!params || !params.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-teal-200">
        <Card className="w-full max-w-md shadow-xl border-2 border-emerald-100">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
            <CardTitle className="text-2xl font-bold text-emerald-700 flex items-center gap-2">
              <FaEnvelope className="w-6 h-6 text-emerald-600" />
              Invalid Letter ID
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-emerald-600">No valid letter ID was provided.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const letter = await getLetter(params.id)

  if (!letter) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-teal-200 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-600">Letter Not Found</CardTitle>
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-teal-200 p-4">
      <LetterContent letter={letter} formattedDate={formattedDate} />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-emerald-200/20 to-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-teal-200/20 to-transparent rounded-full blur-3xl -z-10" />
    </div>
  );
}