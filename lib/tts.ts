import OpenAI from "openai";

const isDemoMode =
  process.env.APP_MODE === "demo" || !process.env.OPENAI_API_KEY;

/**
 * Synthesizes speech from text using OpenAI TTS.
 * Voice: "onyx" (male) at speed 0.9 — slightly slower for learner clarity.
 * The "onyx" voice produces a natural male reading of Spanish text.
 *
 * In demo mode, returns an empty Buffer (audio simply won't play — handled gracefully).
 *
 * To swap providers (e.g. Azure TTS for native es-ES), replace this function.
 */
export async function synthesizeSpeech(text: string): Promise<Buffer> {
  if (isDemoMode) {
    return Buffer.alloc(0);
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "onyx",
    input: text,
    speed: 0.9,
  });

  const arrayBuffer = await mp3.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
