import { GoogleGenerativeAI } from "@google/generative-ai";
import logger from "./logger.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


export default async function classifyQueryToCategory(query, categories) {
  const prompt = `
  You are an expert in text classification. Your task is to categorize the given query into one of the predefined categories: 
  ${categories.join(", ")}.

  **Instructions:**
  - Analyze the query carefully and match it to the most relevant category.
  - If the query is ambiguous, incorrect, or does not fit any category, return "Unknown".
  - Handle common phrasing variations intelligently.

  **Examples:**
  - "Please specify investors for blockchain" → Blockchain
  - "Can you suggest better mentors for my project of ML?" → AI
  - "I want to learn about cloud storage" → Cloud Computing
  - "Tell me about marketing strategies" → Unknown

  **Query:** "${query}"

  **Response:** Provide only the category name as your response.
`;

  try {
    const result = await model.generateContent(prompt);
    const classification = result.response.text().trim();
    if (categories.includes(classification)) {
      return classification;
    } else {
      logger.warn("Gemini returned an invalid category.");
      return "Not Found"; 
    }
  } catch (error) {
    console.log(error)
    logger.error("Error classifying query:", error);
    throw new Error("Failed to classify query.");
  }
}

