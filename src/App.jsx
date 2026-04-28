import { useState } from 'react'
import { getRecommendations } from './utils/recommendation.js'
import { looksLikePerfumeName, extractScentProfile } from './utils/claudeApi.js'

const EXAMPLE_CHIPS = [
  'Oud', 'Rose', 'Musk', 'Fresh', 'Smoky',
  'Sweet', 'Floral', 'Spicy', 'Clean', 'Warm',
]

export default function App() {
  const [input, setInput]             = useState('')
  const [results, setResults]         = useState([])
  const [hasSearched, setHasSearched] = useState(false)
  const [loading, setLoading]         = useState(false)

  async function handleSearch() {
    if (!input.trim()) return

    setHasSearched(true)

    if (looksLikePerfumeName(input)) {
      // Looks like a brand/product name — ask Claude to extract its scent profile
      setLoading(true)
      try {
        const extractedTerms = await extractScentProfile(input)
        setResults(getRecommendations(extractedTerms))
      } catch {
        // API failed — fall back to local scoring silently
        setResults(getRecommendations(input))
      } finally {
        setLoading(false)
      }
    } else {
      // Free notes or mood words — go straight to local scoring
      setResults(getRecommendations(input))
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
    }
  }

  function handleChipClick(chip) {
    setInput(prev =>
      prev.trim() ? `${prev.trim()}, ${chip.toLowerCase()}` : chip.toLowerCase()
    )
  }

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <img
          src="/House of AB Logo - 4.png"
          alt="House of AB"
          className="logo"
        />
        <h1 className="title">Find Your House of AB Scent</h1>
        <p className="subtitle">
          Enter your favourite perfume, notes, or mood — and discover the scent
          that matches your profile.
        </p>
      </header>

      {/* ── Input ── */}
      <section className="input-section">
        <textarea
          className="scent-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Try: oud, rose, smoky, warm — or a perfume name like Creed Aventus"
          rows={3}
          disabled={loading}
          aria-label="Describe your scent preferences"
        />

        <div className="chips" role="group" aria-label="Quick-pick scent words">
          {EXAMPLE_CHIPS.map(chip => (
            <button
              key={chip}
              className="chip"
              onClick={() => handleChipClick(chip)}
              type="button"
              disabled={loading}
            >
              {chip}
            </button>
          ))}
        </div>

        <button
          className="find-btn"
          onClick={handleSearch}
          disabled={!input.trim() || loading}
          type="button"
        >
          {loading ? 'Analysing…' : 'Find My Scent'}
        </button>

        {loading && (
          <p className="loading-label" aria-live="polite">
            Analysing your scent profile…
          </p>
        )}
      </section>

      {/* ── Results ── */}
      {hasSearched && !loading && (
        <section className="results-section" aria-live="polite">
          {results.length === 0 ? (
            <div className="no-results">
              <p>No matches found. Try different notes or moods.</p>
            </div>
          ) : (
            <>
              <h2 className="results-title">Your Matches</h2>
              <div className="results-grid">
                {results.map(result => (
                  <ResultCard key={result.name} result={result} />
                ))}
              </div>

              <div className="cta">
                <p className="cta-text">
                  Want to experience this scent at your event?
                </p>
                <a
                  href="mailto:info@houseofab.com"
                  className="cta-btn"
                >
                  Enquire with House of AB
                </a>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  )
}

function ResultCard({ result }) {
  const allNotes = [
    ...result.notes.top,
    ...result.notes.heart,
    ...result.notes.base,
  ]

  return (
    <article className={`result-card${result.isBestMatch ? ' best-match' : ''}`}>
      {result.isBestMatch && (
        <span className="best-badge" aria-label="Best match">Best Match</span>
      )}

      <div className="card-header">
        <h3 className="fragrance-name">{result.name}</h3>
        <div className="confidence" aria-label={`${result.confidence}% match`}>
          <span className="confidence-value">{result.confidence}%</span>
          <span className="confidence-label">match</span>
        </div>
      </div>

      <div className="confidence-bar" role="presentation">
        <div className="confidence-fill" style={{ width: `${result.confidence}%` }} />
      </div>

      <p className="fragrance-description">{result.description}</p>

      <div className="card-meta">
        <MetaRow label="Scent Family" tags={result.scentFamily} variant="family" />
        <MetaRow label="Notes"        tags={allNotes}            variant="note"   />
        <MetaRow label="Profile"      tags={result.profileTags}  variant="profile" />
      </div>

      <p className="explanation">{result.explanation}</p>
    </article>
  )
}

function MetaRow({ label, tags, variant }) {
  return (
    <div className="meta-group">
      <span className="meta-label">{label}</span>
      <div className="meta-tags">
        {tags.map(tag => (
          <span key={tag} className={`tag tag--${variant}`}>{tag}</span>
        ))}
      </div>
    </div>
  )
}
