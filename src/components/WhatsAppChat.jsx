import { useState } from "react";

export default function WhatsAppChat() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const phone = "639770682561"; // no + sign, no spaces

  const sendMessage = () => {
    if (!name || !message) {
      alert("Please fill all fields");
      return;
    }

    const phone = "639770682561";
    const text = `Hello, I'm ${name}. ${message}`;

    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;

    // safer open method
    window.open(url, "_blank", "noopener,noreferrer");

    // optional reset
    setName("");
    setMessage("");
    setOpen(false);
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
        <div className="fixed bottom-20 right-6 bg-white p-6 rounded-2xl shadow-2xl w-80 z-50 border">
          <h3 className="font-bold mb-3 text-lg text-gray-800">
            Fort Hub Realty
          </h3>

          <input
            type="text"
            placeholder="Your name"
            className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            placeholder="Message..."
            className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            onClick={sendMessage}
            className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded-lg font-semibold transition"
          >
            Send via WhatsApp
          </button>
        </div>
      )}
    </>
  );
}
