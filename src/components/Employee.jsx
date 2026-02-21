import { Component } from "react";
import { variables } from "../Variables.jsx";

export default class Employee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      departments: [],
      employees: [],
      modalTitle: "",
      EmployeeId: 0,
      EmployeeName: "",
      Department: "",
      DateOfJoining: "",
      PhotoFileName:
        "office-center-company-buildings-icon-gray-vector-graphics_996135-51067.avif",
      PhotoPath: variables.VITE_PHOTO_URL,
    };
  }

  getToken() {
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

    // EMPLOYEES
    fetch(variables.API_URL + "employee", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Employee fetch error: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          this.setState({ employees: data });
        } else {
          console.error("Employee not array:", data);
          this.setState({ employees: [] });
        }
      })
      .catch((error) => {
        console.error(error);
        this.setState({ employees: [] });
      });

    // DEPARTMENTS
    fetch(variables.API_URL + "department", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Department fetch error: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          this.setState({ departments: data });
        } else {
          console.error("Department not array:", data);
          this.setState({ departments: [] });
        }
      })
      .catch((error) => {
        console.error(error);
        this.setState({ departments: [] });
      });
  }

  componentDidMount() {
    this.refreshList();
  }

  changeEmployeeName = (e) => this.setState({ EmployeeName: e.target.value });
  changeDepartment = (e) => this.setState({ Department: e.target.value });
  changeDateOfJoining = (e) => this.setState({ DateOfJoining: e.target.value });

  addClick() {
    this.setState({
      modalTitle: "Add Project",
      EmployeeId: 0,
      EmployeeName: "",
      Department: "",
      DateOfJoining: "",
      PhotoFileName:
        "office-center-company-buildings-icon-gray-vector-graphics_996135-51067.avif",
    });
  }

  editClick(emp) {
    this.setState({
      modalTitle: "Edit Project",
      EmployeeId: emp.EmployeeId,
      EmployeeName: emp.EmployeeName,
      Department: emp.Department,
      DateOfJoining: emp.DateOfJoining,
      PhotoFileName: emp.PhotoFileName,
    });
  }

  createClick() {
    const token = this.getToken();
    if (!token) return;

    fetch(variables.API_URL + "employee", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        EmployeeName: this.state.EmployeeName,
        Department: this.state.Department,
        DateOfJoining: this.state.DateOfJoining,
        PhotoFileName: this.state.PhotoFileName,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          alert(result);
          this.refreshList();
        },
        (error) => {
          alert("Failed");
        },
      );
  }

  updateClick() {
    const token = this.getToken();
    if (!token) return;

    fetch(variables.API_URL + "employee", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        EmployeeId: this.state.EmployeeId,
        EmployeeName: this.state.EmployeeName,
        Department: this.state.Department,
        DateOfJoining: this.state.DateOfJoining,
        PhotoFileName: this.state.PhotoFileName,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          alert(result);
          this.refreshList();
        },
        (error) => {
          alert("Failed");
        },
      );
  }

  deleteClick(id) {
    const token = this.getToken();
    if (!token) return;

    if (window.confirm("Are you sure?")) {
      fetch(variables.API_URL + "employee/" + id, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(
          (result) => {
            alert(result);
            this.refreshList();
          },
          (error) => {
            alert("Failed");
          },
        );
    }
  }

  imageUpload = (e) => {
    e.preventDefault();
    const token = this.getToken();
    if (!token) return;

    const formData = new FormData();
    formData.append("file", e.target.files[0], e.target.files[0].name);

    fetch(variables.API_URL + "employee/savefile", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ PhotoFileName: data });
      });
  };

  render() {
    const {
      departments,
      employees,
      modalTitle,
      EmployeeId,
      EmployeeName,
      Department,
      DateOfJoining,
      PhotoPath,
      PhotoFileName,
    } = this.state;

    return (
      <div className="p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Projects</h2>
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
                <th className="px-6 py-3">Project Name</th>
                <th className="px-6 py-3">Developer</th>
                <th className="px-6 py-3">DOL</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {employees.map((emp) => (
                <tr key={emp.EmployeeId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{emp.EmployeeId}</td>
                  <td className="px-6 py-4">{emp.EmployeeName}</td>
                  <td className="px-6 py-4">{emp.Department}</td>
                  <td className="px-6 py-4">{emp.DateOfJoining}</td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button
                      onClick={() => this.editClick(emp)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => this.deleteClick(emp.EmployeeId)}
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

        {/* FORM SECTION */}
        <div className="bg-white p-6 rounded-xl shadow max-w-4xl">
          <h3 className="text-lg font-semibold mb-6">{modalTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT SIDE */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={EmployeeName}
                onChange={this.changeEmployeeName}
                className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <label className="block text-sm font-medium mb-1">
                Developer
              </label>
              <select
                onChange={this.changeDepartment}
                value={Department}
                className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Developers</option>
                {departments.map((dep) => (
                  <option key={dep.DepartmentId} value={dep.DepartmentName}>
                    {dep.DepartmentName}
                  </option>
                ))}
              </select>

              <label className="block text-sm font-medium mb-1">
                Date of Listing
              </label>
              <input
                type="date"
                value={DateOfJoining}
                onChange={this.changeDateOfJoining}
                className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col items-center">
              <img
                className="w-52 h-52 object-cover rounded-lg shadow mb-4"
                src={PhotoPath + PhotoFileName}
                alt="Employee"
              />

              <input
                type="file"
                onChange={this.imageUpload}
                className="border p-2 rounded-lg"
              />
            </div>
          </div>

          {/* BUTTON */}
          <div className="mt-6">
            {EmployeeId === 0 ? (
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
