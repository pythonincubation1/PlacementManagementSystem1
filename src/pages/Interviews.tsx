import React, {
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
  type Interview,
} from "../context/AppDataContext";

/* =========================================================
   FORM TYPE
========================================================= */

type InterviewForm = {
  interviewId: string;

  applicationId: string;

  studentName: string;

  studentId: string;

  company: string;

  role: string;

  interviewDate: string;

  interviewTime: string;

  mode: string;

  interviewer: string;

  status: string;
};

/* =========================================================
   FORM ERRORS
========================================================= */

type FormErrors = {
  interviewId?: string;

  applicationId?: string;

  studentName?: string;

  studentId?: string;

  company?: string;

  role?: string;

  interviewDate?: string;

  interviewTime?: string;

  mode?: string;

  interviewer?: string;

  status?: string;
};

/* =========================================================
   EMPTY FORM
========================================================= */

const emptyForm: InterviewForm = {
  interviewId: "",

  applicationId: "",

  studentName: "",

  studentId: "",

  company: "",

  role: "",

  interviewDate: "",

  interviewTime: "",

  mode: "Online",

  interviewer: "",

  status: "Scheduled",
};

/* =========================================================
   COMPONENT
========================================================= */

export default function Interviews() {

  /* =======================================================
     CONTEXT
  ======================================================= */

  const {
    interviews,

    addInterview,

    updateInterview,

    deleteInterview,
  } = useAppData();

  /* =======================================================
     STATES
  ======================================================= */

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    editingId,
    setEditingId,
  ] = useState<number | null>(
    null
  );

  const [
    form,
    setForm,
  ] =
    useState<InterviewForm>(
      emptyForm
    );

  const [
    errors,
    setErrors,
  ] =
    useState<FormErrors>({});

  /* =======================================================
     SEARCH + FILTER
  ======================================================= */

  const filteredInterviews =
    interviews.filter(
      (interview) => {

        const searchText = `
          ${interview.interviewId}
          ${interview.applicationId}
          ${interview.studentName}
          ${interview.studentId}
          ${interview.company}
          ${interview.role}
          ${interview.interviewer}
          ${interview.mode}
          ${interview.status}
        `.toLowerCase();

        const matchesSearch =
          searchText.includes(
            search.toLowerCase()
          );

        const matchesStatus =
          statusFilter === "All" ||
          interview.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
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

    setForm(
      (previous) => ({
        ...previous,

        [name]: value,
      })
    );

    setErrors(
      (previous) => ({
        ...previous,

        [name]:
          undefined,
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

    setErrors({});

    setShowForm(true);
  };

  /* =======================================================
     OPEN EDIT FORM
  ======================================================= */

  const editInterview = (
    interview: Interview
  ) => {

    setEditingId(
      interview.id
    );

    setForm({
      interviewId:
        interview.interviewId,

      applicationId:
        interview.applicationId,

      studentName:
        interview.studentName,

      studentId:
        interview.studentId,

      company:
        interview.company,

      role:
        interview.role,

      interviewDate:
        interview.interviewDate,

      interviewTime:
        interview.interviewTime,

      mode:
        interview.mode,

      interviewer:
        interview.interviewer,

      status:
        interview.status,
    });

    setErrors({});

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

    setErrors({});
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateForm =
    (): FormErrors => {

      const newErrors: FormErrors =
        {};

      /* INTERVIEW ID */

      if (
        !form.interviewId.trim()
      ) {
        newErrors.interviewId =
          "Interview ID is required.";
      }

      /* APPLICATION ID */

      if (
        !form.applicationId.trim()
      ) {
        newErrors.applicationId =
          "Application ID is required.";
      }

      /* STUDENT NAME */

      if (
        !form.studentName.trim()
      ) {
        newErrors.studentName =
          "Student name is required.";
      }

      /* STUDENT ID */

      if (
        !form.studentId.trim()
      ) {
        newErrors.studentId =
          "Student ID is required.";
      }

      /* COMPANY */

      if (
        !form.company.trim()
      ) {
        newErrors.company =
          "Company name is required.";
      }

      /* ROLE */

      if (
        !form.role.trim()
      ) {
        newErrors.role =
          "Job role is required.";
      }

      /* DATE */

      if (
        !form.interviewDate
      ) {
        newErrors.interviewDate =
          "Interview date is required.";
      }

      /* TIME */

      if (
        !form.interviewTime
      ) {
        newErrors.interviewTime =
          "Interview time is required.";
      }

      /* MODE */

      if (!form.mode) {
        newErrors.mode =
          "Interview mode is required.";
      }

      /* INTERVIEWER */

      if (
        !form.interviewer.trim()
      ) {
        newErrors.interviewer =
          "Interviewer name is required.";
      }

      /* STATUS */

      if (!form.status) {
        newErrors.status =
          "Interview status is required.";
      }

      /* =================================================
         PAST DATE
      ================================================= */

      if (
        form.interviewDate
      ) {

        const today =
          new Date();

        today.setHours(
          0,
          0,
          0,
          0
        );

        const selectedDate =
          new Date(
            form.interviewDate +
              "T00:00:00"
          );

        if (
          selectedDate <
          today
        ) {
          newErrors.interviewDate =
            "Interview date cannot be in the past.";
        }
      }

      /* =================================================
         DUPLICATE INTERVIEW ID
      ================================================= */

      const duplicateInterviewId =
        interviews.some(
          (interview) =>
            interview.interviewId
              .trim()
              .toLowerCase() ===
              form.interviewId
                .trim()
                .toLowerCase() &&
            interview.id !==
              editingId
        );

      if (
        duplicateInterviewId
      ) {
        newErrors.interviewId =
          "Interview ID already exists.";
      }

      /* =================================================
         DUPLICATE APPLICATION ID
      ================================================= */

      const duplicateApplicationId =
        interviews.some(
          (interview) =>
            interview.applicationId
              .trim()
              .toLowerCase() ===
              form.applicationId
                .trim()
                .toLowerCase() &&
            interview.id !==
              editingId
        );

      if (
        duplicateApplicationId
      ) {
        newErrors.applicationId =
          "Application ID already has an interview.";
      }

      return newErrors;
    };

  /* =======================================================
     SAVE INTERVIEW
  ======================================================= */

  const saveInterview = () => {

    const validationErrors =
      validateForm();

    setErrors(
      validationErrors
    );

    if (
      Object.keys(
        validationErrors
      ).length > 0
    ) {
      return;
    }

    /* =================================================
       INTERVIEW DATA
    ================================================= */

    const interviewData = {
      interviewId:
        form.interviewId.trim(),

      applicationId:
        form.applicationId.trim(),

      studentName:
        form.studentName.trim(),

      studentId:
        form.studentId.trim(),

      company:
        form.company.trim(),

      role:
        form.role.trim(),

      interviewDate:
        form.interviewDate,

      interviewTime:
        form.interviewTime,

      mode:
        form.mode,

      interviewer:
        form.interviewer.trim(),

      status:
        form.status,
    };

    /* =================================================
       UPDATE
    ================================================= */

    if (
      editingId !== null
    ) {

      updateInterview(
        editingId,
        interviewData
      );

      alert(
        "Interview updated successfully!"
      );
    }

    /* =================================================
       ADD
    ================================================= */

    else {

      addInterview(
        interviewData
      );

      alert(
        "Interview scheduled successfully!"
      );
    }

    cancelForm();
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDeleteInterview =
    (id: number) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this interview?"
        );

      if (confirmed) {

        deleteInterview(id);

        alert(
          "Interview deleted successfully!"
        );
      }
    };

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {

    setSearch("");

    setStatusFilter("All");
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="students-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header">

        <div>

          <h1>
            Interviews
          </h1>

          <p>
            Manage and monitor student
            placement interviews.
          </p>

        </div>

        <button
          className="primary-button"
          onClick={
            openAddForm
          }
        >
          <Plus size={18} />

          Schedule Interview
        </button>

      </div>

      {/* =================================================
          FORM
      ================================================= */}

      {showForm && (

        <div className="students-card">

          <div className="table-header">

            <h2>
              {editingId !== null
                ? "Edit Interview"
                : "Schedule Interview"}
            </h2>

            <button
              className="icon-button"
              title="Close"
              onClick={
                cancelForm
              }
            >
              <X size={18} />
            </button>

          </div>

          <div className="student-form">

            {/* INTERVIEW ID */}

            <div className="form-field">

              <label>
                Interview ID *
              </label>

              <input
                type="text"
                name="interviewId"
                placeholder="Example: INT004"
                value={
                  form.interviewId
                }
                onChange={
                  handleChange
                }
              />

              {errors.interviewId && (
                <small className="error-text">
                  {
                    errors.interviewId
                  }
                </small>
              )}

            </div>

            {/* APPLICATION ID */}

            <div className="form-field">

              <label>
                Application ID *
              </label>

              <input
                type="text"
                name="applicationId"
                placeholder="Example: APP004"
                value={
                  form.applicationId
                }
                onChange={
                  handleChange
                }
              />

              {errors.applicationId && (
                <small className="error-text">
                  {
                    errors.applicationId
                  }
                </small>
              )}

            </div>

            {/* STUDENT NAME */}

            <div className="form-field">

              <label>
                Student Name *
              </label>

              <input
                type="text"
                name="studentName"
                placeholder="Student Name"
                value={
                  form.studentName
                }
                onChange={
                  handleChange
                }
              />

              {errors.studentName && (
                <small className="error-text">
                  {
                    errors.studentName
                  }
                </small>
              )}

            </div>

            {/* STUDENT ID */}

            <div className="form-field">

              <label>
                Student ID *
              </label>

              <input
                type="text"
                name="studentId"
                placeholder="Example: STU004"
                value={
                  form.studentId
                }
                onChange={
                  handleChange
                }
              />

              {errors.studentId && (
                <small className="error-text">
                  {
                    errors.studentId
                  }
                </small>
              )}

            </div>

            {/* COMPANY */}

            <div className="form-field">

              <label>
                Company *
              </label>

              <input
                type="text"
                name="company"
                placeholder="Company Name"
                value={
                  form.company
                }
                onChange={
                  handleChange
                }
              />

              {errors.company && (
                <small className="error-text">
                  {
                    errors.company
                  }
                </small>
              )}

            </div>

            {/* ROLE */}

            <div className="form-field">

              <label>
                Job Role *
              </label>

              <input
                type="text"
                name="role"
                placeholder="Example: Software Engineer"
                value={
                  form.role
                }
                onChange={
                  handleChange
                }
              />

              {errors.role && (
                <small className="error-text">
                  {
                    errors.role
                  }
                </small>
              )}

            </div>

            {/* DATE */}

            <div className="form-field">

              <label>
                Interview Date *
              </label>

              <input
                type="date"
                name="interviewDate"
                value={
                  form.interviewDate
                }
                onChange={
                  handleChange
                }
              />

              {errors.interviewDate && (
                <small className="error-text">
                  {
                    errors.interviewDate
                  }
                </small>
              )}

            </div>

            {/* TIME */}

            <div className="form-field">

              <label>
                Interview Time *
              </label>

              <input
                type="time"
                name="interviewTime"
                value={
                  form.interviewTime
                }
                onChange={
                  handleChange
                }
              />

              {errors.interviewTime && (
                <small className="error-text">
                  {
                    errors.interviewTime
                  }
                </small>
              )}

            </div>

            {/* MODE */}

            <div className="form-field">

              <label>
                Interview Mode *
              </label>

              <select
                name="mode"
                value={
                  form.mode
                }
                onChange={
                  handleChange
                }
              >

                <option value="Online">
                  Online
                </option>

                <option value="Offline">
                  Offline
                </option>

              </select>

              {errors.mode && (
                <small className="error-text">
                  {
                    errors.mode
                  }
                </small>
              )}

            </div>

            {/* INTERVIEWER */}

            <div className="form-field">

              <label>
                Interviewer *
              </label>

              <input
                type="text"
                name="interviewer"
                placeholder="Interviewer Name"
                value={
                  form.interviewer
                }
                onChange={
                  handleChange
                }
              />

              {errors.interviewer && (
                <small className="error-text">
                  {
                    errors.interviewer
                  }
                </small>
              )}

            </div>

            {/* STATUS */}

            <div className="form-field">

              <label>
                Status *
              </label>

              <select
                name="status"
                value={
                  form.status
                }
                onChange={
                  handleChange
                }
              >

                <option value="Scheduled">
                  Scheduled
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>

                <option value="Selected">
                  Selected
                </option>

                <option value="Rejected">
                  Rejected
                </option>

              </select>

              {errors.status && (
                <small className="error-text">
                  {
                    errors.status
                  }
                </small>
              )}

            </div>

            {/* BUTTONS */}

            <div className="form-buttons">

              <button
                className="primary-button"
                onClick={
                  saveInterview
                }
              >
                {editingId !== null
                  ? "Update Interview"
                  : "Schedule Interview"}
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

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="student-toolbar">

        <div className="student-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search by student, company, role or interviewer..."
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

          <option value="Scheduled">
            Scheduled
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Completed">
            Completed
          </option>

          <option value="Cancelled">
            Cancelled
          </option>

          <option value="Selected">
            Selected
          </option>

          <option value="Rejected">
            Rejected
          </option>

        </select>

        {(search ||
          statusFilter !==
            "All") && (

          <button
            className="secondary-button"
            onClick={
              clearFilters
            }
          >
            Clear
          </button>

        )}

      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="students-card">

        <div className="table-header">

          <h2>
            Interview List
          </h2>

          <span>
            {
              filteredInterviews.length
            }{" "}
            Interviews
          </span>

        </div>

        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>
                  Interview ID
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
                  Date
                </th>

                <th>
                  Time
                </th>

                <th>
                  Mode
                </th>

                <th>
                  Interviewer
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

              {filteredInterviews.length >
              0 ? (

                filteredInterviews.map(
                  (interview) => (

                    <tr
                      key={
                        interview.id
                      }
                    >

                      <td>

                        <strong>
                          {
                            interview.interviewId
                          }
                        </strong>

                      </td>

                      <td>
                        {
                          interview.applicationId
                        }
                      </td>

                      <td>
                        {
                          interview.studentName
                        }
                      </td>

                      <td>
                        {
                          interview.studentId
                        }
                      </td>

                      <td>
                        {
                          interview.company
                        }
                      </td>

                      <td>
                        {
                          interview.role
                        }
                      </td>

                      <td>
                        {
                          interview.interviewDate
                        }
                      </td>

                      <td>
                        {
                          interview.interviewTime
                        }
                      </td>

                      <td>
                        {
                          interview.mode
                        }
                      </td>

                      <td>
                        {
                          interview.interviewer
                        }
                      </td>

                      <td>

                        <span className="status-badge">
                          {
                            interview.status
                          }
                        </span>

                      </td>

                      <td>

                        <div className="action-buttons">

                          {/* EDIT */}

                          <button
                            className="icon-button"
                            title="Edit"
                            onClick={() =>
                              editInterview(
                                interview
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
                              handleDeleteInterview(
                                interview.id
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
                    colSpan={12}
                    style={{
                      textAlign:
                        "center",

                      padding:
                        "30px",
                    }}
                  >
                    No interviews
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