import { useEffect, useRef } from "react";

export default function MessageList({ messages = [], currentUser }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages.length) {
    return (
      <div className="h-[400px] flex items-center justify-center text-gray-400 bg-slate-900 rounded-lg">
        No messages yet
      </div>
    );
  }

  return (
    <div className="h-[400px] overflow-y-auto p-2 bg-slate-900 rounded-lg">
      {messages.map((msg) => {
        const isMine = msg.sender === currentUser;

        return (
          <div
            key={msg.id}
            className={`flex mb-2 ${
              isMine ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-[65%] break-words ${
                isMine
                  ? "bg-green-600 text-white"
                  : "bg-slate-700 text-white"
              }`}
            >
              {/* Sender name (only for received messages) */}
              {!isMine && msg.sender && (
                <div className="text-xs text-gray-300 mb-1">
                  {msg.sender}
                </div>
              )}

              {/* Message text (real DB field: text) */}
              <div>{msg.text}</div>

              {/* Timestamp */}
              {msg.created_at && (
                <div className="text-[10px] text-gray-300 mt-1 text-right">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}