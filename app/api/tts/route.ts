import { NextRequest, NextResponse } from "next/server";
import { synthesizeSpeech } from "@/lib/tts";

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  if (!text) return NextResponse.json({ error: "No text" }, { status: 400 });
  const audio = await synthesizeSpeech(text);
  return new NextResponse(audio.length > 0 ? audio.buffer as ArrayBuffer : new ArrayBuffer(0), {
    headers: { "Content-Type": "audio/mpeg" },
  });
}
