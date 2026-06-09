import 'dotenv/config'
import express from 'express'
import Anthropic from '@anthropic-ai/sdk'

const PORT = process.env.PORT || 3001

// The API key stays here on the server and is never sent to the browser.
const apiKey = process.env.ANTHROPIC_API_KEY
if (!apiKey) {
  console.warn(
    '\n⚠️  ANTHROPIC_API_KEY is not set. The /api/motivation endpoint will return 503,\n' +
      '   and the app will fall back to a built-in message. Copy .env.example to .env\n' +
      '   and add your key to enable AI-generated messages.\n',
  )
}

const client = apiKey ? new Anthropic({ apiKey }) : null

const LANGUAGE_NAMES = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  ja: 'Japanese',
}

const app = express()
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, aiEnabled: Boolean(client) })
})

app.post('/api/motivation', async (req, res) => {
  if (!client) {
    return res.status(503).json({ error: 'AI not configured' })
  }

  const { habitName, currentStreak, category, lang } = req.body || {}
  if (typeof habitName !== 'string' || !habitName.trim()) {
    return res.status(400).json({ error: 'habitName is required' })
  }

  const streak = Number.isFinite(currentStreak) ? currentStreak : 0
  const language = LANGUAGE_NAMES[lang] || 'English'

  try {
    // Short, latency-sensitive generation: thinking disabled, tight token cap,
    // final-answer-only instruction so no reasoning leaks into the message.
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 120,
      thinking: { type: 'disabled' },
      system:
        'You are an upbeat habit coach. Write ONE short motivational message ' +
        '(1–2 sentences, under 25 words) celebrating that the user just completed ' +
        'their habit for today. Be warm, specific to the habit, and energetic. ' +
        'If the streak is notable, weave it in naturally. ' +
        `Write the message in ${language}. ` +
        'Respond only with the message text — no quotes, no preamble, no reasoning, ' +
        'no markdown. At most one emoji, only if it fits naturally.',
      messages: [
        {
          role: 'user',
          content:
            `Habit: ${habitName.trim()}\n` +
            `Category: ${category || 'general'}\n` +
            `Current streak: ${streak} day(s)`,
        },
      ],
    })

    const message = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim()

    if (!message) {
      return res.status(502).json({ error: 'Empty response from model' })
    }

    res.json({ message })
  } catch (err) {
    // Typed SDK errors carry a numeric .status; log it and let the client fall back.
    const status = err?.status || 500
    console.error('Anthropic request failed:', status, err?.message)
    res.status(502).json({ error: 'Generation failed' })
  }
})

app.listen(PORT, () => {
  console.log(`✅ Motivation API listening on http://localhost:${PORT}`)
  console.log(`   AI generation: ${client ? 'enabled' : 'disabled (no API key)'}`)
})
