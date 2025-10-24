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