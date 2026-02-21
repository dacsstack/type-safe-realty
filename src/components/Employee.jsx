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

  // Fetch employees & departments
  refreshList() {
    const token = this.getToken();
    if (!token) return;

    // Employees
    fetch(variables.API_URL + "employee", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Employee fetch error: " + res.status);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) this.setState({ employees: data });
        else this.setState({ employees: [] });
      })
      .catch((err) => console.error(err));

    // Departments
    fetch(variables.API_URL + "department", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Department fetch error: " + res.status);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) this.setState({ departments: data });
        else this.setState({ departments: [] });
      })
      .catch((err) => console.error(err));
  }

  componentDidMount() {
    this.refreshList();
  }

  // Form handlers
  changeEmployeeName = (e) => this.setState({ EmployeeName: e.target.value });
  changeDepartment = (e) => this.setState({ Department: e.target.value });
  changeDateOfJoining = (e) => this.setState({ DateOfJoining: e.target.value });

  // Modal actions
  addClick() {
    this.setState({
      modalTitle: "Add Property",
      EmployeeId: 0,
      EmployeeName: "",
      Department: "",
      DateOfJoining: "",
      PhotoFileName: [],
    });
  }

  editClick(emp) {
    const photos = emp.PhotoFileName
      ? typeof emp.PhotoFileName === "string"
        ? emp.PhotoFileName.split(",")
        : emp.PhotoFileName
      : [];

    this.setState({
      modalTitle: "Edit Property",
      EmployeeId: emp.EmployeeId,
      EmployeeName: emp.EmployeeName,
      Department: emp.Department,
      DateOfJoining: emp.DateOfJoining,
      PhotoFileName: photos,
    });
  }

  // Create Employee
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

  // Update Employee
  updateClick() {
    const token = this.getToken();
    if (!token) return;

    const photos = Array.isArray(this.state.PhotoFileName)
      ? this.state.PhotoFileName.join(",")
      : this.state.PhotoFileName;

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

  // Delete Employee
  deleteClick(id) {
    const token = this.getToken();
    if (!token) return;

    if (!window.confirm("Are you sure?")) return;

    fetch(variables.API_URL + "employee/" + id, {
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
      const res = await fetch(variables.API_URL + "employee/savefile", {
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
          <h2 className="text-2xl font-bold">Property</h2>
          <button
            onClick={() => this.addClick()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Property
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto bg-white rounded-xl shadow mb-8">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 uppercase text-xs text-gray-600">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Date</th>
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

        {/* FORM */}
        <div className="bg-white p-6 rounded-xl shadow max-w-4xl">
          <h3 className="text-lg font-semibold mb-6">{modalTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT SIDE */}
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={EmployeeName}
                onChange={this.changeEmployeeName}
                className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <label className="block text-sm font-medium mb-1">
                Department
              </label>
              <select
                onChange={this.changeDepartment}
                value={Department}
                className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Department</option>
                {departments.map((dep) => (
                  <option key={dep.DepartmentId} value={dep.DepartmentName}>
                    {dep.DepartmentName}
                  </option>
                ))}
              </select>

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
                    alt="Employee"
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
