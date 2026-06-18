import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function InstructorSubmissions({
  assignmentId,
  token
}) {

  const [submissions, setSubmissions] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // LOAD SUBMISSIONS
  const loadSubmissions = async () => {

    try {

      const data = await api(
        `/submissions/${assignmentId}`,
        "GET",
        null,
        token
      );

      setSubmissions(data);

    } catch (err) {

      console.error(err);

    }
  };

  useEffect(() => {

    loadSubmissions();

  }, [assignmentId]);

  // GRADE SUBMISSION
  const gradeSubmission = async (
    submissionId,
    score,
    feedback
  ) => {

    try {

      setLoading(true);

      await api(
        "/grades",
        "POST",
        {
          submission_id: submissionId,
          score,
          feedback
        },
        token
      );

      alert("Graded successfully");

    } catch (err) {

      console.error(err);

      alert("Grading failed");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div style={{ marginTop: 20 }}>

      <h3>Student Submissions</h3>

      {submissions.length === 0 && (
        <p>No submissions yet</p>
      )}

      {submissions.map((s) => (

        <SubmissionCard
          key={s.id}
          submission={s}
          onGrade={gradeSubmission}
          loading={loading}
        />

      ))}

    </div>
  );
}

// SUBMISSION CARD
function SubmissionCard({
  submission,
  onGrade,
  loading
}) {

  const [score, setScore] =
    useState("");

  const [feedback, setFeedback] =
    useState("");

  return (

    <div
      style={{
        background: "white",
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        border: "1px solid #e5e7eb"
      }}
    >

      <p>
        👨‍🎓 Student:
        {" "}
        {submission.student_id}
      </p>

      <p>
        🔁 Attempt:
        {" "}
        {submission.attempt_number}
      </p>

      {submission.content && (
        <p>
          🔗 Link:
          {" "}
          <a
            href={submission.content}
            target="_blank"
            rel="noreferrer"
          >
            Open Submission
          </a>
        </p>
      )}

      {submission.file_url && (
        <p>
          📎 File:
          {" "}
          <a
            href={submission.file_url}
            target="_blank"
            rel="noreferrer"
          >
            Download File
          </a>
        </p>
      )}

      {/* SCORE */}
      <input
        type="number"
        placeholder="Score"
        value={score}
        onChange={(e) =>
          setScore(e.target.value)
        }
        style={{
          width: "100%",
          padding: 10,
          marginTop: 10,
          marginBottom: 10
        }}
      />

      {/* FEEDBACK */}
      <textarea
        placeholder="Feedback"
        value={feedback}
        onChange={(e) =>
          setFeedback(e.target.value)
        }
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10
        }}
      />

      {/* BUTTON */}
      <button
        onClick={() =>
          onGrade(
            submission.id,
            score,
            feedback
          )
        }
        disabled={loading}
        style={{
          padding: "10px 16px",
          background: "#111827",
          color: "white",
          border: "none",
          borderRadius: 8
        }}
      >
        Save Grade
      </button>

    </div>

  );
}