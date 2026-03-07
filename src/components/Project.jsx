import { Component } from "react";
import { variables } from "../Variables.jsx";

export default class Project extends Component {
  constructor(props) {
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
      PhotoFileName: [], // always array
      PhotoPath: variables.PHOTO_URL,
      Location: "",
      Price: "",
      PropertyType: "",
      Latitude: "",
      Longitude: "",
    };
  }

  // Get JWT token
  getToken() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first!");
      window.location.href = "/login";
      return null;
    }
    return token;
  }

  // Fetch projects & developers
  refreshList() {
    const token = this.getToken();
    if (!token) return;

    // Projects
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

    // Developers
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

  // Form handlers
  changeProjectName = (e) => this.setState({ ProjectName: e.target.value });
  changeDeveloper = (e) => this.setState({ Developer: e.target.value });
  changePropertyDetails = (e) =>
    this.setState({ PropertyDetails: e.target.value });
  changeDateOfJoining = (e) => this.setState({ DateOfJoining: e.target.value });
  changeLocation = (e) => this.setState({ Location: e.target.value });
  changePrice = (e) => this.setState({ Price: e.target.value });
  changePropertyType = (e) => this.setState({ PropertyType: e.target.value });
  changeLatitude = (e) => this.setState({ Latitude: e.target.value });
  changeLongitude = (e) => this.setState({ Longitude: e.target.value });

  // Modal actions
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

  editClick(pro) {
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
      Price: pro.Price,
      PropertyType: pro.PropertyType,
      Latitude: pro.Latitude,
      Longitude: pro.Longitude,
    });
  }

  // Create Project
  createClick() {
    const token = this.getToken();
    if (!token) return;

    fetch(variables.API_URL + "project", {
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
        PhotoFileName: this.state.PhotoFileName.join(","), // save as comma string
        Location: this.state.Location,
        Price: this.state.Price,
        PropertyType: this.state.PropertyType,
        Latitude: this.state.Latitude,
        Longitude: this.state.Longitude,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          alert(result.message);
          this.refreshList();
        },
        () => alert("Failed"),
      );
  }

  // Update Project
  updateClick() {
    const token = this.getToken();
    if (!token) return;

    const photos = Array.isArray(this.state.PhotoFileName)
      ? this.state.PhotoFileName.join(",")
      : this.state.PhotoFileName;

    fetch(variables.API_URL + "project", {
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
        PhotoFileName: photos,
        Location: this.state.Location,
        Price: this.state.Price,
        PropertyType: this.state.PropertyType,
        Latitude: this.state.Latitude,
        Longitude: this.state.Longitude,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          alert(result.message);
          this.refreshList();
        },
        () => alert("Failed"),
      );
  }

  // Delete Project
  deleteClick(id) {
    const token = this.getToken();
    if (!token) return;

    if (!window.confirm("Are you sure?")) return;

    fetch(variables.API_URL + "project/" + id, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          alert(result.message);
          this.refreshList();
        },
        () => alert("Failed"),
      );
  }

  // Image upload (multiple)
  imageUpload = async (e) => {
    e.preventDefault();
    const token = this.getToken();
    if (!token) return;

    const files = e.target.files;
    if (!files.length) return;

    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file, file.name);
    }

    try {
      const res = await fetch(variables.API_URL + "project/savefile", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (data.fileNames) {
        // append to existing photos
        this.setState({
          PhotoFileName: [...this.state.PhotoFileName, ...data.fileNames],
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  render() {
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
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Project</h2>
          <button
            onClick={() => this.addClick()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Project
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto bg-white rounded-xl shadow mb-8">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 uppercase text-xs text-gray-600">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Developer</th>
                <th className="px-6 py-3">Property Details</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Latitude</th>
                <th className="px-6 py-3">Longitude</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.map((emp) => (
                <tr key={emp.ProjectId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{emp.ProjectId}</td>
                  <td className="px-6 py-4">{emp.ProjectName}</td>
                  <td className="px-6 py-4">{emp.Developer}</td>
                  <td className="px-6 py-4">{emp.PropertyDetails}</td>
                  <td className="px-6 py-4">{emp.Location}</td>
                  <td className="px-6 py-4">{emp.Price}</td>
                  <td className="px-6 py-4">{emp.PropertyType}</td>
                  <td className="px-6 py-4">{emp.Latitude}</td>
                  <td className="px-6 py-4">{emp.Longitude}</td>
                  <td className="px-6 py-4">{emp.DateOfJoining}</td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button
                      onClick={() => this.editClick(emp)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => this.deleteClick(emp.ProjectId)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FORM */}
        <div className="bg-white p-6 rounded-xl shadow max-w-8xl">
          <h3 className="text-lg font-semibold mb-6">{modalTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT SIDE */}
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={ProjectName}
                onChange={this.changeProjectName}
                className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <label className="block text-sm font-medium mb-1">
                Developer
              </label>
              <select
                onChange={this.changeDeveloper}
                value={Developer}
                className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Developer</option>
                {developers.map((dev) => (
                  <option key={dev.DeveloperId} value={dev.DeveloperName}>
                    {dev.DeveloperName}
                  </option>
                ))}
              </select>

              <label className="block text-sm font-medium mb-1">
                Property Details
              </label>
              <textarea
                type="text"
                value={PropertyDetails}
                onChange={this.changePropertyDetails}
                className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={Location}
                onChange={this.changeLocation}
                className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                value={Price}
                onChange={this.changePrice}
                className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <label className="block text-sm font-medium mb-1">
                Property Type
              </label>
              <input
                type="text"
                value={PropertyType}
                onChange={this.changePropertyType}
                className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <label className="block text-sm font-medium mb-1">Latitude</label>
              <input
                type="number"
                value={Latitude}
                onChange={this.changeLatitude}
                className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <label className="block text-sm font-medium mb-1">
                Longitude
              </label>
              <input
                type="number"
                value={Longitude}
                onChange={this.changeLongitude}
                className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={DateOfJoining}
                onChange={this.changeDateOfJoining}
                className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* RIGHT SIDE: MULTIPLE IMAGES */}
            <div className="flex flex-col items-center">
              <div className="flex flex-wrap gap-2 mb-4">
                {PhotoFileName.map((file) => (
                  <img
                    key={file}
                    src={PhotoPath + file}
                    alt="Project"
                    className="w-32 h-32 object-cover rounded-lg shadow"
                  />
                ))}
              </div>
              <input
                type="file"
                multiple
                onChange={this.imageUpload}
                className="border p-2 rounded-lg"
              />
            </div>
          </div>

          {/* BUTTON */}
          <div className="mt-6">
            {ProjectId === 0 ? (
              <button
                onClick={() => this.createClick()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Create
              </button>
            ) : (
              <button
                onClick={() => this.updateClick()}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
              >
                Update
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}
