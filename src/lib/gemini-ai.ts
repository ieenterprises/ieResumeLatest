import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with your API key
const API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY ||
  "AIzaSyAu5JeCcIBfArFaBgZhCETiM_r0XsnID2I";
const genAI = new GoogleGenerativeAI(API_KEY);

// Get the generative model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function generateAIContent(prompt: string): Promise<string> {
  try {
    console.log("Generating content with prompt:", prompt);

    // Add safety settings to avoid content being blocked
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    };

    const safetySettings = [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ];

    // Use a more professional prompt that's less likely to be flagged
    const safePrompt = `Please create professional content for a resume or cover letter: ${prompt}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: safePrompt }] }],
      generationConfig,
      safetySettings,
    });

    const response = await result.response;
    const text = response.text();
    console.log("Generated content:", text);
    return text;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    // Return a fallback response instead of throwing an error
    return "I'm unable to generate content at the moment. Please try writing your own professional content or try again later.";
  }
}

export async function generateResumeSummary(
  experience: string,
  skills: string,
): Promise<string> {
  const prompt = `Write a professional summary for a resume with the following experience and skills:\n\nExperience: ${experience}\nSkills: ${skills}\n\nThe summary should be concise (3-4 sentences), professional, and highlight key strengths. Format with HTML for bold and bullet points where appropriate.`;

  return generateAIContent(prompt);
}

export async function generateJobDescription(
  position: string,
  company: string,
  responsibilities: string,
): Promise<string> {
  const prompt = `Write a professional job description for a resume with the following details:\n\nPosition: ${position}\nCompany: ${company}\nResponsibilities/Achievements: ${responsibilities}\n\nThe description should be concise, achievement-focused, and use strong action verbs. Format with HTML for bullet points.`;

  return generateAIContent(prompt);
}

export async function generateCustomSectionContent(
  sectionTitle: string,
  context: string,
): Promise<string> {
  const prompt = `Write content for a "${sectionTitle}" section in a resume with the following context:\n\n${context}\n\nThe content should be professional and relevant to the section title. Format with HTML for bullet points where appropriate.`;

  return generateAIContent(prompt);
}

export async function generateCoverLetterIntroduction(
  position: string,
  company: string,
  experience: string,
): Promise<string> {
  const prompt = `Write a professional introduction paragraph for a cover letter with the following details:\n\nPosition applying for: ${position}\nCompany: ${company}\nRelevant experience: ${experience}\n\nThe introduction should express interest in the position and briefly mention why the candidate is a good fit. Keep it to 3-4 sentences.`;

  return generateAIContent(prompt);
}

export async function generateCoverLetterBody(
  position: string,
  skills: string,
  achievements: string,
): Promise<string> {
  const prompt = `Write the body paragraphs for a cover letter for a ${position} position. Include these skills: ${skills} and these achievements: ${achievements}.\n\nThe body should highlight relevant skills and experience, with specific examples that demonstrate qualifications for the role. Format with HTML for emphasis where appropriate.`;

  return generateAIContent(prompt);
}

export async function generateCoverLetterConclusion(
  company: string,
  position: string,
): Promise<string> {
  const prompt = `Write a conclusion paragraph for a cover letter applying to ${company} for a ${position} position.\n\nThe conclusion should express enthusiasm for the opportunity, mention interest in an interview, and thank the reader for their consideration. Keep it to 2-3 sentences.`;

  return generateAIContent(prompt);
}
