
import { GoogleGenAI, Type } from "@google/genai";
import { Fragment } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyze a new thought and find connections, tags, and category.
 */
export async function analyzeNewFragment(newFragment: Fragment, existingFragments: Fragment[]) {
  const context = existingFragments.length > 0 
    ? existingFragments.map(f => `[ID: ${f.id}] ${f.text}`).join('\n')
    : "No existing fragments.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a semantic analysis engine for a thought-mapping tool.
Identify conceptual, thematic, or structural connections, tags, and a high-level category.

NEW FRAGMENT:
${newFragment.text}

EXISTING FRAGMENTS:
${context}

Return metadata for the new fragment and the 3 strongest connections.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "One word category (e.g., Philosophy, Science, Art, Personal)." },
            tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-5 descriptive tags." },
            connections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  targetId: { type: Type.STRING, description: "The ID of the fragment to connect to." },
                  strength: { type: Type.NUMBER, description: "Confidence score 0.0-1.0." },
                  label: { type: Type.STRING, description: "1-2 word label." }
                },
                required: ["targetId", "strength", "label"]
              }
            }
          },
          required: ["category", "tags", "connections"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (err) {
    console.error("Gemini analysis failed:", err);
    return { category: "Unsorted", tags: [], connections: [] };
  }
}

/**
 * Generate a symbolic image for a thought.
 */
export async function generateThoughtImage(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `Create a minimalist, ethereal, scholarly, symbolic illustration for the following thought. 
          Use a dark charcoal and gold color palette. Style: Ink and wash with glowing elements.
          Thought: "${text}"` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (err) {
    console.error("Image generation failed:", err);
    return null;
  }
}

/**
 * Ask a question across the entire Codex (Semantic search/synthesis)
 */
export async function searchCodex(query: string, fragments: Fragment[]) {
  const context = fragments.map(f => f.text).join('\n---\n');
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on the following collection of thoughts, answer the question: "${query}"

THOUGHTS:
${context}`,
    config: {
        systemInstruction: "You are the librarian of a person's inner thoughts. Be brief, poetic, and insightful."
    }
  });

  return response.text;
}
