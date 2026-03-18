import { NextRequest, NextResponse } from "next/server";
import { generateReply, ChatMessage } from "@/lib/chat";

export async function POST(req: NextRequest) {
  const { name, messages, text } = await req.json();
  const result = await generateReply(
    name || "Estudiante",
    (messages as ChatMessage[]) || [],
    text || ""
  );
  return NextResponse.json(result);
}
