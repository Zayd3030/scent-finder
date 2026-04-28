Convert the Express server.js into a Vercel serverless function so the app can be deployed to Vercel for free.

1. Create a new folder called api/ in the project root
2. Inside it create a file called claude.js with this structure:

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') return res.status(200).end()
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.VITE_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify(req.body)
    })
    const data = await response.json()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

3. Update claudeApi.js to fetch from /api/claude (same as before — Vercel routes it automatically)

4. Create a vercel.json in the project root:
{
  "rewrites": [{ "source": "/api/claude", "destination": "/api/claude" }]
}

5. Update package.json build script to just: "vite build"