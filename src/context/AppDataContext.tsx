import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";

/* =========================================================
   TYPES
========================================================= */

export type Student = {
  id: number;
  studentId: string;
  name: string;
  email: string;
  department: string;
  batch: string;
  cgpa: number;
  status: string;
  phone?: string;
  year?: string;
};

export type Company = {
  id: number;
  companyId: string;
  name: string;
  industry: string;
  location: string;
  website: string;
  status: string;
};

export type PlacementDrive = {
  id: number;
  driveId: string;
  company: string;
  jobRole: string;
  package: string;
  driveDate: string;
  location: string;
  status: string;
};

export type Application = {
  id: number;
  applicationId: string;
  studentId: string;
  studentName: string;
  company: string;
  driveId: string;
  jobRole: string;
  appliedDate: string;
  status: string;
};

export type Interview = {
  id: number;
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

export type Placement = {
  id: number;
  placementId: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  company: string;
  role: string;
  packageLpa: string;
  joiningDate: string;
  placementType: string;
  status: string;
};

export type User = {
  id: number;
  userId: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

export type AuditLog = {
  id: number;
  user: string;
  action: string;
  module: string;
  description: string;
  date: string;
  status: "Success" | "Failed";
};

type AppDataContextType = {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;

  companies: Company[];
  placementDrives: PlacementDrive[];
  applications: Application[];
  interviews: Interview[];
  placements: Placement[];
  users: User[];
  auditLogs: AuditLog[];

  addStudent: (student: Omit<Student, "id">) => void;
  updateStudent: (id: number, student: Omit<Student, "id">) => void;
  deleteStudent: (id: number) => void;

  addCompany: (company: Omit<Company, "id">) => void;
  updateCompany: (id: number, company: Omit<Company, "id">) => void;
  deleteCompany: (id: number) => void;

  addPlacementDrive: (drive: Omit<PlacementDrive, "id">) => void;
  updatePlacementDrive: (
    id: number,
    drive: Omit<PlacementDrive, "id">
  ) => void;
  deletePlacementDrive: (id: number) => void;

  addApplication: (application: Omit<Application, "id">) => void;
  updateApplication: (
    id: number,
    application: Omit<Application, "id">
  ) => void;
  deleteApplication: (id: number) => void;

  addInterview: (interview: Omit<Interview, "id">) => void;
  updateInterview: (
    id: number,
    interview: Omit<Interview, "id">
  ) => void;
  deleteInterview: (id: number) => void;

  addPlacement: (placement: Omit<Placement, "id">) => void;
  updatePlacement: (
    id: number,
    placement: Omit<Placement, "id">
  ) => void;
  deletePlacement: (id: number) => void;

  addUser: (user: Omit<User, "id">) => void;
  updateUser: (id: number, user: Omit<User, "id">) => void;
  deleteUser: (id: number) => void;

  addAuditLog: (
    action: string,
    module: string,
    description: string,
    user?: string
  ) => void;
  clearAuditLogs: () => void;
};

/* =========================================================
   CONTEXT
========================================================= */

const AppDataContext = createContext<
  AppDataContextType | undefined
>(undefined);

/* =========================================================
   LOCAL STORAGE KEYS
========================================================= */

const STORAGE_KEYS = {
  students: "placement_students",
  companies: "placement_companies",
  placementDrives: "placement_drives",
  applications: "placement_applications",
  interviews: "placement_interviews",
  placements: "placement_placements",
  users: "placement_users",
  auditLogs: "placement_audit_logs",
};

/* =========================================================
   DEFAULT DATA
========================================================= */

const defaultStudents: Student[] = [
  {
    id: 1,
    studentId: "STU001",
    name: "Arun Kumar",
    email: "arun@gmail.com",
    department: "Computer Science",
    batch: "2026",
    cgpa: 8.5,
    status: "Eligible",
  },
  {
    id: 2,
    studentId: "STU002",
    name: "Priya Sharma",
    email: "priya@gmail.com",
    department: "Information Technology",
    batch: "2026",
    cgpa: 9.0,
    status: "Eligible",
  },
];

const defaultCompanies: Company[] = [
  {
    id: 1,
    companyId: "COM001",
    name: "TCS",
    industry: "IT Services",
    location: "Chennai",
    website: "https://www.tcs.com",
    status: "Active",
  },
  {
    id: 2,
    companyId: "COM002",
    name: "Infosys",
    industry: "IT Services",
    location: "Bangalore",
    website: "https://www.infosys.com",
    status: "Active",
  },
  {
    id: 3,
    companyId: "COM003",
    name: "Zoho",
    industry: "Software",
    location: "Chennai",
    website: "https://www.zoho.com",
    status: "Active",
  },
];

const defaultPlacementDrives: PlacementDrive[] = [
  {
    id: 1,
    driveId: "DRV001",
    company: "TCS",
    jobRole: "Software Developer",
    package: "6 LPA",
    driveDate: "2026-08-20",
    location: "Chennai",
    status: "Upcoming",
  },
  {
    id: 2,
    driveId: "DRV002",
    company: "Infosys",
    jobRole: "Software Engineer",
    package: "7 LPA",
    driveDate: "2026-08-22",
    location: "Bangalore",
    status: "Open",
  },
  {
    id: 3,
    driveId: "DRV003",
    company: "Zoho",
    jobRole: "Software Developer",
    package: "8 LPA",
    driveDate: "2026-08-24",
    location: "Chennai",
    status: "Open",
  },
];

const defaultApplications: Application[] = [
  {
    id: 1,
    applicationId: "APP001",
    studentId: "STU001",
    studentName: "Arun Kumar",
    company: "TCS",
    driveId: "DRV001",
    jobRole: "Software Developer",
    appliedDate: "2026-08-14",
    status: "Applied",
  },
  {
    id: 2,
    applicationId: "APP002",
    studentId: "STU002",
    studentName: "Priya Sharma",
    company: "Infosys",
    driveId: "DRV002",
    jobRole: "Software Engineer",
    appliedDate: "2026-08-15",
    status: "Shortlisted",
  },
  {
    id: 3,
    applicationId: "APP003",
    studentId: "STU003",
    studentName: "Ravi Kumar",
    company: "Zoho",
    driveId: "DRV003",
    jobRole: "Software Developer",
    appliedDate: "2026-08-16",
    status: "Rejected",
  },
];

const defaultInterviews: Interview[] = [
  {
    id: 1,
    interviewId: "INT001",
    applicationId: "APP001",
    studentName: "Arun Kumar",
    studentId: "STU001",
    company: "TCS",
    role: "Software Developer",
    interviewDate: "2026-08-20",
    interviewTime: "10:00",
    mode: "Online",
    interviewer: "Rahul Sharma",
    status: "Scheduled",
  },
  {
    id: 2,
    interviewId: "INT002",
    applicationId: "APP002",
    studentName: "Priya Sharma",
    studentId: "STU002",
    company: "Infosys",
    role: "Software Engineer",
    interviewDate: "2026-08-22",
    interviewTime: "11:30",
    mode: "Offline",
    interviewer: "Anil Kumar",
    status: "Completed",
  },
];

const defaultPlacements: Placement[] = [
  {
    id: 1,
    placementId: "PLC001",
    applicationId: "APP001",
    studentId: "STU001",
    studentName: "Arun Kumar",
    company: "TCS",
    role: "Software Developer",
    packageLpa: "8 LPA",
    joiningDate: "2026-09-01",
    placementType: "Full Time",
    status: "Placed",
  },
  {
    id: 2,
    placementId: "PLC002",
    applicationId: "APP002",
    studentId: "STU002",
    studentName: "Priya Sharma",
    company: "Infosys",
    role: "Software Engineer",
    packageLpa: "9 LPA",
    joiningDate: "2026-09-05",
    placementType: "Full Time",
    status: "Placed",
  },
];

const defaultUsers: User[] = [
  {
    id: 1,
    userId: "USR001",
    name: "Admin User",
    email: "admin@placement.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    userId: "USR002",
    name: "Arun Kumar",
    email: "arun@placement.com",
    role: "Student",
    status: "Active",
  },
  {
    id: 3,
    userId: "USR003",
    name: "Priya Sharma",
    email: "priya@placement.com",
    role: "HR",
    status: "Active",
  },
  {
    id: 4,
    userId: "USR004",
    name: "Ravi Kumar",
    email: "ravi@placement.com",
    role: "Placement Officer",
    status: "Inactive",
  },
];

/* =========================================================
   STORAGE HELPERS
========================================================= */

const readStorage = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);

    if (value === null) {
      return fallback;
    }

    const parsed = JSON.parse(value);
    return parsed as T;
  } catch (error) {
    console.error(`LocalStorage read error: ${key}`, error);
    return fallback;
  }
};

