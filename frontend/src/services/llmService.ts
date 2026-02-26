const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY_STORAGE_KEY = "noventra_openrouter_api_key";

export function getStoredApiKey(): string {
  return localStorage.getItem(API_KEY_STORAGE_KEY) || "";
}

export function setStoredApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
}

export function clearStoredApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

export function hasApiKey(): boolean {
  const key = getStoredApiKey();
  return key.length > 10;
}

export interface LLMError {
  message: string;
  status?: number;
  isApiKeyError: boolean;
}

function mapErrorToMessage(status: number, body: string): LLMError {
  if (status === 401) {
    return {
      message: "Invalid API key. Please check your OpenRouter API key in Settings.",
      status,
      isApiKeyError: true,
    };
  }
  if (status === 403) {
    return {
      message: "Access denied. Your API key may not have permission for this model.",
      status,
      isApiKeyError: false,
    };
  }
  if (status === 429) {
    return {
      message: "Rate limit exceeded. Please wait a moment and try again.",
      status,
      isApiKeyError: false,
    };
  }
  if (status === 402) {
    return {
      message: "Insufficient credits on your OpenRouter account. Please top up at openrouter.ai.",
      status,
      isApiKeyError: false,
    };
  }
  if (status >= 500) {
    return {
      message: "The AI service is temporarily unavailable. Please try again in a moment.",
      status,
      isApiKeyError: false,
    };
  }
  return {
    message: `AI service error (${status}). Please try again.`,
    status,
    isApiKeyError: false,
  };
}

export function extractHtmlFromResponse(text: string): string {
  // Try ```html block first
  const htmlBlockMatch = text.match(/```html\s*([\s\S]*?)```/i);
  if (htmlBlockMatch) return htmlBlockMatch[1].trim();

  // Try full HTML document
  const doctypeMatch = text.match(/(<!DOCTYPE[\s\S]*?<\/html>)/i);
  if (doctypeMatch) return doctypeMatch[1].trim();

  // Try <html> tag
  const htmlTagMatch = text.match(/(<html[\s\S]*?<\/html>)/i);
  if (htmlTagMatch) return htmlTagMatch[1].trim();

  // Try any code block
  const codeBlockMatch = text.match(/```[\w]*\s*([\s\S]*?)```/);
  if (codeBlockMatch) return codeBlockMatch[1].trim();

  return text.trim();
}

export async function generateAIResponse(
  messages: Array<{ role: string; content: string }>,
  projectType: string,
  projectName: string
): Promise<string> {
  const apiKey = getStoredApiKey();

  if (!apiKey || apiKey.length < 10) {
    throw {
      message: "No API key configured. Please add your OpenRouter API key in Settings.",
      isApiKeyError: true,
    } as LLMError;
  }

  const systemPrompt = `You are an expert web developer and UI/UX designer. You create complete, beautiful, functional single-file HTML applications.

Project: "${projectName}" (Type: ${projectType})

RULES:
1. Always respond with a COMPLETE, self-contained HTML file
2. Include all CSS in <style> tags and all JavaScript in <script> tags
3. Make it visually stunning with modern design (gradients, animations, glassmorphism)
4. Use a dark theme by default with vibrant accent colors
5. Make it fully functional and interactive
6. Include proper error handling in the JavaScript
7. Wrap your HTML in \`\`\`html ... \`\`\` code blocks

For ${projectType} projects, focus on:
${projectType === "landing" ? "- Marketing copy, hero sections, feature highlights, CTAs, testimonials" : ""}
${projectType === "fullstack" ? "- Full CRUD interface, data management, forms, tables, modals" : ""}
${projectType === "mobile" ? "- Mobile-first design, touch-friendly UI, bottom navigation, card layouts" : ""}
${projectType === "api" ? "- API documentation, endpoint testing interface, request/response display" : ""}
${projectType === "dashboard" ? "- Charts, metrics, data visualization, sidebar navigation, KPI cards" : ""}
${projectType === "game" ? "- Game loop, canvas rendering, score tracking, controls, animations" : ""}`;

  const requestMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  let response: Response;
  try {
    response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Noventra.ai",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: requestMessages,
        max_tokens: 8192,
        temperature: 0.7,
      }),
    });
  } catch (networkError) {
    throw {
      message: "Network error. Please check your internet connection and try again.",
      isApiKeyError: false,
    } as LLMError;
  }

  if (!response.ok) {
    let body = "";
    try {
      body = await response.text();
    } catch {}
    throw mapErrorToMessage(response.status, body);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw {
      message: "The AI returned an empty response. Please try again.",
      isApiKeyError: false,
    } as LLMError;
  }

  return extractHtmlFromResponse(content);
}
