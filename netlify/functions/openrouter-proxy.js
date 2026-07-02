// Netlify Function (ESM) proxying requests to OpenRouter
// Expects the environment variable OPENROUTER_API_KEY to be set in Netlify
export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    }
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing OPENROUTER_API_KEY environment variable' }),
    }
  }

  try {
    const payload = event.body || '{}'

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: payload,
    })

    const responseBody = await response.text()

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: responseBody,
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error?.message || 'Proxy request failed' }),
    }
  }
}
