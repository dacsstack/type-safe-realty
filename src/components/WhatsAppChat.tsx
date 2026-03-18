import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  type: "user" | "agent";
  text: string;
}

export default function WhatsAppChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { type: "agent", text: "Hi! How can we help you today?" },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const phone = "639770682561"; // WhatsApp number
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Listen for external HeroSlider button click
  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener("openWhatsAppChat", openChat);
    return () => window.removeEventListener("openWhatsAppChat", openChat);
  }, []);

  // Auto scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Simulate agent typing indicator for first few seconds
  useEffect(() => {
    if (!open) return;
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), 1500);
    return () => clearTimeout(timer);
  }, [open]);

  const sendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { type: "user", text: input }]);

    // Prepare WhatsApp text (all messages)
    const allText = [...messages, { type: "user", text: input }]
      .map((msg) => msg.text)
      .join("\n");

    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
      allText,
    )}`;

    // Open WhatsApp in new tab
    window.open(url, "_blank", "noopener,noreferrer");

    setInput(""); // Clear input but keep popup open
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-full shadow-xl z-50 transition"
      >
        WhatsApp
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-20 right-4 w-11/12 max-w-xs md:w-80 bg-white shadow-2xl rounded-2xl z-50 border flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center bg-green-500 text-white p-3 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white overflow-hidden">
                {/* Agent avatar placeholder */}
                <img
                  src="/agent.png"
                  alt="Agent"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold">Fort Hub Realty</span>
            </div>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto h-64 space-y-2 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-xl max-w-[75%] break-word ${
                    msg.type === "user"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <span className="bg-gray-200 p-2 rounded-xl animate-pulse">
                  Agent is typing...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button
              onClick={sendMessage}
              className="bg-green-500 text-white px-4 py-2 rounded-xl"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
