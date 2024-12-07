import { format } from 'date-fns'
import { Typewriter } from '@/components/Typewriter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getLetter } from '@/lib/firebase-admin'
import { FaEnvelope, FaCalendarAlt, FaUser, FaQuoteLeft } from 'react-icons/fa'

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
      <Card className="w-full max-w-3xl shadow-2xl border-2 border-emerald-100 transform hover:scale-[1.02] transition-all duration-500">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b-2 border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-full shadow-lg">
              <FaEnvelope className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-emerald-800">{letter.title}</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-8 bg-white">
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4">
              <div className="relative bg-gradient-to-br from-emerald-50 to-green-50 p-8 rounded-xl shadow-inner border border-emerald-100">
                <FaQuoteLeft className="absolute top-4 left-4 text-emerald-200 w-8 h-8 opacity-50" />
                <div className="pl-8 pt-4">
                  <Typewriter
                    text={letter.content}
                    delay={30}
                    className="text-emerald-800 leading-relaxed text-lg font-serif"
                  />
                </div>
              </div>
            </div>
          </ScrollArea>

          <Separator className="my-6 bg-emerald-100" />

          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
            <div className="flex flex-col space-y-2 text-sm text-emerald-700">
              {letter.author && (
                <p className="flex items-center gap-2">
                  <FaUser className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold">From:</span> {letter.author}
                </p>
              )}
              <p className="flex items-center gap-2">
                <FaCalendarAlt className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Written on:</span> {formattedDate}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-emerald-200/20 to-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-teal-200/20 to-transparent rounded-full blur-3xl -z-10" />
    </div>
  );
}