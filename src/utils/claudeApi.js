// Single-word descriptors that should go straight to local scoring
const KNOWN_TERMS = new Set([
  'oud', 'rose', 'musk', 'fresh', 'smoky', 'sweet', 'floral', 'spicy', 'clean', 'warm',
  'dark', 'sensual', 'woody', 'citrus', 'amber', 'leather', 'incense', 'vanilla',
  'jasmine', 'patchouli', 'bergamot', 'cedar', 'sandalwood', 'iris', 'vetiver',
  'tuberose', 'resinous', 'gourmand', 'fruity', 'aquatic', 'aromatic', 'powdery',
  'earthy', 'herbal', 'musky', 'oriental', 'saffron', 'pepper', 'cinnamon', 'almond',
  'pear', 'lemon', 'lychee', 'litchi', 'labdanum', 'agarwood', 'amberwood',
])

/**
 * Returns true when input looks like a perfume/brand name rather than
 * a comma-separated list of notes or mood words.
 *
 * Rules:
 *  - Any comma present → notes mode
 *  - Single known descriptor word → notes mode
 *  - Two or more words with no comma → treat as perfume name → call API
 */
export function looksLikePerfumeName(input) {
  const trimmed = input.trim()

  if (trimmed.includes(',')) return false

  const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean)

  if (words.length === 1 && KNOWN_TERMS.has(words[0])) return false

  if (words.length >= 2) return true

  return false
}

/**
 * Calls the Claude API via the Vite dev proxy (/api/claude → api.anthropic.com/v1/messages)
 * to extract fragrance notes, scent family, and mood descriptors from a perfume name.
 * Returns a comma-separated string ready for getRecommendations().
 * Throws on failure so the caller can fall back to local scoring.
 */
export async function extractScentProfile(userInput) {
  // Debug: confirm the key is visible to the client bundle
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  console.log(
    '[ScentFinder] API key loaded:',
    apiKey ? `${apiKey.slice(0, 12)}…` : 'MISSING — check .env'
  )

  const prompt =
    `You are a fragrance expert. The user has entered: ${userInput}. ` +
    `Extract the key fragrance notes, scent family, and mood descriptors for this. ` +
    `Return ONLY a JSON object with keys: notes (array), scentFamily (array), mood (array). ` +
    `No explanation, no markdown, just raw JSON.`

  // Auth headers are handled by the Express server — no auth sent from the frontend.
  const response = await fetch('http://localhost:3001/api/claude', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  console.log('[ScentFinder] Claude API response status:', response.status)

  if (!response.ok) {
    const errorText = await response.text()
    console.error('[ScentFinder] Claude API error body:', errorText)
    throw new Error(`Claude API ${response.status}`)
  }

  const data = await response.json()
  console.log('[ScentFinder] Claude API response data:', data)

  const text = data.content[0].text.trim()

  // Strip any accidental markdown fences before parsing
  const clean = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  const parsed = JSON.parse(clean)

  const allTerms = [
    ...(parsed.notes       ?? []),
    ...(parsed.scentFamily ?? []),
    ...(parsed.mood        ?? []),
  ]

  console.log('[ScentFinder] Extracted terms:', allTerms)

  if (allTerms.length === 0) throw new Error('Empty profile returned')

  return allTerms.join(', ')
}
