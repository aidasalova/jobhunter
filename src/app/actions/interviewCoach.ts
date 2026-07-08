"use server";

import { generateObject, generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

function getModel(provider: string, apiKey: string) {
  switch (provider) {
    case "gemini":
      const google = createGoogleGenerativeAI({ apiKey });
      return google("gemini-2.5-flash");
    case "openai":
      const openai = createOpenAI({ apiKey });
      return openai("gpt-4o-mini");
    case "anthropic":
      const anthropic = createAnthropic({ apiKey });
      return anthropic("claude-3-5-haiku-latest");
    default:
      throw new Error("Unsupported AI Provider.");
  }
}

export async function generateQuestions(
  provider: string,
  apiKey: string,
  jobDescription: string,
  cv: string,
  roleTitle: string,
  companyName: string,
  masterProfile: string
) {
  if (!apiKey) throw new Error("API Key is required.");
  
  try {
    const model = getModel(provider, apiKey);
    
    const { object } = await generateObject({
      model,
      schema: z.object({
        strategicAdvice: z.string().describe("A 2-3 sentence overarching interview strategy. Analyze alignment between CV and JD. Highlight specific strengths to emphasize and potential gaps to defend."),
        questions: z.array(z.string()).length(10).describe("Exactly 10 highly relevant interview questions.")
      }),
      prompt: `You are an expert hiring manager and lead interviewer for the ${roleTitle} position at ${companyName}. 

Based on the Job Description and the candidate's CV below, generate an overall Interview Strategy and exactly 10 highly likely, challenging, and highly specific interview questions this candidate will face for this exact role.

### INTERVIEW STRATEGY
Analyze the alignment between the candidate's CV and the Job Description. Provide a 2-3 sentence overarching "Interview Strategy." Highlight which specific strengths the candidate should emphasize and which potential gaps or weaknesses they should be prepared to defend.

### QUESTION DISTRIBUTION
- 3 Behavioral/Leadership questions (focusing on past scenarios, conflict resolution, or stakeholder management).
- 5 Technical/Role-Specific questions (drilling into the exact skills required in the Job Description or probing the specific projects listed in the CV).
- 2 Strategic/Problem-Solving questions (testing how they would approach a real-world problem at ${companyName}).

### STRICT RULES
- DO NOT ask generic, surface-level questions like "What is your biggest weakness?"
- Frame the questions as if you are speaking directly to the candidate (e.g., "I see on your CV you used React for XYZ. Can you walk me through...").
- If the Job Description is missing, base the questions strictly on the skills, seniority level, and projects shown in the candidate's CV for a ${roleTitle}.

---

---

CANDIDATE'S MASTER PROFILE:
${masterProfile || "Not provided."}

CANDIDATE'S TAILORED CV:
${cv || "None provided for this specific application. Rely strictly on the Master Profile above to understand the candidate's background."}

JOB DESCRIPTION / CONTEXT:
${jobDescription || "Not provided. Base questions on standard expectations for a " + roleTitle + " and the candidate's background."}`
    });

    return { success: true, data: object };
  } catch (error: any) {
    console.error("Error generating questions:", error);
    return { success: false, error: error.message };
  }
}

export async function generateAnswer(
  provider: string,
  apiKey: string,
  jobDescription: string,
  cv: string,
  question: string,
  roleTitle: string,
  companyName: string
) {
  if (!apiKey) throw new Error("API Key is required.");

  try {
    const model = getModel(provider, apiKey);

    const { text } = await generateText({
      model,
      prompt: `You are an expert career coach for the ${roleTitle} position at ${companyName}.
The candidate is preparing for an interview. Help them answer the following question using the STAR method (Situation, Task, Action, Result).
Make the answer sound natural, professional, and directly draw from the provided CV and tailored for the Job Description.
Format your response cleanly in Markdown with bold headers for **Situation**, **Task**, **Action**, and **Result**.

Question: "${question}"

Job Description:
${jobDescription || "Not provided."}

Candidate's CV:
${cv || "Not provided."}
`
    });

    return { success: true, data: text };
  } catch (error: any) {
    console.error("Error generating answer:", error);
    return { success: false, error: error.message };
  }
}
