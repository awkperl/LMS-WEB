import { useState } from "react";
import { api } from "../services/api";

export default function CreateAssignment({
  token,
  courseId,
  refresh
}) {

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      due_date: "",
      attempt_limit: 1
    });

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const createAssignment =
    async () => {

      try {

        setLoading(true);

        await api(
          "/assignments",
          "POST",
          {
            ...form,
            course_id: courseId
          },
          token
        );

        setMessage(
          "Assignment created"
        );

        setForm({
          title: "",
          description: "",
          due_date: "",
          attempt_limit: 1
        });

        refresh();

      } catch (err) {

        console.error(err);

        setMessage(
          err.message
        );

      } finally {

        setLoading(false);

      }
    };

  return (
    <div
      style={{
        background: "white",
        padding: 20,
        borderRadius: 12,
        marginBottom: 30
      }}
    >

      <h3>
        Create Assignment
      </h3>

      {message && (

        <div
          style={{
            background: "#f3f4f6",
            padding: 10,
            borderRadius: 8,
            marginBottom: 15
          }}
        >
          {message}
        </div>

      )}

      {/* TITLE */}
      <input
        type="text"
        placeholder="Assignment title"
        value={form.title}
        onChange={(e) =>
          setForm({
            ...form,
            title: e.target.value
          })
        }
        style={inputStyle}
      />

      {/* DESCRIPTION */}
      <textarea
        placeholder="Description"
        rows={4}
        value={form.description}
        onChange={(e) =>
          setForm({
            ...form,
            description:
              e.target.value
          })
        }
        style={inputStyle}
      />

      {/* DUE DATE */}
      <input
        type="datetime-local"
        value={form.due_date}
        onChange={(e) =>
          setForm({
            ...form,
            due_date:
              e.target.value
          })
        }
        style={inputStyle}
      />

      {/* ATTEMPTS */}
      <input
        type="number"
        min="1"
        value={form.attempt_limit}
        onChange={(e) =>
          setForm({
            ...form,
            attempt_limit:
              e.target.value
          })
        }
        style={inputStyle}
      />

      <button
        onClick={
          createAssignment
        }
        disabled={loading}
        style={buttonStyle}
      >
        {loading
          ? "Creating..."
          : "Create Assignment"}
      </button>

    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #d1d5db"
};

const buttonStyle = {
  padding: "12px 18px",
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer"
};