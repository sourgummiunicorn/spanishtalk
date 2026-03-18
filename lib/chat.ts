import OpenAI from "openai";

const isDemoMode =
  process.env.APP_MODE === "demo" || !process.env.OPENAI_API_KEY;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  replyText: string;
  rewrite: string;
  corrections: string[];
  suggestions: string[];
}

const MOCK_RESPONSE: ChatResponse = {
  replyText:
    "¡Buenos días! ¿Qué le pongo? Tenemos café solo, café con leche y cortado.",
  rewrite: "Quiero un café con leche, por favor.",
  corrections: [
    "Great job! 'por favor' is exactly the right polite phrase to use.",
    "Remember: in Spain, 'un café con leche' is a standard morning order.",
  ],
  suggestions: [
    "¿Cuánto cuesta?",
    "Un cortado, por favor.",
    "¿Tiene también tostadas?",
  ],
};

/**
 * Generates a conversation reply, rewrite, corrections, and suggestions.
 * Uses GPT-4o-mini with a Spain Spanish persona in demo mode.
 *
 * To swap providers, replace the OpenAI call below with your preferred LLM.
 */
export async function generateReply(
  name: string,
  messages: ChatMessage[],
  userText: string
): Promise<ChatResponse> {
  if (isDemoMode) {
    return MOCK_RESPONSE;
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const systemPrompt = `Eres un asistente de conversación en español de España para principiantes absolutos (nivel A0/A1). Tu nombre es Carlos. Estás ayudando a ${name} a practicar español en el escenario 'En una cafetería'. Responde siempre en español de España (usa distinción: c/z = /θ/, usa vosotros cuando sea apropiado). Sé amable y conciso (1–2 frases). Si el usuario está muy perdido, puedes dar una pequeña ayuda en inglés. Devuelve SIEMPRE un objeto JSON con estos campos exactos: replyText (tu respuesta en español), rewrite (versión más natural de lo que dijo el usuario, en español de España), corrections (array de hasta 2 correcciones para principiantes, en inglés), suggestions (array de exactamente 3 frases cortas en español que el usuario podría decir a continuación).`;

  const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userText },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: chatMessages,
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as Partial<ChatResponse>;

  return {
    replyText: parsed.replyText ?? "",
    rewrite: parsed.rewrite ?? "",
    corrections: Array.isArray(parsed.corrections) ? parsed.corrections : [],
    suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
  };
}
