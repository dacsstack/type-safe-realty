import { Component } from "react";
import { variables } from "../Variables.jsx";

export default class Banner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      features: [],
      about: [],
      modalTitle: "",
      AboutId: 0,
      Title: "",
      Feature: "",
      Description: "",
      DateOfJoining: "",
      PhotoFileName: [], // always array
      PhotoPath: variables.PHOTO_URL,
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

  // Fetch About
  refreshList() {
    const token = this.getToken();
    if (!token) return;

    // Banners
    fetch(variables.API_URL + "about", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Banner fetch error: " + res.status);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) this.setState({ about: data });
        else this.setState({ about: [] });
      })
      .catch((err) => console.error(err));

    // ABOUT
    fetch(variables.API_URL + "features", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("About fetch error: " + res.status);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) this.setState({ features: data });
        else this.setState({ features: [] });
      })
      .catch((err) => console.error(err));
  }

  componentDidMount() {
    this.refreshList();
  }

  // Form handlers
  changeTitle = (e) => this.setState({ Title: e.target.value });
  changeFeature = (e) => this.setState({ Feature: e.target.value });
  changeDescription = (e) => this.setState({ Description: e.target.value });
  changeDateOfJoining = (e) => this.setState({ DateOfJoining: e.target.value });

  // Modal actions
  addClick() {
    this.setState({
      modalTitle: "Add Feature",
      AboutId: 0,
      Title: "",
      Feature: "",
      Description: "",
      DateOfJoining: "",
      PhotoFileName: [],
    });
  }

  editClick(fea) {
    const photos = fea.PhotoFileName
      ? typeof fea.PhotoFileName === "string"
        ? fea.PhotoFileName.split(",")
        : fea.PhotoFileName
      : [];

    this.setState({
      modalTitle: "Edit Feature",
      AboutId: fea.AboutId,
      Title: fea.Title,
      Feature: fea.Feature,
      Description: fea.Description,
      DateOfJoining: fea.DateOfJoining,
      PhotoFileName: photos,
    });
  }

  // Create Feature
  createClick() {
    const token = this.getToken();
    if (!token) return;

    fetch(variables.API_URL + "about", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        Title: this.state.Title,
        Feature: this.state.Feature,
        Description: this.state.Description,
        DateOfJoining: this.state.DateOfJoining,
        PhotoFileName: this.state.PhotoFileName.join(","), // save as comma string
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

  // Update Banner
  updateClick() {
    const token = this.getToken();
    if (!token) return;

    const photos = Array.isArray(this.state.PhotoFileName)
      ? this.state.PhotoFileName.join(",")
      : this.state.PhotoFileName;

    fetch(variables.API_URL + "about", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        AboutId: this.state.AboutId,
        Title: this.state.Title,
        Feature: this.state.Feature,
        Description: this.state.Description,
        DateOfJoining: this.state.DateOfJoining,
        PhotoFileName: photos,
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

  // Delete Banner
  deleteClick(id) {
    const token = this.getToken();
    if (!token) return;

    if (!window.confirm("Are you sure?")) return;

    fetch(variables.API_URL + "about/" + id, {
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
      const res = await fetch(variables.API_URL + "about/savefile", {
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
      features,
      about,
      modalTitle,
      AboutId,
      Title,
      Feature,
      Description,
      DateOfJoining,
      PhotoPath,
      PhotoFileName,
    } = this.state;

    return (
      <div className="p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">About</h2>
          <button
            onClick={() => this.addClick()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add About
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto bg-white rounded-xl shadow mb-8">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 uppercase text-xs text-gray-600">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Developer</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {about.map((fea) => (
                <tr key={fea.AboutId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{fea.AboutId}</td>
                  <td className="px-6 py-4">{fea.Title}</td>
                  <td className="px-6 py-4">{fea.Feature}</td>
                  <td className="px-6 py-4">{fea.Description}</td>
                  <td className="px-6 py-4">{fea.DateOfJoining}</td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button
                      onClick={() => this.editClick(fea)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => this.deleteClick(fea.AboutId)}
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
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={Title}
                onChange={this.changeTitle}
                className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <label className="block text-sm font-medium mb-1">Feature</label>
              <select
                onChange={this.changeFeature}
                value={Feature}
                className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Feature</option>
                {features.map((feat) => (
                  <option key={feat.FeatureId} value={feat.FeatureProfileName}>
                    {feat.FeatureProfileName}
                  </option>
                ))}
              </select>

              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                type="text"
                value={Description}
                onChange={this.changeDescription}
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
                    alt="Banner"
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
            {AboutId === 0 ? (
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
