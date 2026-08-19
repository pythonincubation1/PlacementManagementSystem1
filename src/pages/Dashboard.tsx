import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  Briefcase,
  UserCheck,
  FileText,
  CalendarCheck,
  TrendingUp,
  Award,
  Clock,
  LogOut,
} from "lucide-react";

import StatCard from "../components/StatCard";
import { useAppData } from "../context/AppDataContext";


const normalize = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLowerCase();


const getPackageValue = (value?: string) => {

  if (!value) return 0;

  const number = Number.parseFloat(
    String(value).replace(/[^0-9.]/g, "")
  );

  return Number.isNaN(number)
    ? 0
    : number;
};


export default function Dashboard() {

  const navigate = useNavigate();

  const {
    students,
    companies,
    placementDrives,
    applications,
    interviews,
    placements,
  } = useAppData();


  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {

    localStorage.removeItem(
      "isAdminLoggedIn"
    );

    localStorage.removeItem(
      "adminUsername"
    );

    navigate("/admin-login");

  };


  /* =====================================================
     BASIC COUNTS
  ===================================================== */

  const totalStudents =
    students.length;

  const totalCompanies =
    companies.length;

  const totalDrives =
    placementDrives.length;

  const totalApplications =
    applications.length;

  const totalInterviews =
    interviews.length;


  /* =====================================================
     PLACED STUDENTS
  ===================================================== */

  const placedStudentIds =
    useMemo(() => {

      return new Set(

        placements

          .filter(
            (placement) =>
              normalize(
                placement.status
              ) === "placed"
          )

          .map(
            (placement) =>
              String(
                placement.studentId
              ).trim()
          )

          .filter(Boolean)

      );

    }, [placements]);


  const placedStudents =
    placedStudentIds.size;


  /* =====================================================
     PLACEMENT RATE
  ===================================================== */

  const placementRate =
    totalStudents > 0

      ? Math.round(
          (placedStudents /
            totalStudents) *
            100
        )

      : 0;


  /* =====================================================
     AVERAGE PACKAGE
  ===================================================== */

  const placedRecords =
    useMemo(

      () =>
        placements.filter(
          (placement) =>
            normalize(
              placement.status
            ) === "placed"
        ),

      [placements]

    );


  const averagePackage =
    useMemo(() => {

      const packages =
        placedRecords

          .map(
            (placement) =>
              getPackageValue(
                placement.packageLpa
              )
          )

          .filter(
            (value) =>
              value > 0
          );


      if (!packages.length) {
        return 0;
      }


      return Number(

        (
          packages.reduce(
            (sum, value) =>
              sum + value,
            0
          ) /
          packages.length
        ).toFixed(1)

      );

    }, [placedRecords]);


  /* =====================================================
     HIGHEST PACKAGE
  ===================================================== */

  const highestPackage =
    useMemo(() => {

      if (!placedRecords.length) {

        return {
          value: 0,
          company: "",
          student: "",
        };

      }


      return placedRecords.reduce(

        (highest, placement) => {

          const currentValue =
            getPackageValue(
              placement.packageLpa
            );


          if (
            currentValue >
            highest.value
          ) {

            return {

              value: currentValue,

              company:
                placement.company,

              student:
                placement.studentName,

            };

          }


          return highest;

        },

        {
          value: 0,
          company: "",
          student: "",
        }

      );

    }, [placedRecords]);


  /* =====================================================
     APPLICATION STATUS
  ===================================================== */

  const appliedApplications =
    applications.filter(
      (application) =>
        normalize(
          application.status
        ) === "applied"
    ).length;


  const shortlistedApplications =
    applications.filter(
      (application) =>
        normalize(
          application.status
        ) === "shortlisted"
    ).length;


  const rejectedApplications =
    applications.filter(
      (application) =>
        normalize(
          application.status
        ) === "rejected"
    ).length;


  /* =====================================================
     INTERVIEW STATUS
  ===================================================== */

  const scheduledInterviews =
    interviews.filter(
      (interview) =>
        normalize(
          interview.status
        ) === "scheduled"
    ).length;


  /* =====================================================
     UPCOMING DRIVES
  ===================================================== */

  const upcomingDrives =
    useMemo(() => {

      return [...placementDrives]

        .filter(
          (drive) =>
            normalize(
              drive.status
            ) === "upcoming" ||

            normalize(
              drive.status
            ) === "open"
        )

        .sort(
          (a, b) =>
            new Date(
              a.driveDate
            ).getTime() -

            new Date(
              b.driveDate
            ).getTime()
        )

        .slice(0, 5);

    }, [placementDrives]);


  /* =====================================================
     RECENT INTERVIEWS
  ===================================================== */

  const recentInterviews =
    useMemo(() => {

      return [...interviews]

        .sort(
          (a, b) =>

            new Date(
              `${a.interviewDate}T${
                a.interviewTime ||
                "00:00"
              }`
            ).getTime() -

            new Date(
              `${b.interviewDate}T${
                b.interviewTime ||
                "00:00"
              }`
            ).getTime()

        )

        .slice(0, 5);

    }, [interviews]);


  /* =====================================================
     RECENT PLACEMENTS
  ===================================================== */

  const recentPlacements =
    useMemo(() => {

      return [...placedRecords]

        .sort(
          (a, b) =>
            new Date(
              b.joiningDate
            ).getTime() -

            new Date(
              a.joiningDate
            ).getTime()
        )

        .slice(0, 5);

    }, [placedRecords]);


  /* =====================================================
     DATE FORMAT
  ===================================================== */

  const formatDate = (
    date: string
  ) => {

    if (!date) {
      return "-";
    }


    const parsedDate =
      new Date(date);


    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      return date;

    }


    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  return (

    <div className="students-page">


      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="page-header">

        <div>

          <h1>
            Dashboard
          </h1>

          <p>
            Overview of your placement
            management system
          </p>

        </div>


        {/* LOGOUT BUTTON */}

        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            background: "#dc2626",
            color: "#ffffff",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>


      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="stats-grid">

        <StatCard
          title="Total Students"
          value={String(
            totalStudents
          )}
          description="Registered students"
        />


        <StatCard
          title="Companies"
          value={String(
            totalCompanies
          )}
          description="Registered companies"
        />


        <StatCard
          title="Placement Drives"
          value={String(
            totalDrives
          )}
          description="Available drives"
        />


        <StatCard
          title="Placed Students"
          value={String(
            placedStudents
          )}
          description="Successfully placed"
        />

      </div>


      {/* =================================================
          SECOND SUMMARY ROW
      ================================================= */}

      <div className="dashboard-grid">

        <DashboardMetric
          icon={
            <FileText size={22} />
          }
          title="Applications"
          value={
            totalApplications
          }
          description={`${shortlistedApplications} shortlisted`}
        />


        <DashboardMetric
          icon={
            <CalendarCheck
              size={22}
            />
          }
          title="Interviews"
          value={
            totalInterviews
          }
          description={`${scheduledInterviews} scheduled`}
        />


        <DashboardMetric
          icon={
            <TrendingUp
              size={22}
            />
          }
          title="Placement Rate"
          value={`${placementRate}%`}
          description="Overall placement rate"
        />


        <DashboardMetric
          icon={
            <Award size={22} />
          }
          title="Average Package"
          value={`${averagePackage} LPA`}
          description="Average placed package"
        />

      </div>


      {/* =================================================
          PLACEMENT OVERVIEW
      ================================================= */}

      <div className="dashboard-grid">


        {/* PLACEMENT OVERVIEW */}

        <div className="dashboard-card">

          <div className="dashboard-card-header">

            <div>

              <h2>
                Placement Overview
              </h2>

              <p>
                Current placement
                performance
              </p>

            </div>

            <UserCheck
              size={24}
            />

          </div>


          <div className="placement-overview">

            <div className="placement-circle">

              <strong>
                {placementRate}%
              </strong>

              <span>
                Placed
              </span>

            </div>


            <div className="placement-details">

              <div>

                <span>
                  Total Students
                </span>

                <strong>
                  {totalStudents}
                </strong>

              </div>


              <div>

                <span>
                  Placed Students
                </span>

                <strong>
                  {placedStudents}
                </strong>

              </div>


              <div>

                <span>
                  Applications
                </span>

                <strong>
                  {totalApplications}
                </strong>

              </div>

            </div>

          </div>

        </div>


        {/* APPLICATION STATUS */}

        <div className="dashboard-card">

          <div className="dashboard-card-header">

            <div>

              <h2>
                Application Overview
              </h2>

              <p>
                Current application
                status
              </p>

            </div>

            <FileText
              size={24}
            />

          </div>


          <StatusRow
            label="Applied"
            value={
              appliedApplications
            }
            total={
              totalApplications
            }
          />


          <StatusRow
            label="Shortlisted"
            value={
              shortlistedApplications
            }
            total={
              totalApplications
            }
          />


          <StatusRow
            label="Rejected"
            value={
              rejectedApplications
            }
            total={
              totalApplications
            }
          />

        </div>

      </div>


      {/* =================================================
          UPCOMING PLACEMENT DRIVES
      ================================================= */}

      <div className="dashboard-card">

        <div className="dashboard-card-header">

          <div>

            <h2>
              Upcoming Placement Drives
            </h2>

            <p>
              Upcoming company
              recruitment drives
            </p>

          </div>

          <Briefcase
            size={24}
          />

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
                  Date
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {upcomingDrives.length >
              0 ? (

                upcomingDrives.map(
                  (drive) => (

                    <tr
                      key={drive.id}
                    >

                      <td>

                        <strong>
                          {
                            drive.driveId
                          }
                        </strong>

                      </td>


                      <td>
                        {
                          drive.company
                        }
                      </td>


                      <td>
                        {
                          drive.jobRole
                        }
                      </td>


                      <td>
                        {
                          drive.package
                        }
                      </td>


                      <td>

                        {formatDate(
                          drive.driveDate
                        )}

                      </td>


                      <td>

                        <span className="status-badge">

                          {
                            drive.status
                          }

                        </span>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan={6}
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "30px",
                    }}
                  >
                    No upcoming
                    placement
                    drives.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =================================================
          RECENT INTERVIEWS + PLACEMENTS
      ================================================= */}

      <div className="dashboard-grid">


        {/* RECENT INTERVIEWS */}

        <div className="dashboard-card">

          <div className="dashboard-card-header">

            <div>

              <h2>
                Recent Interviews
              </h2>

              <p>
                Latest interview
                schedules
              </p>

            </div>

            <Clock
              size={24}
            />

          </div>


          <div className="activity-list">

            {recentInterviews.length >
            0 ? (

              recentInterviews.map(
                (interview) => (

                  <div
                    className="activity-item"
                    key={interview.id}
                  >

                    <div>

                      <strong>
                        {
                          interview.studentName
                        }
                      </strong>

                      <span>
                        {
                          interview.company
                        }{" "}
                        •{" "}
                        {
                          interview.role
                        }
                      </span>

                    </div>


                    <div className="activity-right">

                      <strong>

                        {formatDate(
                          interview.interviewDate
                        )}

                      </strong>

                      <span>
                        {
                          interview.interviewTime
                        }
                      </span>

                    </div>

                  </div>

                )
              )

            ) : (

              <p>
                No interview records
                available.
              </p>

            )}

          </div>

        </div>


        {/* RECENT PLACEMENTS */}

        <div className="dashboard-card">

          <div className="dashboard-card-header">

            <div>

              <h2>
                Recent Placements
              </h2>

              <p>
                Successfully placed
                students
              </p>

            </div>

            <Award
              size={24}
            />

          </div>


          <div className="activity-list">

            {recentPlacements.length >
            0 ? (

              recentPlacements.map(
                (placement) => (

                  <div
                    className="activity-item"
                    key={placement.id}
                  >

                    <div>

                      <strong>
                        {
                          placement.studentName
                        }
                      </strong>

                      <span>
                        {
                          placement.company
                        }{" "}
                        •{" "}
                        {
                          placement.role
                        }
                      </span>

                    </div>


                    <div className="activity-right">

                      <strong>
                        {
                          placement.packageLpa
                        }
                      </strong>

                      <span className="status-badge">
                        Placed
                      </span>

                    </div>

                  </div>

                )
              )

            ) : (

              <p>
                No placement records
                available.
              </p>

            )}

          </div>

        </div>

      </div>


      {/* =================================================
          PERFORMANCE SUMMARY
      ================================================= */}

      <div className="dashboard-card">

        <div className="dashboard-card-header">

          <div>

            <h2>
              Performance Summary
            </h2>

            <p>
              Overall placement
              performance
            </p>

          </div>

          <TrendingUp
            size={24}
          />

        </div>


        <div className="report-statistics">


          <div className="report-stat">

            <span>
              Total Students
            </span>

            <strong>
              {totalStudents}
            </strong>

          </div>


          <div className="report-stat">

            <span>
              Placed Students
            </span>

            <strong>
              {placedStudents}
            </strong>

          </div>


          <div className="report-stat">

            <span>
              Placement Rate
            </span>

            <strong>
              {placementRate}%
            </strong>

          </div>


          <div className="report-stat">

            <span>
              Average Package
            </span>

            <strong>
              {averagePackage} LPA
            </strong>

          </div>


          <div className="report-stat">

            <span>
              Highest Package
            </span>

            <strong>
              {highestPackage.value} LPA
            </strong>

          </div>

        </div>


        {highestPackage.value >
          0 && (

          <div
            style={{
              marginTop:
                "20px",
              padding:
                "15px",
              borderRadius:
                "8px",
              background:
                "#f8f9fa",
            }}
          >

            <strong>
              Highest Package:
            </strong>{" "}

            {
              highestPackage.student
            }

            {" — "}

            {
              highestPackage.company
            }

            {" — "}

            {
              highestPackage.value
            }{" "}
            LPA

          </div>

        )}

      </div>

    </div>
  );
}


/* =========================================================
   DASHBOARD METRIC
========================================================= */

function DashboardMetric({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  description: string;
}) {

  return (

    <div className="dashboard-card">

      <div className="dashboard-card-icon">
        {icon}
      </div>


      <div>

        <p>
          {title}
        </p>

        <h2>
          {value}
        </h2>

        <small>
          {description}
        </small>

      </div>

    </div>

  );
}


/* =========================================================
   STATUS ROW
========================================================= */

function StatusRow({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {

  const percentage =
    total > 0
      ? Math.round(
          (value / total) * 100
        )
      : 0;


  return (

    <div
      style={{
        marginBottom:
          "18px",
      }}
    >

      <div
        style={{
          display:
            "flex",
          justifyContent:
            "space-between",
          marginBottom:
            "6px",
        }}
      >

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>


      <div
        style={{
          width: "100%",
          height: "8px",
          background:
            "#e9ecef",
          borderRadius:
            "10px",
          overflow:
            "hidden",
        }}
      >

        <div
          style={{
            width:
              `${percentage}%`,
            height:
              "100%",
            background:
              "#2563eb",
            borderRadius:
              "10px",
          }}
        />

      </div>

    </div>

  );
}