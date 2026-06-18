import { useState } from "react";
import { api } from "../services/api";

export default function Register({ goToLogin }) {

  /**const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });**/
  const [form, setForm] = useState({
  name: "",
  email: "",
  password: "",
  role: "student"
});

  const [loading, setLoading] = useState(false);

  const register = async () => {

    try {

      setLoading(true);

      const res = await api(
        "/auth/register",
        "POST",
        form
      );

      // SUCCESS
      if (res.id || res.message) {

        alert("Registration successful");

        // REDIRECT TO LOGIN
        goToLogin();

      } else {

        alert(
          res.msg || "Registration failed"
        );

      }

    } catch (err) {

      console.error(err);
      alert("Registration failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#111827"
      }}
    >

      {/* LEFT SIDE */}
      <div
        style={{
          flex: 1,
          background:
            "linear-gradient(to bottom right,#111827,#1f2937)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 60
        }}
      >

        <h1
          style={{
            fontSize: 42,
            marginBottom: 10
          }}
        >
          LMS Platform
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "#d1d5db",
            maxWidth: 450,
            lineHeight: 1.6
          }}
        >
          Create your account and start learning,
          submitting assignments, taking exams
          and earning certificates.
        </p>

      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          width: 450,
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 40
        }}
      >

        <div style={{ width: "100%" }}>

          <h2
            style={{
              marginBottom: 10,
              fontSize: 30
            }}
          >
            Create Account
          </h2>

          <p
            style={{
              color: "gray",
              marginBottom: 30
            }}
          >
            Register to continue
          </p>

          {/* NAME */}
          <div style={{ marginBottom: 20 }}>

            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter full name"
              value={form.name}
              onChange={e =>
                setForm({
                  ...form,
                  name: e.target.value
                })
              }
              style={inputStyle}
            />

          </div>

          {/* EMAIL */}
          <div style={{ marginBottom: 20 }}>

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={e =>
                setForm({
                  ...form,
                  email: e.target.value
                })
              }
              style={inputStyle}
            />

          </div>

          {/* PASSWORD */}
          <div style={{ marginBottom: 25 }}>

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={e =>
                setForm({
                  ...form,
                  password: e.target.value
                })
              }
              style={inputStyle}
            />

          </div>

          {/* BUTTON */}
          <button
            onClick={register}
            disabled={loading}
            style={{
              width: "100%",
              padding: 14,
              border: "none",
              borderRadius: 8,
              background: "#111827",
              color: "white",
              fontSize: 16,
              cursor: "pointer"
            }}
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>

          {/* LOGIN LINK */}
          <p
            style={{
              marginTop: 20,
              textAlign: "center",
              color: "gray"
            }}
          >
            Already have an account?{" "}

            <span
              onClick={goToLogin}
              style={{
                color: "#2563eb",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Login
            </span>

          </p>

        </div>

      </div>

    </div>
  );
}

/* INPUT STYLE */
const inputStyle = {
  width: "100%",
  padding: 14,
  marginTop: 8,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 16
};