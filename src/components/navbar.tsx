import { Bell, Search, UserCircle } from "lucide-react";

export default function Navbar() {
  return (
    <header className="navbar">

      <div className="search-box">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search..."
        />
      </div>

      <div className="navbar-right">

        <Bell size={20} />

        <div className="profile">
          <UserCircle size={28} />

          <div>
            <strong>Admin User</strong>
            <small>Administrator</small>
          </div>
        </div>

      </div>

    </header>
  );
}