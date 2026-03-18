import OpenAI from "openai";

const isDemoMode =
  process.env.APP_MODE === "demo" || !process.env.OPENAI_API_KEY;

/**
 * Transcribes audio using OpenAI Whisper.
 * In demo mode (APP_MODE=demo or no OPENAI_API_KEY), returns a canned Spanish phrase.
 *
 * To swap to browser Web Speech API instead, replace this function with a
 * client-side SpeechRecognition implementation.
 */
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  if (isDemoMode) {
    return "Quiero un café con leche, por favor.";
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const arrayBuffer = await audioBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const file = new File([buffer], "audio.webm", { type: audioBlob.type || "audio/webm" });

  const response = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
    language: "es",
  });

  return response.text;
}
