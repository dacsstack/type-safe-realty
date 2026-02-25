import { useEffect, useState } from "react";

const slides = [
  {
    image: "/images/slide-1.jpg",
    title: "Find Your Dream Property",
    subtitle: "Trusted Real Estate Experts",
  },
  {
    image: "/images/slide-2.jpg",
    title: "Prime Investment Locations",
    subtitle: "Best Deals in Metro Manila",
  },
  {
    image: "/images/slide-3.jpg",
    title: "Luxury & Affordable Homes",
    subtitle: "Your Property Partner",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Data:", form);

    // 🔥 OPTIONAL: connect to backend API
    // fetch("/api/inquiry", { method: "POST", body: JSON.stringify(form) })

    alert("Message sent successfully!");
    setForm({ name: "", email: "", contact: "", message: "" });
  };

  return (
    <section
      className="relative h-162.5 bg-cover bg-center transition-all duration-700"
      style={{ backgroundImage: `url(${slides[current].image})` }}
    >
      <div className="bg-black/70 h-full flex items-center">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          {/* LEFT SIDE TEXT */}
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              {slides[current].title}
            </h1>
            <p className="text-lg opacity-90">{slides[current].subtitle}</p>
          </div>

          {/* RIGHT SIDE CONTACT FORM */}
          <div className="bg-white p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Write Us</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                required
                className="w-full border rounded-lg p-3"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                type="email"
                placeholder="Email"
                required
                className="w-full border rounded-lg p-3"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input
                type="text"
                placeholder="Contact Number"
                className="w-full border rounded-lg p-3"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
              />

              <textarea
                placeholder="Your Message"
                required
                className="w-full border rounded-lg p-3"
                rows="4"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
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
