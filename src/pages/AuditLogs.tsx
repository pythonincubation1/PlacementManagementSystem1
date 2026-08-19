import React, { useMemo, useState } from "react";
import "./AuditLogs.css";
import { useAppData } from "../context/AppDataContext";

const AuditLogs: React.FC = () => {
  const { auditLogs, clearAuditLogs } = useAppData();

  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");

  const modules = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(auditLogs.map((log) => log.module))
      ),
    ];
  }, [auditLogs]);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        log.user.toLowerCase().includes(searchText) ||
        log.action.toLowerCase().includes(searchText) ||
        log.module.toLowerCase().includes(searchText) ||
        log.description.toLowerCase().includes(searchText) ||
        log.date.toLowerCase().includes(searchText);

      const matchesModule =
        moduleFilter === "All" ||
        log.module === moduleFilter;

      return matchesSearch && matchesModule;
    });
  }, [auditLogs, search, moduleFilter]);

  const handleClearLogs = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all audit logs?"
    );

    if (confirmed) {
      clearAuditLogs();
    }
  };

  return (
    <div className="audit-page">
      {/* Header */}
      <div className="audit-header">
        <div>
          <h1>Audit Logs</h1>

          <p>
            Track all important activities performed in
            the system.
          </p>
        </div>

        <button
          className="clear-logs-btn"
          onClick={handleClearLogs}
          disabled={auditLogs.length === 0}
        >
          Clear Logs
        </button>
      </div>

      {/* Main Card */}
      <div className="audit-card">

        {/* Filters */}
        <div className="audit-filters">

          <input
            type="text"
            placeholder="Search audit logs..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={moduleFilter}
            onChange={(e) =>
              setModuleFilter(e.target.value)
            }
          >
            {modules.map((module) => (
              <option
                key={module}
                value={module}
              >
                {module}
              </option>
            ))}
          </select>

        </div>

        {/* Table */}
        <div className="audit-table-container">

          <table className="audit-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Action</th>
                <th>Module</th>
                <th>Description</th>
                <th>Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {filteredLogs.length > 0 ? (

                filteredLogs.map((log) => (

                  <tr key={log.id}>

                    <td>
                      {log.id}
                    </td>

                    <td className="user-name">
                      {log.user}
                    </td>

                    <td>
                      <span className="action-badge">
                        {log.action}
                      </span>
                    </td>

                    <td>
                      {log.module}
                    </td>

                    <td>
                      {log.description}
                    </td>

                    <td>
                      {log.date}
                    </td>

                    <td>

                      <span
                        className={
                          log.status === "Success"
                            ? "status-success"
                            : "status-failed"
                        }
                      >
                        {log.status}
                      </span>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan={7}
                    className="no-data"
                  >
                    {auditLogs.length === 0
                      ? "No audit logs available."
                      : "No audit logs found."}
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* Summary */}
        <div className="audit-summary">

          Showing{" "}
          <strong>
            {filteredLogs.length}
          </strong>{" "}
          of{" "}
          <strong>
            {auditLogs.length}
          </strong>{" "}
          audit logs

        </div>

      </div>
    </div>
  );
};

export default AuditLogs;