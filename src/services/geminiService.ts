import { GoogleGenAI, Type } from "@google/genai";
import { FileNode } from "../types";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY! 
});

const MODEL_NAME = "gemini-3.1-pro-preview";

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const getCodeCompletion = async (
  prefix: string,
  suffix: string,
  fileName: string,
  language: string,
  contextFiles: FileNode[]
) => {
  const context = contextFiles
    .filter(f => f.name !== fileName)
    .map(f => `File: ${f.name}\nLanguage: ${f.language}\nContent:\n${f.content}`)
    .join('\n\n---\n\n');

  const prompt = ` You are an expert AI code autocomplete engine.
Your task is to provide the code that goes between the prefix and the suffix.
Only output the code completion itself. Do not include markdown code blocks, explanations, or the prefix/suffix.

CONTEXT FILES:
${context}

TARGET FILE: ${fileName}
LANGUAGE: ${language}

PREFIX:
${prefix}

SUFFIX:
${suffix}

COMPLETION:`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.1,
        topP: 0.1,
      }
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("AI Completion Error:", error);
    return "";
  }
};

export const chatWithAI = async (
  messages: ChatMessage[],
  currentFile: FileNode | null,
  allFiles: FileNode[]
) => {
  const context = allFiles
    .map(f => `File: ${f.name}\nLanguage: ${f.language}\nContent:\n${f.content}`)
    .join('\n\n---\n\n');

  const systemInstruction = `You are CodeFlow Assistant, an expert AI coding companion for mobile developers.
You assist users with writing, debugging, and explaining code.
You have access to the following project context:

${context}

Currently viewing: ${currentFile?.name || 'Nothing'}

Guidance:
1. Be concise but helpful.
2. When providing code, use markdown blocks with the correct language.
3. Suggest improvements or bug fixes based on the context.
4. If asked to modify a file, explain the changes clearly.
`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      })),
      config: {
        systemInstruction,
      }
    });

    return response.text || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("AI Chat Error:", error);
    return "An error occurred while communicating with the AI.";
  }
};
