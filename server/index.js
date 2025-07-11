import express from 'express';
import cors from 'cors';
import { Client } from '@gradio/client';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const client = await Client.connect('mhamad69/Portfolio-Chat-Bot');
    const result = await client.predict('/chat', {
      message,
      max_tokens: 300,
      temperature: 0.3,
      top_p: 0.9,
    });

    res.json({ reply: result.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to contact chatbot' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