const writeStorage = <T,>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`LocalStorage write error: ${key}`, error);
  }
};

const getNextId = <T extends { id: number }>(items: T[]) => {
  if (!items.length) return 1;

  return (
    Math.max(
      ...items.map((item) => Number(item.id) || 0)
    ) + 1
  );
};

/*
  Important:
  localStorage may already contain old/incorrect data from previous
  versions of the project. These loaders always return an array.
*/
const loadArray = <T,>(key: string, fallback: T[]): T[] => {
  const stored = readStorage<unknown>(key, fallback);

  return Array.isArray(stored) ? (stored as T[]) : fallback;
};

const loadUsers = (): User[] => {
  const stored = loadArray<User>(
    STORAGE_KEYS.users,
    defaultUsers
  );

  return stored.map((item, index) => ({
    id:
      typeof item.id === "number"
        ? item.id
        : index + 1,
    userId:
      typeof item.userId === "string" && item.userId.trim()
        ? item.userId.trim()
        : `USR${String(index + 1).padStart(3, "0")}`,
    name:
      typeof item.name === "string"
        ? item.name.trim()
        : "",
    email:
      typeof item.email === "string"
        ? item.email.trim()
        : "",
    role:
      typeof item.role === "string" && item.role.trim()
        ? item.role.trim()
        : "Student",
    status:
      typeof item.status === "string" && item.status.trim()
        ? item.status.trim()
        : "Active",
  }));
};

