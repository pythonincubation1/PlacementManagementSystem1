import { Outlet } from "react-router-dom";

import Sidebar from "./sidebar";
import Navbar from "./navbar";

export default function AdminLayout() {
  return (
    <div className="app">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">

        {/* Navbar */}
        <Navbar />

        {/* Current Page */}
        <main className="page-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}