import React, { useMemo, useState } from "react";

import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Pause,
  Play,
} from "lucide-react";

import {
  useAppData,
  type User,
} from "../context/AppDataContext";

/* =========================================================
   FORM TYPE
========================================================= */

type UserForm = {
  name: string;
  email: string;
  role: string;
  status: string;
};

/* =========================================================
   INITIAL FORM
========================================================= */

const emptyForm: UserForm = {
  name: "",
  email: "",
  role: "Student",
  status: "Active",
};

/* =========================================================
   USERS PAGE
========================================================= */

export default function Users() {
  /* =======================================================
     CONTEXT
  ======================================================= */

  const {
    users,
    addUser,
    updateUser,
    deleteUser,
    addAuditLog,
  } = useAppData();

  /* =======================================================
     SEARCH
  ======================================================= */

  const [search, setSearch] = useState("");

  /* =======================================================
     MODAL
  ======================================================= */

  const [showModal, setShowModal] = useState(false);

  /* =======================================================
     EDITING USER
  ======================================================= */

  const [editingUser, setEditingUser] =
    useState<User | null>(null);

  /* =======================================================
     FORM
  ======================================================= */

  const [form, setForm] =
    useState<UserForm>(emptyForm);

  /* =======================================================
     FORM ERRORS
  ======================================================= */

  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });

  /* =======================================================
     FILTER USERS
  ======================================================= */

  const filteredUsers = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    if (!searchValue) {
      return users;
    }

    return users.filter((user) =>
      [
        user.userId,
        user.name,
        user.email,
        user.role,
        user.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchValue)
    );
  }, [users, search]);

  /* =======================================================
     OPEN ADD USER
  ======================================================= */

  const openAddUser = () => {
    setEditingUser(null);

    setForm({
      ...emptyForm,
    });

    setErrors({
      name: "",
      email: "",
    });

    setShowModal(true);
  };

  /* =======================================================
     OPEN EDIT USER
  ======================================================= */

  const openEditUser = (user: User) => {
    setEditingUser(user);

    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    setErrors({
      name: "",
      email: "",
    });

    setShowModal(true);
  };

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const closeModal = () => {
    setShowModal(false);

    setEditingUser(null);

    setForm({
      ...emptyForm,
    });

    setErrors({
      name: "",
      email: "",
    });
  };

  /* =======================================================
     HANDLE FORM CHANGE
  ======================================================= */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (
      name === "name" ||
      name === "email"
    ) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  /* =======================================================
     VALIDATE FORM
  ======================================================= */

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
    };

    let hasError = false;

    /* NAME */

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
      hasError = true;
    }

    /* EMAIL */

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      newErrors.email =
        "Please enter a valid email";
      hasError = true;
    }

    /* DUPLICATE EMAIL */

    const duplicateEmail = users.some(
      (user) =>
        user.email.toLowerCase() ===
          form.email.trim().toLowerCase() &&
        user.id !== editingUser?.id
    );

    if (duplicateEmail) {
      newErrors.email =
        "This email already exists";
      hasError = true;
    }

    setErrors(newErrors);

    return !hasError;
  };

  /* =======================================================
     ADD USER
  ======================================================= */

  const handleAddUser = () => {
    if (!validateForm()) {
      return;
    }

    /*
      userId is generated inside AppDataContext.
      This keeps ID generation centralized.
    */

    addUser({
      userId: "",
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      status: form.status,
    });

    addAuditLog(
      "Created",
      "Users",
      `Created user ${form.name.trim()}`
    );

    closeModal();
  };

  /* =======================================================
     UPDATE USER
  ======================================================= */

  const handleUpdateUser = () => {
    if (!validateForm()) {
      return;
    }

    if (!editingUser) {
      return;
    }

    updateUser(editingUser.id, {
      userId: editingUser.userId,
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      status: form.status,
    });

    addAuditLog(
      "Updated",
      "Users",
      `Updated user ${form.name.trim()}`
    );

    closeModal();
  };

  /* =======================================================
     DELETE USER
  ======================================================= */

  const handleDeleteUser = (user: User) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmed) {
      return;
    }

    deleteUser(user.id);

    addAuditLog(
      "Deleted",
      "Users",
      `Deleted user ${user.name}`
    );
  };

  /* =======================================================
     TOGGLE STATUS
  ======================================================= */

  const toggleUserStatus = (user: User) => {
    const newStatus =
      user.status === "Active"
        ? "Inactive"
        : "Active";

    updateUser(user.id, {
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      status: newStatus,
    });

    addAuditLog(
      "Status Changed",
      "Users",
      `${user.name} changed to ${newStatus}`
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
          <h1>Users</h1>

          <p>
            Manage system users and their roles.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openAddUser}
        >
          <Plus size={18} />
          Add User
        </button>

      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="student-toolbar">

        <div className="student-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search by name, ID, email or role..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      {/* =================================================
          USER CARD
      ================================================= */}

      <div className="students-card">

        <div className="table-header">

          <div>
            <h2>User List</h2>

            <p>
              {filteredUsers.length} users found
            </p>
          </div>

        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>User ID</th>

                <th>Name</th>

                <th>Email</th>

                <th>Role</th>

                <th>Status</th>

                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {filteredUsers.length > 0 ? (

                filteredUsers.map((user) => (

                  <tr key={user.id}>

                    {/* USER ID */}

                    <td>
                      <strong>
                        {user.userId}
                      </strong>
                    </td>

                    {/* NAME */}

                    <td>
                      {user.name}
                    </td>

                    {/* EMAIL */}

                    <td>
                      {user.email}
                    </td>

                    {/* ROLE */}

                    <td>

                      <span className="role-badge">
                        {user.role}
                      </span>

                    </td>

                    {/* STATUS */}

                    <td>

                      <span
                        className={`status-badge ${
                          user.status === "Active"
                            ? "status-active"
                            : "status-inactive"
                        }`}
                      >
                        {user.status}
                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td>

                      <div className="action-buttons">

                        {/* EDIT */}

                        <button
                          className="icon-button"
                          title="Edit User"
                          onClick={() =>
                            openEditUser(user)
                          }
                        >
                          <Edit size={17} />
                        </button>

                        {/* ACTIVATE / DEACTIVATE */}

                        <button
                          className="icon-button"
                          title={
                            user.status === "Active"
                              ? "Deactivate User"
                              : "Activate User"
                          }
                          onClick={() =>
                            toggleUserStatus(user)
                          }
                        >

                          {user.status === "Active" ? (
                            <Pause size={17} />
                          ) : (
                            <Play size={17} />
                          )}

                        </button>

                        {/* DELETE */}

                        <button
                          className="icon-button delete-button"
                          title="Delete User"
                          onClick={() =>
                            handleDeleteUser(user)
                          }
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No users found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (

        <div
          className="modal-overlay"
          onClick={closeModal}
        >

          <div
            className="modal-container"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <h2>
                  {editingUser
                    ? "Edit User"
                    : "Add New User"}
                </h2>

                <p>
                  {editingUser
                    ? "Update user information."
                    : "Create a new system user."}
                </p>

              </div>

              <button
                className="modal-close"
                onClick={closeModal}
                title="Close"
              >
                <X size={20} />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="modal-body">

              {/* NAME */}

              <div className="form-group">

                <label>
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter user name"
                  value={form.name}
                  onChange={handleChange}
                />

                {errors.name && (
                  <span className="form-error">
                    {errors.name}
                  </span>
                )}

              </div>

              {/* EMAIL */}

              <div className="form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={handleChange}
                />

                {errors.email && (
                  <span className="form-error">
                    {errors.email}
                  </span>
                )}

              </div>

              {/* ROLE */}

              <div className="form-group">

                <label>
                  Role
                </label>

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >

                  <option value="Admin">
                    Admin
                  </option>

                  <option value="Placement Officer">
                    Placement Officer
                  </option>

                  <option value="HR">
                    HR
                  </option>

                  <option value="Student">
                    Student
                  </option>

                </select>

              </div>

              {/* STATUS */}

              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="modal-footer">

              <button
                className="secondary-button"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={
                  editingUser
                    ? handleUpdateUser
                    : handleAddUser
                }
              >

                {editingUser ? (
                  <>
                    <Edit size={18} />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Add User
                  </>
                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}