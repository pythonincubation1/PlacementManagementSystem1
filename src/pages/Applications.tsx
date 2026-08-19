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
  type Application,
} from "../context/AppDataContext";

/* =========================================================
   FORM TYPE
========================================================= */

type ApplicationForm = {
  applicationId: string;
  studentId: string;
  studentName: string;
  company: string;
  driveId: string;
  jobRole: string;
  appliedDate: string;
  status: string;
};

/* =========================================================
   EMPTY FORM
========================================================= */

const emptyForm: ApplicationForm = {
  applicationId: "",
  studentId: "",
  studentName: "",
  company: "",
  driveId: "",
  jobRole: "",
  appliedDate: "",
  status: "Applied",
};

/* =========================================================
   COMPONENT
========================================================= */

export default function Applications() {

  /* =======================================================
     APP DATA
  ======================================================= */

  const {
    applications,
    students,
    placementDrives,
    addApplication,
    updateApplication,
    deleteApplication,
  } = useAppData();

  /* =======================================================
     STATES
  ======================================================= */

  const [search, setSearch] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [form, setForm] =
    useState<ApplicationForm>({
      ...emptyForm,
    });

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredApplications =
    useMemo(() => {

      const searchText =
        search.trim().toLowerCase();

      if (!searchText) {
        return applications;
      }

      return applications.filter(
        (application: Application) =>
          `
          ${application.applicationId}
          ${application.studentId}
          ${application.studentName}
          ${application.company}
          ${application.driveId}
          ${application.jobRole}
          ${application.appliedDate}
          ${application.status}
          `
            .toLowerCase()
            .includes(searchText)
      );

    }, [
      applications,
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
     STUDENT CHANGE
  ======================================================= */

  const handleStudentChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {

    const studentId =
      e.target.value;

    const selectedStudent =
      students.find(
        (student) =>
          student.studentId ===
          studentId
      );

    if (!selectedStudent) {

      setForm(
        (previousForm) => ({
          ...previousForm,
          studentId: "",
          studentName: "",
        })
      );

      return;
    }

    setForm(
      (previousForm) => ({
        ...previousForm,

        studentId:
          selectedStudent.studentId,

        studentName:
          selectedStudent.name,
      })
    );
  };

  /* =======================================================
     DRIVE CHANGE
  ======================================================= */

  const handleDriveChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {

    const driveId =
      e.target.value;

    const selectedDrive =
      placementDrives.find(
        (drive) =>
          drive.driveId ===
          driveId
      );

    if (!selectedDrive) {

      setForm(
        (previousForm) => ({
          ...previousForm,
          driveId: "",
          company: "",
          jobRole: "",
        })
      );

      return;
    }

    setForm(
      (previousForm) => ({
        ...previousForm,

        driveId:
          selectedDrive.driveId,

        company:
          selectedDrive.company,

        jobRole:
          selectedDrive.jobRole,
      })
    );
  };

  /* =======================================================
     GENERATE APPLICATION ID
  ======================================================= */

  const generateApplicationId =
    () => {

      const numbers =
        applications
          .map(
            (application) => {

              const match =
                application.applicationId.match(
                  /^APP(\d+)$/
                );

              return match
                ? Number(match[1])
                : 0;
            }
          );

      const nextNumber =
        numbers.length > 0
          ? Math.max(...numbers) + 1
          : 1;

      return `APP${String(
        nextNumber
      ).padStart(3, "0")}`;
    };

  /* =======================================================
     OPEN ADD FORM
  ======================================================= */

  const openAddForm = () => {

    setEditingId(null);

    setForm({
      ...emptyForm,

      applicationId:
        generateApplicationId(),

      appliedDate:
        new Date()
          .toISOString()
          .split("T")[0],
    });

    setShowForm(true);
  };

  /* =======================================================
     OPEN EDIT FORM
  ======================================================= */

  const editApplication = (
    application: Application
  ) => {

    setEditingId(
      application.id
    );

    setForm({
      applicationId:
        application.applicationId,

      studentId:
        application.studentId,

      studentName:
        application.studentName,

      company:
        application.company,

      driveId:
        application.driveId,

      jobRole:
        application.jobRole,

      appliedDate:
        application.appliedDate,

      status:
        application.status,
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
     SAVE APPLICATION
  ======================================================= */

  const saveApplication = () => {

    /* -----------------------------------------------------
       VALIDATION
    ----------------------------------------------------- */

    if (
      !form.applicationId.trim() ||
      !form.studentId.trim() ||
      !form.studentName.trim() ||
      !form.company.trim() ||
      !form.driveId.trim() ||
      !form.jobRole.trim() ||
      !form.appliedDate ||
      !form.status
    ) {

      alert(
        "Please fill all required fields."
      );

      return;
    }

    /* -----------------------------------------------------
       DUPLICATE APPLICATION ID
    ----------------------------------------------------- */

    const duplicateApplication =
      applications.find(
        (application) =>
          application.applicationId
            .toLowerCase() ===
            form.applicationId
              .trim()
              .toLowerCase() &&
          application.id !==
            editingId
      );

    if (duplicateApplication) {

      alert(
        `Application ID ${form.applicationId.trim()} already exists.`
      );

      return;
    }

    /* =====================================================
       UPDATE
    ===================================================== */

    if (editingId !== null) {

      updateApplication(
        editingId,
        {
          applicationId:
            form.applicationId.trim(),

          studentId:
            form.studentId.trim(),

          studentName:
            form.studentName.trim(),

          company:
            form.company.trim(),

          driveId:
            form.driveId.trim(),

          jobRole:
            form.jobRole.trim(),

          appliedDate:
            form.appliedDate,

          status:
            form.status,
        }
      );

      alert(
        `Application ${form.applicationId} updated successfully!`
      );

    }

    /* =====================================================
       ADD
    ===================================================== */

    else {

      addApplication({
        applicationId:
          form.applicationId.trim(),

        studentId:
          form.studentId.trim(),

        studentName:
          form.studentName.trim(),

        company:
          form.company.trim(),

        driveId:
          form.driveId.trim(),

        jobRole:
          form.jobRole.trim(),

        appliedDate:
          form.appliedDate,

        status:
          form.status,
      });

      alert(
        `Application ${form.applicationId} added successfully!`
      );
    }

    cancelForm();
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const deleteApplicationItem = (
    id: number
  ) => {

    const application =
      applications.find(
        (item) =>
          item.id === id
      );

    if (!application) {
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${application.applicationId} - ${application.studentName}?`
      );

    if (!confirmed) {
      return;
    }

    deleteApplication(id);

    alert(
      "Application deleted successfully!"
    );
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="students-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="page-header">

        <div>

          <h1>
            Applications
          </h1>

          <p>
            Manage and monitor all
            student placement
            applications.
          </p>

        </div>

        <button
          className="primary-button"
          onClick={openAddForm}
        >
          <Plus size={18} />

          Add Application
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
                ? "Edit Application"
                : "Add Application"}

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
                APPLICATION ID
            ================================================= */}

            <input
              type="text"
              name="applicationId"
              placeholder="Application ID"
              value={
                form.applicationId
              }
              onChange={handleChange}
              disabled
            />

            {/* =================================================
                STUDENT
            ================================================= */}

            <select
              name="studentId"
              value={
                form.studentId
              }
              onChange={
                handleStudentChange
              }
            >

              <option value="">
                Select Student *
              </option>

              {students.map(
                (student) => (

                  <option
                    key={
                      student.id
                    }
                    value={
                      student.studentId
                    }
                  >
                    {student.studentId} -
                    {" "}
                    {student.name}
                  </option>

                )
              )}

            </select>

            {/* =================================================
                STUDENT NAME
            ================================================= */}

            <input
              type="text"
              name="studentName"
              placeholder="Student Name"
              value={
                form.studentName
              }
              readOnly
            />

            {/* =================================================
                DRIVE
            ================================================= */}

            <select
              name="driveId"
              value={
                form.driveId
              }
              onChange={
                handleDriveChange
              }
            >

              <option value="">
                Select Placement Drive *
              </option>

              {placementDrives.map(
                (drive) => (

                  <option
                    key={
                      drive.id
                    }
                    value={
                      drive.driveId
                    }
                  >
                    {drive.driveId} -
                    {" "}
                    {drive.company} -
                    {" "}
                    {drive.jobRole}
                  </option>

                )
              )}

            </select>

            {/* =================================================
                COMPANY
            ================================================= */}

            <input
              type="text"
              name="company"
              placeholder="Company"
              value={
                form.company
              }
              readOnly
            />

            {/* =================================================
                JOB ROLE
            ================================================= */}

            <input
              type="text"
              name="jobRole"
              placeholder="Job Role"
              value={
                form.jobRole
              }
              readOnly
            />

            {/* =================================================
                APPLIED DATE
            ================================================= */}

            <input
              type="date"
              name="appliedDate"
              value={
                form.appliedDate
              }
              onChange={handleChange}
            />

            {/* =================================================
                STATUS
            ================================================= */}

            <select
              name="status"
              value={
                form.status
              }
              onChange={handleChange}
            >

              <option value="Applied">
                Applied
              </option>

              <option value="Shortlisted">
                Shortlisted
              </option>

              <option value="Rejected">
                Rejected
              </option>

              <option value="Selected">
                Selected
              </option>

              <option value="Withdrawn">
                Withdrawn
              </option>

            </select>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="form-buttons">

              <button
                className="primary-button"
                onClick={
                  saveApplication
                }
              >

                {editingId !== null
                  ? "Update Application"
                  : "Save Application"}

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
            placeholder="Search by application, student, company, drive or role..."
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
          APPLICATION TABLE
      ================================================= */}

      <div className="students-card">

        <div className="table-header">

          <h2>
            Application List
          </h2>

          <span>
            {
              filteredApplications.length
            }{" "}
            {
              filteredApplications.length ===
              1
                ? "Application"
                : "Applications"
            }
          </span>

        </div>

        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>
                  Application ID
                </th>

                <th>
                  Student ID
                </th>

                <th>
                  Student
                </th>

                <th>
                  Company
                </th>

                <th>
                  Drive ID
                </th>

                <th>
                  Job Role
                </th>

                <th>
                  Applied Date
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

              {filteredApplications.length >
              0 ? (

                filteredApplications.map(
                  (
                    application
                  ) => (

                    <tr
                      key={
                        application.id
                      }
                    >

                      <td>
                        <strong>
                          {
                            application.applicationId
                          }
                        </strong>
                      </td>

                      <td>
                        {
                          application.studentId
                        }
                      </td>

                      <td>
                        {
                          application.studentName
                        }
                      </td>

                      <td>
                        {
                          application.company
                        }
                      </td>

                      <td>
                        <strong>
                          {
                            application.driveId
                          }
                        </strong>
                      </td>

                      <td>
                        {
                          application.jobRole
                        }
                      </td>

                      <td>
                        {
                          application.appliedDate
                        }
                      </td>

                      <td>

                        <span className="status-badge">
                          {
                            application.status
                          }
                        </span>

                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            className="icon-button"
                            title="Edit"
                            onClick={() =>
                              editApplication(
                                application
                              )
                            }
                          >
                            <Edit
                              size={17}
                            />
                          </button>

                          <button
                            className="icon-button delete-button"
                            title="Delete"
                            onClick={() =>
                              deleteApplicationItem(
                                application.id
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
                    colSpan={9}
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "30px",
                    }}
                  >
                    No applications
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