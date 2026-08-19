import {
  useState,
} from "react";

import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
} from "lucide-react";

import {
  useAppData,
  type Placement,
} from "../context/AppDataContext";

/* =========================================================
   FORM TYPE
========================================================= */

type PlacementForm = Omit<
  Placement,
  "id"
>;

/* =========================================================
   EMPTY FORM
========================================================= */

const emptyForm: PlacementForm = {
  placementId: "",
  applicationId: "",
  studentId: "",
  studentName: "",
  company: "",
  role: "",
  packageLpa: "",
  joiningDate: "",
  placementType: "Full Time",
  status: "Placed",
};

/* =========================================================
   COMPONENT
========================================================= */

export default function Placements() {
  /* =======================================================
     CONTEXT
  ======================================================= */

  const {
    placements,
    addPlacement,
    updatePlacement,
    deletePlacement,
  } = useAppData();

  /* =======================================================
     STATES
  ======================================================= */

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [form, setForm] =
    useState<PlacementForm>(
      emptyForm
    );

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredPlacements =
    placements.filter(
      (placement) => {
        const text = `
          ${placement.placementId}
          ${placement.applicationId}
          ${placement.studentId}
          ${placement.studentName}
          ${placement.company}
          ${placement.role}
          ${placement.packageLpa}
          ${placement.joiningDate}
          ${placement.placementType}
          ${placement.status}
        `.toLowerCase();

        return (
          text.includes(
            search.toLowerCase()
          ) &&
          (statusFilter === "All" ||
            placement.status ===
              statusFilter)
        );
      }
    );

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const {
      name,
      value,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =======================================================
     OPEN ADD FORM
  ======================================================= */

  const openAddForm = () => {
    setEditingId(null);

    setForm({
      ...emptyForm,
    });

    setShowForm(true);
  };

  /* =======================================================
     EDIT
  ======================================================= */

  const editPlacement = (
    placement: Placement
  ) => {
    setEditingId(
      placement.id
    );

    setForm({
      placementId:
        placement.placementId,

      applicationId:
        placement.applicationId,

      studentId:
        placement.studentId,

      studentName:
        placement.studentName,

      company:
        placement.company,

      role:
        placement.role,

      packageLpa:
        placement.packageLpa,

      joiningDate:
        placement.joiningDate,

      placementType:
        placement.placementType,

      status:
        placement.status,
    });

    setShowForm(true);
  };

  /* =======================================================
     CANCEL
  ======================================================= */

  const cancelForm = () => {
    setShowForm(false);

    setEditingId(null);

    setForm({
      ...emptyForm,
    });
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const savePlacement = () => {
    /* -----------------------------------------------------
       VALIDATION
    ----------------------------------------------------- */

    if (
      !form.placementId.trim() ||
      !form.applicationId.trim() ||
      !form.studentId.trim() ||
      !form.studentName.trim() ||
      !form.company.trim() ||
      !form.role.trim() ||
      !form.packageLpa.trim() ||
      !form.joiningDate.trim()
    ) {
      alert(
        "Please fill all required fields."
      );

      return;
    }

    /* -----------------------------------------------------
       DUPLICATE PLACEMENT ID CHECK
    ----------------------------------------------------- */

    const duplicate =
      placements.find(
        (placement) =>
          placement.placementId
            .toLowerCase() ===
            form.placementId
              .trim()
              .toLowerCase() &&
          placement.id !==
            editingId
      );

    if (duplicate) {
      alert(
        "Placement ID already exists. Please use a different Placement ID."
      );

      return;
    }

    /* -----------------------------------------------------
       UPDATE
    ----------------------------------------------------- */

    if (editingId !== null) {
      updatePlacement(
        editingId,
        {
          ...form,
          placementId:
            form.placementId.trim(),
          applicationId:
            form.applicationId.trim(),
          studentId:
            form.studentId.trim(),
          studentName:
            form.studentName.trim(),
          company:
            form.company.trim(),
          role:
            form.role.trim(),
          packageLpa:
            form.packageLpa.trim(),
          joiningDate:
            form.joiningDate,
          placementType:
            form.placementType,
          status:
            form.status,
        }
      );

      alert(
        "Placement updated successfully!"
      );
    }

    /* -----------------------------------------------------
       ADD
    ----------------------------------------------------- */

    else {
      addPlacement({
        ...form,
        placementId:
          form.placementId.trim(),
        applicationId:
          form.applicationId.trim(),
        studentId:
          form.studentId.trim(),
        studentName:
          form.studentName.trim(),
        company:
          form.company.trim(),
        role:
          form.role.trim(),
        packageLpa:
          form.packageLpa.trim(),
        joiningDate:
          form.joiningDate,
        placementType:
          form.placementType,
        status:
          form.status,
      });

      alert(
        "Placement added successfully!"
      );
    }

    cancelForm();
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDeletePlacement = (
    id: number
  ) => {
    const placement =
      placements.find(
        (item) =>
          item.id === id
      );

    const confirmed =
      window.confirm(
        `Are you sure you want to delete placement ${
          placement?.placementId ||
          ""
        }?`
      );

    if (!confirmed) {
      return;
    }

    deletePlacement(id);

    alert(
      "Placement deleted successfully!"
    );
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="students-page">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="page-header">

        <div>
          <h1>
            Placements
          </h1>

          <p>
            Manage and monitor
            successful student
            placements.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={
            openAddForm
          }
        >
          <Plus size={18} />

          Add Placement
        </button>

      </div>

      {/* ===================================================
          FORM
      =================================================== */}

      {showForm && (
        <div className="students-card">

          <div className="table-header">

            <h2>
              {editingId !== null
                ? "Edit Placement"
                : "Add Placement"}
            </h2>

            <button
              className="icon-button"
              onClick={
                cancelForm
              }
              title="Close"
            >
              <X size={18} />
            </button>

          </div>

          <div className="student-form">

            {/* PLACEMENT ID */}

            <input
              name="placementId"
              placeholder="Placement ID"
              value={
                form.placementId
              }
              onChange={
                handleChange
              }
            />

            {/* APPLICATION ID */}

            <input
              name="applicationId"
              placeholder="Application ID"
              value={
                form.applicationId
              }
              onChange={
                handleChange
              }
            />

            {/* STUDENT ID */}

            <input
              name="studentId"
              placeholder="Student ID"
              value={
                form.studentId
              }
              onChange={
                handleChange
              }
            />

            {/* STUDENT NAME */}

            <input
              name="studentName"
              placeholder="Student Name"
              value={
                form.studentName
              }
              onChange={
                handleChange
              }
            />

            {/* COMPANY */}

            <input
              name="company"
              placeholder="Company Name"
              value={
                form.company
              }
              onChange={
                handleChange
              }
            />

            {/* ROLE */}

            <input
              name="role"
              placeholder="Job Role"
              value={
                form.role
              }
              onChange={
                handleChange
              }
            />

            {/* PACKAGE */}

            <input
              name="packageLpa"
              placeholder="Package (Example: 8 LPA)"
              value={
                form.packageLpa
              }
              onChange={
                handleChange
              }
            />

            {/* JOINING DATE */}

            <input
              type="date"
              name="joiningDate"
              value={
                form.joiningDate
              }
              onChange={
                handleChange
              }
            />

            {/* PLACEMENT TYPE */}

            <select
              name="placementType"
              value={
                form.placementType
              }
              onChange={
                handleChange
              }
            >
              <option value="Full Time">
                Full Time
              </option>

              <option value="Internship">
                Internship
              </option>

              <option value="Internship + Full Time">
                Internship + Full Time
              </option>
            </select>

            {/* STATUS */}

            <select
              name="status"
              value={
                form.status
              }
              onChange={
                handleChange
              }
            >
              <option value="Placed">
                Placed
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Withdrawn">
                Withdrawn
              </option>
            </select>

            {/* BUTTONS */}

            <div className="form-buttons">

              <button
                className="primary-button"
                onClick={
                  savePlacement
                }
              >
                {editingId !== null
                  ? "Update Placement"
                  : "Add Placement"}
              </button>

              <button
                className="secondary-button"
                onClick={
                  cancelForm
                }
              >
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ===================================================
          SEARCH + FILTER
      =================================================== */}

      <div className="student-toolbar">

        <div className="student-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search by placement ID, student, company, role or package..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        <select
          className="filter-select"
          value={
            statusFilter
          }
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
        >
          <option value="All">
            All Statuses
          </option>

          <option value="Placed">
            Placed
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Withdrawn">
            Withdrawn
          </option>
        </select>

      </div>

      {/* ===================================================
          TABLE
      =================================================== */}

      <div className="students-card">

        <div className="table-header">

          <h2>
            Placement List
          </h2>

          <span>
            {
              filteredPlacements.length
            }{" "}
            Placements
          </span>

        </div>

        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>
                  Placement ID
                </th>

                <th>
                  Application ID
                </th>

                <th>
                  Student
                </th>

                <th>
                  Student ID
                </th>

                <th>
                  Company
                </th>

                <th>
                  Role
                </th>

                <th>
                  Package
                </th>

                <th>
                  Joining Date
                </th>

                <th>
                  Type
                </th>

                <th>
                  Status
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredPlacements.length >
              0 ? (
                filteredPlacements.map(
                  (
                    placement
                  ) => (
                    <tr
                      key={
                        placement.id
                      }
                    >

                      <td>
                        <strong>
                          {
                            placement.placementId
                          }
                        </strong>
                      </td>

                      <td>
                        {
                          placement.applicationId
                        }
                      </td>

                      <td>
                        {
                          placement.studentName
                        }
                      </td>

                      <td>
                        {
                          placement.studentId
                        }
                      </td>

                      <td>
                        {
                          placement.company
                        }
                      </td>

                      <td>
                        {
                          placement.role
                        }
                      </td>

                      <td>
                        {
                          placement.packageLpa
                        }
                      </td>

                      <td>
                        {
                          placement.joiningDate
                        }
                      </td>

                      <td>
                        {
                          placement.placementType
                        }
                      </td>

                      <td>

                        <span className="status-badge">
                          {
                            placement.status
                          }
                        </span>

                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            className="icon-button"
                            title="Edit"
                            onClick={() =>
                              editPlacement(
                                placement
                              )
                            }
                          >
                            <Edit
                              size={
                                17
                              }
                            />
                          </button>

                          <button
                            className="icon-button delete-button"
                            title="Delete"
                            onClick={() =>
                              handleDeletePlacement(
                                placement.id
                              )
                            }
                          >
                            <Trash2
                              size={
                                17
                              }
                            />
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )
              ) : (
                <tr>

                  <td
                    colSpan={
                      11
                    }
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "30px",
                    }}
                  >
                    No placements
                    found.
                  </td>

                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}