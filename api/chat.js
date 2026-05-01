module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { message } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/models', {
      method: 'GET',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    });

    const data = await response.json();
    console.log('Available models:', JSON.stringify(data));
    res.status(200).json({ reply: 'Check logs for available models' });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ reply: err.message });
  }
};
