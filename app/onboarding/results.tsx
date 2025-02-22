export default function Results({ books }: { books: any[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {books.map((book, index) => (
        <div
          key={index}
          className="aspect-[2/3] rounded-lg bg-purple-900/20 border border-purple-500/50 p-4 flex items-center justify-center"
        >
          <span className="text-purple-400">Book {index + 1}</span>
        </div>
      ))}
    </div>
  )
}

