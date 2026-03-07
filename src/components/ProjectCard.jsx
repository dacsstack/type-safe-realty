export default function ProjectCard({ project, photoUrl }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-2xl transition">
      <img
        src={
          project.PhotoFileName
            ? photoUrl + project.PhotoFileName
            : "/images/no-image.jpg"
        }
        alt={project.EmployeeName}
        className="w-full h-52 object-cover rounded-t-xl"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{project.EmployeeName}</h3>
        <p className="text-gray-500 text-sm">Listed: {project.DateOfJoining}</p>
      </div>
    </div>
  );
}
