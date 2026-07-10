import { useEffect, useState } from "react";
import { api } from "../services/api";
import SubmitAssignment from "../components/SubmitAssignment";
import CreateAssignment from "../components/CreateAssignment";
import AssignmentStatusBadge from "../components/AssignmentStatusBadge";
import InstructorSubmissions from "../components/InstructorSubmissions";
import QuizManagement from "../components/QuizManagement";


export default function Course({
  courseId,
  token,
  goBack
}) {

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [tab, setTab] = useState("assignments");

  const user = JSON.parse(localStorage.getItem("user"));

  // LOAD ASSIGNMENTS
  const loadAssignments = async () => {

    try {

      const data = await api(
        `/assignments/${courseId}`,
        "GET",
        null,
        token
      );

      setAssignments(data);

    } catch (err) {

      console.error(err);

    }
  };

  // LOAD SUBMISSIONS
  const loadSubmissions = async () => {

    try {

      const responses = await Promise.all(

        assignments.map(a =>

          api(
            `/submissions/${a.id}`,
            "GET",
            null,
            token
          )

        )

      );

      const flat = responses.flat();

      setSubmissions(flat);

    } catch (err) {

      console.error(err);

    }
  };

  // INITIAL LOAD
  useEffect(() => {

    loadAssignments();

  }, [courseId]);

  // LOAD SUBMISSIONS AFTER ASSIGNMENTS
  useEffect(() => {

    if (assignments.length > 0) {

      loadSubmissions();

    }

  }, [assignments]);

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: 30
      }}
    >

      {/* HEADER */}
      <div
        style={{
          background: "white",
          padding: 25,
          borderRadius: 12,
          marginBottom: 30,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}
      >

        <div>

          <button
            onClick={goBack}
            style={{
              padding: "8px 14px",
              border: "none",
              borderRadius: 6,
              background: "#111827",
              color: "white",
              cursor: "pointer",
              marginBottom: 15
            }}
          >
            ⬅ Back
          </button>

       <h1
  style={{
    margin: 0,
    fontSize: 28
  }}
>
  Course Workspace
</h1>

<p style={{ color: "gray" }}>
  Manage assignments, quizzes and course activities.
</p>

        </div>

        {/* ASSIGNMENT COUNT */}
        <div
          style={{
            background: "#111827",
            color: "white",
            padding: "16px 20px",
            borderRadius: 10,
            textAlign: "center"
          }}
        >

          <h2 style={{ margin: 0 }}>
            {assignments.length}
          </h2>

          <p style={{ margin: 0 }}>
            Assignments
          </p>

        </div>

      </div>

      <div
  style={{
    display: "flex",
    gap: 10,
    marginBottom: 25
  }}
>

  <button
    onClick={() => setTab("assignments")}
    style={{
      padding: "10px 20px",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      background:
        tab === "assignments"
          ? "#111827"
          : "#e5e7eb",
      color:
        tab === "assignments"
          ? "white"
          : "#111827"
    }}
  >
    📚 Assignments
  </button>

  <button
    onClick={() => setTab("quizzes")}
    style={{
      padding: "10px 20px",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      background:
        tab === "quizzes"
          ? "#111827"
          : "#e5e7eb",
      color:
        tab === "quizzes"
          ? "white"
          : "#111827"
    }}
  >
    📝 Quizzes
  </button>

</div>

{tab === "assignments" && (

<>


      {/* CREATE ASSIGNMENT */}
      {["instructor", "admin"].includes(
        user?.role
      ) && (

        <CreateAssignment
          token={token}
          courseId={courseId}
          refresh={loadAssignments}
        />

      )}

      {/* EMPTY STATE */}
      {assignments.length === 0 && (

        <div
          style={{
            background: "white",
            padding: 40,
            borderRadius: 12,
            textAlign: "center"
          }}
        >

          <h3>No assignments yet</h3>

          <p style={{ color: "gray" }}>
            Assignments will appear here
          </p>

        </div>

      )}

      {/* ASSIGNMENTS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(320px,1fr))",
          gap: 20
        }}
      >

        {assignments.map((a, index) => {

          // ALL SUBMISSIONS FOR THIS ASSIGNMENT
          const assignmentSubmissions =
            submissions.filter(
              s => s.assignment_id === a.id
            );

          // LATEST SUBMISSION
          const submission =
            assignmentSubmissions[
              assignmentSubmissions.length - 1
            ];

          return (

            <div
              key={a.id}
              style={{
                background: "white",
                borderRadius: 14,
                overflow: "hidden",
                boxShadow:
                  "0 2px 10px rgba(0,0,0,0.08)"
              }}
            >

              {/* TOP COLOR */}
              <div
                style={{
                  height: 80,
                  background:
                    index % 4 === 0 ? "#2563eb" :
                    index % 4 === 1 ? "#7c3aed" :
                    index % 4 === 2 ? "#059669" :
                    "#ea580c"
                }}
              />

              {/* BODY */}
              <div style={{ padding: 20 }}>

                {/* STATUS */}
                <AssignmentStatusBadge
                  assignment={a}
                  submissions={submissions}
                  userId={user?.id}
                />

                {/* TITLE */}
                <h3 style={{ marginTop: 10 }}>
                  {a.title}
                </h3>

                {/* DESCRIPTION */}
                <p style={{ color: "gray" }}>
                  {a.description}
                </p>

                {/* DUE DATE */}
                <p>
                  📅 Due:
                  {" "}
                  {a.due_date
                    ? new Date(
                        a.due_date
                      ).toLocaleString()
                    : "No deadline"}
                </p>

                {/* ATTEMPTS */}
                <p>
                  🔁 Attempts Allowed:
                  {" "}
                  {a.attempt_limit}
                </p>

                {/* MAX SCORE */}
                <p>
                  🏆 Max Score:
                  {" "}
                  {a.max_score}
                </p>

                {/* SUBMISSION STATUS */}
                {submission && (

                  <div
                    style={{
                      marginTop: 10,
                      padding: 10,
                      borderRadius: 8,
                      background: "#ecfdf5",
                      border: "1px solid #d1fae5"
                    }}
                  >

                    <p
                      style={{
                        margin: 0,
                        color: "#065f46",
                        fontWeight: "600"
                      }}
                    >
                      ✅ Submitted
                    </p>

                    <p
                      style={{
                        margin: 0,
                        marginTop: 5,
                        color: "#065f46"
                      }}
                    >
                      Attempt #
                      {submission.attempt_number}
                    </p>

                  </div>

                )}

                {/* STUDENT GRADE + FEEDBACK */}
                {submission &&
                  submission.score !== null && (

                  <div
                    style={{
                      marginTop: 12,
                      padding: 12,
                      borderRadius: 8,
                      background: "#eff6ff",
                      border: "1px solid #bfdbfe"
                    }}
                  >

                    <p
                      style={{
                        margin: 0,
                        marginBottom: 8,
                        fontWeight: "700",
                        color: "#1d4ed8"
                      }}
                    >
                      🏆 Score:
                      {" "}
                      {submission.score}
                    </p>

                    <p
                      style={{
                        margin: 0,
                        color: "#374151"
                      }}
                    >
                      💬 Feedback:
                      {" "}
                      {submission.feedback ||
                        "No feedback yet"}
                    </p>

                    <p
                      style={{
                        marginTop: 8,
                        fontSize: 12,
                        color: "gray"
                      }}
                    >
                      ✅ Graded
                      {" "}
                      {submission.graded_at
                        ? new Date(
                            submission.graded_at
                          ).toLocaleString()
                        : ""}
                    </p>

                  </div>

                )}

                {/* SUBMIT BUTTON */}
                <button
                  onClick={() =>
                    setSelectedAssignment(a.id)
                  }
                  style={{
                    marginTop: 15,
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: 8,
                    background: "#111827",
                    color: "white",
                    cursor: "pointer",
                    width: "100%"
                  }}
                >
                  Submit Assignment
                </button>

                {/* INSTRUCTOR PANEL */}
                {["instructor", "admin"].includes(
                  user?.role
                ) && (

                  <InstructorSubmissions
                    assignmentId={a.id}
                    token={token}
                  />

                )}

              </div>

            </div>

          );
        })}

      </div>

      {/* SUBMIT MODAL */}
      {selectedAssignment && (

        <SubmitAssignment
          assignmentId={selectedAssignment}
          token={token}
          close={() =>
            setSelectedAssignment(null)
          }
          refreshSubmissions={
            loadSubmissions
          }
        />

      )}
</>

)}
{tab === "quizzes" && (

  <QuizManagement
    courseId={courseId}
    token={token}
  />

)}
    </div>

  );
}