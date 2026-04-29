const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Uses Gemini API to suggest task priority.
 * 
 * @param {string} title 
 * @param {string} description 
 * @returns {Promise<{priority: string, reason: string}>}
 */
async function suggestPriority(title, description) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('No GEMINI_API_KEY found, skipping AI prioritization.');
      return { priority: 'medium', reason: 'Defaulted to medium due to missing API key.' };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are a task prioritization assistant. Based on the task title and description, suggest a priority level (low, medium, high) and provide a brief reasoning string (max 1 sentence).
Respond ONLY with a valid JSON object in this format:
{"priority": "low|medium|high", "reason": "Your brief reasoning here."}

Task Title: "${title}"
Task Description: "${description || 'No description provided.'}"
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON in case the model adds markdown formatting like ```json ... ```
    const match = responseText.match(/\{[\s\S]*\}/);
    if (match) {
        const parsed = JSON.parse(match[0]);
        // Validate priority against allowed enum values
        if (!['low', 'medium', 'high'].includes(parsed.priority)) {
            parsed.priority = 'medium';
        }
        return {
            priority: parsed.priority,
            reason: parsed.reason
        };
    } else {
        throw new Error('Failed to parse AI response as JSON.');
    }
  } catch (error) {
    console.error('AI Suggestion Error:', error);
    return { priority: 'medium', reason: 'Failed to generate priority due to an error.' };
  }
}

module.exports = { suggestPriority };
