import { Link } from "react-router-dom";
import WhatsAppChat from "../components/WhatsAppChat";

export default function Layout({ children }) {
  // ✅ scroll function HERE
  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };
  return (
    <div className="flex flex-col min-h-screen font-['Roboto_Condensed']">
      {/* HEADER */}
      <header className="bg-gray-600 shadow-md sticky top-0 z-50 opacity-80">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Fort Hub Realty" className="h-12" />

            <div>
              <h1 className="text-xl font-bold text-yellow-400">
                FORT HUB REALTY
              </h1>

              <small className="text-white text-sm">
                Educate clients about the hot real estate deals
              </small>
            </div>
          </Link>

          <nav>
            <ul className="flex gap-6 text-white">
              <li>
                <Link to="/" className="font-medium">
                  Home
                </Link>
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
                <Link to="/" className="font-medium">
                  About
                </Link>
              </li>

              <li>
                <Link to="/" className="font-medium">
                  Our Projects
                </Link>
              </li>

              <li>
                <Link to="/" className="font-medium">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* CONTENT — grows to push footer down */}
      <main className="grow">{children}</main>

      <footer className="bg-gray-900 text-gray-300 opacity-80">
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
          <div>
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

      {/* FLOATING CHAT */}
      <WhatsAppChat />
    </div>
  );
}
