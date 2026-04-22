import { useEffect, useRef } from "react";

export default function MessageList({ messages, currentUser }) {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No messages yet
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-2 bg-slate-900 rounded-lg">
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
              className={`px-3 py-2 rounded-lg max-w-[60%] ${
                isMine
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-white"
              }`}
            >
              {!isMine && (
                <div className="text-xs text-gray-300 mb-1">
                  {msg.sender}
                </div>
              )}

              {/* MESSAGE */}
              <div>{msg.text}</div>

              {/* TIME + STATUS */}
              <div className="flex justify-end gap-2 text-[10px] text-gray-400 mt-1">
                <span>
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {isMine && <span>{msg.status || "sent"}</span>}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}