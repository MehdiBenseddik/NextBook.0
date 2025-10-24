import Image from "next/image"

export default function RecommendationsPage({ searchParams }: any) {
  const recsParam = searchParams?.recs
  let recommendations: any[] = []
  try {
    if (recsParam) recommendations = JSON.parse(decodeURIComponent(recsParam))
  } catch (e) {
    console.error('Failed to parse recommendations', e)
  }

  // If no recommendations were passed, show a friendly message.
  if (!recsParam || recommendations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">No recommendations found</h2>
          <p className="text-muted-foreground mt-2">Try the onboarding flow to generate reading suggestions.</p>
          <div className="mt-4">
            <a href="/onboarding" className="inline-block px-4 py-2 bg-primary text-white rounded-lg">Go to Onboarding</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-accent/30 pt-32">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-primary inline-block relative">Your Reading Adventure Begins!</h1>
        </div>

        {recommendations.length === 0 ? (
          <p className="text-center text-muted-foreground">No recommendations yet. Try the onboarding flow.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((book: any, i: number) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="h-48 w-full relative rounded-lg overflow-hidden mb-4 bg-gray-100">
                  {/* If book.coverUrl exists, show it; otherwise show placeholder */}
                  {book.coverUrl ? (
                    <Image src={book.coverUrl} alt={book.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                <p className="text-sm mb-2">{book.shortDescription}</p>
                <p className="text-xs text-primary">Why this is a good match: {book.whyThisIsAGoodMatch}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

