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

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState<number>(0);

  const [form, setForm] = useState<InquiryForm>({
    Name: "",
    Email: "",
    Contact: "",
    Message: "",
  });

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  // ✅ FETCH banners
  useEffect(() => {
    fetch("https://forthubapi-backend-production.up.railway.app/api/banner")
      .then((res) => res.json())
      .then((data: Slide[]) => setSlides(data))
      .catch((err) => console.error("Banner fetch error:", err));
  }, []);

  // ✅ AUTO SLIDER
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides]);

  // ✅ SUBMIT FORM
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://forthubapi-backend-production.up.railway.app/api/inquiry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to send inquiry.");
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
  };

  if (slides.length === 0) return null;

  const slide = slides[current];

  const bgImage = slide.PhotoFileName
    ? `url(https://forthubapi-backend-production.up.railway.app/Photos/${slide.PhotoFileName})`
    : `url(https://forthubapi-backend-production.up.railway.app/dummy/placeholder.jpg)`;

  return (
    <section
      id="home"
      className="relative h-162.5 bg-cover bg-center transition-all duration-700 transform hover:scale-105"
      style={{
        backgroundImage: `url(${slide.PhotoFileName ? `https://forthubapi-backend-production.up.railway.app/Photos/${slide.PhotoFileName}` : "https://forthubapi-backend-production.up.railway.app/dummy/placeholder.jpg"})`,
      }}
    >
      {/* Dark overlay */}
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
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transform transition duration-300 shadow-lg hover:scale-105"
              >
                Explore Our Projects
              </button>

              <button
                onClick={() =>
                  window.dispatchEvent(new Event("openWhatsAppChat"))
                }
                className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transform transition duration-300 shadow-lg hover:scale-105"
              >
                Talk to an Agent
              </button>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="bg-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/20 transition-transform duration-300 transform hover:scale-105">
            <h2 className="text-2xl font-bold mb-4 text-white">Write Us</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {["Name", "Email", "Contact"].map((field) => (
                <input
                  key={field}
                  type={field === "Email" ? "email" : "text"}
                  placeholder={
                    field === "Contact" ? "Contact Number" : `Your ${field}`
                  }
                  required={field !== "Contact" ? true : false}
                  value={form[field as keyof InquiryForm]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value } as any)
                  }
                  className="w-full border border-white/30 text-white rounded-xl p-3 bg-white/10 
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/20 
                         hover:bg-white/20 transition duration-300"
                />
              ))}

              <textarea
                placeholder="Your Message"
                required
                rows={4}
                value={form.Message}
                onChange={(e) => setForm({ ...form, Message: e.target.value })}
                className="w-full border border-white/30 text-white rounded-xl p-3 bg-white/10 
                       focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/20 
                       hover:bg-white/20 transition duration-300"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold 
                       transform transition duration-300 hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
