import { Component } from "react";
import { variables } from "../Variables.jsx";

export default class Feature extends Component {
  constructor(props) {
    super(props);
    this.state = {
      features: [],
      featuresWithoutFilter: [],
      modalTitle: "",
      FeatureProfileName: "",
      FeatureId: 0,
      FeatureIdFilter: "",
      FeatureProfileNameFilter: "",
    };
  }

  // =====================
  // FILTER & SORT
  // =====================
  FilterFn() {
    const { FeatureIdFilter, FeatureProfileNameFilter, featuresWithoutFilter } =
      this.state;
    const filtered = featuresWithoutFilter.filter(
      (el) =>
        el.FeatureId.toString()
          .toLowerCase()
          .includes(FeatureIdFilter.toLowerCase().trim()) &&
        el.FeatureProfileName.toLowerCase().includes(
          FeatureProfileNameFilter.toLowerCase().trim(),
        ),
    );
    this.setState({ features: filtered });
  }

  sortResult(prop, asc) {
    const sorted = [...this.state.featuresWithoutFilter].sort((a, b) => {
      if (asc) return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
      else return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
    });
    this.setState({ features: sorted });
  }

  changeFeatureIdFilter = (e) => {
    this.setState({ FeatureIdFilter: e.target.value }, () => this.FilterFn());
  };
  changeFeatureProfileNameFilter = (e) => {
    this.setState({ FeatureNameFilter: e.target.value }, () => this.FilterFn());
  };

  // =====================
  // FETCH FEATURE
  // =====================
  async refreshList() {
    try {
      const res = await fetch(variables.API_URL + "features", {
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
        this.setState({ features: data, featuresWithoutFilter: data });
      } else {
        console.error("Invalid data format:", data);
        this.setState({ features: [] });
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      this.setState({ features: [] });
    }
  }

  componentDidMount() {
    this.refreshList();
  }

  // =====================
  // FORM CONTROL
  // =====================
  changeFeatureProfileName = (e) =>
    this.setState({ FeatureProfileName: e.target.value });

  addClick() {
    this.setState({
      modalTitle: "Add Feature",
      FeatureId: 0,
      FeatureProfileName: "",
    });
  }

  editClick(fea) {
    this.setState({
      modalTitle: "Edit Feature",
      FeatureId: fea.FeatureId,
      FeatureProfileName: fea.FeatureProfileName,
    });
  }

  // =====================
  // CRUD ACTIONS
  // =====================
  async createClick() {
    try {
      const res = await fetch(variables.API_URL + "features", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          FeatureProfileName: this.state.FeatureProfileName,
        }),
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
      const res = await fetch(variables.API_URL + "features", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          FeatureId: this.state.FeatureId,
          FeatureProfileName: this.state.FeatureProfileName,
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
      const res = await fetch(variables.API_URL + "features/" + id, {
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
    const { features, modalTitle, FeatureId, FeatureProfileName } = this.state;

    return (
      <div className="p-4">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Feature</h2>
          <button
            onClick={() => this.addClick()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Feature
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Feature ID</th>
                <th className="px-6 py-3">Feature Name</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {features.map((fea) => (
                <tr key={fea.FeatureId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{fea.FeatureId}</td>
                  <td className="px-6 py-4">{fea.FeatureProfileName}</td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button
                      onClick={() => this.editClick(fea)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => this.deleteClick(fea.FeatureId)}
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
            placeholder="Feature Profile Name"
            value={FeatureProfileName}
            onChange={this.changeFeatureProfileName}
            className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {FeatureId === 0 ? (
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
