import { FormEvent, useEffect, useState } from "react";

interface Slide {
  BannerName: string;
  BannerDetails: string;
  PhotoFileName: string;
}

interface InquiryForm {
  Name: string;
  Email: string;
  Contact: string;
  Message: string;
}

interface HeroSliderProps {
  scrollToSection: (section: string) => void;
}

export default function HeroSlider({ scrollToSection }: HeroSliderProps) {
  const API = "https://forthubapi-backend-production.up.railway.app/api";
  const PHOTO_URL =
    "https://forthubapi-backend-production.up.railway.app/Photos";

  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<InquiryForm>({
    Name: "",
    Email: "",
    Contact: "",
    Message: "",
  });

  // FETCH BANNERS
  useEffect(() => {
    fetch(`${API}/banner`)
      .then((res) => res.json())
      .then((data) => setSlides(data))
      .catch((err) => console.error("Banner fetch error:", err));
  }, []);

  // AUTO SLIDER
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides]);

  // SUBMIT INQUIRY
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API}/inquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to send inquiry.");
        setLoading(false);
        return;
      }

      alert("Message sent successfully!");

      setForm({
        Name: "",
        Email: "",
        Contact: "",
        Message: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to send inquiry.");
    }

    setLoading(false);
  };

  // LOADING SCREEN
  if (slides.length === 0) {
    return (
      <div className="h-[650px] flex items-center justify-center bg-black text-white">
        Loading banners...
      </div>
    );
  }

  const slide = slides[current];

  const bgImage = slide.PhotoFileName
    ? `${PHOTO_URL}/${slide.PhotoFileName}`
    : "/dummy/placeholder.jpg";

  return (
    <section
      id="home"
      className="relative h-[650px] bg-cover bg-center transition-opacity duration-1000"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          {/* LEFT TEXT */}
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              {slide.BannerName}
            </h1>

            <p className="text-lg opacity-90 mb-6">{slide.BannerDetails}</p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection("projects")}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition transform hover:scale-105 shadow-lg"
              >
                Explore Our Projects
              </button>

              <button
                onClick={() =>
                  window.dispatchEvent(new Event("openWhatsAppChat"))
                }
                className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition transform hover:scale-105 shadow-lg"
              >
                Talk to an Agent
              </button>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="bg-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/20">
            <h2 className="text-2xl font-bold mb-4 text-white">Write Us</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                required
                value={form.Name}
                onChange={(e) => setForm({ ...form, Name: e.target.value })}
                className="w-full border border-white/30 text-white rounded-xl p-3 bg-white/10 
                focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <input
                type="email"
                placeholder="Your Email"
                required
                value={form.Email}
                onChange={(e) => setForm({ ...form, Email: e.target.value })}
                className="w-full border border-white/30 text-white rounded-xl p-3 bg-white/10 
                focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <input
                type="text"
                placeholder="Contact Number"
                value={form.Contact}
                onChange={(e) => setForm({ ...form, Contact: e.target.value })}
                className="w-full border border-white/30 text-white rounded-xl p-3 bg-white/10 
                focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <textarea
                placeholder="Your Message"
                required
                rows={4}
                value={form.Message}
                onChange={(e) => setForm({ ...form, Message: e.target.value })}
                className="w-full border border-white/30 text-white rounded-xl p-3 bg-white/10 
                focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
