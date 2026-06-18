import { useState } from "react";
import { api } from "../services/api";

export default function SubmitAssignment({
  assignmentId,
  token,
  close,
  refreshSubmissions
}) {

  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {

    try {

      setLoading(true);

      let file_url = "";

      // UPLOAD FILE
      if (file) {

        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch(
          "http://localhost:5000/api/upload",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: formData
          }
        );

        const uploadData = await uploadRes.json();

        file_url = uploadData.file_url;
      }

      // SAVE SUBMISSION
      await api(
        "/submissions",
        "POST",
        {
          assignment_id: assignmentId,
          submission_type: file ? "file" : "link",
          content: link,
          file_url
        },
        token
      );

      alert("Assignment submitted successfully!");
      await refreshSubmissions();
      close();

    } catch (err) {

      console.error(err);
      alert("Submission failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
      }}
    >

      {/* MODAL */}
      <div
        style={{
          width: 500,
          background: "white",
          borderRadius: 16,
          padding: 30,
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
        }}
      >

        {/* HEADER */}
        <div style={{ marginBottom: 25 }}>

          <h2
            style={{
              margin: 0,
              marginBottom: 8
            }}
          >
            Submit Assignment
          </h2>

          <p style={{ color: "gray" }}>
            Upload your file or paste a submission link
          </p>

        </div>

        {/* LINK INPUT */}
        <div style={{ marginBottom: 20 }}>

          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: "600"
            }}
          >
            Submission Link
          </label>

          <input
            type="text"
            placeholder="Google Drive / GitHub / Website link"
            value={link}
            onChange={e => setLink(e.target.value)}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 15
            }}
          />

        </div>

        {/* FILE INPUT */}
        <div style={{ marginBottom: 25 }}>

          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: "600"
            }}
          >
            Upload File
          </label>

          <div
            style={{
              border: "2px dashed #d1d5db",
              borderRadius: 10,
              padding: 20,
              textAlign: "center",
              background: "#f9fafb"
            }}
          >

            <input
              type="file"
              onChange={e =>
                setFile(e.target.files[0])
              }
            />

            {file && (

              <p
                style={{
                  marginTop: 10,
                  color: "#2563eb"
                }}
              >
                {file.name}
              </p>

            )}

          </div>

        </div>

        {/* BUTTONS */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10
          }}
        >

          <button
            onClick={close}
            style={{
              padding: "10px 18px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              background: "white",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            style={{
              padding: "10px 18px",
              borderRadius: 8,
              border: "none",
              background: "#111827",
              color: "white",
              cursor: "pointer"
            }}
          >
            {loading
              ? "Submitting..."
              : "Submit Assignment"}
          </button>

        </div>

      </div>

    </div>
  );
}