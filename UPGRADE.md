Scrap the Vite proxy approach entirely. Instead, create a simple Express backend server to handle the Claude API call securely.

1. Install dependencies:
npm install express cors dotenv

2. Create a new file called server.js in the project root:

const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/claude', async (req, res) => {
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
})

app.listen(3001, () => console.log('Proxy server running on port 3001'))

3. Update claudeApi.js to fetch from http://localhost:3001/api/claude instead of any Anthropic URL directly. No auth headers in the frontend fetch at all.

4. Update package.json scripts to add:
"server": "node server.js"

5. Remove the proxy config from vite.config.js entirely — clean it back to default.