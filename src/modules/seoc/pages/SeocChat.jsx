import { useEffect, useState } from "react";
import { supabase } from "/src/lib/supabase";

import MessageList from "../components/Chat/MessageList";
import MessageInput from "../components/Chat/MessageInput";

export default function SeocChat() {
  const [messages, setMessages] = useState([]);
  const [targets, setTargets] = useState({
    districts: [],
    central: [],
  });
  const [target, setTarget] = useState(null);

  const sender = "SEOC";

  useEffect(() => {
    fetchTargets();
  }, []);

  useEffect(() => {
    if (!target) return;

    fetchMessages();

    const channel = supabase
      .channel("chat-seoc")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new;

          const isRelevant =
            (msg.sender === sender && msg.receiver === target) ||
            (msg.sender === target && msg.receiver === sender);

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
  }, [target]);

  // ✅ FIXED: Separate District & Central
  const fetchTargets = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("sender, receiver");

    if (error) {
      console.error(error);
      return;
    }

    const districts = new Set();
    const central = new Set();

    data.forEach((msg) => {
      const people = [msg.sender, msg.receiver];

      people.forEach((p) => {
        if (p === "SEOC") return;

        if (p === "MHA") {
          central.add(p); // ✅ central
        } else {
          districts.add(p); // ✅ district
        }
      });
    });

    const districtList = Array.from(districts);
    const centralList = Array.from(central);

    setTargets({
      districts: districtList,
      central: centralList,
    });

    // default selection
    if (districtList.length > 0) {
      setTarget(districtList[0]);
    } else if (centralList.length > 0) {
      setTarget(centralList[0]);
    }
  };

  // 📥 FETCH + SEEN UPDATE
  const fetchMessages = async () => {
    if (!target) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender.eq.SEOC,receiver.eq.${target}),and(sender.eq.${target},receiver.eq.SEOC)`
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
    } else {
      setMessages(data || []);
    }

    // ✅ mark as seen
    await supabase
      .from("messages")
      .update({ status: "seen" })
      .eq("receiver", sender)
      .eq("sender", target)
      .eq("status", "sent");
  };

  // 📤 SEND
  const sendMessage = async (text) => {
    if (!text.trim() || !target) return;

    const { error } = await supabase.from("messages").insert({
      sender,
      receiver: target,
      text,
      status: "sent",
    });

    if (error) {
      console.error(error);
    } else {
      fetchMessages();
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white">

      {/* LEFT PANEL */}
      <div className="w-[220px] border-r border-slate-700 p-3 bg-slate-800">

        {/* DISTRICTS */}
        <h3 className="mb-2 text-sm text-gray-300">Districts</h3>
        {targets.districts.map((t) => (
          <div
            key={t}
            onClick={() => setTarget(t)}
            className={`p-2 rounded cursor-pointer mb-1 ${
              target === t ? "bg-blue-600" : "hover:bg-slate-700"
            }`}
          >
            {t}
          </div>
        ))}

        {/* CENTRAL */}
        {targets.central.length > 0 && (
          <>
            <h3 className="mt-4 mb-2 text-sm text-gray-300">Central</h3>
            {targets.central.map((t) => (
              <div
                key={t}
                onClick={() => setTarget(t)}
                className={`p-2 rounded cursor-pointer mb-1 ${
                  target === t ? "bg-green-600" : "hover:bg-slate-700"
                }`}
              >
                {t}
              </div>
            ))}
          </>
        )}
      </div>

      {/* RIGHT CHAT AREA */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="p-4 border-b border-slate-700 bg-slate-800 shadow-glow">
          <h2 className="text-lg font-semibold">
            Chat with {target || "Select"}
          </h2>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-hidden p-4">
          <MessageList messages={messages} currentUser={sender} />
        </div>

        {/* INPUT */}
        <div className="p-3 border-t border-slate-700 bg-slate-800">
          <MessageInput onSend={sendMessage} />
        </div>
      </div>
    </div>
  );
}