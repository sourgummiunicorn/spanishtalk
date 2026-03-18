# SpanishTalk

A voice-first Spain Spanish (es-ES) conversation practice web app for absolute beginners.

## Quick Start (no API key needed)

```bash
npm install
npm run dev
```

Then open **http://localhost:3000** in your browser.

That's it — the app runs in **demo mode** by default, so you can click through the full flow (name entry → mic recording → AI reply) without any API keys. When you're ready to use real AI, see [Setup](#setup) below.

> **Requirements:** Node.js 18+ and npm.

## Features
- 🎙️ Voice-first conversation with an AI partner (Carlos)
- 🇪🇸 Spain Spanish (distinción, vosotros) at A0/A1 level
- 📝 Instant transcript + native rewrite + corrections
- 💡 Quick reply suggestions
- 🔇 Demo mode — works without API keys

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy the example and fill in your keys:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key for ASR (Whisper), chat (GPT-4o-mini), TTS |
| `APP_MODE` | Set to `demo` to use mock responses without keys |

### 3. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## ASR / TTS / Chat configuration

All AI providers are abstracted in `lib/`:
- `lib/asr.ts` — speech-to-text (Whisper by default)
- `lib/chat.ts` — conversation AI (GPT-4o-mini by default)
- `lib/tts.ts` — text-to-speech (OpenAI TTS by default)

### TTS voice selection
The TTS implementation uses OpenAI's `onyx` voice (male) with the Spanish text. The `onyx` voice produces a natural male reading of Spanish text. To switch providers, replace `lib/tts.ts`.

**Male Spain Spanish voice**: OpenAI `onyx` at speed `0.9` works well for learner-friendly male `es-ES` output.

### Browser ASR alternative
You can also switch `lib/asr.ts` to use the Web Speech API (browser-native) to avoid server costs. See comments in `lib/asr.ts`.

## Mic permissions
The app will prompt for microphone access when you first click the record button. On Chrome/Firefox, you must allow access. On Safari, ensure mic permissions are granted in System Preferences → Security & Privacy.

If you see "Microphone access denied", reload the page and click "Allow" in the browser prompt.

## Demo mode
Without `OPENAI_API_KEY`, the app runs in demo mode:
- ASR returns a canned Spanish phrase
- Chat returns a mocked conversation turn
- TTS returns silence (no audio plays)

This lets you test the full UI flow without any API keys.

## Scenarios
Currently seeded: **En una cafetería** (In a café). The AI partner Carlos guides you through ordering at a café in Spain.

To add scenarios, extend the system prompt in `lib/chat.ts`.

## Deploy
Deploy to Vercel:
```bash
npx vercel
```
Set `OPENAI_API_KEY` in Vercel environment variables.
