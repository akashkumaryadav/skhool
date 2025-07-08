// app/api/ai-filter/route.ts

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Ensure your API key is stored securely and NOT prefixed with NEXT_PUBLIC_
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_STUDIO_API_KEY;

if (!apiKey) {
  throw new Error("GOOGLE_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Configuration for the model to ensure it's less likely to block our JSON request.
// This is a good practice for structured data generation.
const generationConfig = {
  temperature: 0.2, // Lower temperature for more deterministic, less "creative" output
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-04-17",
  generationConfig,
  safetySettings,
});

export async function POST(req: NextRequest) {
  try {
    const { query, schema } = await req.json();

    if (!query || !schema) {
      return NextResponse.json(
        { error: "Query and schema are required." },
        { status: 400 }
      );
    }

    const prompt = `You are an intelligent data filtering assistant for a web application. Your task is to convert a user's natural language query into a structured JSON filter object.
      Here is the schema of the available filterable columns:
      ${JSON.stringify(schema, null, 2)}

      Here is the user's query: "${query}"

      RULES:
      1.  Analyze the user's query to identify filter criteria.
      2.  The keys of the output JSON object MUST exactly match one of the 'accessorKey' values from the schema.
      3.  The values of the output JSON object MUST exactly match one of the 'filterOptions' for that key in the schema. Be case-sensitive.
      4.  If the query mentions a value that is similar but not identical to a filter option (e.g., "gogle" instead of "Google"), map it to the correct option.
      5.  If the query does not seem to request any specific filters or is nonsensical, return an empty JSON object: {}.
      6.  Only return the JSON object, with no additional text, explanations, or markdown formatting like \`\`\`json.

      EXAMPLES:
      -   User Query: "show me all unpaid students"
          Expected Output: { "feeStatus": "Unpaid" }
      -   User Query: "all students from google"
          Expected Output: { "guardianCompany": "Google" }
      -   User Query: "unpaid from facebook"
          Expected Output: { "feeStatus": "Unpaid", "guardianCompany": "Facebook" }
      -   User Query: "hello there"
          Expected Output: {}`;

    // --- THIS IS THE CORRECTED USAGE FOR @google/genai ---
    const result = await model.generateContent(prompt);

    // Access the response directly after the promise resolves.
    const response = result.response;
    const text = response.text();
    // --- END OF CORRECTION ---

    // The rest of the logic remains the same.
    try {
      const filterObject = JSON.parse(text);
      return NextResponse.json(filterObject);
    } catch (e) {
      console.error("AI returned malformed or non-JSON text:", text, e);
      return NextResponse.json({}); // Fail gracefully
    }
  } catch (error) {
    console.error("Error in AI filter route:", error);
    if (error instanceof Error && error.message.includes("SAFETY")) {
      return NextResponse.json(
        { error: "Request blocked due to safety settings." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to process AI filter." },
      { status: 500 }
    );
  }
}
