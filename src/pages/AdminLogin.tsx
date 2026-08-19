import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    // Username validation
    if (!username.trim()) {
      setError("Please enter username");
      return;
    }

    // Password validation
    if (!password.trim()) {
      setError("Please enter password");
      return;
    }

    setLoading(true);

    // ============================================
    // FRONTEND ADMIN CREDENTIALS
    // ============================================

    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "Admin@12345";

    // Small delay to show loading state
    setTimeout(() => {

      if (
        username.trim() === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
      ) {

        // ============================================
        // SAVE LOGIN STATUS
        // ============================================

        localStorage.setItem(
          "isAdminLoggedIn",
          "true"
        );

        // Save username
        localStorage.setItem(
          "adminUsername",
          username.trim()
        );

        // Go to dashboard
        navigate("/dashboard");

      } else {

        setError(
          "Invalid username or password"
        );

      }

      setLoading(false);

    }, 500);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f7fb",
        padding: "20px",
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          borderRadius: "14px",
          padding: "35px",
          boxShadow:
            "0 10px 35px rgba(0, 0, 0, 0.10)",
        }}
      >

        {/* ========================================
            ICON
        ======================================== */}

        <div
          style={{
            width: "65px",
            height: "65px",
            borderRadius: "50%",
            background: "#2563eb",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <ShieldCheck size={32} />
        </div>


        {/* ========================================
            TITLE
        ======================================== */}

        <h1
          style={{
            textAlign: "center",
            margin: "0 0 8px",
            fontSize: "28px",
            fontWeight: 700,
          }}
        >
          Admin Login
        </h1>


        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginBottom: "30px",
          }}
        >
          Placement Management System
        </p>


        {/* ========================================
            LOGIN FORM
        ======================================== */}

        <form onSubmit={handleLogin}>

          {/* USERNAME */}

          <div
            style={{
              marginBottom: "20px",
            }}
          >

            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
                color: "#374151",
              }}
            >
              Username
            </label>


            <input
              type="text"
              value={username}
              placeholder="Enter admin username"
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              autoComplete="username"
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "15px",
                boxSizing: "border-box",
                outline: "none",
              }}
            />

          </div>


          {/* PASSWORD */}

          <div
            style={{
              marginBottom: "20px",
            }}
          >

            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
                color: "#374151",
              }}
            >
              Password
            </label>


            <input
              type="password"
              value={password}
              placeholder="Enter admin password"
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "15px",
                boxSizing: "border-box",
                outline: "none",
              }}
            />

          </div>


          {/* ERROR MESSAGE */}

          {error && (
            <div
              style={{
                marginBottom: "20px",
                padding: "11px 13px",
                borderRadius: "8px",
                background: "#fee2e2",
                color: "#b91c1c",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "8px",
              background: loading
                ? "#93c5fd"
                : "#2563eb",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 600,
              cursor: loading
                ? "not-allowed"
                : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >

            <LogIn size={18} />

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>


        {/* ========================================
            DEMO CREDENTIALS
        ======================================== */}

        <div
          style={{
            marginTop: "25px",
            padding: "14px",
            background: "#f8fafc",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#475569",
          }}
        >

          <strong>
            Demo Admin Credentials
          </strong>

          <div style={{ marginTop: "8px" }}>
            Username: <strong>admin</strong>
          </div>

          <div>
            Password: <strong>Admin@12345</strong>
          </div>

        </div>

      </div>

    </div>
  );
}