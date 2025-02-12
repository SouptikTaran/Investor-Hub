import { GoogleGenerativeAI } from "@google/generative-ai";
import logger from "./logger.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


export default async function classifyQueryToCategory(query, categories) {
  const prompt = `
    You are an expert at understanding text and categorizing it into predefined categories. 
    Given the following categories: ${categories.join(", ")}, 
    classify the following query into one of them:

    Query: "${query}"

    Provide only the category as your response.
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

