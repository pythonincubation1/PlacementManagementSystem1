export type AuditLog = {
  id: number;
  user: string;
  action: string;
  module: string;
  description: string;
  date: string;
  status: "Success" | "Failed";
};

const AUDIT_LOGS_KEY = "placement_audit_logs";

export const addAuditLog = (
  action: string,
  module: string,
  description: string,
  user: string = "Admin"
) => {
  const existingLogs: AuditLog[] = JSON.parse(
    localStorage.getItem(AUDIT_LOGS_KEY) || "[]"
  );

  const newLog: AuditLog = {
    id: Date.now(),
    user,
    action,
    module,
    description,
    date: new Date().toLocaleString(),
    status: "Success",
  };

  localStorage.setItem(
    AUDIT_LOGS_KEY,
    JSON.stringify([newLog, ...existingLogs])
  );
};

export const getAuditLogs = (): AuditLog[] => {
  return JSON.parse(
    localStorage.getItem(AUDIT_LOGS_KEY) || "[]"
  );
};

export const clearAuditLogs = () => {
  localStorage.removeItem(AUDIT_LOGS_KEY);
};