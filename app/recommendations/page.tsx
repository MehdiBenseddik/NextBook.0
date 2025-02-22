import Image from "next/image"

const placeholderBooks = [
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    coverUrl: "https://m.media-amazon.com/images/I/81iqZ2HHD-L._AC_UF1000,1000_QL80_.jpg",
  },
  {
    title: "The Lion, the Witch and the Wardrobe",
    author: "C.S. Lewis",
    coverUrl: "https://m.media-amazon.com/images/I/81QUw81WcoL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    title: "Charlotte's Web",
    author: "E.B. White",
    coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lol.jpg-iqWr3jEkA9EnC2pdlUGyJtarrdO2vj.jpeg",
  },
  {
    title: "The Giver",
    author: "Lois Lowry",
    coverUrl: "https://m.media-amazon.com/images/I/81zE42gT3xL._AC_UF1000,1000_QL80_.jpg",
  },
]

export default function RecommendationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-accent/30 pt-32">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-primary inline-block relative">Your Reading Adventure Begins!</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {placeholderBooks.map((book, i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-primary/20 shadow-lg hover:scale-105 transition-all cursor-pointer group overflow-hidden"
            >
              <div className="w-full h-full flex flex-col items-center justify-end p-4 relative">
                <Image
                  src={book.coverUrl || "/placeholder.svg"}
                  alt={book.title}
                  layout="fill"
                  objectFit="cover"
                  className="absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <p className="text-white font-medium text-center relative z-10">{book.title}</p>
                <p className="text-white/80 text-sm text-center relative z-10">{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

