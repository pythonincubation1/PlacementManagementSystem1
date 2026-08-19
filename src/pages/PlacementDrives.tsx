import React, {
  useMemo,
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
  type PlacementDrive,
} from "../context/AppDataContext";

/* =========================================================
   FORM TYPE
========================================================= */

type DriveForm = {
  driveId: string;
  company: string;
  jobRole: string;
  package: string;
  driveDate: string;
  location: string;
  status: string;
};

/* =========================================================
   EMPTY FORM
========================================================= */

const emptyForm: DriveForm = {
  driveId: "",
  company: "",
  jobRole: "",
  package: "",
  driveDate: "",
  location: "",
  status: "Upcoming",
};

/* =========================================================
   COMPONENT
========================================================= */

export default function PlacementDrives() {
  /* =======================================================
     APP DATA CONTEXT
  ======================================================= */

  const {
    placementDrives,
    addPlacementDrive,
    updatePlacementDrive,
    deletePlacementDrive,
  } = useAppData();

  /* =======================================================
     LOCAL STATES
  ======================================================= */

  const [search, setSearch] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [form, setForm] =
    useState<DriveForm>({
      ...emptyForm,
    });

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredDrives =
    useMemo(() => {
      const searchText =
        search.trim().toLowerCase();

      if (!searchText) {
        return placementDrives;
      }

      return placementDrives.filter(
        (drive: PlacementDrive) =>
          `
          ${drive.driveId}
          ${drive.company}
          ${drive.jobRole}
          ${drive.package}
          ${drive.driveDate}
          ${drive.location}
          ${drive.status}
          `
            .toLowerCase()
            .includes(searchText)
      );
    }, [
      placementDrives,
      search,
    ]);

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

    setForm(
      (previousForm) => ({
        ...previousForm,
        [name]: value,
      })
    );
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
     OPEN EDIT FORM
  ======================================================= */

  const editDrive = (
    drive: PlacementDrive
  ) => {
    setEditingId(drive.id);

    setForm({
      driveId: drive.driveId,
      company: drive.company,
      jobRole: drive.jobRole,
      package: drive.package,
      driveDate: drive.driveDate,
      location: drive.location,
      status: drive.status,
    });

    setShowForm(true);
  };

  /* =======================================================
     CANCEL FORM
  ======================================================= */

  const cancelForm = () => {
    setShowForm(false);

    setEditingId(null);

    setForm({
      ...emptyForm,
    });
  };

  /* =======================================================
     SAVE / UPDATE DRIVE
  ======================================================= */

  const saveDrive = () => {
    /* -----------------------------------------------------
       VALIDATION
    ----------------------------------------------------- */

    if (
      !form.driveId.trim() ||
      !form.company.trim() ||
      !form.jobRole.trim() ||
      !form.package.trim() ||
      !form.driveDate ||
      !form.location.trim() ||
      !form.status
    ) {
      alert(
        "Please fill all required fields."
      );

      return;
    }

    /* =====================================================
       CHECK DUPLICATE DRIVE ID
    ===================================================== */

    const duplicateDrive =
      placementDrives.find(
        (drive) =>
          drive.driveId
            .toLowerCase() ===
            form.driveId
              .trim()
              .toLowerCase() &&
          drive.id !== editingId
      );

    if (duplicateDrive) {
      alert(
        `Drive ID ${form.driveId.trim()} already exists. Please use a different Drive ID.`
      );

      return;
    }

    /* =====================================================
       UPDATE
    ===================================================== */

    if (editingId !== null) {
      updatePlacementDrive(
        editingId,
        {
          driveId:
            form.driveId.trim(),

          company:
            form.company.trim(),

          jobRole:
            form.jobRole.trim(),

          package:
            form.package.trim(),

          driveDate:
            form.driveDate,

          location:
            form.location.trim(),

          status:
            form.status,
        }
      );

      alert(
        `Placement drive ${form.driveId.trim()} updated successfully!`
      );
    }

    /* =====================================================
       ADD
    ===================================================== */

    else {
      addPlacementDrive({
        driveId:
          form.driveId.trim(),

        company:
          form.company.trim(),

        jobRole:
          form.jobRole.trim(),

        package:
          form.package.trim(),

        driveDate:
          form.driveDate,

        location:
          form.location.trim(),

        status:
          form.status,
      });

      alert(
        "Placement drive added successfully!"
      );
    }

    /* -----------------------------------------------------
       CLOSE FORM
    ----------------------------------------------------- */

    cancelForm();
  };

  /* =======================================================
     DELETE DRIVE
  ======================================================= */

  const deleteDrive = (
    id: number
  ) => {
    const drive =
      placementDrives.find(
        (item: PlacementDrive) =>
          item.id === id
      );

    if (!drive) {
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${drive.driveId} - ${drive.company}?`
      );

    if (!confirmed) {
      return;
    }

    deletePlacementDrive(id);

    alert(
      "Placement drive deleted successfully!"
    );
  };

  /* =======================================================
     RETURN UI
  ======================================================= */

  return (
    <div className="students-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="page-header">

        <div>
          <h1>
            Placement Drives
          </h1>

          <p>
            Manage and monitor all
            placement drives.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openAddForm}
        >
          <Plus size={18} />

          Add Drive
        </button>

      </div>

      {/* =================================================
          ADD / EDIT FORM
      ================================================= */}

      {showForm && (
        <div className="students-card">

          <div className="table-header">

            <h2>
              {editingId !== null
                ? "Edit Placement Drive"
                : "Add Placement Drive"}
            </h2>

            <button
              className="icon-button"
              onClick={cancelForm}
              title="Close"
            >
              <X size={18} />
            </button>

          </div>

          <div className="student-form">

            {/* =================================================
                DRIVE ID
            ================================================= */}

            <input
              type="text"
              name="driveId"
              placeholder="Drive ID e.g. DRV001 *"
              value={form.driveId}
              onChange={handleChange}
            />

            {/* =================================================
                COMPANY
            ================================================= */}

            <input
              type="text"
              name="company"
              placeholder="Company Name *"
              value={form.company}
              onChange={handleChange}
            />

            {/* =================================================
                JOB ROLE
            ================================================= */}

            <input
              type="text"
              name="jobRole"
              placeholder="Job Role *"
              value={form.jobRole}
              onChange={handleChange}
            />

            {/* =================================================
                PACKAGE
            ================================================= */}

            <input
              type="text"
              name="package"
              placeholder="Package e.g. 6 LPA *"
              value={form.package}
              onChange={handleChange}
            />

            {/* =================================================
                DRIVE DATE
            ================================================= */}

            <input
              type="date"
              name="driveDate"
              value={form.driveDate}
              onChange={handleChange}
            />

            {/* =================================================
                LOCATION
            ================================================= */}

            <input
              type="text"
              name="location"
              placeholder="Location *"
              value={form.location}
              onChange={handleChange}
            />

            {/* =================================================
                STATUS
            ================================================= */}

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Upcoming">
                Upcoming
              </option>

              <option value="Open">
                Open
              </option>

              <option value="Closed">
                Closed
              </option>
            </select>

            {/* =================================================
                FORM BUTTONS
            ================================================= */}

            <div className="form-buttons">

              <button
                className="primary-button"
                onClick={saveDrive}
              >
                {editingId !== null
                  ? "Update Drive"
                  : "Save Drive"}
              </button>

              <button
                className="secondary-button"
                onClick={cancelForm}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="student-toolbar">

        <div className="student-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search by drive, company, role or location..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

      </div>

      {/* =================================================
          DRIVE LIST
      ================================================= */}

      <div className="students-card">

        <div className="table-header">

          <h2>
            Placement Drive List
          </h2>

          <span>
            {filteredDrives.length}{" "}
            {filteredDrives.length === 1
              ? "Drive"
              : "Drives"}
          </span>

        </div>

        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>
                  Drive ID
                </th>

                <th>
                  Company
                </th>

                <th>
                  Job Role
                </th>

                <th>
                  Package
                </th>

                <th>
                  Drive Date
                </th>

                <th>
                  Location
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

              {filteredDrives.length > 0 ? (

                filteredDrives.map(
                  (
                    drive: PlacementDrive
                  ) => (

                    <tr
                      key={drive.id}
                    >

                      <td>
                        <strong>
                          {drive.driveId}
                        </strong>
                      </td>

                      <td>
                        {drive.company}
                      </td>

                      <td>
                        {drive.jobRole}
                      </td>

                      <td>
                        {drive.package}
                      </td>

                      <td>
                        {drive.driveDate}
                      </td>

                      <td>
                        {drive.location}
                      </td>

                      <td>
                        <span className="status-badge">
                          {drive.status}
                        </span>
                      </td>

                      <td>

                        <div className="action-buttons">

                          {/* EDIT */}

                          <button
                            className="icon-button"
                            title="Edit"
                            onClick={() =>
                              editDrive(
                                drive
                              )
                            }
                          >
                            <Edit
                              size={17}
                            />
                          </button>

                          {/* DELETE */}

                          <button
                            className="icon-button delete-button"
                            title="Delete"
                            onClick={() =>
                              deleteDrive(
                                drive.id
                              )
                            }
                          >
                            <Trash2
                              size={17}
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
                    colSpan={8}
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "30px",
                    }}
                  >
                    No placement
                    drives found.
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