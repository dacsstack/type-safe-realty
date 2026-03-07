import { Component } from "react";
import { variables } from "../Variables.jsx";

export default class Banner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      developers: [],
      banners: [],
      modalTitle: "",
      BannerId: 0,
      BannerName: "",
      Developer: "",
      BannerDetails: "",
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

  // Fetch banners & developers
  refreshList() {
    const token = this.getToken();
    if (!token) return;

    // Banners
    fetch(variables.API_URL + "banner", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Banner fetch error: " + res.status);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) this.setState({ banners: data });
        else this.setState({ banners: [] });
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
  changeBannerName = (e) => this.setState({ BannerName: e.target.value });
  changeDeveloper = (e) => this.setState({ Developer: e.target.value });
  changeBannerDetails = (e) => this.setState({ BannerDetails: e.target.value });
  changeDateOfJoining = (e) => this.setState({ DateOfJoining: e.target.value });

  // Modal actions
  addClick() {
    this.setState({
      modalTitle: "Add Banner",
      BannerId: 0,
      BannerName: "",
      Developer: "",
      BannerDetails: "",
      DateOfJoining: "",
      PhotoFileName: [],
    });
  }

  editClick(pro) {
    const photos = pro.PhotoFileName
      ? typeof pro.PhotoFileName === "string"
        ? pro.PhotoFileName.split(",")
        : pro.PhotoFileName
      : [];

    this.setState({
      modalTitle: "Edit Banner",
      BannerId: pro.BannerId,
      BannerName: pro.BannerName,
      Developer: pro.Developer,
      BannerDetails: pro.BannerDetails,
      DateOfJoining: pro.DateOfJoining,
      PhotoFileName: photos,
    });
  }

  // Create Banner
  createClick() {
    const token = this.getToken();
    if (!token) return;

    fetch(variables.API_URL + "banner", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        BannerName: this.state.BannerName,
        Developer: this.state.Developer,
        BannerDetails: this.state.BannerDetails,
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

    fetch(variables.API_URL + "banner", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        BannerId: this.state.BannerId,
        BannerName: this.state.BannerName,
        Developer: this.state.Developer,
        BannerDetails: this.state.BannerDetails,
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

    fetch(variables.API_URL + "banner/" + id, {
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
      const res = await fetch(variables.API_URL + "banner/savefile", {
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
      banners,
      modalTitle,
      BannerId,
      BannerName,
      Developer,
      BannerDetails,
      DateOfJoining,
      PhotoPath,
      PhotoFileName,
    } = this.state;

    return (
      <div className="p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Banner</h2>
          <button
            onClick={() => this.addClick()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Banner
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
              {banners.map((ban) => (
                <tr key={ban.BannerId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{ban.BannerId}</td>
                  <td className="px-6 py-4">{ban.BannerName}</td>
                  <td className="px-6 py-4">{ban.Developer}</td>
                  <td className="px-6 py-4">{ban.BannerDetails}</td>
                  <td className="px-6 py-4">{ban.DateOfJoining}</td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button
                      onClick={() => this.editClick(ban)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => this.deleteClick(ban.BannerId)}
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
                value={BannerName}
                onChange={this.changeBannerName}
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
                Description
              </label>
              <textarea
                type="text"
                value={BannerDetails}
                onChange={this.changeBannerDetails}
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
            {BannerId === 0 ? (
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