const loadStudents = () =>
  loadArray<Student>(
    STORAGE_KEYS.students,
    defaultStudents
  );

const loadCompanies = () =>
  loadArray<Company>(
    STORAGE_KEYS.companies,
    defaultCompanies
  );

const loadPlacementDrives = () =>
  loadArray<PlacementDrive>(
    STORAGE_KEYS.placementDrives,
    defaultPlacementDrives
  );

const loadApplications = () =>
  loadArray<Application>(
    STORAGE_KEYS.applications,
    defaultApplications
  );

const loadInterviews = () =>
  loadArray<Interview>(
    STORAGE_KEYS.interviews,
    defaultInterviews
  );

const loadPlacements = () =>
  loadArray<Placement>(
    STORAGE_KEYS.placements,
    defaultPlacements
  );

/* =========================================================
   PROVIDER
========================================================= */

export const AppDataProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [students, setStudents] =
    useState<Student[]>(loadStudents);

  const [companies, setCompanies] =
    useState<Company[]>(loadCompanies);

  const [placementDrives, setPlacementDrives] =
    useState<PlacementDrive[]>(loadPlacementDrives);

  const [applications, setApplications] =
    useState<Application[]>(loadApplications);

  const [interviews, setInterviews] =
    useState<Interview[]>(loadInterviews);

  const [placements, setPlacements] =
    useState<Placement[]>(loadPlacements);

  const [users, setUsers] =
    useState<User[]>(loadUsers);

  const [auditLogs, setAuditLogs] =
    useState<AuditLog[]>(() =>
      loadArray<AuditLog>(
        STORAGE_KEYS.auditLogs,
        []
      )
    );

  /* =======================================================
     LOCAL STORAGE
  ======================================================= */

  useEffect(() => {
    writeStorage(STORAGE_KEYS.students, students);
  }, [students]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.companies, companies);
  }, [companies]);

  useEffect(() => {
    writeStorage(
      STORAGE_KEYS.placementDrives,
      placementDrives
    );
  }, [placementDrives]);

  useEffect(() => {
    writeStorage(
      STORAGE_KEYS.applications,
      applications
    );
  }, [applications]);

  useEffect(() => {
    writeStorage(
      STORAGE_KEYS.interviews,
      interviews
    );
  }, [interviews]);

  useEffect(() => {
    writeStorage(
      STORAGE_KEYS.placements,
      placements
    );
  }, [placements]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.users, users);
  }, [users]);

  useEffect(() => {
    writeStorage(
      STORAGE_KEYS.auditLogs,
      auditLogs
    );
  }, [auditLogs]);

  /* =======================================================
     AUDIT
  ======================================================= */

  const addAuditLog = (
    action: string,
    module: string,
    description: string,
    user = "Admin"
  ) => {
    const newLog: AuditLog = {
      id: Date.now(),
      user,
      action,
      module,
      description,
      date: new Date().toLocaleString(),
      status: "Success",
    };

    setAuditLogs((previous) => [
      newLog,
      ...previous,
    ]);
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
  };

  /* =======================================================
     STUDENTS
  ======================================================= */

  const addStudent = (
    student: Omit<Student, "id">
  ) => {
    setStudents((previous) => [
      ...previous,
      {
        ...student,
        id: getNextId(previous),
      },
    ]);

    addAuditLog(
      "Added",
      "Students",
      `Added student ${student.name}`
    );
  };

  const updateStudent = (
    id: number,
    student: Omit<Student, "id">
  ) => {
    setStudents((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...student, id }
          : item
      )
    );

    addAuditLog(
      "Updated",
      "Students",
      `Updated student ${student.name}`
    );
  };

  const deleteStudent = (id: number) => {
    const student = students.find(
      (item) => item.id === id
    );

    setStudents((previous) =>
      previous.filter((item) => item.id !== id)
    );

    addAuditLog(
      "Deleted",
      "Students",
      `Deleted student ${student?.name || id}`
    );
  };

  /* =======================================================
     COMPANIES
  ======================================================= */

  const addCompany = (
    company: Omit<Company, "id">
  ) => {
    setCompanies((previous) => [
      ...previous,
      {
        ...company,
        id: getNextId(previous),
      },
    ]);

    addAuditLog(
      "Added",
      "Companies",
      `Added company ${company.name}`
    );
  };

  const updateCompany = (
    id: number,
    company: Omit<Company, "id">
  ) => {
    setCompanies((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...company, id }
          : item
      )
    );

    addAuditLog(
      "Updated",
      "Companies",
      `Updated company ${company.name}`
    );
  };

  const deleteCompany = (id: number) => {
    const company = companies.find(
      (item) => item.id === id
    );

    setCompanies((previous) =>
      previous.filter((item) => item.id !== id)
    );

    addAuditLog(
      "Deleted",
      "Companies",
      `Deleted company ${company?.name || id}`
    );
  };

  /* =======================================================
     PLACEMENT DRIVES
  ======================================================= */

  const addPlacementDrive = (
    drive: Omit<PlacementDrive, "id">
  ) => {
    setPlacementDrives((previous) => [
      ...previous,
      {
        ...drive,
        id: getNextId(previous),
      },
    ]);

    addAuditLog(
      "Added",
      "Placement Drives",
      `Added drive ${drive.driveId}`
    );
  };

  const updatePlacementDrive = (
    id: number,
    drive: Omit<PlacementDrive, "id">
  ) => {
    setPlacementDrives((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...drive, id }
          : item
      )
    );

    addAuditLog(
      "Updated",
      "Placement Drives",
      `Updated drive ${drive.driveId}`
    );
  };

  const deletePlacementDrive = (id: number) => {
    const drive = placementDrives.find(
      (item) => item.id === id
    );

    setPlacementDrives((previous) =>
      previous.filter((item) => item.id !== id)
    );

    addAuditLog(
      "Deleted",
      "Placement Drives",
      `Deleted drive ${drive?.driveId || id}`
    );
  };

  /* =======================================================
     APPLICATIONS
  ======================================================= */

  const addApplication = (
    application: Omit<Application, "id">
  ) => {
    setApplications((previous) => [
      ...previous,
      {
        ...application,
        id: getNextId(previous),
      },
    ]);

    addAuditLog(
      "Added",
      "Applications",
      `Added application ${application.applicationId}`
    );
  };

  const updateApplication = (
    id: number,
    application: Omit<Application, "id">
  ) => {
    setApplications((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...application, id }
          : item
      )
    );

    addAuditLog(
      "Updated",
      "Applications",
      `Updated application ${application.applicationId}`
    );
  };

  const deleteApplication = (id: number) => {
    const application = applications.find(
      (item) => item.id === id
    );

    setApplications((previous) =>
      previous.filter((item) => item.id !== id)
    );

    addAuditLog(
      "Deleted",
      "Applications",
      `Deleted application ${
        application?.applicationId || id
      }`
    );
  };

  /* =======================================================
     INTERVIEWS
  ======================================================= */

  const addInterview = (
    interview: Omit<Interview, "id">
  ) => {
    setInterviews((previous) => [
      ...previous,
      {
        ...interview,
        id: getNextId(previous),
      },
    ]);

    addAuditLog(
      "Added",
      "Interviews",
      `Added interview ${interview.interviewId}`
    );
  };

  const updateInterview = (
    id: number,
    interview: Omit<Interview, "id">
  ) => {
    setInterviews((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...interview, id }
          : item
      )
    );

    addAuditLog(
      "Updated",
      "Interviews",
      `Updated interview ${interview.interviewId}`
    );
  };

  const deleteInterview = (id: number) => {
    const interview = interviews.find(
      (item) => item.id === id
    );

    setInterviews((previous) =>
      previous.filter((item) => item.id !== id)
    );

    addAuditLog(
      "Deleted",
      "Interviews",
      `Deleted interview ${
        interview?.interviewId || id
      }`
    );
  };

  /* =======================================================
     PLACEMENTS
  ======================================================= */

  const addPlacement = (
    placement: Omit<Placement, "id">
  ) => {
    setPlacements((previous) => [
      ...previous,
      {
        ...placement,
        id: getNextId(previous),
      },
    ]);

    addAuditLog(
      "Added",
      "Placements",
      `Added placement ${placement.placementId}`
    );
  };

  const updatePlacement = (
    id: number,
    placement: Omit<Placement, "id">
  ) => {
    setPlacements((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...placement, id }
          : item
      )
    );

    addAuditLog(
      "Updated",
      "Placements",
      `Updated placement ${placement.placementId}`
    );
  };

  const deletePlacement = (id: number) => {
    const placement = placements.find(
      (item) => item.id === id
    );

    setPlacements((previous) =>
      previous.filter((item) => item.id !== id)
    );

    addAuditLog(
      "Deleted",
      "Placements",
      `Deleted placement ${
        placement?.placementId || id
      }`
    );
  };

  /* =======================================================
     USERS
  ======================================================= */

  const addUser = (
    user: Omit<User, "id">
  ) => {
    setUsers((previous) => {
      const nextId = getNextId(previous);

      const generatedUserId =
        user.userId?.trim()
          ? user.userId.trim()
          : `USR${String(nextId).padStart(3, "0")}`;

      return [
        ...previous,
        {
          ...user,
          id: nextId,
          userId: generatedUserId,
        },
      ];
    });

    addAuditLog(
      "Added",
      "Users",
      `Added user ${user.name}`
    );
  };

  const updateUser = (
    id: number,
    user: Omit<User, "id">
  ) => {
    setUsers((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...user,
              id,
              userId:
                user.userId?.trim()
                  ? user.userId.trim()
                  : item.userId,
            }
          : item
      )
    );

    addAuditLog(
      "Updated",
      "Users",
      `Updated user ${user.name}`
    );
  };

  const deleteUser = (id: number) => {
    const user = users.find(
      (item) => item.id === id
    );

    setUsers((previous) =>
      previous.filter((item) => item.id !== id)
    );

    addAuditLog(
      "Deleted",
      "Users",
      `Deleted user ${user?.name || id}`
    );
  };

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value: AppDataContextType = {
    students,
    setStudents,

    companies,
    placementDrives,
    applications,
    interviews,
    placements,
    users,
    auditLogs,

    addStudent,
    updateStudent,
    deleteStudent,

    addCompany,
    updateCompany,
    deleteCompany,

    addPlacementDrive,
    updatePlacementDrive,
    deletePlacementDrive,

    addApplication,
    updateApplication,
    deleteApplication,

    addInterview,
    updateInterview,
    deleteInterview,

    addPlacement,
    updatePlacement,
    deletePlacement,

    addUser,
    updateUser,
    deleteUser,

    addAuditLog,
    clearAuditLogs,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};

/* =========================================================
   CUSTOM HOOK
========================================================= */

export const useAppData = (): AppDataContextType => {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error(
      "useAppData must be used inside AppDataProvider"
    );
  }

  return context;
};