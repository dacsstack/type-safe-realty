import axios from "axios";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Link, useNavigate } from "react-router-dom";
import HeroSlider from "../components/HeroSliderf";
import WhatsAppChat from "../components/WhatsAppChat";

export default function LandingPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [about, setAbout] = useState([]);
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    minPrice: "",
    maxPrice: "",
  });
  // ✅ scroll function HERE
  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const fetchFilteredProjects = async () => {
    const query = new URLSearchParams({
      location: filters.location || "",
      type: filters.type || "",
      minPrice: filters.minPrice || "",
      maxPrice: filters.maxPrice || "",
    }).toString();

    const response = await fetch(`http://localhost:5000/api/project?${query}`);

    const data = await response.json();

    // ✅ If empty result, reload all projects
    if (!data || data.length === 0) {
      const res = await axios.get("http://localhost:5000/api/project");
      setProjects(res.data);
    } else {
      setProjects(data);
    }
  };

  useEffect(() => {
    // fetch projects from backend (public)
    axios
      .get("http://localhost:5000/api/project")
      .then((res) => setProjects(res.data))
      .catch(console.error);

    axios
      .get("http://localhost:5000/api/about")
      .then((res) => setAbout(res.data))
      .catch(console.error);

    axios
      .get("http://localhost:5000/api/blog")
      .then((res) => setBlogs(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="font-['Roboto_Condensed']">
      {/* HEADER */}
      <header className="bg-black/30 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between p-4">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Fort Hub Realty" className="h-12" />
            <div>
              <h1 className="text-xl font-bold">FORT HUB REALTY</h1>
              <small className="text-gray-600 text-sm">
                Educate clients about the hot real estate deals
              </small>
            </div>
          </a>
          <nav>
            <ul className="flex gap-6">
              <li>
                <button
                  onClick={() => scrollToSection("home")}
                  className="font-medium"
                >
                  Home
                </button>
              </li>

              <li>
                <button
                  onClick={() => scrollToSection("blogs")}
                  className="font-medium"
                >
                  Blogs
                </button>
              </li>

              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="font-medium"
                >
                  About
                </button>
              </li>

              <li>
                <button
                  onClick={() => scrollToSection("projects")}
                  className="font-medium"
                >
                  Our Projects
                </button>
              </li>

              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="font-medium"
                >
                  Contact
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      {/* HERO SLIDER */}
      <HeroSlider scrollToSection={scrollToSection} />
      {/* <section className="py-16 bg-white">
        <div className="container mx-auto grid md:grid-cols-4 text-center gap-8">
          <div>
            <h2 className="text-4xl font-bold text-blue-600">150+</h2>
            <p className="text-gray-600">Properties Sold</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-blue-600">500+</h2>
            <p className="text-gray-600">Happy Clients</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-blue-600">10+</h2>
            <p className="text-gray-600">Accredited Developers</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-blue-600">8 Years</h2>
            <p className="text-gray-600">Industry Experience</p>
          </div>
        </div>
      </section> */}
      {/* PROJECTS */}

      <section id="projects" className="py-16 bg-transparent">
        <div className="container mx-auto">
          <div className="py-16 bg-transparent rounded-2xl shadow-lg mb-8 grid md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Location"
              className="bg-white/10 p-2 rounded backdrop-blur-xl border border-white/20"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Property Type"
              className="border p-2 rounded"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            />

            <input
              type="number"
              placeholder="Min Price"
              className="border p-2 rounded"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Max Price"
              className="border p-2 rounded"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
            />

            <button
              onClick={fetchFilteredProjects}
              className="bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>
          <h2 className="text-3xl font-bold mb-8">Our Accredited Projects</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full border border-white/30 text-white rounded-xl p-3 focus:outline-none">
            {Array.isArray(projects) &&
              projects.map((p) => {
                // SAFE convert PhotoFileName to array
                let photos = [];

                if (p.PhotoFileName) {
                  if (Array.isArray(p.PhotoFileName)) {
                    photos = p.PhotoFileName;
                  } else if (typeof p.PhotoFileName === "string") {
                    photos = p.PhotoFileName.split(",");
                  }
                }

                const firstPhoto =
                  photos.length > 0
                    ? `http://localhost:5000/Photos/${photos[0]}`
                    : "/dummy/thumb-1.jpg";

                return (
                  <div
                    key={p.ProjectId}
                    onClick={() => navigate(`/project/${p.ProjectId}`)}
                    className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                  >
                    <img
                      src={firstPhoto}
                      alt={p.ProjectName}
                      className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                    />

                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition"></div>

                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{p.ProjectName}</h3>
                      <p className="text-sm">{p.Developer}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
      {/* ABOUT / SERVICES */}
      <section id="about" className="py-16 bg-transparent">
        <div className="container mx-auto grid md:grid-cols-3 gap-8">
          {Array.isArray(about) &&
            about.map((p) => {
              // SAFE convert PhotoFileName to array
              let photos = [];

              if (p.PhotoFileName) {
                if (Array.isArray(p.PhotoFileName)) {
                  photos = p.PhotoFileName;
                } else if (typeof p.PhotoFileName === "string") {
                  photos = p.PhotoFileName.split(",");
                }
              }

              const firstPhoto =
                photos.length > 0
                  ? `http://localhost:5000/Photos/${photos[0]}`
                  : "/dummy/thumb-1.jpg";

              return (
                <div
                  key={p.AboutId}
                  onClick={() => navigate(`/about/${p.AboutId}`)}
                  className="py-16 bg-transparent p-6 rounded shadow"
                >
                  <h3 className="text-3xl text-white font-bold mb-4">
                    {p.Feature}
                  </h3>
                  <img
                    src={firstPhoto}
                    alt={p.Title}
                    className="w-full h-48 object-cover rounded"
                  />
                  <p className="text-gray-600 text-sm">{p.Title}</p>
                  <a href="#" className="mt-2 inline-block text-blue-600">
                    Read more
                  </a>
                </div>
              );
            })}
        </div>
      </section>
      {/* TESTIMONIALS + BLOGS */}
      <section id="blogs" className="py-16 bg-transparent">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-bold">Latest Insights</h2>

            <button
              onClick={() => navigate("/blogs")}
              className="text-blue-600 font-semibold hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {blogs.slice(0, 3).map((b) => (
              <div
                key={b.BlogId}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
              >
                {b.VideoUrl && (
                  <div className="aspect-video">
                    <ReactPlayer
                      url={b.VideoUrl}
                      width="100%"
                      height="100%"
                      controls
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="text-sm text-gray-400 mb-2">
                    {b.DateCreated}
                  </div>

                  <h3 className="text-lg font-bold mb-3 line-clamp-2">
                    {b.Title}
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-3">
                    {b.Description}
                  </p>

                  <button
                    onClick={() => navigate(`/blog/${b.BlogId}`)}
                    className="mt-4 text-blue-600 font-semibold hover:underline"
                  >
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CHAT WIDGET */}
      <WhatsAppChat />
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" className="h-12" />
              <div>
                <h2 className="text-white font-bold text-lg">
                  Fort Hub Realty
                </h2>
                <p className="text-sm text-gray-400">
                  Your trusted real estate partner
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-400">
              We help clients find the best real estate investment
              opportunities, condominiums, and properties in prime locations.
            </p>

            {/* SOCIAL */}
            <div className="flex gap-4 mt-4">
              <a className="hover:text-white transition">
                <i className="fa fa-facebook text-lg"></i>
              </a>
              <a className="hover:text-white transition">
                <i className="fa fa-instagram text-lg"></i>
              </a>
              <a className="hover:text-white transition">
                <i className="fa fa-twitter text-lg"></i>
              </a>
              <a className="hover:text-white transition">
                <i className="fa fa-youtube text-lg"></i>
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>

            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/home" className="hover:text-white transition">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/project" className="hover:text-white transition">
                  Projects
                </Link>
              </li>

              <li>
                <Link to="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>

              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* FEATURED PROJECTS */}
          <div>
            <h3 className="text-white font-semibold mb-4">Featured Projects</h3>

            <ul className="space-y-2 text-sm">
              <li className="hover:text-white transition cursor-pointer">
                BGC Taguig Condo
              </li>

              <li className="hover:text-white transition cursor-pointer">
                Makati Luxury Condo
              </li>

              <li className="hover:text-white transition cursor-pointer">
                Quezon City Residences
              </li>

              <li className="hover:text-white transition cursor-pointer">
                Cebu Beach Property
              </li>
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div id="contact">
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>

            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2">
                <i className="fa fa-map-marker"></i>
                Manila, Philippines
              </p>

              <p className="flex items-center gap-2">
                <i className="fa fa-phone"></i>
                +63 912 345 6789
              </p>

              <p className="flex items-center gap-2">
                <i className="fa fa-envelope"></i>
                info@forthubrealty.com
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="text-gray-400">
              © 2026 Fort Hub Realty. All rights reserved.
            </div>

            <div className="flex gap-6 mt-2 md:mt-0">
              <a className="hover:text-white transition">Privacy Policy</a>

              <a className="hover:text-white transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
