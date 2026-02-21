import { Component } from "react";
import { variables } from "../Variables.jsx";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [], // projects fetched from database
    };
  }

  refreshList() {
    const token = localStorage.getItem("token");

    fetch(variables.API_URL + "employee", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json();
      })
      .then((data) => {
        // Assume each project has: EmployeeId, EmployeeName, Department, DateOfJoining, PhotoFileName
        const projects = data.map((proj) => ({
          ...proj,
          photos: proj.PhotoFileName.split(","), // support multiple photos
        }));
        this.setState({ projects });
      })
      .catch((err) => console.error(err));
  }

  componentDidMount() {
    this.refreshList();
  }

  render() {
    const { projects } = this.state;

    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Projects</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.EmployeeId}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Image carousel / thumbnails */}
              <div className="relative h-64">
                {proj.photos.map((photo) => (
                  <img
                    key={photo} // unique key per photo
                    src={variables.PHOTO_URL + photo}
                    alt={proj.EmployeeName + "-" + photo}
                    className="w-full h-full object-cover"
                  />
                ))}
              </div>

              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                  {proj.EmployeeName}
                </h3>
                <p className="text-gray-600 mb-1">
                  Developer: {proj.Department}
                </p>
                <p className="text-gray-500 text-sm">
                  Date of Listing: {proj.DateOfJoining}
                </p>
              </div>

              <div className="p-4 border-t flex justify-between items-center">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  View
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
