module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { message } = req.body;

  const systemPrompt = `You are Simply Fit AI, an expert personal fitness coach specialising in strength training, muscle building, fat loss, and nutrition. You are motivating, knowledgeable, and concise. You give practical, actionable advice tailored to the user's goals. You speak like a supportive coach — direct but encouraging. Never recommend anything dangerous. Keep responses under 150 words unless a detailed plan is requested.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();
    console.log('Anthropic response:', JSON.stringify(data));
    const reply = data.content?.[0]?.text || "I couldn't generate a response.";
    res.status(200).json({ reply });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ reply: 'Something went wrong. Please try again!' });
  }
};
