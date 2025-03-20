const express = require('express');
const router = express.Router(); // Initialize the Express router
const OpenAI = require('openai');

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Your OpenAI API Key from the .env file
});

// Define the /stoic route
router.get('/stoic', async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use gpt-3.5-turbo as a fallback
      messages: [
        {
          role: 'system',
          content:
            'You are a philosophy assistant specializing in Stoicism. Provide an authentic Stoic quote from Marcus Aurelius, Seneca, or Epictetus. Include the author’s name and a short explanation.',
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    const aiResponse = response.choices[0].message.content.trim();
    res.json({ message: aiResponse });
  } catch (error) {
    console.error('Error fetching Stoic quote:', error.message);
    res.status(500).json({ error: 'Failed to fetch Stoic quote' });
  }
});

module.exports = router; // Export the router

