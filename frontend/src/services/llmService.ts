const OPENROUTER_API_KEY = "sk-or-v1-b6e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5";

export type ProjectType = "landing" | "dashboard" | "mobile" | "fullstack" | "api";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

function getSystemPrompt(projectType: ProjectType): string {
  const baseInstructions = `You are Noventra AI, an expert web developer and UI/UX designer. 
You generate complete, beautiful, production-ready HTML/CSS/JS applications.

CRITICAL RULES:
1. ALWAYS wrap your complete HTML output in a markdown code block: \`\`\`html ... \`\`\`
2. The HTML must be a complete document with <!DOCTYPE html>, <html>, <head>, and <body> tags
3. Use inline CSS and vanilla JavaScript only (no external dependencies except CDN links)
4. Make the design visually stunning with modern aesthetics
5. Include all functionality requested by the user
6. After the code block, provide a brief explanation of what you built`;

  const projectInstructions: Record<ProjectType, string> = {
    landing: `${baseInstructions}

PROJECT TYPE: Landing Page
- Create beautiful marketing landing pages
- Include hero section, features, testimonials, CTA
- Use modern gradients, animations, and typography
- Make it fully responsive`,

    dashboard: `${baseInstructions}

PROJECT TYPE: Dashboard/Admin Panel
- Create data-rich dashboard interfaces
- Include charts (use Chart.js from CDN), stats cards, tables
- Use a professional dark or light theme
- Include sidebar navigation`,

    mobile: `${baseInstructions}

PROJECT TYPE: Mobile App UI
- Create mobile-first UI that looks like a native app
- Use max-width: 390px centered layout
- Include bottom navigation, cards, and mobile patterns
- Add touch-friendly interactions`,

    fullstack: `${baseInstructions}

PROJECT TYPE: Full-Stack Web App
- Create a complete web application with full functionality
- Include forms, data management, CRUD operations
- Use localStorage for data persistence
- Include proper routing simulation`,

    api: `${baseInstructions}

PROJECT TYPE: API Explorer / Tool
- Create developer tools and API explorers
- Include code editors, JSON viewers, request builders
- Use monospace fonts and developer-friendly UI
- Include syntax highlighting`,
  };

  return projectInstructions[projectType] || baseInstructions;
}

function getModificationPrompt(): string {
  return `You are Noventra AI, an expert web developer. You are modifying an existing HTML application.

CRITICAL RULES:
1. ALWAYS return the COMPLETE modified HTML document wrapped in: \`\`\`html ... \`\`\`
2. Apply the requested changes while preserving all existing functionality
3. The output must be a complete, working HTML document
4. After the code block, briefly describe what you changed`;
}

export async function generateAIResponse(
  userMessage: string,
  projectType: ProjectType,
  conversationHistory: Message[],
  existingHtml?: string
): Promise<string> {
  const isModification = !!existingHtml && existingHtml.trim().length > 0;

  const systemPrompt = isModification ? getModificationPrompt() : getSystemPrompt(projectType);

  const messages: Message[] = [
    { role: "system", content: systemPrompt },
  ];

  // Add conversation history (excluding system messages)
  for (const msg of conversationHistory) {
    if (msg.role !== "system") {
      messages.push(msg);
    }
  }

  // If modifying, include the existing HTML as context
  if (isModification && existingHtml) {
    messages.push({
      role: "user",
      content: `Here is the current HTML application:\n\`\`\`html\n${existingHtml}\n\`\`\`\n\nNow apply this change: ${userMessage}`,
    });
  } else {
    messages.push({ role: "user", content: userMessage });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "Noventra AI",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages,
        temperature: 0.7,
        max_tokens: 16000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API error ${response.status}: ${errorData?.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in API response");
    }

    return content;
  } catch (error) {
    console.error("LLM API error:", error);
    throw error;
  }
}

export function extractHtmlFromResponse(response: string): string {
  // Try to match ```html ... ``` blocks (with optional language specifier)
  const htmlBlockRegex = /```html\s*\n([\s\S]*?)```/i;
  const match = response.match(htmlBlockRegex);

  if (match && match[1]) {
    const extracted = match[1].trim();
    if (extracted.length > 0) {
      return extracted;
    }
  }

  // Fallback: try to find a complete HTML document directly in the response
  const doctypeRegex = /(<!DOCTYPE html[\s\S]*<\/html>)/i;
  const doctypeMatch = response.match(doctypeRegex);
  if (doctypeMatch && doctypeMatch[1]) {
    return doctypeMatch[1].trim();
  }

  // Fallback: look for <html> ... </html>
  const htmlTagRegex = /(<html[\s\S]*<\/html>)/i;
  const htmlTagMatch = response.match(htmlTagRegex);
  if (htmlTagMatch && htmlTagMatch[1]) {
    return htmlTagMatch[1].trim();
  }

  return "";
}
