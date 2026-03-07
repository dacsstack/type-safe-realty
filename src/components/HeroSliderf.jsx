import { useEffect, useState } from "react";

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  // ✅ scroll function HERE
  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const [form, setForm] = useState({
    Name: "",
    Email: "",
    Contact: "",
    Message: "",
  });

  // ✅ FETCH banners from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/banner")
      .then((res) => res.json())
      .then((data) => setSlides(data))
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

  // ✅ SUBMIT FORM TO DATABASE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to send inquiry. Please try again.");
        return;
      }

      alert("Message sent successfully!");
      setForm({ Name: "", Email: "", Contact: "", Message: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to send inquiry. Please try again.");
    }
  };

  if (slides.length === 0) return null; // prevent errors while loading

  const slide = slides[current];
  const bgImage = slide.PhotoFileName
    ? `url(http://localhost:5000/Photos/${slide.PhotoFileName})`
    : `url(/dummy/placeholder.jpg)`;

  return (
    <section
      id="home"
      className="relative h-162.5 bg-cover bg-center transition-all duration-700"
      style={{ backgroundImage: bgImage }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          {/* LEFT SIDE TEXT */}
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              {slide.BannerName}
            </h1>
            <p className="text-lg opacity-90">{slide.BannerDetails}</p>
            {/* ✅ PROFESSIONAL CTA BUTTONS */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection("projects")}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
              >
                Explore Our Projects
              </button>

              <button
                onClick={() => scrollToSection("contact")}
                className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition shadow-lg"
              >
                Talk to an Agent
              </button>
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="bg-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/20">
            <h2 className="text-2xl font-bold mb-4 text-white">Write Us</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                required
                className="w-full border border-white/30 text-white rounded-xl p-3 bg-white/10 focus:outline-none focus:border-white transition"
                value={form.Name}
                onChange={(e) => setForm({ ...form, Name: e.target.value })}
              />

              <input
                type="email"
                placeholder="Email"
                required
                className="w-full border border-white/30 text-white rounded-xl p-3 bg-white/10 focus:outline-none focus:border-white transition"
                value={form.Email}
                onChange={(e) => setForm({ ...form, Email: e.target.value })}
              />

              <input
                type="text"
                placeholder="Contact Number"
                className="w-full border border-white/30 text-white rounded-xl p-3 bg-white/10 focus:outline-none focus:border-white transition"
                value={form.Contact}
                onChange={(e) => setForm({ ...form, Contact: e.target.value })}
              />

              <textarea
                placeholder="Your Message"
                required
                className="w-full border border-white/30 text-white rounded-xl p-3 bg-white/10 focus:outline-none focus:border-white transition"
                rows="4"
                value={form.Message}
                onChange={(e) => setForm({ ...form, Message: e.target.value })}
              />

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
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
