import { Component, ReactNode } from "react";
import { variables } from "../Variables";

interface DeveloperState {
  developers: DeveloperData[];
  developersWithoutFilter: DeveloperData[];
  modalTitle: string;
  DeveloperName: string;
  DeveloperId: number;
  DeveloperIdFilter: string;
  DeveloperNameFilter: string;
}

interface DeveloperData {
  DeveloperId: number;
  DeveloperName: string;
}

export default class Developer extends Component<{}, DeveloperState> {
  constructor(props: {}) {
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

  sortResult(prop: keyof DeveloperData, asc: boolean) {
    const sorted = [...this.state.developersWithoutFilter].sort((a, b) => {
      if (asc) return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
      else return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
    });
    this.setState({ developers: sorted });
  }

  changeDeveloperIdFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ DeveloperIdFilter: e.target.value }, () => this.FilterFn());
  };
  changeDeveloperNameFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          Authorization: "Bearer " + (localStorage.getItem("token") || ""),
        },
      });

      if (res.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      if (!res.ok) throw new Error("HTTP error " + res.status);

      const data: unknown = await res.json();
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
  changeDeveloperName = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ DeveloperName: e.target.value });

  addClick() {
    this.setState({
      modalTitle: "Add Developer",
      DeveloperId: 0,
      DeveloperName: "",
    });
  }

  editClick(_e: React.MouseEvent, id: number, name: string) {
    this.setState({
      modalTitle: "Edit Developer",
      DeveloperId: id,
      DeveloperName: name,
    });
  }

  createClick = async () => {
    if (!this.state.DeveloperName) {
      alert("Please enter developer name");
      return;
    }

    try {
      const response = await fetch(variables.API_URL + "developers", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + (localStorage.getItem("token") || ""),
        },
        body: JSON.stringify({
          DeveloperName: this.state.DeveloperName,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Failed to create developer");
        return;
      }

      this.refreshList();
      this.setState({ DeveloperName: "" });
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating developer");
    }
  };

  updateClick = async () => {
    if (!this.state.DeveloperName) {
      alert("Please enter developer name");
      return;
    }

    try {
      const response = await fetch(variables.API_URL + "developers", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + (localStorage.getItem("token") || ""),
        },
        body: JSON.stringify({
          DeveloperId: this.state.DeveloperId,
          DeveloperName: this.state.DeveloperName,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Failed to update developer");
        return;
      }

      this.refreshList();
      this.setState({ DeveloperName: "" });
    } catch (error) {
      console.error("Error:", error);
      alert("Error updating developer");
    }
  };

  deleteClick = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const response = await fetch(variables.API_URL + `developers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + (localStorage.getItem("token") || ""),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Failed to delete developer");
        return;
      }

      this.refreshList();
    } catch (error) {
      console.error("Error:", error);
      alert("Error deleting developer");
    }
  };

  render(): ReactNode {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Developers</h2>

        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Filter by ID"
            value={this.state.DeveloperIdFilter}
            onChange={this.changeDeveloperIdFilter}
            className="px-3 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Filter by Name"
            value={this.state.DeveloperNameFilter}
            onChange={this.changeDeveloperNameFilter}
            className="px-3 py-2 border rounded"
          />
          <button
            onClick={() => this.addClick()}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Add Developer
          </button>
        </div>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.developers.map((d) => (
              <tr key={d.DeveloperId} className="border-b">
                <td className="p-2">{d.DeveloperId}</td>
                <td className="p-2">{d.DeveloperName}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={(e) =>
                      this.editClick(e, d.DeveloperId, d.DeveloperName)
                    }
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => this.deleteClick(d.DeveloperId)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
