import { useMemo, useState, type ReactNode } from "react";
import {
  BarChart3,
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  Search,
  Download,
  FileText,
  UserCheck,
  CalendarCheck,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAppData } from "../context/AppDataContext";

const normalize = (value: unknown) =>
  String(value ?? "").trim().toLowerCase();

const getPackageValue = (value?: string) => {
  if (!value) return 0;
  const parsed = Number.parseFloat(
    String(value).replace(/[^0-9.]/g, "")
  );
  return Number.isNaN(parsed) ? 0 : parsed;
};

export default function Reports() {
  const {
    students,
    companies,
    placementDrives,
    applications,
    interviews,
    placements,
  } = useAppData();

  const [departmentSearch, setDepartmentSearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");

  const totalStudents = students.length;
  const totalCompanies = companies.length;
  const totalDrives = placementDrives.length;
  const totalApplications = applications.length;
  const totalInterviews = interviews.length;

  // Count unique placed students so duplicate placement records
  // do not inflate the placement rate.
  const placedStudentIds = useMemo(
    () =>
      new Set(
        placements
          .filter((p) => normalize(p.status) === "placed")
          .map((p) => String(p.studentId).trim())
          .filter(Boolean)
      ),
    [placements]
  );

  const placedStudents = placedStudentIds.size;

  const pendingPlacements = placements.filter(
    (p) => normalize(p.status) === "pending"
  ).length;

  const rejectedPlacements = placements.filter(
    (p) => normalize(p.status) === "rejected"
  ).length;

  const shortlistedApplications = applications.filter(
    (a) => normalize(a.status) === "shortlisted"
  ).length;

  const rejectedApplications = applications.filter(
    (a) => normalize(a.status) === "rejected"
  ).length;

  const appliedApplications = applications.filter(
    (a) => normalize(a.status) === "applied"
  ).length;

  const completedInterviews = interviews.filter(
    (i) => normalize(i.status) === "completed"
  ).length;

  const scheduledInterviews = interviews.filter(
    (i) => normalize(i.status) === "scheduled"
  ).length;

  const cancelledInterviews = interviews.filter(
    (i) => normalize(i.status) === "cancelled"
  ).length;

  const placementRate =
    totalStudents > 0
      ? Math.round((placedStudents / totalStudents) * 100)
      : 0;

  const placedRecords = useMemo(
    () =>
      placements.filter(
        (placement) => normalize(placement.status) === "placed"
      ),
    [placements]
  );

  const averagePackage = useMemo(() => {
    const values = placedRecords
      .map((p) => getPackageValue(p.packageLpa))
      .filter((value) => value > 0);

    if (!values.length) return 0;

    return Number(
      (
        values.reduce((sum, value) => sum + value, 0) / values.length
      ).toFixed(1)
    );
  }, [placedRecords]);

  const highestPackage = useMemo(() => {
    const values = placedRecords
      .map((placement) => ({
        value: getPackageValue(placement.packageLpa),
        company: placement.company,
        student: placement.studentName,
      }))
      .filter((item) => item.value > 0);

    if (!values.length) {
      return { value: 0, company: "", student: "" };
    }

    return values.reduce((highest, current) =>
      current.value > highest.value ? current : highest
    );
  }, [placedRecords]);

  const departmentData = useMemo(() => {
    const map: Record<
      string,
      {
        department: string;
        students: number;
        placed: number;
        rate: number;
      }
    > = {};

    students.forEach((student) => {
      const department = student.department?.trim() || "Unknown";

      if (!map[department]) {
        map[department] = {
          department,
          students: 0,
          placed: 0,
          rate: 0,
        };
      }

      map[department].students += 1;
    });

    const counted = new Set<string>();

    placedRecords.forEach((placement) => {
      const studentKey =
        String(placement.studentId || "").trim() ||
        String(placement.studentName || "").trim();

      if (counted.has(studentKey)) return;
      counted.add(studentKey);

      const student = students.find(
        (item) =>
          String(item.studentId).trim() ===
          String(placement.studentId).trim()
      );

      const department = student?.department?.trim() || "Unknown";

      if (!map[department]) {
        map[department] = {
          department,
          students: 0,
          placed: 0,
          rate: 0,
        };
      }

      map[department].placed += 1;
    });

    Object.values(map).forEach((item) => {
      item.rate =
        item.students > 0
          ? Math.round((item.placed / item.students) * 100)
          : 0;
    });

    return Object.values(map);
  }, [students, placedRecords]);

  const companyData = useMemo(() => {
    const map: Record<
      string,
      {
        company: string;
        students: number;
        packageTotal: number;
        packageCount: number;
      }
    > = {};

    placedRecords.forEach((placement) => {
      const company = placement.company?.trim() || "Unknown";

      if (!map[company]) {
        map[company] = {
          company,
          students: 0,
          packageTotal: 0,
          packageCount: 0,
        };
      }

      map[company].students += 1;

      const packageValue = getPackageValue(placement.packageLpa);

      if (packageValue > 0) {
        map[company].packageTotal += packageValue;
        map[company].packageCount += 1;
      }
    });

    return Object.values(map).map((item) => ({
      company: item.company,
      students: item.students,
      package:
        item.packageCount > 0
          ? Number((item.packageTotal / item.packageCount).toFixed(1))
          : 0,
    }));
  }, [placedRecords]);

  const applicationStatusData = useMemo(() => {
    const map: Record<string, number> = {};

    applications.forEach((application) => {
      const status = application.status?.trim() || "Unknown";
      map[status] = (map[status] || 0) + 1;
    });

    return Object.entries(map).map(([status, count]) => ({
      status,
      count,
    }));
  }, [applications]);

  const interviewStatusData = useMemo(() => {
    const map: Record<string, number> = {};

    interviews.forEach((interview) => {
      const status = interview.status?.trim() || "Unknown";
      map[status] = (map[status] || 0) + 1;
    });

    return Object.entries(map).map(([status, count]) => ({
      status,
      count,
    }));
  }, [interviews]);

  const filteredDepartments = departmentData.filter((item) =>
    item.department
      .toLowerCase()
      .includes(departmentSearch.toLowerCase())
  );

  const filteredCompanies = companyData.filter((item) =>
    item.company.toLowerCase().includes(companySearch.toLowerCase())
  );

  const exportReport = () => {
    const rows: string[][] = [
      ["PLACEMENT MANAGEMENT SYSTEM - REPORT"],
      [],
      ["OVERALL STATISTICS"],
      ["Total Students", String(totalStudents)],
      ["Placed Students", String(placedStudents)],
      ["Total Companies", String(totalCompanies)],
      ["Placement Drives", String(totalDrives)],
      ["Total Applications", String(totalApplications)],
      ["Total Interviews", String(totalInterviews)],
      ["Shortlisted Applications", String(shortlistedApplications)],
      ["Rejected Applications", String(rejectedApplications)],
      ["Scheduled Interviews", String(scheduledInterviews)],
      ["Completed Interviews", String(completedInterviews)],
      ["Placement Rate", `${placementRate}%`],
      ["Average Package", `${averagePackage} LPA`],
      ["Highest Package", `${highestPackage.value} LPA`],
      [],
      ["DEPARTMENT-WISE PLACEMENT REPORT"],
      ["Department", "Total Students", "Placed Students", "Placement Rate"],
      ...filteredDepartments.map((item) => [
        item.department,
        String(item.students),
        String(item.placed),
        `${item.rate}%`,
      ]),
      [],
      ["COMPANY-WISE PLACEMENT REPORT"],
      ["Company", "Students Placed", "Average Package"],
      ...filteredCompanies.map((item) => [
        item.company,
        String(item.students),
        `${item.package} LPA`,
      ]),
      [],
      ["APPLICATION STATISTICS"],
      ["Status", "Count"],
      ...applicationStatusData.map((item) => [
        item.status,
        String(item.count),
      ]),
      [],
      ["INTERVIEW STATISTICS"],
      ["Status", "Count"],
      ...interviewStatusData.map((item) => [
        item.status,
        String(item.count),
      ]),
    ];

    const csvContent = rows
      .map((row) =>
        row
          .map((value) => {
            const text = String(value ?? "");
            return /[,"\n]/.test(text)
              ? `"${text.replace(/"/g, '""')}"`
              : text;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "placement-report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const ChartEmpty = ({ message }: { message: string }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      {message}
    </div>
  );

  return (
    <div className="students-page">
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p>View placement statistics and performance reports.</p>
        </div>

        <button className="primary-button" onClick={exportReport}>
          <Download size={18} />
          Export Report
        </button>
      </div>

      <div className="dashboard-grid">
        <SummaryCard icon={<Users size={22} />} label="Total Students" value={totalStudents} />
        <SummaryCard icon={<UserCheck size={22} />} label="Placed Students" value={placedStudents} />
        <SummaryCard icon={<Building2 size={22} />} label="Total Companies" value={totalCompanies} />
        <SummaryCard icon={<Briefcase size={22} />} label="Placement Drives" value={totalDrives} />
      </div>

      <div className="dashboard-grid">
        <SummaryCard icon={<FileText size={22} />} label="Total Applications" value={totalApplications} />
        <SummaryCard icon={<CalendarCheck size={22} />} label="Total Interviews" value={totalInterviews} />
        <SummaryCard icon={<TrendingUp size={22} />} label="Placement Rate" value={`${placementRate}%`} />
        <SummaryCard icon={<BarChart3 size={22} />} label="Average Package" value={`${averagePackage} LPA`} />
      </div>

      <ReportCard
        title="Overall Placement Statistics"
        subtitle="Current placement performance"
        icon={<BarChart3 size={24} />}
      >
        <div className="report-statistics">
          <Stat label="Placement Rate" value={`${placementRate}%`} />
          <Stat label="Average Package" value={`${averagePackage} LPA`} />
          <Stat label="Highest Package" value={`${highestPackage.value} LPA`} />
          <Stat label="Placed Students" value={placedStudents} />
        </div>

        {highestPackage.value > 0 && (
          <div
            style={{
              marginTop: 20,
              padding: 15,
              borderRadius: 8,
              background: "#f8f9fa",
            }}
          >
            <strong>Highest Package Holder:</strong>{" "}
            {highestPackage.student} — {highestPackage.company} —{" "}
            {highestPackage.value} LPA
          </div>
        )}
      </ReportCard>

      <ReportCard
        title="Department-wise Placement"
        subtitle="Total students vs placed students"
        icon={<BarChart3 size={24} />}
      >
        <ChartBox>
          {departmentData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="students" name="Total Students" />
                <Bar dataKey="placed" name="Placed Students" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmpty message="No department data available." />
          )}
        </ChartBox>
      </ReportCard>

      <ReportCard
        title="Company-wise Placements"
        subtitle="Students placed by company"
        icon={<Briefcase size={24} />}
      >
        <ChartBox>
          {companyData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={companyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="company" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="students" name="Students Placed" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmpty message="No company placement data available." />
          )}
        </ChartBox>
      </ReportCard>

      <ReportCard
        title="Application Status Analysis"
        subtitle="Application status distribution"
        icon={<FileText size={24} />}
      >
        <ChartBox height={320}>
          {applicationStatusData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmpty message="No application data available." />
          )}
        </ChartBox>

        <div className="report-statistics">
          <Stat label="Total" value={totalApplications} />
          <Stat label="Applied" value={appliedApplications} />
          <Stat label="Shortlisted" value={shortlistedApplications} />
          <Stat label="Rejected" value={rejectedApplications} />
        </div>
      </ReportCard>

      <ReportCard
        title="Interview Status Analysis"
        subtitle="Interview performance"
        icon={<CalendarCheck size={24} />}
      >
        <ChartBox height={320}>
          {interviewStatusData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={interviewStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Interviews" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmpty message="No interview data available." />
          )}
        </ChartBox>

        <div className="report-statistics">
          <Stat label="Total" value={totalInterviews} />
          <Stat label="Scheduled" value={scheduledInterviews} />
          <Stat label="Completed" value={completedInterviews} />
          <Stat label="Cancelled" value={cancelledInterviews} />
        </div>
      </ReportCard>

      <ReportCard
        title="Department-wise Placement Report"
        subtitle="Placement performance by department"
      >
        <SearchBox
          placeholder="Search department..."
          value={departmentSearch}
          onChange={setDepartmentSearch}
        />

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Department</th>
                <th>Total Students</th>
                <th>Placed Students</th>
                <th>Placement Rate</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.length ? (
                filteredDepartments.map((item) => (
                  <tr key={item.department}>
                    <td><strong>{item.department}</strong></td>
                    <td>{item.students}</td>
                    <td>{item.placed}</td>
                    <td>
                      <span className="status-badge">{item.rate}%</span>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyRow colSpan={4} text="No departments found." />
              )}
            </tbody>
          </table>
        </div>
      </ReportCard>

      <ReportCard
        title="Company-wise Placement Report"
        subtitle="Placement statistics by company"
      >
        <SearchBox
          placeholder="Search company..."
          value={companySearch}
          onChange={setCompanySearch}
        />

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Students Placed</th>
                <th>Average Package</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.length ? (
                filteredCompanies.map((item) => (
                  <tr key={item.company}>
                    <td><strong>{item.company}</strong></td>
                    <td>{item.students}</td>
                    <td>{item.package > 0 ? `${item.package} LPA` : "N/A"}</td>
                  </tr>
                ))
              ) : (
                <EmptyRow colSpan={3} text="No companies found." />
              )}
            </tbody>
          </table>
        </div>
      </ReportCard>

      <ReportCard
        title="Placement Status"
        subtitle="Current placement records"
        icon={<UserCheck size={24} />}
      >
        <div className="report-statistics">
          <Stat label="Placed" value={placedStudents} />
          <Stat label="Pending" value={pendingPlacements} />
          <Stat label="Rejected" value={rejectedPlacements} />
        </div>
      </ReportCard>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-icon">{icon}</div>
      <div>
        <p>{label}</p>
        <h2>{value}</h2>
      </div>
    </div>
  );
}

function ReportCard({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="students-card">
      <div className="table-header">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        {icon}
      </div>
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="report-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SearchBox({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="student-toolbar">
      <div className="student-search">
        <Search size={18} />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function ChartBox({
  children,
  height = 350,
}: {
  children: ReactNode;
  height?: number;
}) {
  return (
    <div style={{ width: "100%", height }}>{children}</div>
  );
}

function EmptyRow({
  colSpan,
  text,
}: {
  colSpan: number;
  text: string;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        style={{ textAlign: "center", padding: "30px" }}
      >
        {text}
      </td>
    </tr>
  );
}