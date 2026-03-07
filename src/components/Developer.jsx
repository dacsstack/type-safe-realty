import { Component } from "react";
import { variables } from "../Variables.jsx";

export default class Developer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      developers: [],
      developersWithoutFilter: [],
      modalTitle: "",
      DeveloperName: "",
      DeveloperId: 0,
      DeveloperIdFilter: "",
      DeveloperNameFilter: "",
    };
  }

  // =====================
  // FILTER & SORT
  // =====================
  FilterFn() {
    const { DeveloperIdFilter, DeveloperNameFilter, developersWithoutFilter } =
      this.state;
    const filtered = developersWithoutFilter.filter(
      (el) =>
        el.DeveloperId.toString()
          .toLowerCase()
          .includes(DeveloperIdFilter.toLowerCase().trim()) &&
        el.DeveloperName.toLowerCase().includes(
          DeveloperNameFilter.toLowerCase().trim(),
        ),
    );
    this.setState({ developers: filtered });
  }

  sortResult(prop, asc) {
    const sorted = [...this.state.developersWithoutFilter].sort((a, b) => {
      if (asc) return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
      else return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
    });
    this.setState({ developers: sorted });
  }

  changeDeveloperIdFilter = (e) => {
    this.setState({ DeveloperIdFilter: e.target.value }, () => this.FilterFn());
  };
  changeDeveloperNameFilter = (e) => {
    this.setState({ DeveloperNameFilter: e.target.value }, () =>
      this.FilterFn(),
    );
  };

  // =====================
  // FETCH DEVELOPER
  // =====================
  async refreshList() {
    try {
      const res = await fetch(variables.API_URL + "developer", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (res.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      if (!res.ok) throw new Error("HTTP error " + res.status);

      const data = await res.json();
      if (Array.isArray(data)) {
        this.setState({ developers: data, developersWithoutFilter: data });
      } else {
        console.error("Invalid data format:", data);
        this.setState({ developers: [] });
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      this.setState({ developers: [] });
    }
  }

  componentDidMount() {
    this.refreshList();
  }

  // =====================
  // FORM CONTROL
  // =====================
  changeDeveloperName = (e) => this.setState({ DeveloperName: e.target.value });

  addClick() {
    this.setState({
      modalTitle: "Add Developer",
      DeveloperId: 0,
      DeveloperName: "",
    });
  }

  editClick(dev) {
    this.setState({
      modalTitle: "Edit Developer",
      DeveloperId: dev.DeveloperId,
      DeveloperName: dev.DeveloperName,
    });
  }

  // =====================
  // CRUD ACTIONS
  // =====================
  async createClick() {
    try {
      const res = await fetch(variables.API_URL + "developer", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ DeveloperName: this.state.DeveloperName }),
      });
      const result = await res.json();
      alert(result.message);
      this.refreshList();
    } catch {
      alert("Failed");
    }
  }

  async updateClick() {
    try {
      const res = await fetch(variables.API_URL + "developer", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          DeveloperId: this.state.DeveloperId,
          DeveloperName: this.state.DeveloperName,
        }),
      });
      const result = await res.json();
      alert(result.message);
      this.refreshList();
    } catch {
      alert("Failed");
    }
  }

  async deleteClick(id) {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(variables.API_URL + "developer/" + id, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const result = await res.json();
      alert(result.message);
      this.refreshList();
    } catch {
      alert("Failed");
    }
  }

  // =====================
  // RENDER
  // =====================
  render() {
    const { developers, modalTitle, DeveloperId, DeveloperName } = this.state;

    return (
      <div className="p-4">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Developer</h2>
          <button
            onClick={() => this.addClick()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Developer
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Developer ID</th>
                <th className="px-6 py-3">Developer Name</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {developers.map((dev) => (
                <tr key={dev.DeveloperId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{dev.DeveloperId}</td>
                  <td className="px-6 py-4">{dev.DeveloperName}</td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button
                      onClick={() => this.editClick(dev)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => this.deleteClick(dev.DeveloperId)}
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

        {/* SIMPLE FORM */}
        <div className="mt-6 bg-white p-6 rounded-xl shadow max-w-8xl">
          <h3 className="text-lg font-semibold mb-4">{modalTitle}</h3>
          <input
            type="text"
            placeholder="Developer Name"
            value={DeveloperName}
            onChange={this.changeDeveloperName}
            className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {DeveloperId === 0 ? (
            <button
              onClick={() => this.createClick()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Create
            </button>
          ) : (
            <button
              onClick={() => this.updateClick()}
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
