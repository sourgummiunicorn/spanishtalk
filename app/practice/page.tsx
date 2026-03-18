"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ConversationTimeline from "@/components/ConversationTimeline";
import RecorderButton from "@/components/RecorderButton";
import type { ChatMessage } from "@/lib/chat";

interface Turn {
  id: string;
  userText: string;
  replyText: string;
  rewrite: string;
  corrections: string[];
  suggestions: string[];
}

export default function PracticePage() {
  const router = useRouter();
  const [name, setName] = useState("Estudiante");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("spanishtalk_name");
    if (!saved) {
      router.replace("/");
    } else {
      setName(saved);
    }
  }, [router]);

  const processUserInput = useCallback(
    async (userText: string) => {
      if (!userText.trim() || processing) return;
      setProcessing(true);
      setError(null);

      try {
        // 1. Send to chat API
        const chatRes = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, messages, text: userText }),
        });
        if (!chatRes.ok) throw new Error("Chat API error");
        const chatData = await chatRes.json();

        // 2. Fetch TTS audio
        let audioUrl: string | null = null;
        try {
          const ttsRes = await fetch("/api/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: chatData.replyText }),
          });
          if (ttsRes.ok) {
            const blob = await ttsRes.blob();
            if (blob.size > 0) {
              audioUrl = URL.createObjectURL(blob);
            }
          }
        } catch {
          // TTS failure is non-fatal — demo mode returns empty buffer
        }

        // 3. Play TTS audio if available
        if (audioUrl) {
          const audio = new Audio(audioUrl);
          audio.play().catch(() => {
            // Autoplay may be blocked by the browser — ignore silently
          });
        }

        // 4. Update conversation history for next turn
        const updatedMessages: ChatMessage[] = [
          ...messages,
          { role: "user", content: userText },
          { role: "assistant", content: chatData.replyText },
        ];
        setMessages(updatedMessages);

        // 5. Add turn to UI
        const newTurn: Turn = {
          id: crypto.randomUUID(),
          userText,
          replyText: chatData.replyText,
          rewrite: chatData.rewrite,
          corrections: chatData.corrections ?? [],
          suggestions: chatData.suggestions ?? [],
        };
        setTurns((prev) => [...prev, newTurn]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong. Please try again."
        );
      } finally {
        setProcessing(false);
      }
    },
    [name, messages, processing]
  );

  async function handleRecorded(blob: Blob) {
    setProcessing(true);
    setError(null);

    let userText = "";
    try {
      const formData = new FormData();
      formData.append("audio", blob, "audio.webm");
      const asrRes = await fetch("/api/asr", {
        method: "POST",
        body: formData,
      });
      if (!asrRes.ok) throw new Error("ASR API error");
      const asrData = await asrRes.json();
      userText = asrData.text ?? "";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not transcribe audio."
      );
      setProcessing(false);
      return;
    }

    // processUserInput will set processing=false when done
    await processUserInput(userText);
  }

  function handleSuggestion(text: string) {
    processUserInput(text);
  }

  function handleChangeName() {
    localStorage.removeItem("spanishtalk_name");
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={handleChangeName}
          className="text-gray-400 hover:text-white text-sm transition-colors duration-150 flex items-center gap-1"
          aria-label="Go back and change name"
        >
          ← Change name
        </button>
        <div className="text-center">
          <h1 className="text-white font-bold text-lg leading-none">
            SpanishTalk
          </h1>
          <p className="text-gray-400 text-xs mt-0.5">
            ¡Hola, {name}! Estamos en una cafetería.
          </p>
        </div>
        <div className="w-24" aria-hidden="true" />
      </header>

      {/* Scenario banner */}
      <div className="bg-amber-900/30 border-b border-amber-800/40 px-4 py-2 text-center">
        <p className="text-amber-300 text-xs font-medium">
          🍵 En una cafetería — Scenario: You&apos;re ordering at a café in Spain. Talk to Carlos!
        </p>
      </div>

      {/* Conversation timeline */}
      <ConversationTimeline turns={turns} onSuggestion={handleSuggestion} />

      {/* Error message */}
      {error && (
        <div className="mx-4 mb-2 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm text-center">
          {error}
        </div>
      )}

      {/* Bottom bar */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-5 flex flex-col items-center gap-2">
        {processing && (
          <p className="text-gray-400 text-sm animate-pulse">
            Carlos is thinking…
          </p>
        )}
        <RecorderButton onRecorded={handleRecorded} disabled={processing} />
        <p className="text-gray-600 text-xs">
          {processing ? "Processing…" : "Tap to speak"}
        </p>
      </div>
    </div>
  );
}
