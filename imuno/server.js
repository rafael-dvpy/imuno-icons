import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model = 'moonshotai/kimi-k2:free', apiKey } = req.body;

    if (!apiKey) {
      console.error('API key not provided');
      return res.status(400).json({ error: 'API key not configured' });
    }

    console.log('Forwarding request to OpenRouter');
    console.log('Model:', model);

    const response = await fetch('https://openrouter.io/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://imuno-icons.com',
        'X-Title': 'ImunoIcons',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    console.log('OpenRouter response status:', response.status);

    if (!response.ok) {
      console.error('OpenRouter error:', data);
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('API Proxy Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
