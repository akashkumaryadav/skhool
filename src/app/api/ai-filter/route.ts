import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GOOGLE_STUDIO_API_KEY as string
);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

export async function POST(req: NextRequest) {
  try {
    const { query, schema } = await req.json();

    if (!query || !schema) {
      return NextResponse.json(
        { error: "Query and schema are required." },
        { status: 400 }
      );
    }

    const prompt = `You are an advanced, multilingual data filtering assistant. Your task is to convert a user's natural language query into a JSON array of filter conditions based on the provided English schema. The query may be in English, Hindi, or Hinglish.
      SCHEMA:
      ${JSON.stringify(schema, null, 2)}

      USER'S QUERY: "${query}"

      RULES:
      1. Your output MUST be a JSON array of objects. Each object represents one filter condition.
      2. Each filter object MUST have three keys: "field" (string), "operator" (string), and "value" (string or number).
      3. The "field" must EXACTLY match an 'accessorKey' from the schema. Understand synonyms (e.g., "father" -> "guardian", "surname" -> "lastname").
      4. Choose an "operator" ('equals' or 'contains') based on the user's intent.
      5. If the query is conversational or doesn't map to filters, return an empty array: [].
      6. ONLY return the JSON array, with no other text or markdown formatting.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const filterConditions = JSON.parse(
      text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()
    );
    return NextResponse.json(filterConditions);
  } catch (error) {
    console.error("AI filter route error:", error);
    return NextResponse.json([]); // Fail gracefully
  }
}
