"use server";

import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

const cvSchema = z.object({
  cv: z.string().describe("The tailored CV in Markdown format.")
});

const coverLetterSchema = z.object({
  coverLetter: z.string().describe("The tailored Cover Letter in Markdown format.")
});

function getModel(provider: string, apiKey: string) {
  if (!apiKey) {
    throw new Error("API Key is required. Please configure it in your Master Profile.");
  }
  switch (provider) {
    case "gemini":
      return createGoogleGenerativeAI({ apiKey })("gemini-2.5-flash");
    case "openai":
      return createOpenAI({ apiKey })("gpt-4o-mini");
    case "anthropic":
      return createAnthropic({ apiKey })("claude-3-5-haiku-latest");
    default:
      throw new Error("Unsupported AI Provider. Please select a valid provider in your Master Profile.");
  }
}

export async function generateCV(
  provider: string,
  apiKey: string,
  masterProfile: string,
  jobDescription: string,
  baseCV: string,
  roleTitle: string, 
  companyName: string,
  customFocus?: string
) {
  const model = getModel(provider, apiKey);

  let systemPrompt = `You are an expert career coach and professional resume writer specializing in the ${roleTitle} role. 

Your task is to analyze the user's background and craft a highly targeted CV for the ${roleTitle} position at ${companyName}.

### STRICT RULES & GUARDRAILS
1. ZERO HALLUCINATION: NEVER invent experience, skills, degrees, or metrics. Adhere strictly to the facts provided in the Master Profile and Base CV. If a metric is missing, do not guess it.
2. TONE: Adopt the user's preferred "Tone of Voice" specified in the Master Profile.
3. WEAKNESSES: The Master Profile may list weaknesses or gaps. Do NOT highlight these in the CV.
4. FORMAT: Output in clean Markdown.

### CV GUIDELINES
- Cross-reference the user's background with the Job Description. Naturally integrate exact keywords and phrases from the Job Description to optimize for ATS.
- If a Base CV is provided, use it as your structural baseline but aggressively tailor the bullet points to highlight relevance to the new role.
- Focus heavily on the "Strong Points" and "Core Skills" from the Master Profile.

### USER INSTRUCTIONS
${customFocus ? `The user has provided the following specific instructions for this generation:\n"${customFocus}"\n(Prioritize these instructions above general guidelines).` : "No custom instructions provided."}

---

### INPUT DATA

JOB DESCRIPTION:
${jobDescription}

MASTER PROFILE:
${masterProfile}

BASE CV DRAFT:
${baseCV || "None provided. Construct a new, highly tailored CV from the Master Profile."}`;

  if (customFocus && customFocus.trim() !== "") {
    systemPrompt += `\n\n**CRITICAL INSTRUCTION:** The user has provided the following specific custom instructions you MUST follow:\n${customFocus}`;
  }

  try {
    const { object } = await generateObject({
      model,
      schema: cvSchema,
      prompt: systemPrompt,
    });

    return { success: true, data: object };
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return { success: false, error: error.message || "An error occurred during generation." };
  }
}

export async function generateCoverLetter(
  provider: string,
  apiKey: string,
  masterProfile: string,
  jobDescription: string,
  baseCV: string,
  roleTitle: string, 
  companyName: string,
  customFocus?: string
) {
  const model = getModel(provider, apiKey);

  let systemPrompt = `You are an expert career coach and professional resume writer specializing in the ${roleTitle} role. 

Your task is to analyze the user's background and craft a highly targeted Cover Letter for the ${roleTitle} position at ${companyName}.

### STRICT RULES & GUARDRAILS
1. ZERO HALLUCINATION: NEVER invent experience, skills, degrees, or metrics. Adhere strictly to the facts provided in the Master Profile and Base CV.
2. TONE: Adopt the user's preferred "Tone of Voice" specified in the Master Profile.
3. WEAKNESSES: The Master Profile may list weaknesses or gaps. Do NOT highlight these in the Cover Letter.
4. FORMAT: Output in clean Markdown.

### COVER LETTER GUIDELINES
- Craft a compelling, modern cover letter addressed to ${companyName}.
- Tell a cohesive narrative connecting the user's background to the company's specific needs outlined in the Job Description.
- Focus heavily on the "Strong Points" and "Core Skills" from the Master Profile.

### USER INSTRUCTIONS
${customFocus ? `The user has provided the following specific instructions for this generation:\n"${customFocus}"\n(Prioritize these instructions above general guidelines).` : "No custom instructions provided."}

---

### INPUT DATA

JOB DESCRIPTION:
${jobDescription}

MASTER PROFILE:
${masterProfile}

BASE CV DRAFT:
${baseCV || "None provided."}`;

  if (customFocus && customFocus.trim() !== "") {
    systemPrompt += `\n\n**CRITICAL INSTRUCTION:** The user has provided the following specific custom instructions you MUST follow:\n${customFocus}`;
  }

  try {
    const { object } = await generateObject({
      model,
      schema: coverLetterSchema,
      prompt: systemPrompt,
    });

    return { success: true, data: object };
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return { success: false, error: error.message || "An error occurred during generation." };
  }
}
