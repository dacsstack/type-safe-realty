import { Component } from "react";
import { variables } from "../Variables.jsx";

export default class Department extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: [],
      departmentsWithoutFilter: [],
      modalTitle: "",
      DepartmentName: "",
      DepartmentId: 0,
      DepartmentIdFilter: "",
      DepartmentNameFilter: "",
    };
  }

  // =====================
  // FILTER & SORT
  // =====================
  FilterFn() {
    const {
      DepartmentIdFilter,
      DepartmentNameFilter,
      departmentsWithoutFilter,
    } = this.state;
    const filtered = departmentsWithoutFilter.filter(
      (el) =>
        el.DepartmentId.toString()
          .toLowerCase()
          .includes(DepartmentIdFilter.toLowerCase().trim()) &&
        el.DepartmentName.toLowerCase().includes(
          DepartmentNameFilter.toLowerCase().trim(),
        ),
    );
    this.setState({ departments: filtered });
  }

  sortResult(prop, asc) {
    const sorted = [...this.state.departmentsWithoutFilter].sort((a, b) => {
      if (asc) return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
      else return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
    });
    this.setState({ departments: sorted });
  }

  changeDepartmentIdFilter = (e) => {
    this.setState({ DepartmentIdFilter: e.target.value }, () =>
      this.FilterFn(),
    );
  };
  changeDepartmentNameFilter = (e) => {
    this.setState({ DepartmentNameFilter: e.target.value }, () =>
      this.FilterFn(),
    );
  };

  // =====================
  // FETCH DEPARTMENTS
  // =====================
  async refreshList() {
    try {
      const res = await fetch(variables.API_URL + "department", {
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
        this.setState({ departments: data, departmentsWithoutFilter: data });
      } else {
        console.error("Invalid data format:", data);
        this.setState({ departments: [] });
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      this.setState({ departments: [] });
    }
  }

  componentDidMount() {
    this.refreshList();
  }

  // =====================
  // FORM CONTROL
  // =====================
  changeDepartmentName = (e) =>
    this.setState({ DepartmentName: e.target.value });

  addClick() {
    this.setState({
      modalTitle: "Add Developer",
      DepartmentId: 0,
      DepartmentName: "",
    });
  }

  editClick(dep) {
    this.setState({
      modalTitle: "Edit Developer",
      DepartmentId: dep.DepartmentId,
      DepartmentName: dep.DepartmentName,
    });
  }

  // =====================
  // CRUD ACTIONS
  // =====================
  async createClick() {
    try {
      const res = await fetch(variables.API_URL + "department", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ DepartmentName: this.state.DepartmentName }),
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
      const res = await fetch(variables.API_URL + "department", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          DepartmentId: this.state.DepartmentId,
          DepartmentName: this.state.DepartmentName,
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
      const res = await fetch(variables.API_URL + "department/" + id, {
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
    const { departments, modalTitle, DepartmentId, DepartmentName } =
      this.state;

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
              {departments.map((dep) => (
                <tr key={dep.DepartmentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{dep.DepartmentId}</td>
                  <td className="px-6 py-4">{dep.DepartmentName}</td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button
                      onClick={() => this.editClick(dep)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => this.deleteClick(dep.DepartmentId)}
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
        <div className="mt-6 bg-white p-6 rounded-xl shadow max-w-md">
          <h3 className="text-lg font-semibold mb-4">{modalTitle}</h3>
          <input
            type="text"
            placeholder="Developer Name"
            value={DepartmentName}
            onChange={this.changeDepartmentName}
            className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {DepartmentId === 0 ? (
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
