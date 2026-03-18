"use client";
import { useEffect, useRef } from "react";

interface Turn {
  id: string;
  userText: string;
  replyText: string;
  rewrite: string;
  corrections: string[];
  suggestions: string[];
}

interface Props {
  turns: Turn[];
  onSuggestion: (text: string) => void;
}

export default function ConversationTimeline({ turns, onSuggestion }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns]);

  if (turns.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-center px-6">
        <div>
          <div className="text-5xl mb-3">🎙️</div>
          <p className="text-lg font-medium">Start speaking to begin your practice session</p>
          <p className="text-sm mt-1">Press the mic button below to record</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
      {turns.map((turn) => (
        <div key={turn.id} className="space-y-3">
          {/* User bubble — right-aligned */}
          <div className="flex justify-end">
            <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[75%] shadow">
              <p className="text-sm">{turn.userText}</p>
            </div>
          </div>

          {/* Assistant bubble — left-aligned */}
          <div className="flex justify-start">
            <div className="space-y-2 max-w-[80%]">
              <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-3 shadow">
                <p className="text-sm font-medium">🤖 Carlos</p>
                <p className="text-sm mt-1">{turn.replyText}</p>
              </div>

              {/* Native rewrite */}
              {turn.rewrite && (
                <div className="px-4 py-2 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                    Native rewrite:
                  </p>
                  <p className="text-sm italic text-green-700">{turn.rewrite}</p>
                </div>
              )}

              {/* Corrections */}
              {turn.corrections.length > 0 && (
                <div className="px-4 py-2 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                    Corrections:
                  </p>
                  <ul className="space-y-1">
                    {turn.corrections.map((c, i) => (
                      <li key={i} className="text-sm text-yellow-800">
                        ⚠️ {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {turn.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {turn.suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => onSuggestion(s)}
                      className="text-xs bg-white border border-gray-300 text-gray-700 rounded-full px-3 py-1.5 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition-colors duration-150 shadow-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
