import React, { useMemo, useState } from "react";

import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
} from "lucide-react";

import {
  useAppData,
  type Company,
} from "../context/AppDataContext";

type CompanyForm = {
  companyId: string;
  name: string;
  industry: string;
  location: string;
  website: string;
};

const emptyForm: CompanyForm = {
  companyId: "",
  name: "",
  industry: "",
  location: "",
  website: "",
};

export default function Companies() {
  /* =====================================================
     APP DATA CONTEXT
  ===================================================== */

  const {
    companies,
    addCompany,
    updateCompany,
    deleteCompany,
  } = useAppData();

  /* =====================================================
     LOCAL STATES
  ===================================================== */

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [form, setForm] =
    useState<CompanyForm>({
      ...emptyForm,
    });

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredCompanies = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    if (!searchText) {
      return companies;
    }

    return companies.filter(
      (company: Company) =>
        `${company.name}
        ${company.companyId}
        ${company.industry}
        ${company.location}
        ${company.website}
        ${company.status}`
          .toLowerCase()
          .includes(searchText)
    );
  }, [companies, search]);

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      name,
      value,
    } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  /* =====================================================
     OPEN ADD FORM
  ===================================================== */

  const openAddForm = () => {
    setEditingId(null);

    setForm({
      ...emptyForm,
    });

    setShowForm(true);
  };

  /* =====================================================
     OPEN EDIT FORM
  ===================================================== */

  const editCompany = (
    company: Company
  ) => {
    setEditingId(company.id);

    setForm({
      companyId: company.companyId,
      name: company.name,
      industry: company.industry,
      location: company.location,
      website: company.website,
    });

    setShowForm(true);
  };

  /* =====================================================
     CANCEL FORM
  ===================================================== */

  const cancelForm = () => {
    setShowForm(false);

    setEditingId(null);

    setForm({
      ...emptyForm,
    });
  };

  /* =====================================================
     SAVE COMPANY
  ===================================================== */

  const saveCompany = () => {
    /* ---------------------------------------------------
       VALIDATION
    --------------------------------------------------- */

    if (
      !form.companyId.trim() ||
      !form.name.trim() ||
      !form.industry.trim() ||
      !form.location.trim()
    ) {
      alert(
        "Please fill all required fields."
      );

      return;
    }

    /* ---------------------------------------------------
       COMPANY DATA
    --------------------------------------------------- */

    const companyData: Omit<
      Company,
      "id"
    > = {
      companyId:
        form.companyId.trim(),

      name:
        form.name.trim(),

      industry:
        form.industry.trim(),

      location:
        form.location.trim(),

      website:
        form.website.trim(),

      status: "Active",
    };

    /* ===================================================
       UPDATE COMPANY
    =================================================== */

    if (editingId !== null) {
      updateCompany(
        editingId,
        companyData
      );

      alert(
        "Company updated successfully!"
      );
    }

    /* ===================================================
       ADD COMPANY
    =================================================== */

    else {
      addCompany(
        companyData
      );

      alert(
        "Company added successfully!"
      );
    }

    /* ===================================================
       CLOSE FORM
    =================================================== */

    cancelForm();
  };

  /* =====================================================
     DELETE COMPANY
  ===================================================== */

  const handleDeleteCompany = (
    id: number
  ) => {
    const company =
      companies.find(
        (item: Company) =>
          item.id === id
      );

    if (!company) {
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${company.name}?`
      );

    if (!confirmed) {
      return;
    }

    deleteCompany(id);

    alert(
      "Company deleted successfully!"
    );
  };

  /* =====================================================
     RETURN UI
  ===================================================== */

  return (
    <div className="students-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="page-header">

        <div>
          <h1>
            Companies
          </h1>

          <p>
            Manage and monitor all
            registered companies.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openAddForm}
        >
          <Plus size={18} />

          Add Company
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
                ? "Edit Company"
                : "Add Company"}
            </h2>

            <button
              className="icon-button"
              onClick={cancelForm}
              title="Close"
              type="button"
            >
              <X size={18} />
            </button>

          </div>

          <div className="student-form">

            {/* COMPANY ID */}

            <input
              type="text"
              name="companyId"
              placeholder="Company ID *"
              value={
                form.companyId
              }
              onChange={
                handleChange
              }
            />

            {/* COMPANY NAME */}

            <input
              type="text"
              name="name"
              placeholder="Company Name *"
              value={
                form.name
              }
              onChange={
                handleChange
              }
            />

            {/* INDUSTRY */}

            <input
              type="text"
              name="industry"
              placeholder="Industry *"
              value={
                form.industry
              }
              onChange={
                handleChange
              }
            />

            {/* LOCATION */}

            <input
              type="text"
              name="location"
              placeholder="Location *"
              value={
                form.location
              }
              onChange={
                handleChange
              }
            />

            {/* WEBSITE */}

            <input
              type="url"
              name="website"
              placeholder="Website"
              value={
                form.website
              }
              onChange={
                handleChange
              }
            />

            {/* FORM BUTTONS */}

            <div className="form-buttons">

              <button
                className="primary-button"
                onClick={saveCompany}
                type="button"
              >
                {editingId !== null
                  ? "Update Company"
                  : "Save Company"}
              </button>

              <button
                className="secondary-button"
                onClick={cancelForm}
                type="button"
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
            placeholder="Search by company, ID, industry or location..."
            value={search}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement>
            ) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

      </div>

      {/* =================================================
          COMPANY LIST
      ================================================= */}

      <div className="students-card">

        <div className="table-header">

          <h2>
            Company List
          </h2>

          <span>
            {
              filteredCompanies.length
            }{" "}
            {filteredCompanies.length ===
            1
              ? "Company"
              : "Companies"}
          </span>

        </div>

        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>
                  Company ID
                </th>

                <th>
                  Company Name
                </th>

                <th>
                  Industry
                </th>

                <th>
                  Location
                </th>

                <th>
                  Website
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

              {filteredCompanies.length >
              0 ? (

                filteredCompanies.map(
                  (
                    company: Company
                  ) => (

                    <tr
                      key={
                        company.id
                      }
                    >

                      {/* COMPANY ID */}

                      <td>
                        <strong>
                          {
                            company.companyId
                          }
                        </strong>
                      </td>

                      {/* COMPANY NAME */}

                      <td>
                        {
                          company.name
                        }
                      </td>

                      {/* INDUSTRY */}

                      <td>
                        {
                          company.industry
                        }
                      </td>

                      {/* LOCATION */}

                      <td>
                        {
                          company.location
                        }
                      </td>

                      {/* WEBSITE */}

                      <td>

                        {company.website ? (

                          <a
                            href={
                              company.website
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            Visit
                          </a>

                        ) : (
                          "-"
                        )}

                      </td>

                      {/* STATUS */}

                      <td>

                        <span className="status-badge">
                          {
                            company.status
                          }
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="action-buttons">

                          {/* EDIT */}

                          <button
                            className="icon-button"
                            title="Edit"
                            type="button"
                            onClick={() =>
                              editCompany(
                                company
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
                            type="button"
                            onClick={() =>
                              handleDeleteCompany(
                                company.id
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
                    colSpan={7}
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "30px",
                    }}
                  >
                    No companies
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