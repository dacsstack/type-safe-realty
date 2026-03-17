import { Component, ReactNode } from "react";
import { variables } from "../Variables";

interface ProjectState {
  developers: DeveloperOption[];
  projects: ProjectData[];
  modalTitle: string;
  ProjectId: number;
  ProjectName: string;
  Developer: string;
  PropertyDetails: string;
  DateOfJoining: string;
  PhotoFileName: string[];
  PhotoPath: string;
  Location: string;
  Price: string;
  PropertyType: string;
  Latitude: string;
  Longitude: string;
}

interface DeveloperOption {
  DeveloperId: number;
  DeveloperName: string;
}

interface ProjectData {
  ProjectId: number;
  ProjectName: string;
  Developer: string;
  PropertyDetails: string;
  DateOfJoining: string;
  PhotoFileName: string | string[];
  Location: string;
  Price: number;
  PropertyType: string;
  Latitude: number;
  Longitude: number;
}

export default class Project extends Component<{}, ProjectState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      developers: [],
      projects: [],
      modalTitle: "",
      ProjectId: 0,
      ProjectName: "",
      Developer: "",
      PropertyDetails: "",
      DateOfJoining: "",
      PhotoFileName: [],
      PhotoPath: variables.PHOTO_URL,
      Location: "",
      Price: "",
      PropertyType: "",
      Latitude: "",
      Longitude: "",
    };
  }

  getToken(): string | null {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first!");
      window.location.href = "/login";
      return null;
    }
    return token;
  }

  refreshList() {
    const token = this.getToken();
    if (!token) return;

    fetch(variables.API_URL + "project", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Project fetch error: " + res.status);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) this.setState({ projects: data });
        else this.setState({ projects: [] });
      })
      .catch((err) => console.error(err));

    fetch(variables.API_URL + "developer", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Developer fetch error: " + res.status);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) this.setState({ developers: data });
        else this.setState({ developers: [] });
      })
      .catch((err) => console.error(err));
  }

  componentDidMount() {
    this.refreshList();
  }

  changeProjectName = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ ProjectName: e.target.value });
  changeDeveloper = (e: React.ChangeEvent<HTMLSelectElement>) =>
    this.setState({ Developer: e.target.value });
  changePropertyDetails = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    this.setState({ PropertyDetails: e.target.value });
  changeDateOfJoining = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ DateOfJoining: e.target.value });
  changeLocation = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ Location: e.target.value });
  changePrice = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ Price: e.target.value });
  changePropertyType = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ PropertyType: e.target.value });
  changeLatitude = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ Latitude: e.target.value });
  changeLongitude = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ Longitude: e.target.value });

  addClick() {
    this.setState({
      modalTitle: "Add Property",
      ProjectId: 0,
      ProjectName: "",
      Developer: "",
      PropertyDetails: "",
      DateOfJoining: "",
      PhotoFileName: [],
      Location: "",
      Price: "",
      PropertyType: "",
      Latitude: "",
      Longitude: "",
    });
  }

  editClick = (pro: ProjectData) => {
    const photos = pro.PhotoFileName
      ? typeof pro.PhotoFileName === "string"
        ? pro.PhotoFileName.split(",")
        : pro.PhotoFileName
      : [];

    this.setState({
      modalTitle: "Edit Project",
      ProjectId: pro.ProjectId,
      ProjectName: pro.ProjectName,
      Developer: pro.Developer,
      PropertyDetails: pro.PropertyDetails,
      DateOfJoining: pro.DateOfJoining,
      PhotoFileName: photos,
      Location: pro.Location,
      Price: pro.Price.toString(),
      PropertyType: pro.PropertyType,
      Latitude: pro.Latitude.toString(),
      Longitude: pro.Longitude.toString(),
    });
  };

  createClick = async () => {
    const token = this.getToken();
    if (!token) return;

    try {
      const response = await fetch(variables.API_URL + "properties", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ProjectName: this.state.ProjectName,
          Developer: this.state.Developer,
          PropertyDetails: this.state.PropertyDetails,
          DateOfJoining: this.state.DateOfJoining,
          PhotoFileName: this.state.PhotoFileName,
          Location: this.state.Location,
          Price: parseFloat(this.state.Price),
          PropertyType: this.state.PropertyType,
          Latitude: parseFloat(this.state.Latitude),
          Longitude: parseFloat(this.state.Longitude),
        }),
      });

      const result = await response.json();
      alert(result.message || "Project created");
      this.refreshList();
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    }
  };

  updateClick = async () => {
    const token = this.getToken();
    if (!token) return;

    try {
      const response = await fetch(variables.API_URL + "properties", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ProjectId: this.state.ProjectId,
          ProjectName: this.state.ProjectName,
          Developer: this.state.Developer,
          PropertyDetails: this.state.PropertyDetails,
          DateOfJoining: this.state.DateOfJoining,
          PhotoFileName: this.state.PhotoFileName,
          Location: this.state.Location,
          Price: parseFloat(this.state.Price),
          PropertyType: this.state.PropertyType,
          Latitude: parseFloat(this.state.Latitude),
          Longitude: parseFloat(this.state.Longitude),
        }),
      });

      const result = await response.json();
      alert(result.message || "Project updated");
      this.refreshList();
    } catch (err) {
      console.error(err);
      alert("Failed to update project");
    }
  };

  deleteClick = async (id: number) => {
    const token = this.getToken();
    if (!token) return;

    if (!window.confirm("Are you sure?")) return;

    try {
      const response = await fetch(variables.API_URL + `properties/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      alert(result.message || "Project deleted");
      this.refreshList();
    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
    }
  };

  imageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const token = this.getToken();
    if (!token) return;

    const files = e.target.files;
    if (!files?.length) return;

    const formData = new FormData();
    for (const file of Array.from(files)) {
      formData.append("files", file);
    }

    try {
      const res = await fetch(variables.API_URL + "properties/savefile", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data: { fileNames: string[] } = await res.json();

      if (data.fileNames) {
        this.setState({
          PhotoFileName: [...this.state.PhotoFileName, ...data.fileNames],
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  render(): ReactNode {
    const {
      developers,
      projects,
      modalTitle,
      ProjectId,
      ProjectName,
      Developer,
      PropertyDetails,
      DateOfJoining,
      PhotoPath,
      PhotoFileName,
      Location,
      Price,
      PropertyType,
      Latitude,
      Longitude,
    } = this.state;

    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Project</h2>
          <button
            onClick={() => this.addClick()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Project
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow mb-8">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 uppercase text-xs text-gray-600">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Developer</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.map((p) => (
                <tr key={p.ProjectId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{p.ProjectId}</td>
                  <td className="px-6 py-4">{p.ProjectName}</td>
                  <td className="px-6 py-4">{p.Developer}</td>
                  <td className="px-6 py-4">{p.Location}</td>
                  <td className="px-6 py-4">${p.Price}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => this.editClick(p)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => this.deleteClick(p.ProjectId)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">{modalTitle}</h3>
          <input
            type="text"
            placeholder="Project Name"
            value={ProjectName}
            onChange={this.changeProjectName}
            className="w-full border rounded-lg p-2 mb-3 focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={Developer}
            onChange={this.changeDeveloper}
            className="w-full border rounded-lg p-2 mb-3"
          >
            <option value="">Select Developer</option>
            {developers.map((d) => (
              <option key={d.DeveloperId} value={d.DeveloperName}>
                {d.DeveloperName}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Property Details"
            value={PropertyDetails}
            onChange={this.changePropertyDetails}
            className="w-full border rounded-lg p-2 mb-3"
            rows={3}
          />
          <input
            type="date"
            value={DateOfJoining}
            onChange={this.changeDateOfJoining}
            className="w-full border rounded-lg p-2 mb-3"
          />
          <input
            type="text"
            placeholder="Location"
            value={Location}
            onChange={this.changeLocation}
            className="w-full border rounded-lg p-2 mb-3"
          />
          <input
            type="number"
            placeholder="Price"
            value={Price}
            onChange={this.changePrice}
            className="w-full border rounded-lg p-2 mb-3"
          />
          <input
            type="text"
            placeholder="Property Type"
            value={PropertyType}
            onChange={this.changePropertyType}
            className="w-full border rounded-lg p-2 mb-3"
          />
          <input
            type="number"
            placeholder="Latitude"
            value={Latitude}
            onChange={this.changeLatitude}
            className="w-full border rounded-lg p-2 mb-3"
          />
          <input
            type="number"
            placeholder="Longitude"
            value={Longitude}
            onChange={this.changeLongitude}
            className="w-full border rounded-lg p-2 mb-3"
          />

          <div className="mb-3">
            <input type="file" multiple onChange={this.imageUpload} />
            <div className="mt-2 flex flex-wrap gap-2">
              {PhotoFileName.map((f, i) => (
                <div key={i} className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {f}
                </div>
              ))}
            </div>
          </div>

          {ProjectId === 0 ? (
            <button
              onClick={this.createClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Create
            </button>
          ) : (
            <button
              onClick={this.updateClick}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Update
            </button>
          )}
        </div>
      </div>
    );
  }
}
