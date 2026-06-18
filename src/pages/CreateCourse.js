import { useState } from "react";
import { api } from "../services/api";

export default function CreateCourse({
  token
}) {

  const [form, setForm] = useState({
    title: "",
    description: ""
  });

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const createCourse = async () => {

    setMessage("");

    if (!form.title) {
      return setMessage(
        "Course title is required"
      );
    }

    try {

      setLoading(true);

      await api(
        "/courses",
        "POST",
        form,
        token
      );

      setMessage(
        "Course created successfully"
      );

      setForm({
        title: "",
        description: ""
      });

    } catch (err) {

      console.error(err);

      setMessage(
        "Failed to create course"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div>

      <div
        style={{
          background: "white",
          padding: 30,
          borderRadius: 12
        }}
      >

        <h2>Create Course</h2>

        <p style={{ color: "gray" }}>
          Instructor course management
        </p>

        {/* MESSAGE */}
        {message && (

          <div
            style={{
              background: "#f3f4f6",
              padding: 12,
              borderRadius: 8,
              marginBottom: 20
            }}
          >
            {message}
          </div>

        )}

        {/* TITLE */}
        <div style={{ marginBottom: 20 }}>

          <label>
            Course Title
          </label>

          <input
            type="text"
            value={form.title}
            onChange={e =>
              setForm({
                ...form,
                title: e.target.value
              })
            }
            style={inputStyle}
          />

        </div>

        {/* DESCRIPTION */}
        <div style={{ marginBottom: 20 }}>

          <label>
            Description
          </label>

          <textarea
            rows={5}
            value={form.description}
            onChange={e =>
              setForm({
                ...form,
                description: e.target.value
              })
            }
            style={inputStyle}
          />

        </div>

        {/* BUTTON */}
        <button
          onClick={createCourse}
          disabled={loading}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: 8,
            background: "#111827",
            color: "white",
            cursor: "pointer"
          }}
        >
          {loading
            ? "Creating..."
            : "Create Course"}
        </button>

      </div>

    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 14,
  marginTop: 8,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 16
};