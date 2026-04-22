import { useEffect, useState } from "react";
import { supabase } from "/src/lib/supabase";

import MessageList from "../components/Chat/MessageList";
import MessageInput from "../components/Chat/MessageInput";

export default function AuthoritiesChat() {
  const [messages, setMessages] = useState([]);

  const sender = localStorage.getItem("district");
  const receiver = "SEOC";

  useEffect(() => {
    if (!sender) return;

    fetchMessages();

    const channel = supabase
      .channel("chat-dm")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new;

          const isRelevant =
            (msg.sender === sender && msg.receiver === receiver) ||
            (msg.sender === receiver && msg.receiver === sender);

          if (isRelevant) {
            setMessages((prev) => {
              const exists = prev.find((m) => m.id === msg.id);
              if (exists) return prev;
              return [...prev, msg];
            });
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [sender]);

  // ✅ FETCH + SEEN UPDATE
  const fetchMessages = async () => {
    if (!sender) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender.eq.${sender},receiver.eq.SEOC),and(sender.eq.SEOC,receiver.eq.${sender})`
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Fetch error:", error.message);
    } else {
      setMessages(data || []);
    }

    // ✅ mark messages as seen
    await supabase
      .from("messages")
      .update({ status: "seen" })
      .eq("receiver", sender)
      .eq("status", "sent");
  };

  // ✅ SEND MESSAGE WITH STATUS
  const sendMessage = async (text) => {
    if (!text.trim() || !sender) return;

    const { error } = await supabase.from("messages").insert({
      sender,
      receiver,
      text,
      status: "sent", // 👈 NEW
    });

    if (error) {
      console.error("Send error:", error.message);
    } else {
      fetchMessages();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white">

      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-slate-800 shadow-glow">
        <h2 className="text-lg font-semibold">
          Chat with SEOC ({sender})
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden p-4">
        <MessageList messages={messages} currentUser={sender} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-700 bg-slate-800">
        <MessageInput onSend={sendMessage} />
      </div>

    </div>
  );
}