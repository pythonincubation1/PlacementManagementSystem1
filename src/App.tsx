import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AppDataProvider } from "./context/AppDataContext";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

import AdminLogin from "./pages/AdminLogin";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Companies from "./pages/Companies";
import PlacementDrives from "./pages/PlacementDrives";
import Applications from "./pages/Applications";
import Interviews from "./pages/Interviews";
import Placements from "./pages/Placements";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import AuditLogs from "./pages/AuditLogs";


function App() {
  return (
    <AppDataProvider>

      <BrowserRouter>

        <Routes>

          {/* =========================================
              ADMIN LOGIN
          ========================================= */}

          <Route
            path="/admin-login"
            element={<AdminLogin />}
          />


          {/* =========================================
              PROTECTED ADMIN ROUTES
          ========================================= */}

          <Route element={<ProtectedRoute />}>

            {/* =========================================
                ADMIN LAYOUT
            ========================================= */}

            <Route element={<AdminLayout />}>

              {/* Dashboard */}

              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />


              {/* Students */}

              <Route
                path="/students"
                element={<Students />}
              />


              {/* Companies */}

              <Route
                path="/companies"
                element={<Companies />}
              />


              {/* Placement Drives */}

              <Route
                path="/placement-drives"
                element={<PlacementDrives />}
              />


              {/* Applications */}

              <Route
                path="/applications"
                element={<Applications />}
              />


              {/* Interviews */}

              <Route
                path="/interviews"
                element={<Interviews />}
              />


              {/* Placements */}

              <Route
                path="/placements"
                element={<Placements />}
              />


              {/* Reports */}

              <Route
                path="/reports"
                element={<Reports />}
              />


              {/* Users */}

              <Route
                path="/users"
                element={<Users />}
              />


              {/* Audit Logs */}

              <Route
                path="/audit-logs"
                element={<AuditLogs />}
              />

            </Route>

          </Route>

        </Routes>

      </BrowserRouter>

    </AppDataProvider>
  );
}

export default App;