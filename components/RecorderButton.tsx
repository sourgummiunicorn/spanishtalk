"use client";
import { useRef, useState } from "react";

interface Props {
  onRecorded: (blob: Blob) => void;
  disabled?: boolean;
}

export default function RecorderButton({ onRecorded, disabled = false }: Props) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((t) => t.stop());
        onRecorded(blob);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch {
      alert(
        "Microphone access denied. Please allow microphone access and try again."
      );
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  function handleClick() {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled && !recording}
      aria-label={recording ? "Stop recording" : "Start recording"}
      className={[
        "relative flex items-center justify-center w-20 h-20 rounded-full text-4xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2",
        recording
          ? "bg-red-600 text-white focus:ring-red-400 animate-pulse shadow-lg shadow-red-500/50"
          : disabled
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-md",
      ].join(" ")}
    >
      🎙️
      {recording && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full animate-ping" />
      )}
    </button>
  );
}
