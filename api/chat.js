// api/chat.js — Simply Fit AI chat endpoint
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { message, history = [], mode } = req.body;

  const systemPrompt = `You are Simply Fit AI, an expert personal fitness coach specialising in strength training, muscle building, fat loss, and nutrition. You are motivating, knowledgeable, and concise. You give practical, actionable advice tailored to the user's goals. You speak like a supportive coach — direct but encouraging. Never recommend anything dangerous. Always suggest consulting a doctor for medical concerns. Keep responses under 150 words unless a detailed plan is requested.`;

  const messages = [
    ...history.slice(-10), // keep last 10 messages for context
    { role: 'user', content: message }
  ];

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: systemPrompt,
        messages
      })
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || "I couldn't generate a response. Please try again.";
    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: 'Something went wrong. Please try again!' });
  }
}
