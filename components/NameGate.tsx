"use client";
import { useState, useEffect } from "react";

interface Props {
  onStart: (name: string) => void;
}

export default function NameGate({ onStart }: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("spanishtalk_name");
    if (saved) setName(saved);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem("spanishtalk_name", trimmed);
    onStart(trimmed);
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">
        <div className="text-5xl mb-4">🇪🇸</div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
          SpanishTalk
        </h1>
        <p className="text-gray-500 text-lg mb-8">
          Practice Spain Spanish with AI
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-left">
            <label
              htmlFor="name-input"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Your name
            </label>
            <input
              id="name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. María"
              autoComplete="given-name"
              autoFocus
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              aria-label="Enter your name to start"
            />
          </div>
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-150"
          >
            ¡Empezamos! →
          </button>
        </form>
        <p className="text-gray-400 text-xs mt-6">
          No account required · Demo mode works without API keys
        </p>
      </div>
    </div>
  );
}
