import { NextResponse } from 'next/server'

// Ensure this app route is treated as dynamic (not statically exported)
export const dynamic = 'force-dynamic'

function maskKey(key?: string) {
  if (!key) return '(none)'
  if (key.length <= 8) return '(<short-key>)'
  return `${key.slice(0,4)}...${key.slice(-4)}`
}

export async function GET() {
  // Only expose this in development to avoid leaking info in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const key = process.env.OPENAI_API_KEY
  const masked = maskKey(key)
  const looksPlaceholder = !key || key.toLowerCase().includes('your-api') || key.toLowerCase().includes('sk-xxxxx') || key.length < 20

  return NextResponse.json({ maskedKey: masked, looksPlaceholder, nodeEnv: process.env.NODE_ENV || 'undefined' })
}
