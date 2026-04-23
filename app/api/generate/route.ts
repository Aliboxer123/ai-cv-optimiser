import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { cv, jobDescription } = await req.json();

    if (!cv || !jobDescription) {
      return NextResponse.json(
        { error: "Missing cv or jobDescription" },
        { status: 400 }
      );
    }

    const cvSafe = cv.slice(0, 4000);
    const jobSafe = jobDescription.slice(0, 3000);

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `
You are a CV optimisation engine.

Return ONLY valid JSON. No markdown. No commentary.

CRITICAL RULES:
- "result" must be a clean rewritten CV only (NO analysis inside it)
- "score" MUST always be a number between 0 and 100
- Never return partial JSON

Return EXACT structure:

{
  "result": string,
  "score": number,
  "strengths": string,
  "gaps": string,
  "missingKeywords": string[],
  "atsFeedback": string
}
          `.trim(),
        },
        {
          role: "user",
          content: `
CV:
${cvSafe}

JOB:
${jobSafe}
          `.trim(),
        },
      ],
    });

    const content = response.choices[0]?.message?.content || "";

    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");

    if (start === -1 || end === -1) {
      return NextResponse.json(
        { error: "Invalid JSON response" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(content.slice(start, end + 1));

    return NextResponse.json({
      result: parsed.result ?? "",
      score: typeof parsed.score === "number" ? parsed.score : 0,
      strengths: parsed.strengths ?? "",
      gaps: parsed.gaps ?? "",
      missingKeywords: parsed.missingKeywords ?? [],
      atsFeedback: parsed.atsFeedback ?? "",
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}