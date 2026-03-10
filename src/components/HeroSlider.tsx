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

  // SUBMIT FORM
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

  if (slides.length === 0) return null;

  const slide = slides[current];

  const bgImage = slide.PhotoFileName
    ? `${PHOTO_URL}/${slide.PhotoFileName}`
    : "/dummy/placeholder.jpg";

  return (
    <section id="home" className="relative h-162.5 overflow-hidden">
      {/* BACKGROUND SLIDER */}
      {slides.map((slide, index) => {
        const bgImage = slide.PhotoFileName
          ? `${PHOTO_URL}/${slide.PhotoFileName}`
          : "/dummy/placeholder.jpg";

        return (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        );
      })}

      {/* CONTENT (NOT PART OF SLIDER) */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          {/* TEXT */}
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              {slides[current]?.BannerName}
            </h1>

            <p className="text-lg opacity-90 mb-6">
              {slides[current]?.BannerDetails}
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection("projects")}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Explore Our Projects
              </button>

              <button
                onClick={() =>
                  window.dispatchEvent(new Event("openWhatsAppChat"))
                }
                className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Talk to an Agent
              </button>
            </div>
          </div>

          {/* FORM */}
          <div className="relative group flex items-center">
            {/* AGENT */}
            <img
              src="/agent.png"
              alt="Agent"
              className="absolute -left-20 bottom-0 w-40
          opacity-0 translate-x-10
          group-hover:opacity-100 group-hover:translate-x-0
          transition-all duration-700"
            />

            {/* CONTACT FORM */}
            <div
              className="bg-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-xl
          border border-white/20 transition-transform duration-300
          group-hover:translate-x-3"
            >
              <h2 className="text-2xl font-bold mb-4 text-white">Write Us</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                ...
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
