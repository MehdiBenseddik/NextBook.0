// filepath: app/api/recommendations/route.ts
import OpenAI from 'openai'
import { NextResponse } from 'next/server'

// Do not create the OpenAI client at module load time. Create it inside the request
// handler so changes to environment variables (or restarts) are picked up reliably.

type Answers = Record<string, string>

function buildPrompt(answers: Answers) {
  return `You are an assistant that recommends children's books. The user provided the following information:\n\nUsage: ${answers.usage || 'Not specified'}\nReading Level: ${answers.level || 'Not specified'}\nGenres: ${answers.genres || 'Not specified'}\nFavorite Books: ${answers.favorites || 'Not specified'}\nStory Preference: ${answers.story || 'Not specified'}\n\nRespond with a JSON array of 3 book objects with the fields: title, author, shortDescription (1-2 sentences), and whyThisIsAGoodMatch. Output only valid JSON.`
}

export async function POST(req: Request) {
  try {
    const { answers } = await req.json()

    const prompt = buildPrompt(answers || {})

    // Use model from env when provided, otherwise fall back to a safe default.
    const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo'

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY missing', details: 'Set OPENAI_API_KEY in .env.local and restart the dev server' }, { status: 400 })
    }

    const openai = new OpenAI({ apiKey })

    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 600,
    })

    const text = completion.choices?.[0]?.message?.content

    // Try to parse JSON from the model output
    let recommendations: any = null
    try {
      recommendations = JSON.parse(text || '')
    } catch (e) {
      // If parsing fails, wrap the plain text into an array
      recommendations = [{ title: 'Recommendations', author: '', shortDescription: text, whyThisIsAGoodMatch: '' }]
    }

    // If recommendations are an array, try to enrich each with a cover image
    async function findCoverUrl(title?: string, author?: string) {
      try {
        if (!title && !author) return undefined

        const tryUrls: string[] = []

        // Helper to construct a search URL with arbitrary query string and limit
        const search = async (query: string, limit = 5) => {
          try {
            const url = `https://openlibrary.org/search.json?${query}&limit=${limit}`
            const res = await fetch(url)
            if (!res.ok) return null
            const data = await res.json()
            return data?.docs || []
          } catch (e) {
            return null
          }
        }

        // 1) Try the precise title+author params (existing behavior)
        const parts: string[] = []
        if (title) parts.push(`title=${encodeURIComponent(title)}`)
        if (author) parts.push(`author=${encodeURIComponent(author)}`)
        const precise = parts.join('&')
        if (precise) {
          const docs = await search(precise, 3)
          if (docs && docs.length) {
            for (const doc of docs) {
              if (doc.cover_i) return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
              const edition = doc.cover_edition_key || doc.edition_key?.[0]
              if (edition) return `https://covers.openlibrary.org/b/olid/${edition}-L.jpg`
              // isbn fallback
              const isbn = doc.isbn?.[0]
              if (isbn) return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
            }
          }
        }

        // 2) Try a combined full-text q= search (title + author)
        const combinedQuery = encodeURIComponent(`${title || ''} ${author || ''}`)
        const docs2 = await search(`q=${combinedQuery}`, 5)
        if (docs2 && docs2.length) {
          for (const doc of docs2) {
            if (doc.cover_i) return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
            const edition = doc.cover_edition_key || doc.edition_key?.[0]
            if (edition) return `https://covers.openlibrary.org/b/olid/${edition}-L.jpg`
            const isbn = doc.isbn?.[0]
            if (isbn) return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
          }
        }

        // 3) Try a cleaned title (remove parenthetical or subtitle parts)
        const cleanedTitle = (title || '').replace(/\([^)]*\)/g, '').split(':')[0].trim()
        if (cleanedTitle && cleanedTitle !== title) {
          const docs3 = await search(`title=${encodeURIComponent(cleanedTitle)}`, 3)
          if (docs3 && docs3.length) {
            for (const doc of docs3) {
              if (doc.cover_i) return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
              const edition = doc.cover_edition_key || doc.edition_key?.[0]
              if (edition) return `https://covers.openlibrary.org/b/olid/${edition}-L.jpg`
              const isbn = doc.isbn?.[0]
              if (isbn) return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
            }
          }
        }

        // 4) As a last resort, try the Open Library cover with a fuzzy search by title only
        if (title) {
          const docs4 = await search(`title=${encodeURIComponent(title)}`, 10)
          if (docs4 && docs4.length) {
            for (const doc of docs4) {
              if (doc.cover_i) return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
              const edition = doc.cover_edition_key || doc.edition_key?.[0]
              if (edition) return `https://covers.openlibrary.org/b/olid/${edition}-L.jpg`
              const isbn = doc.isbn?.[0]
              if (isbn) return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
            }
          }
        }

        return undefined
      } catch (err) {
        console.warn('OpenLibrary lookup failed', err)
        return undefined
      }
    }

    if (Array.isArray(recommendations)) {
      const enriched = await Promise.all(recommendations.map(async (rec: any) => {
        if (rec.coverUrl) return rec
        const coverUrl = await findCoverUrl(rec.title, rec.author)
        return { ...rec, coverUrl }
      }))
      recommendations = enriched
    }

    return NextResponse.json({ recommendations })
  } catch (error) {
    // Log full error on the server for debugging (do NOT return secrets to the client)
    console.error('Recommendations API error', error)

    const message = error instanceof Error ? error.message : String(error)
    const lower = (message || '').toLowerCase()

    // Detect common OpenAI invalid API key messages and return a sanitized 401
    if (lower.includes('incorrect api key') || lower.includes('invalid_api_key') || lower.includes('invalid api key') || (error as any)?.status === 401 || (error as any)?.response?.status === 401) {
      const details = 'Invalid OpenAI API key. Set a valid OPENAI_API_KEY in your server environment and restart the dev server.'
      return NextResponse.json({ error: 'Invalid API key', details }, { status: 401 })
    }

    // For other errors, avoid exposing internal messages in production
    const details = process.env.NODE_ENV === 'production' ? 'An internal error occurred' : message
    return NextResponse.json({ error: 'Failed to generate recommendations', details }, { status: 500 })
  }
}