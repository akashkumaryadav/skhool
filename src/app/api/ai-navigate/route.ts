// app/api/ai-navigate/route.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GOOGLE_STUDIO_API_KEY as string
);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

export async function POST(req: NextRequest) {
  try {
    const { query, routes, userRole } = await req.json();
    if (!query || !routes || !userRole) {
      return NextResponse.json(
        { error: "Query, routes, and userRole are required." },
        { status: 400 }
      );
    }

    // --- THE NEW, ROLE-AWARE PROMPT ---
    const prompt = `
      You are a strict, role-aware AI navigation assistant for a multi-role (admin, teacher, student) educational web application.
      
      The current user has the role of: "${userRole}".

      This is the MOST IMPORTANT rule: You MUST ONLY suggest a route if its description indicates it is for the user's role ("${userRole}"). If a user asks for a page that does not belong to their role (e.g., a 'teacher' asks for 'Manage Teachers'), you MUST return an empty JSON object.

      Here is a complete list of all available pages. Analyze the "description" of each route to determine its role.
      ${JSON.stringify(routes, null, 2)}

      USER'S QUERY: "${query}"

      RULES:
      1.  **ROLE ENFORCEMENT IS MANDATORY.** First, filter the routes to only those matching the user's role: "${userRole}".
      2.  From that filtered list, find the single best matching route for the user's query.
      3.  Your output MUST be a JSON object with a single key: "route".
      4.  The value of "route" must be the exact "path" string from the matched route object.
      5.  If the query is ambiguous, doesn't match any of the user's allowed routes, or asks for a page outside their role, return an empty JSON object: {}.
      6.  ONLY return the JSON object, with no other text or markdown formatting.

      ROLE-BASED EXAMPLES:
      - User Role: "teacher", User Query: "show me my students"
        Expected Output: { "route": "/teacher/students" }
      - User Role: "teacher", User Query: "manage all students in the system"
        Expected Output: {} (This is an admin task)
      - User Role: "admin", User Query: "manage students"
        Expected Output: { "route": "/admin/students" }
      - User Role: "student", User Query: "teacher dashboard"
        Expected Output: {} (Student cannot access teacher dashboard)
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    try {
      const navigationObject = JSON.parse(
        text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim()
      );
      console.log(navigationObject)
      return NextResponse.json(navigationObject);
    } catch (e) {
      console.error("AI navigation returned malformed JSON:", text, e);
      return NextResponse.json({});
    }
  } catch (error) {
    console.error("AI navigation route error:", error);
    return NextResponse.json(
      { error: "Failed to process navigation command." },
      { status: 500 }
    );
  }
}
