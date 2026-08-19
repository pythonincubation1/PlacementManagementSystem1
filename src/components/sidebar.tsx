import { Link } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileText,
  CalendarCheck,
  Award,
  BarChart3,
  UserCog,
  ClipboardList,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    name: "Students",
    icon: Users,
    path: "/students",
  },
  {
    name: "Companies",
    icon: Building2,
    path: "/companies",
  },
  {
    name: "Placement Drives",
    icon: Briefcase,
    path: "/placement-drives",
  },
  {
    name: "Applications",
    icon: FileText,
    path: "/applications",
  },
  {
    name: "Interviews",
    icon: CalendarCheck,
    path: "/interviews",
  },
  {
    name: "Placements",
    icon: Award,
    path: "/placements",
  },
  {
    name: "Reports",
    icon: BarChart3,
    path: "/reports",
  },
  {
    name: "Users",
    icon: UserCog,
    path: "/users",
  },
  {
    name: "Audit Logs",
    icon: ClipboardList,
    path: "/audit-logs",
  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logo">
        Placement
      </div>

      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              className="menu-item"
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}