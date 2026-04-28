import { fragrances } from '../data/fragrances.js'

// Maps mood/descriptor words to related notes, families, and tags
const synonymMap = {
  oud:     ['agarwood', 'woody', 'smoky', 'resinous'],
  fresh:   ['clean', 'citrus', 'airy', 'bright'],
  sweet:   ['vanilla', 'gourmand', 'fruity'],
  floral:  ['rose', 'jasmine', 'lily', 'orange blossom', 'tuberose'],
  warm:    ['amber', 'spicy', 'musk', 'resinous'],
  dark:    ['smoky', 'oud', 'leather', 'incense'],
  sensual: ['leather', 'musk', 'rose', 'amber'],
  clean:   ['white musk', 'fresh', 'airy', 'pristine'],
}

// Split and normalise raw user input into individual search terms
function parseInput(input) {
  return [...new Set(
    input
      .toLowerCase()
      .split(/[,\s]+/)
      .map(t => t.trim())
      .filter(t => t.length > 1)
  )]
}

// Flatten all notes for a fragrance into a lowercase array
function getAllNotes(fragrance) {
  return [
    ...fragrance.notes.top,
    ...fragrance.notes.heart,
    ...fragrance.notes.base,
  ].map(n => n.toLowerCase())
}

// Return true when two strings share a meaningful substring overlap
function substringMatch(a, b) {
  return a.includes(b) || b.includes(a)
}

// Score a single fragrance against the parsed user terms.
// Returns { score, matchedReasons }
function scoreFragrance(fragrance, terms) {
  const allNotes = getAllNotes(fragrance)
  const families = fragrance.scentFamily.map(f => f.toLowerCase())
  const tags     = fragrance.profileTags.map(t => t.toLowerCase())

  let score = 0
  const matchedReasons = []

  for (const term of terms) {
    let termMatched = false

    // +3 — exact (substring) note match
    if (allNotes.some(n => substringMatch(n, term))) {
      score += 3
      matchedReasons.push(term)
      termMatched = true
    }

    // +2 — scent family match
    if (families.some(f => substringMatch(f, term))) {
      score += 2
      if (!termMatched) matchedReasons.push(term)
      termMatched = true
    }

    // +2 — profile tag match
    if (tags.some(t => substringMatch(t, term))) {
      score += 2
      if (!termMatched) matchedReasons.push(term)
      termMatched = true
    }

    // +1 — synonym / related mood match
    const synonyms = synonymMap[term] ?? []
    const hasSynonymMatch = synonyms.some(syn =>
      allNotes.some(n  => substringMatch(n, syn))  ||
      families.some(f  => substringMatch(f, syn))  ||
      tags.some(t      => substringMatch(t, syn))
    )
    if (hasSynonymMatch) {
      score += 1
      if (!termMatched) matchedReasons.push(term)
    }
  }

  return { score, matchedReasons: [...new Set(matchedReasons)] }
}

// Return the top-3 matching fragrances with confidence % and explanation.
export function getRecommendations(input) {
  if (!input.trim()) return []

  const terms = parseInput(input)
  if (terms.length === 0) return []

  const scored = fragrances.map(fragrance => ({
    ...fragrance,
    ...scoreFragrance(fragrance, terms),
  }))

  const maxScore = Math.max(...scored.map(f => f.score))
  if (maxScore === 0) return []

  return scored
    .filter(f => f.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((f, i) => ({
      ...f,
      // Scale confidence relative to top scorer; top result capped at 97 %
      confidence: Math.round((f.score / maxScore) * 97),
      isBestMatch: i === 0,
      explanation:
        f.matchedReasons.length > 0
          ? `Matched because you mentioned ${f.matchedReasons.join(', ')}.`
          : 'Closest match based on your preferences.',
    }))
}
