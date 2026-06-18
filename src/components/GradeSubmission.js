/**import { useState } from "react";
import { api } from "../services/api";

export default function GradeSubmission({
  submission,
  token,
  refresh
}) {

  const [score, setScore] =
    useState(submission.score || "");

  const [feedback, setFeedback] =
    useState(submission.feedback || "");

  const [loading, setLoading] =
    useState(false);

  const grade = async () => {

    try {

      setLoading(true);

      await api(
        "/grade",
        "POST",
        {
          submission_id: submission.id,
          score,
          feedback
        },
        token
      );

      refresh();

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div
      style={{
        padding: 15,
        border: "1px solid #ddd",
        borderRadius: 10,
        marginTop: 10
      }}
    >

      <h4>Grade Submission</h4>

      <input
        type="number"
        placeholder="Score"
        value={score}
        onChange={(e) =>
          setScore(e.target.value)
        }
        style={{
          width: "100%",
          marginBottom: 10
        }}
      />

      <textarea
        placeholder="Feedback"
        value={feedback}
        onChange={(e) =>
          setFeedback(e.target.value)
        }
        style={{
          width: "100%",
          marginBottom: 10
        }}
      />

      <button
        onClick={grade}
        disabled={loading}
      >
        {loading
          ? "Saving..."
          : "Submit Grade"}
      </button>

    </div>
  );
}
**/

/** 

import { useState } from "react";
import { api } from "../services/api";

export default function GradeSubmission({
  submission,
  token,
  refresh
}) {

  const [score, setScore] =
    useState(submission.score || "");

  const [feedback, setFeedback] =
    useState(submission.feedback || "");

  const [loading, setLoading] =
    useState(false);

  const grade = async () => {

    try {

      setLoading(true);

      await api(
        "/grade",
        "POST",
        {
          submission_id: submission.id,
          score,
          feedback
        },
        token
      );

      refresh();

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div
      style={{
        padding: 15,
        border: "1px solid #ddd",
        borderRadius: 10,
        marginTop: 10
      }}
    >

      <h4>Grade Submission</h4>

      <input
        type="number"
        placeholder="Score"
        value={score}
        onChange={(e) =>
          setScore(e.target.value)
        }
        style={{
          width: "100%",
          marginBottom: 10
        }}
      />

      <textarea
        placeholder="Feedback"
        value={feedback}
        onChange={(e) =>
          setFeedback(e.target.value)
        }
        style={{
          width: "100%",
          marginBottom: 10
        }}
      />

      <button
        onClick={grade}
        disabled={loading}
      >
        {loading
          ? "Saving..."
          : "Submit Grade"}
      </button>

    </div>
  );
}**/

import { useState } from "react";
import { api } from "../services/api";

export default function GradeSubmission({
  submission,
  token,
  refresh
}) {

  const [score, setScore] =
    useState(submission.score || "");

  const [feedback, setFeedback] =
    useState(submission.feedback || "");

  const [loading, setLoading] =
    useState(false);

  const grade = async () => {

    try {

      setLoading(true);

      await api(
        "/grade",
        "POST",
        {
          submission_id: submission.id,
          score,
          feedback
        },
        token
      );

      refresh();

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div
      style={{
        padding: 15,
        border: "1px solid #ddd",
        borderRadius: 10,
        marginTop: 10
      }}
    >

      <h4>Grade Submission</h4>

      <input
        type="number"
        placeholder="Score"
        value={score}
        onChange={(e) =>
          setScore(e.target.value)
        }
        style={{
          width: "100%",
          marginBottom: 10
        }}
      />

      <textarea
        placeholder="Feedback"
        value={feedback}
        onChange={(e) =>
          setFeedback(e.target.value)
        }
        style={{
          width: "100%",
          marginBottom: 10
        }}
      />

      <button
        onClick={grade}
        disabled={loading}
      >
        {loading
          ? "Saving..."
          : "Submit Grade"}
      </button>

    </div>
  );
}