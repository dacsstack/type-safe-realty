import { useEffect, useState } from "react";

const testimonials = [
  { name: "Jessica Watson", message: "Very professional real estate service!" },
  { name: "Michael Cruz", message: "Got my condo investment fast and smooth." },
  { name: "Andrea Lim", message: "Highly recommended broker!" },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-8">Testimonials</h2>
        <div className="bg-white p-8 rounded-xl shadow-md max-w-xl mx-auto">
          <p className="italic mb-4">"{testimonials[index].message}"</p>
          <h4 className="font-semibold">- {testimonials[index].name}</h4>
        </div>
      </div>
    </section>
  );
}
