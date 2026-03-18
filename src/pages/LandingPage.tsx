import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { variables } from "../Variables";
import HeroSlider from "../components/HeroSlider";
import WhatsAppChat from "../components/WhatsAppChat";

interface FilterState {
  location: string;
  type: string;
  minPrice: string;
  maxPrice: string;
}

interface ProjectData {
  ProjectId: number;
  ProjectName: string;
  Developer: string;
  PropertyDetails: string;
  PhotoFileName: string | string[];
  [key: string]: any;
}

interface AboutData {
  AboutId: number;
  Title: string;
  Feature: string;
  PhotoFileName: string | string[];
  [key: string]: any;
}

interface BlogData {
  BlogId: number;
  Title: string;
  Description: string;
  Image: string;
  VideoUrl?: string;
  CreatedAt: string;
  [key: string]: any;
}

const LandingPage: FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [about, setAbout] = useState<AboutData[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    location: "",
    type: "",
    minPrice: "",
    maxPrice: "",
  });

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchFilteredProjects = async (
    overrideFilters: Partial<FilterState> = {},
  ) => {
    try {
      const currentFilters = { ...filters, ...overrideFilters };

      const queryObj: Record<string, string> = {};
      if (currentFilters.location) queryObj.location = currentFilters.location;
      if (currentFilters.type) queryObj.type = currentFilters.type;
      if (currentFilters.minPrice) queryObj.minPrice = currentFilters.minPrice;
      if (currentFilters.maxPrice) queryObj.maxPrice = currentFilters.maxPrice;

      const query = new URLSearchParams(queryObj).toString();
      const url = `${variables.API_URL}project${query ? "?" + query : ""}`;

      const res = await axios.get<ProjectData[]>(url);

      if (res.data && res.data.length > 0) {
        setProjects(res.data);
        scrollToSection("projects");
      } else {
        // If no results, fetch all projects
        const allRes = await axios.get<ProjectData[]>(
          variables.API_URL + "project",
        );
        setProjects(allRes.data);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const handleFeaturedClick = (locationName: string) => {
    fetchFilteredProjects({ location: locationName });
    setFilters((prev) => ({ ...prev, location: locationName }));
  };

  useEffect(() => {
    // Fetch all data on component mount
    axios
      .get<ProjectData[]>(variables.API_URL + "project")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Error fetching projects:", err));

    axios
      .get<AboutData[]>(variables.API_URL + "about")
      .then((res) => setAbout(res.data))
      .catch((err) => console.error("Error fetching about:", err));

    axios
      .get<BlogData[]>(variables.API_URL + "blogs")
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error("Error fetching blogs:", err));
  }, []);

  const getPhotoUrl = (photoFileName: string | string[]): string => {
    if (!photoFileName) return "/dummy/thumb-1.jpg";

    let photos: string[] = [];
    if (typeof photoFileName === "string") {
      photos = photoFileName.split(",");
    } else if (Array.isArray(photoFileName)) {
      photos = photoFileName;
    }

    const firstPhoto = photos.length > 0 ? photos[0] : null;
    return firstPhoto
      ? `${variables.PHOTO_URL}${firstPhoto}`
      : "/dummy/thumb-1.jpg";
  };

  return (
    <div className="font-['Roboto_Condensed']">
      {/* HEADER */}
      <header className="bg-gray-600 shadow-md sticky top-0 z-50 opacity-90">
        <div className="container mx-auto flex items-center justify-between p-4">
          {/* LOGO */}
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Fort Hub Realty" className="h-12" />
            <div>
              <h1 className="text-xl font-bold text-yellow-400">
                FORT HUB REALTY
              </h1>
              <small className="text-white text-sm">
                Educate clients about the hot real estate deals
              </small>
            </div>
          </a>

          {/* DESKTOP MENU */}
          <nav className="hidden md:block">
            <ul className="flex gap-6 text-white">
              <li>
                <button
                  onClick={() => scrollToSection("home")}
                  className="font-medium hover:text-yellow-300 transition"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("blogs")}
                  className="font-medium hover:text-yellow-300 transition"
                >
                  Blogs
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="font-medium hover:text-yellow-300 transition"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("projects")}
                  className="font-medium hover:text-yellow-300 transition"
                >
                  Our Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="font-medium hover:text-yellow-300 transition"
                >
                  Contact
                </button>
              </li>
            </ul>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden bg-gray-700 text-white flex flex-col items-center gap-4 py-4">
            <button
              onClick={() => {
                scrollToSection("home");
                setMenuOpen(false);
              }}
              className="hover:text-yellow-300"
            >
              Home
            </button>
            <button
              onClick={() => {
                scrollToSection("blogs");
                setMenuOpen(false);
              }}
              className="hover:text-yellow-300"
            >
              Blogs
            </button>
            <button
              onClick={() => {
                scrollToSection("about");
                setMenuOpen(false);
              }}
              className="hover:text-yellow-300"
            >
              About
            </button>
            <button
              onClick={() => {
                scrollToSection("projects");
                setMenuOpen(false);
              }}
              className="hover:text-yellow-300"
            >
              Our Projects
            </button>
            <button
              onClick={() => {
                scrollToSection("contact");
                setMenuOpen(false);
              }}
              className="hover:text-yellow-300"
            >
              Contact
            </button>
          </div>
        )}
      </header>

      {/* HERO SLIDER */}
      <HeroSlider scrollToSection={scrollToSection} />

      {/* PROJECTS SECTION */}
      <section id="projects" className="py-16 bg-black/50 opacity-90">
        <div className="container mx-auto">
          {/* FILTER BAR */}
          <div className="bg-black/50 p-6 rounded-2xl shadow-lg mb-8 grid md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Location"
              className="bg-gray-600 p-2 rounded text-white placeholder:text-gray-400 transform transition duration-300 hover:scale-105 hover:bg-gray-500 focus:scale-105 focus:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Property Type"
              className="bg-gray-600 p-2 rounded text-white placeholder:text-gray-400 transform transition duration-300 hover:scale-105 hover:bg-gray-500 focus:scale-105 focus:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            />
            <input
              type="number"
              placeholder="Min Price"
              className="bg-gray-600 p-2 rounded text-white placeholder:text-gray-400 transform transition duration-300 hover:scale-105 hover:bg-gray-500 focus:scale-105 focus:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Max Price"
              className="bg-gray-600 p-2 rounded text-white placeholder:text-gray-400 transform transition duration-300 hover:scale-105 hover:bg-gray-500 focus:scale-105 focus:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
            />
            <button
              onClick={() => fetchFilteredProjects()}
              className="bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transform transition duration-300 hover:scale-105"
            >
              Search
            </button>
          </div>

          <h2 className="text-3xl font-bold mb-8 text-white">
            Our Accredited Projects
          </h2>

          {/* PROJECTS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full border border-black/30 text-blue-200 rounded-xl p-3 bg-white/30 focus:outline-none focus:border-blue-500 transition">
            {projects.length === 0 ? (
              <div className="col-span-full text-center py-10 text-white text-xl">
                No Available Project
              </div>
            ) : (
              projects.map((p) => (
                <div
                  key={p.ProjectId}
                  onClick={() => navigate(`/project/${p.ProjectId}`)}
                  className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition"
                >
                  <img
                    src={getPhotoUrl(p.PhotoFileName)}
                    alt={p.ProjectName}
                    className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{p.ProjectName}</h3>
                    <p className="text-sm">{p.Developer}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ABOUT / SERVICES SECTION */}
      <section id="about" className="py-16">
        <div className="container mx-auto grid md:grid-cols-3 gap-8">
          {about.map((item) => (
            <div
              key={item.AboutId}
              onClick={() => navigate(`/about/${item.AboutId}`)}
              className="group relative bg-black/50 rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
            >
              {/* IMAGE */}
              <img
                src={getPhotoUrl(item.PhotoFileName)}
                alt={item.Title}
                className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-105"
              />

              {/* HOVER OVERLAY */}
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>

              {/* CONTENT */}
              <div className="p-6 relative z-10">
                <h3 className="text-3xl font-bold mb-4 text-white">
                  {item.Feature}
                </h3>
                <p className="text-white text-sm">{item.Title}</p>
                <a
                  href="#"
                  className="mt-2 inline-block text-blue-200 font-semibold hover:underline"
                >
                  Read more
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BLOGS SECTION */}
      <section id="blogs" className="py-20 bg-black/50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-white">Latest Blogs</h2>
            {!showAllBlogs && (
              <button
                onClick={() => setShowAllBlogs(true)}
                className="text-blue-400 font-semibold hover:underline"
              >
                View All →
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {(showAllBlogs ? blogs : blogs.slice(0, 3)).map((b) => (
              <div
                key={b.BlogId}
                className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
              >
                {/* IMAGE / VIDEO */}
                {b.VideoUrl ? (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${b.VideoUrl.split("v=")[1]}/hqdefault.jpg`}
                      alt={b.Title}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <img
                    src={`${variables.UPLOADS_URL}${b.Image}`}
                    alt={b.Title}
                    className="w-full h-52 object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                {/* HOVER OVERLAY */}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>

                {/* CONTENT */}
                <div className="p-6 relative z-10">
                  <p className="text-gray-400 text-sm mb-2">
                    {new Date(b.CreatedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="text-lg text-gray-400 font-bold mb-3">
                    {b.Title}
                  </h3>
                  <p className="text-gray-200 text-sm line-clamp-3">
                    {b.Description}
                  </p>
                  <button
                    onClick={() => navigate(`/blogs/${b.BlogId}`)}
                    className="mt-4 text-blue-200 font-semibold hover:underline"
                  >
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Show Less button */}
          {showAllBlogs && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAllBlogs(false)}
                className="text-blue-400 font-semibold hover:underline"
              >
                Show Less ↑
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CHAT WIDGET */}
      <WhatsAppChat />

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 opacity-80">
        <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" className="h-12" alt="Logo" />
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
              <a href="#" className="hover:text-white transition">
                <i className="fa fa-facebook text-lg"></i>
              </a>
              <a href="#" className="hover:text-white transition">
                <i className="fa fa-instagram text-lg"></i>
              </a>
              <a href="#" className="hover:text-white transition">
                <i className="fa fa-twitter text-lg"></i>
              </a>
              <a href="#" className="hover:text-white transition">
                <i className="fa fa-youtube text-lg"></i>
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => scrollToSection("home")}
                  className="hover:text-white transition cursor-pointer bg-transparent border-0 p-0"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("projects")}
                  className="hover:text-white transition cursor-pointer bg-transparent border-0 p-0"
                >
                  Our Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="hover:text-white transition cursor-pointer bg-transparent border-0 p-0"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="hover:text-white transition cursor-pointer bg-transparent border-0 p-0"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* FEATURED PROJECTS */}
          <div>
            <h3 className="text-white font-semibold mb-4">Featured Projects</h3>
            <ul className="space-y-2 text-sm">
              <li
                className="hover:text-white transition cursor-pointer"
                onClick={() => handleFeaturedClick("Taguig")}
              >
                BGC Taguig Condo
              </li>
              <li
                className="hover:text-white transition cursor-pointer"
                onClick={() => handleFeaturedClick("Makati")}
              >
                Makati Luxury Condo
              </li>
              <li
                className="hover:text-white transition cursor-pointer"
                onClick={() => handleFeaturedClick("Quezon City")}
              >
                Quezon City Residences
              </li>
              <li
                className="hover:text-white transition cursor-pointer"
                onClick={() => handleFeaturedClick("Cebu")}
              >
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
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
