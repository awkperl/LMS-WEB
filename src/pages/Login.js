/** 
import { useState } from "react";
import { api } from "../services/api";

export default function Login({ setToken }) {
  const [form, setForm] = useState({ email: "", password: "" });

  const login = async () => {
    const res = await api("/auth/login", "POST", form);

    if (res.token) {
      setToken(res.token);
    } else {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input placeholder="Email"
        onChange={e => setForm({...form, email: e.target.value})} />

      <input type="password" placeholder="Password"
        onChange={e => setForm({...form, password: e.target.value})} />

      <button onClick={login}>Login</button>
    </div>
  );
}**/
import { useState } from "react";
import { api } from "../services/api";

export default function Login({
  setToken,
  goToRegister
}) {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const login = async () => {

    setError("");

    // VALIDATION
    if (!form.email || !form.password) {
      return setError(
        "Email and password are required"
      );
    }

    // EMAIL VALIDATION
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      return setError(
        "Enter a valid email address"
      );
    }

    try {

      setLoading(true);

      const res = await api(
        "/auth/login",
        "POST",
        form
      );

      // SUCCESS
      if (res.token) {

        localStorage.setItem(
          "token",
          res.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(res.user)
        );

        setToken(res.token);

      } else {

        setError(
          res.msg || "Login failed"
        );

      }

    } catch (err) {

      console.error(err);

      setError(
        err.message || "Login failed"
      );

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
          Login to access courses, assignments,
          exams and certificates.
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
            Welcome Back
          </h2>

          <p
            style={{
              color: "gray",
              marginBottom: 30
            }}
          >
            Login to continue
          </p>

          {/* ERROR */}
          {error && (

            <div
              style={{
                background: "#fee2e2",
                color: "#b91c1c",
                padding: 12,
                borderRadius: 8,
                marginBottom: 20
              }}
            >
              {error}
            </div>

          )}

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
          <div style={{ marginBottom: 10 }}>

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

          {/* FORGOT PASSWORD */}
          <div
            style={{
              textAlign: "right",
              marginBottom: 25
            }}
          >

            <span
              style={{
                color: "#2563eb",
                cursor: "pointer",
                fontSize: 14
              }}
            >
              Forgot Password?
            </span>

          </div>

          {/* BUTTON */}
          <button
            onClick={login}
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
              ? "Signing in..."
              : "Sign In"}
          </button>

          {/* REGISTER */}
          <p
            style={{
              marginTop: 20,
              textAlign: "center",
              color: "gray"
            }}
          >
            Don't have an account?{" "}

            <span
              onClick={goToRegister}
              style={{
                color: "#2563eb",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Register
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