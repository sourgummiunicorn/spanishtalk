# SpanishTalk

A voice-first Spain Spanish (es-ES) conversation practice web app for absolute beginners.

## Quick Start (no account, no login, no API key needed)

```bash
npm install
npm run dev
```

Then open **http://localhost:3000** in your browser.

**You do not need an OpenAI account.** The app runs in **demo mode** by default — enter your name, tap the mic button, and walk through the full conversation flow with pre-written mock responses. No sign-up, no login, no birthday prompt, no credit card.

> **Requirements:** Node.js 18+ and npm.

### Do I need to log in to OpenAI?

**No — not to try the app.** Demo mode uses hard-coded mock responses and works entirely offline (no API calls).

You only need an OpenAI account if you want **real** AI responses (live speech recognition, GPT-4o-mini replies, and text-to-speech audio). In that case you would go to [platform.openai.com](https://platform.openai.com) to create an account and generate an API key — OpenAI does ask for age verification (birthday) as part of account sign-up. But this is completely optional and only needed for the paid/live AI features. See [Setup](#setup) below.

## Features
- 🎙️ Voice-first conversation with an AI partner (Carlos)
- 🇪🇸 Spain Spanish (distinción, vosotros) at A0/A1 level
- 📝 Instant transcript + native rewrite + corrections
- 💡 Quick reply suggestions
- 🔇 Demo mode — works without API keys

## Setup

### Option A — Demo mode (no account required)

Just run `npm install && npm run dev`. No configuration needed. The app detects that no API key is set and falls back to demo mode automatically.

### Option B — Real AI (OpenAI account required)

> ⚠️ OpenAI's sign-up flow asks for your birthday as part of age verification. This is only needed if you want live AI features. Demo mode works without any account.

1. Create an account at [platform.openai.com](https://platform.openai.com) and generate an API key.
2. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```
3. Open `.env.local` and paste your key:
   ```
   OPENAI_API_KEY=sk-...
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```

`.env.local` variables:
| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key for ASR (Whisper), chat (GPT-4o-mini), TTS |
| `APP_MODE` | Set to `demo` to force mock responses even when a key is present |

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
