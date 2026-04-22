import { useState } from "react";

export default function MessageInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    onSend(trimmed); // sends to DB via parent
    setInput("");
  };

  return (
    <div className="flex gap-2 mt-2">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 p-2 rounded-md bg-slate-800 text-white outline-none"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
      />

      <button
        onClick={handleSend}
        className="bg-green-600 px-4 rounded-md text-white"
      >
        Send
      </button>
    </div>
  );
}