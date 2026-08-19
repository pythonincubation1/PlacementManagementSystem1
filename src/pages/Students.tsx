import React, { useState } from "react";

import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
} from "lucide-react";

import {
  useAppData,
  type Student,
} from "../context/AppDataContext";

/* =========================================================
   STUDENT FORM TYPE
========================================================= */

type StudentForm = {
  studentId: string;
  name: string;
  email: string;
  department: string;
  batch: string;
  cgpa: string;
};

/* =========================================================
   EMPTY FORM
========================================================= */

const emptyForm: StudentForm = {
  studentId: "",
  name: "",
  email: "",
  department: "",
  batch: "",
  cgpa: "",
};

/* =========================================================
   STUDENTS PAGE
========================================================= */

export default function Students() {
  /*
   * STEP 13.3 / 13.9
   *
   * Students data comes from AppDataContext.
   * Data is stored in localStorage.
   * Audit logs are also stored in localStorage.
   */

  const {
    students,
    setStudents,
    addAuditLog,
  } = useAppData();

  /* =====================================================
     STATES
  ===================================================== */

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [form, setForm] =
    useState<StudentForm>(emptyForm);

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredStudents = students.filter(
    (student) =>
      `${student.name} ${student.studentId} ${student.department}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  /* =====================================================
     FORM INPUT CHANGE
  ===================================================== */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     OPEN ADD FORM
  ===================================================== */

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  /* =====================================================
     OPEN EDIT FORM
  ===================================================== */

  const editStudent = (
    student: Student
  ) => {
    setEditingId(student.id);

    setForm({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      department: student.department,
      batch: student.batch,
      cgpa: student.cgpa.toString(),
    });

    setShowForm(true);
  };

  /* =====================================================
     CANCEL FORM
  ===================================================== */

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  /* =====================================================
     SAVE STUDENT
  ===================================================== */

  const saveStudent = () => {
    /* ---------------------------------------------------
       VALIDATION
    --------------------------------------------------- */

    if (
      !form.studentId ||
      !form.name ||
      !form.email ||
      !form.department ||
      !form.batch ||
      !form.cgpa
    ) {
      alert("Please fill all fields.");
      return;
    }

    const cgpaValue = Number(form.cgpa);

    if (
      isNaN(cgpaValue) ||
      cgpaValue < 0 ||
      cgpaValue > 10
    ) {
      alert(
        "CGPA must be between 0 and 10."
      );
      return;
    }

    /* ---------------------------------------------------
       EDIT EXISTING STUDENT
    --------------------------------------------------- */

    if (editingId !== null) {
      const existingStudent =
        students.find(
          (student) =>
            student.id === editingId
        );

      setStudents((prevStudents) =>
        prevStudents.map(
          (student) =>
            student.id === editingId
              ? {
                  ...student,
                  studentId:
                    form.studentId,
                  name: form.name,
                  email: form.email,
                  department:
                    form.department,
                  batch: form.batch,
                  cgpa: cgpaValue,
                }
              : student
        )
      );

      /* AUDIT LOG */

      addAuditLog(
        "Updated",
        "Students",
        `Updated student ${
          existingStudent?.name ||
          form.name
        }`
      );

      alert(
        "Student updated successfully!"
      );
    }

    /* ---------------------------------------------------
       ADD NEW STUDENT
    --------------------------------------------------- */

    else {
      const newStudent: Student = {
        id:
          students.length > 0
            ? Math.max(
                ...students.map(
                  (student) =>
                    student.id
                )
              ) + 1
            : 1,

        studentId:
          form.studentId,

        name: form.name,

        email: form.email,

        department:
          form.department,

        batch: form.batch,

        cgpa: cgpaValue,

        status: "Eligible",
      };

      setStudents((prevStudents) => [
        ...prevStudents,
        newStudent,
      ]);

      /* AUDIT LOG */

      addAuditLog(
        "Added",
        "Students",
        `Added student ${newStudent.name}`
      );

      alert(
        "Student added successfully!"
      );
    }

    cancelForm();
  };

  /* =====================================================
     DELETE STUDENT
  ===================================================== */

  const deleteStudent = (
    id: number
  ) => {
    const studentToDelete =
      students.find(
        (student) =>
          student.id === id
      );

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this student?"
      );

    if (!confirmed) {
      return;
    }

    setStudents((prevStudents) =>
      prevStudents.filter(
        (student) =>
          student.id !== id
      )
    );

    /* AUDIT LOG */

    if (studentToDelete) {
      addAuditLog(
        "Deleted",
        "Students",
        `Deleted student ${studentToDelete.name}`
      );
    }
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="students-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="page-header">

        <div>
          <h1>Students</h1>

          <p>
            Manage and monitor all
            registered students.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openAddForm}
        >
          <Plus size={18} />

          Add Student
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
                ? "Edit Student"
                : "Add Student"}
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

            {/* STUDENT ID */}

            <input
              type="text"
              name="studentId"
              placeholder="Student ID"
              value={form.studentId}
              onChange={handleChange}
            />

            {/* NAME */}

            <input
              type="text"
              name="name"
              placeholder="Student Name"
              value={form.name}
              onChange={handleChange}
            />

            {/* EMAIL */}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            {/* DEPARTMENT */}

            <input
              type="text"
              name="department"
              placeholder="Department"
              value={form.department}
              onChange={handleChange}
            />

            {/* BATCH */}

            <input
              type="text"
              name="batch"
              placeholder="Batch"
              value={form.batch}
              onChange={handleChange}
            />

            {/* CGPA */}

            <input
              type="number"
              name="cgpa"
              placeholder="CGPA"
              min="0"
              max="10"
              step="0.1"
              value={form.cgpa}
              onChange={handleChange}
            />

            {/* FORM BUTTONS */}

            <div className="form-buttons">

              <button
                className="primary-button"
                onClick={saveStudent}
              >
                {editingId !== null
                  ? "Update Student"
                  : "Save Student"}
              </button>

              <button
                type="button"
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
            placeholder="Search by name, ID or department..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      {/* =================================================
          STUDENT TABLE
      ================================================= */}

      <div className="students-card">

        <div className="table-header">

          <h2>
            Student List
          </h2>

          <span>
            {filteredStudents.length}{" "}
            Students
          </span>

        </div>

        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>
                  Student ID
                </th>

                <th>
                  Name
                </th>

                <th>
                  Email
                </th>

                <th>
                  Department
                </th>

                <th>
                  Batch
                </th>

                <th>
                  CGPA
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

              {filteredStudents.length >
              0 ? (

                filteredStudents.map(
                  (student) => (

                    <tr
                      key={student.id}
                    >

                      <td>
                        <strong>
                          {
                            student.studentId
                          }
                        </strong>
                      </td>

                      <td>
                        {student.name}
                      </td>

                      <td>
                        {student.email}
                      </td>

                      <td>
                        {
                          student.department
                        }
                      </td>

                      <td>
                        {student.batch}
                      </td>

                      <td>
                        {student.cgpa}
                      </td>

                      <td>
                        <span className="status-badge">
                          {
                            student.status
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
                              editStudent(
                                student
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
                              deleteStudent(
                                student.id
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
                    No students found.
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