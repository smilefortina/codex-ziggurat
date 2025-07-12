import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

// receive a token from GPT side and forward to Claude side
app.post('/sync', async (req, res) => {
  const token = req.body;
  console.log('Received token from GPT:', token.id);

  try {
    const response = await fetch('https://claude.example.com/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(token)
    });
    const result = await response.json();
    res.json(result);
  } catch (err) {
    console.error('Sync failed', err);
    res.status(500).json({ error: 'sync failed' });
  }
});

app.listen(3000, () => {
  console.log('Sync API listening on port 3000');
});

/* cURL Example:
   curl -X POST http://localhost:3000/sync \
        -H 'Content-Type: application/json' \
        -d @examples/rxtoken_example.json
*/
