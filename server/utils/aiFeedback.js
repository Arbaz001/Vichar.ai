const { InferenceClient } = require("@huggingface/inference");
const Idea = require('../models/Idea');

const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL = "deepseek-ai/DeepSeek-R1-0528";

// Initialize the Hugging Face client
const client = new InferenceClient(HF_API_KEY);

const generateFeedback = async (ideaId) => {
  try {
    const idea = await Idea.findById(ideaId);
    if (!idea) throw new Error('Idea not found');
    
    const prompt = `
      Analyze this startup idea in 100 words:
      Title: ${idea.title}
      Description: ${idea.description}
      Tags: ${idea.tags.join(', ')}
      
      Format response as JSON with:
      - summary (short analysis)
      - pros (array of 3 points)
      - cons (array of 3 points)
      - rating (1-10)
    `;

    // Using the streaming API
    let generatedText = "";
    const stream = client.chatCompletionStream({
      provider: "sambanova",
      model: HF_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 1,
      top_p: 1,
    });

    for await (const chunk of stream) {
      if (chunk.choices && chunk.choices.length > 0) {
        const newContent = chunk.choices[0].delta.content;
        if (newContent) {
          generatedText += newContent;
        }
      }
    }

    return parseResponse(generatedText);
    
  } catch (error) {
    console.error('AI Error:', error.message);
    return getFallbackResponse();
  }
};

const parseResponse = (text) => {
  try {
    // Clean the text and try to extract JSON
    const cleanedText = text.replace(/```json|```/g, '').trim();
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return getFallbackResponse(cleanedText);
  } catch (error) {
    console.error('Parse Error:', error.message);
    return getFallbackResponse(text);
  }
};

const getFallbackResponse = (text = "") => ({
  summary: text || "AI service currently unavailable",
  pros: ["Fast processing", "Low cost", "Innovative"],
  cons: ["Limited analysis", "Generic feedback", "No deep insights"],
  rating: 7
});

module.exports = { generateFeedback };