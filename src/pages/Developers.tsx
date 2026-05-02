import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { variables } from "../Variables";
import Layout from "../layouts/Layout";

interface DeveloperData {
  DeveloperId: number;
  DeveloperName: string;
  Username?: string;
  Specialization?: string;
  Bio?: string;
  PortfolioUrl?: string;
  Location?: string;
  ProfileImage?: string;
  [key: string]: any;
}

const Developers: FC = () => {
  const navigate = useNavigate();
  const [developers, setDevelopers] = useState<DeveloperData[]>([]);
  const [filteredDevelopers, setFilteredDevelopers] = useState<DeveloperData[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        setLoading(true);
        const res = await axios.get<DeveloperData[]>(
          variables.API_URL + "developer",
        );
        const data = Array.isArray(res.data) ? res.data : [];
        setDevelopers(data);
        setFilteredDevelopers(data);
      } catch (err) {
        console.error("Error fetching developers:", err);
        setDevelopers([]);
        setFilteredDevelopers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  // Handle search filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDevelopers(developers);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredDevelopers(
        developers.filter(
          (dev) =>
            dev.DeveloperName.toLowerCase().includes(term) ||
            dev.Username?.toLowerCase().includes(term) ||
            dev.Specialization?.toLowerCase().includes(term) ||
            dev.Location?.toLowerCase().includes(term),
        ),
      );
    }
  }, [searchTerm, developers]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6 py-12">
          {/* HEADER */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Our Developers
            </h1>
            <p className="text-gray-400 text-lg">
              Explore our team of talented developers and their portfolios
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search by name, specialization, or location..."
              className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* DEVELOPERS GRID */}
          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">Loading developers...</p>
            </div>
          ) : filteredDevelopers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">
                {searchTerm.trim()
                  ? "No developers found"
                  : "No developers available"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDevelopers.map((dev) => (
                <DeveloperCard
                  key={dev.DeveloperId}
                  developer={dev}
                  onNavigate={() =>
                    navigate(`/developer/${dev.DeveloperId}`, {
                      state: { developer: dev },
                    })
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

// Developer Card Component
const DeveloperCard: FC<{
  developer: DeveloperData;
  onNavigate: () => void;
}> = ({ developer, onNavigate }) => {
  return (
    <div className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-700 hover:border-blue-500">
      {/* CARD BACKGROUND EFFECT */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300" />

      <div className="relative z-10 p-6">
        {/* PROFILE HEADER */}
        <div className="flex items-center gap-4 mb-4">
          {/* AVATAR */}
          <div className="flex-shrink-0">
            <img
              src={developer.ProfileImage || "/api/placeholder/64/64"}
              alt={developer.DeveloperName}
              className="w-16 h-16 rounded-full border-3 border-blue-500 object-cover"
            />
          </div>

          {/* NAME & USERNAME */}
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-white">
              {developer.DeveloperName}
            </h3>
            {developer.Username && (
              <p className="text-sm text-gray-400">@{developer.Username}</p>
            )}
          </div>
        </div>

        {/* SPECIALIZATION BADGE */}
        {developer.Specialization && (
          <div className="mb-3">
            <span className="inline-block bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/30">
              {developer.Specialization}
            </span>
          </div>
        )}

        {/* BIO / DESCRIPTION */}
        {developer.Bio && (
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
            {developer.Bio}
          </p>
        )}

        {/* LOCATION */}
        {developer.Location && (
          <div className="flex items-center gap-2 mb-4 text-gray-400 text-sm">
            <span>📍</span>
            <span>{developer.Location}</span>
          </div>
        )}

        {/* DIVIDER */}
        <div className="my-4 h-px bg-gradient-to-r from-gray-700 to-gray-600" />

        {/* ACTION BUTTONS */}
        <div className="flex gap-3">
          <button
            onClick={onNavigate}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            View Profile
          </button>

          {developer.PortfolioUrl ? (
            <a
              href={developer.PortfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 text-center"
            >
              Portfolio →
            </a>
          ) : (
            <button className="flex-1 px-4 py-2 bg-gray-700 text-gray-400 font-semibold rounded-lg cursor-not-allowed opacity-50">
              No Portfolio
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Developers;
