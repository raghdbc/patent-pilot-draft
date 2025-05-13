/**
 * Groq API Service
 * 
 * Handles communication with the Groq API for AI-powered drafting assistance.
 */

const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Interface for chat message
 */
interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Interface for Groq API response
 */
interface GroqResponse {
  id: string;
  choices: {
    message: ChatMessage;
    finish_reason: string;
  }[];
}

/**
 * Sends a request to Groq API for patent drafting assistance
 * @param messages Array of chat messages
 * @returns The AI's response
 */
export async function generateDraftingResponse(messages: ChatMessage[]): Promise<string> {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: "You are a patent drafting assistant. Help users draft patent applications by providing clear, technical, and legally sound responses. Focus on accuracy and proper patent terminology. Format your response in a clear, structured manner with appropriate headings and sections."
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 32768,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.statusText}. Details: ${errorText}`);
    }

    const data: GroqResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Groq API:", error);
    throw error;
  }
}

/**
 * Generates a patent claim based on the provided description
 * @param description Technical description of the invention
 * @returns Generated patent claim
 */
export async function generatePatentClaim(description: string): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: "user",
      content: `Please help me draft a patent claim based on the following description. Format the claim in proper patent claim format with numbered claims and proper legal terminology:\n\n${description}`
    }
  ];

  return generateDraftingResponse(messages);
}

/**
 * Generates a patent specification section based on the provided description
 * @param description Technical description of the invention
 * @param section The section to generate (e.g., "background", "summary", "detailed description")
 * @returns Generated patent specification section
 */
export async function generateSpecificationSection(
  description: string,
  section: "background" | "summary" | "detailed_description"
): Promise<string> {
  const sectionPrompts = {
    background: "Please help me draft the background section of a patent specification. Include the field of invention, problem statement, and prior art discussion.",
    summary: "Please help me draft the summary section of a patent specification. Include the purpose, main features, and advantages of the invention.",
    detailed_description: "Please help me draft the detailed description section of a patent specification. Include structure, operation, implementation details, and alternative embodiments."
  };

  const messages: ChatMessage[] = [
    {
      role: "user",
      content: `${sectionPrompts[section]} based on the following description:\n\n${description}`
    }
  ];

  return generateDraftingResponse(messages);
} 