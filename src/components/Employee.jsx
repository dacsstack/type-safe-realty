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
      PhotoFileName: [], // multiple filenames as array
      PhotoPath: variables.PHOTO_URL,
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

    // Employees
    fetch(variables.API_URL + "employee", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) =>
        this.setState({ employees: Array.isArray(data) ? data : [] }),
      )
      .catch(() => this.setState({ employees: [] }));

    // Departments
    fetch(variables.API_URL + "department", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) =>
        this.setState({ departments: Array.isArray(data) ? data : [] }),
      )
      .catch(() => this.setState({ departments: [] }));
  }

  componentDidMount() {
    this.refreshList();
  }

  changeEmployeeName = (e) => this.setState({ EmployeeName: e.target.value });
  changeDepartment = (e) => this.setState({ Department: e.target.value });
  changeDateOfJoining = (e) => this.setState({ DateOfJoining: e.target.value });

  addClick = () =>
    this.setState({
      modalTitle: "Add Employee",
      EmployeeId: 0,
      EmployeeName: "",
      Department: "",
      DateOfJoining: "",
      PhotoFileName: [],
    });

  editClick = (emp) =>
    this.setState({
      modalTitle: "Edit Employee",
      EmployeeId: emp.EmployeeId,
      EmployeeName: emp.EmployeeName,
      Department: emp.Department,
      DateOfJoining: emp.DateOfJoining,
      PhotoFileName: emp.PhotoFileName.split(","), // array
    });

  createClick = () => {
    const token = this.getToken();
    if (!token) return;

    fetch(variables.API_URL + "employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(this.state),
    })
      .then((res) => res.json())
      .then(() => this.refreshList());
  };

  updateClick = () => {
    const token = this.getToken();
    if (!token) return;

    fetch(variables.API_URL + "employee", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(this.state),
    })
      .then((res) => res.json())
      .then(() => this.refreshList());
  };

  deleteClick = (id) => {
    const token = this.getToken();
    if (!token) return;

    if (window.confirm("Are you sure?")) {
      fetch(variables.API_URL + "employee/" + id, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(() => this.refreshList());
    }
  };

  imageUpload = (e) => {
    e.preventDefault();
    const token = this.getToken();
    if (!token) return;

    const files = e.target.files;
    if (!files.length) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++)
      formData.append("file", files[i], files[i].name);

    fetch(variables.API_URL + "employee/savefile", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => this.setState({ PhotoFileName: data.fileNames })); // store array
  };

  render() {
    const {
      employees,
      departments,
      modalTitle,
      EmployeeName,
      Department,
      DateOfJoining,
      PhotoPath,
      PhotoFileName,
    } = this.state;

    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">{modalTitle || "Employees"}</h2>

        <input
          type="file"
          multiple
          onChange={this.imageUpload}
          className="border p-2 rounded-lg mb-4"
        />

        <div className="flex gap-2 mb-6">
          {PhotoFileName.map((file, i) => (
            <img
              key={i}
              src={`${PhotoPath}${file}`}
              alt="Employee"
              className="w-32 h-32 object-cover rounded-lg"
            />
          ))}
        </div>

        {/* TABLE */}
        <table className="min-w-full border text-left">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>DOL</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.EmployeeId}>
                <td>{emp.EmployeeId}</td>
                <td>{emp.EmployeeName}</td>
                <td>{emp.Department}</td>
                <td>{emp.DateOfJoining}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
