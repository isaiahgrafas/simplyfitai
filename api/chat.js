module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { message, history = [], profile = {} } = req.body;

  const profileSummary = Object.keys(profile).length > 0
    ? `\n\nKNOWN USER PROFILE (always respect these details):\n${Object.entries(profile).map(([k,v]) => `- ${k}: ${v}`).join('\n')}`
    : '';

  const systemPrompt = `You are Simply Fit AI, an expert personal fitness coach specialising in strength training, muscle building, fat loss, and nutrition. You are motivating, knowledgeable, and concise. You give practical, actionable advice tailored to the user's goals. You speak like a supportive coach — direct but encouraging. Never recommend anything dangerous. Keep responses under 150 words unless a detailed plan is requested.${profileSummary}

As you learn details about the user (equipment available, goals, fitness level, injuries, schedule, dietary preferences etc) remember them and never contradict them. If the user says they only have bodyweight equipment, never recommend weights.`;

  const messages = [
    ...history.slice(-10),
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
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: systemPrompt,
        messages
      })
    });

    const data = await response.json();
    console.log('Response:', JSON.stringify(data));
    const reply = data.content?.[0]?.text || "I couldn't generate a response.";
    res.status(200).json({ reply });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ reply: 'Something went wrong. Please try again!' });
  }
};
