import { useEffect, useState } from "react";
import { variables } from "../Variables";
import HeroSlider from "./HeroSlider";
import ProjectCard from "./ProjectCard";
import Testimonials from "./Testimonials";
import WhatsAppChat from "./WhatsAppChat";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(variables.API_URL + "project")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        } else if (Array.isArray(data.data)) {
          setProjects(data.data);
        } else {
          setProjects([]);
        }
      })
      .catch(() => setProjects([]));
  }, []);

  return (
    <div>
      <HeroSlider />

      {/* PROJECTS */}
      <section className="py-16 container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Our Accredited Projects
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {projects.map((proj) => (
            <ProjectCard
              key={proj.ProjectId}
              project={proj}
              photoUrl={variables.PHOTO_URL}
            />
          ))}
        </div>
      </section>

      <Testimonials />
      <WhatsAppChat />

      {/* FOOTER */}
      <footer className="bg-black text-white py-8 text-center">
        © 2026 Fort Hub Realty. Designed by Dacs.
      </footer>
      <WhatsAppChat />
    </div>
  );
}
