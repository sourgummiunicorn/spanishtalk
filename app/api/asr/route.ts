import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/asr";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("audio") as Blob;
  if (!file) return NextResponse.json({ error: "No audio" }, { status: 400 });
  const text = await transcribeAudio(file);
  return NextResponse.json({ text });
}
