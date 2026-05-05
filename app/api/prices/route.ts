import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { slugs } = await req.json()
    if (!slugs || !Array.isArray(slugs)) {
      return NextResponse.json({ error: 'Invalid slugs' }, { status: 400 })
    }

    const list = slugs.join(', ')

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      tools: [{ type: 'web_search_20250305', name: 'web_search' } as any],
      messages: [{
        role: 'user',
        content: `Go to warframe.market and find the current minimum sell price at rank 5 (platinum) for each of these Warframe arcanes: ${list}.

Use web search to find prices from warframe.market for each item. Search for each one like "warframe.market ${slugs[0].replace(/_/g, ' ')}" etc.

Return ONLY a valid JSON object with no extra text, no markdown fences, no explanation:
{"${slugs[0]}": 120, "${slugs[1]}": 45, ...}

Use null for any arcane where you cannot find a price. Include all ${slugs.length} slugs as keys.`
      }]
    })

    const textBlock = response.content.find((b: any) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ prices: {} })
    }

    const raw = textBlock.text.replace(/```json|```/g, '').trim()
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) return NextResponse.json({ prices: {} })

    const prices = JSON.parse(match[0])
    return NextResponse.json({ prices })
  } catch (err: any) {
    console.error('Price fetch error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
