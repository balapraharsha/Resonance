import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'sk-ant-api03-demo-key'
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Resonance API' });
});

// Analyze emotional state
app.post('/api/analyze-emotion', async (req, res) => {
  try {
    const { input } = req.body;

    if (!input || input.trim().length === 0) {
      return res.status(400).json({ error: 'Input is required' });
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Analyze this emotional state and return ONLY a valid JSON object with no additional text:

User input: "${input}"

Return format (must be valid JSON):
{
  "primary_emotion": "anxiety|loneliness|grief|stress|overwhelm|sadness|anger|fear",
  "intensity": 1-10,
  "themes": ["career", "relationships", "health", "family", "academic", "financial"],
  "crisis_level": "calm|struggling|crisis",
  "summary": "one sentence summary of emotional state"
}

IMPORTANT: 
- If user mentions suicide, self-harm, or immediate danger, set crisis_level to "crisis"
- Otherwise assess as "calm" or "struggling"
- Return ONLY the JSON object, no markdown, no explanations`
      }]
    });

    const responseText = message.content[0].text.trim();
    
    // Clean up any markdown formatting
    const cleanedText = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const emotionalState = JSON.parse(cleanedText);

    res.json({ emotionalState });
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    res.status(500).json({ 
      error: 'Failed to analyze emotional state',
      emotionalState: {
        primary_emotion: 'anxiety',
        intensity: 5,
        themes: ['general'],
        crisis_level: 'struggling',
        summary: 'Experiencing general emotional distress'
      }
    });
  }
});

// Generate peer response
app.post('/api/generate-response', async (req, res) => {
  try {
    const { userMessage, peer, emotionalContext, conversationHistory } = req.body;

    const historyContext = conversationHistory
      .slice(-4)
      .map(msg => `${msg.sender === 'user' ? 'User' : 'Peer'}: ${msg.text}`)
      .join('\n');

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `You are roleplaying as ${peer.bio}. You're having a peer support conversation.

Emotional context: The user is experiencing ${emotionalContext.primary_emotion} related to ${emotionalContext.themes.join(', ')}.

Recent conversation:
${historyContext}

User just said: "${userMessage}"

Respond as this peer with:
- Empathy and validation (not advice)
- Share brief relatable experience if appropriate
- Ask gentle follow-up question
- Keep it natural, warm, 2-3 sentences max
- NEVER diagnose or provide therapy
- NEVER say "I'm here for you" or similar AI phrases

Response:`
      }]
    });

    const response = message.content[0].text.trim();

    res.json({ response });
  } catch (error) {
    console.error('Error generating response:', error);
    res.json({ 
      response: "I hear you. That sounds really difficult. What's been the hardest part for you?"
    });
  }
});

// Generate reflection prompt
app.post('/api/generate-reflection', async (req, res) => {
  try {
    const { beforeEmotion, afterRating } = req.body;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `User felt ${beforeEmotion.primary_emotion} (intensity: ${beforeEmotion.intensity}/10) before conversation.
After conversation, they rated themselves ${afterRating}/10.

Generate a thoughtful reflection prompt (2-3 sentences) that:
- Acknowledges their emotional journey
- Encourages self-reflection
- Is hopeful but not dismissive
- Doesn't sound like generic AI

Return ONLY the prompt text, nothing else.`
      }]
    });

    const prompt = message.content[0].text.trim();

    res.json({ prompt, resources: [] });
  } catch (error) {
    console.error('Error generating reflection:', error);
    res.json({ 
      prompt: "Take a moment to notice what changed during this conversation. Sometimes being heard is the first step toward feeling less alone.",
      resources: []
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Resonance API running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health\n`);
});

export default app;
