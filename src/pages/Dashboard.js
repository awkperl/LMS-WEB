import { useEffect, useState } from "react";
import { api } from "../services/api";

import Course from "./Course";
import CreateCourse from "./CreateCourse";
import Notifications from "./Notifications";
import Exams from "./Exams";
import Certificates from "./Certificates";
import BrowseCourses from "./BrowseCourses";
import Analytics from "./Analytics";
import Library from "./Library";
import QuizManagement from "./QuizManagement";


export default function Dashboard({ token }) {

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] =
    useState(null);

  const [page, setPage] =
    useState("courses");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // LOAD COURSES
  useEffect(() => {

    loadCourses();

  }, [token]);

  // LOAD COURSES FUNCTION
  const loadCourses = async () => {

    try {

      const data = await api(
        "/courses",
        "GET",
        null,
        token
      );

      setCourses(data);

    } catch (err) {

      console.error(err);

    }
  };

  // ENROLL COURSE
  const enrollCourse = async (
    courseId
  ) => {

    try {

      await api(
        "/enrollments",
        "POST",
        {
          course_id: courseId
        },
        token
      );

      alert(
        "Enrolled successfully"
      );

      // REFRESH COURSES
      loadCourses();

    } catch (err) {

      console.error(err);

      alert(
        err.message ||
        "Enrollment failed"
      );

    }
  };

  // OPEN COURSE PAGE
  if (selectedCourse) {

    return (
      <Course
        courseId={selectedCourse}
        token={token}
        goBack={() =>
          setSelectedCourse(null)
        }
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f3f4f6"
      }}
    >

      {/* SIDEBAR */}
      <div
        style={{
          width: 250,
          background: "#111827",
          color: "white",
          padding: 20
        }}
      >

        <h2>LMS</h2>

        <div style={{ marginTop: 30 }}>

          {/* COURSES */}
          <div
            onClick={() =>
              setPage("courses")
            }
            style={menuStyle(
              page === "courses"
            )}
          >
            📚 Courses
          </div>

          {/* CREATE COURSE */}
          {[
            "instructor",
            "admin"
          ].includes(user?.role) && (

            <div
              onClick={() =>
                setPage(
                  "create-course"
                )
              }
              style={menuStyle(
                page === "create-course"
              )}
            >
              ➕ Create Course
            </div>

          )}
          {user?.role === "student" && (

  <div
    onClick={() =>
      setPage("browse-courses")
    }
    style={menuStyle(
      page === "browse-courses"
    )}
  >
    🌍 Browse Courses
  </div>

)}

{["admin", "instructor"].includes(user?.role) && (

  <div
    onClick={() => setPage("quiz-management")}
    style={menuStyle(page === "quiz-management")}
  >
    📝 Quiz Management
  </div>

)}

          {/* NOTIFICATIONS */}
          <div
            onClick={() =>
              setPage(
                "notifications"
              )
            }
            style={menuStyle(
              page === "notifications"
            )}
          >
            🔔 Notifications
          </div>

          {/* EXAMS */}
          <div
            onClick={() =>
              setPage("exams")
            }
            style={menuStyle(
              page === "exams"
            )}
          >
            📝 Exams
          </div>

          {/* ANALYTICS */}
          <div
            onClick={() =>
              setPage("analytics")
            }
            style={menuStyle(
              page === "analytics"
            )}
          >
            📊 Analytics
          </div>

          {/* CERTIFICATES */}
          <div
            onClick={() =>
              setPage(
                "certificates"
              )
            }
            style={menuStyle(
              page === "certificates"
            )}
          >
            🏆 Certifications
          </div>
          <div
  onClick={() => setPage("library")}
  style={menuStyle(page === "library")}
>
  📚 Library
</div>

        </div>

      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          padding: 30
        }}
      >

        {/* TOPBAR */}
        <div
          style={{
            background: "white",
            padding: 20,
            borderRadius: 10,
            marginBottom: 30,
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center"
          }}
        >

          {/* USER INFO */}
          <div>

            <h2 style={{ margin: 0 }}>
              LMS Dashboard
            </h2>

            <p
              style={{
                color: "gray"
              }}
            >
              Welcome back,
              {" "}
              {user?.name}
            </p>

            <p
              style={{
                color: "#2563eb",
                fontWeight: "bold",
                marginTop: 5
              }}
            >
              {user?.role?.toUpperCase()}
            </p>

          </div>

          {/* COURSE COUNT */}
          <div>

            Total Courses:
            {" "}
            <strong>
              {courses.length}
            </strong>

          </div>

          {/* LOGOUT */}
          <button
            onClick={() => {

              localStorage.removeItem(
                "token"
              );

              localStorage.removeItem(
                "user"
              );

              window.location.reload();

            }}
            style={{
              padding: "10px 16px",
              border: "none",
              borderRadius: 8,
              background: "#dc2626",
              color: "white",
              cursor: "pointer"
            }}
          >
            Logout
          </button>

        </div>

        {/* CREATE COURSE PAGE */}
        {page === "create-course" && (

          <CreateCourse
            token={token}
          />

        )}

        {/* COURSES PAGE */}
        {page === "courses" && (

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(250px,1fr))",
              gap: 20
            }}
          >

            {courses.map(
              (c, index) => (

                <div
                  key={c.id}
                  onClick={() =>
                    setSelectedCourse(
                      c.id
                    )
                  }
                  style={{
                    background:
                      "white",
                    borderRadius: 12,
                    overflow:
                      "hidden",
                    cursor:
                      "pointer",
                    boxShadow:
                      "0 2px 8px rgba(0,0,0,0.1)"
                  }}
                >

                  {/* HEADER */}
                  <div
                    style={{
                      height: 80,

                      background:
                        index % 4 === 0
                          ? "#2563eb"
                          : index % 4 === 1
                          ? "#7c3aed"
                          : index % 4 === 2
                          ? "#059669"
                          : "#ea580c"
                    }}
                  />

                  {/* BODY */}
                  <div
                    style={{
                      padding: 20
                    }}
                  >

                    <h3>
                      {c.title}
                    </h3>

                    <p
                      style={{
                        color:
                          "gray"
                      }}
                    >
                      Open course
                      and assignments
                    </p>

                    {/* STUDENT */}
                    {user?.role ===
                    "student" ? (

                      <button
                        onClick={(
                          e
                        ) => {

                          e.stopPropagation();

                          enrollCourse(
                            c.id
                          );

                        }}
                        style={{
                          padding:
                            "8px 14px",

                          background:
                            "#2563eb",

                          color:
                            "white",

                          border:
                            "none",

                          borderRadius:
                            6,

                          cursor:
                            "pointer"
                        }}
                      >
                        Enroll
                      </button>

                    ) : (

                      <button
                        style={{
                          padding:
                            "8px 14px",

                          background:
                            "#111827",

                          color:
                            "white",

                          border:
                            "none",

                          borderRadius:
                            6
                        }}
                      >
                        Open Course
                      </button>

                    )}

                  </div>

                </div>

              )
            )}

          </div>

        )}
        
        {page === "browse-courses" && (

  <BrowseCourses
    token={token}
  />

)}


        {/* NOTIFICATIONS */}
        {page ===
          "notifications" && (

          <Notifications
            token={token}
          />

        )}

        {page === "quiz-management" && (

  <QuizManagement
    token={token}
  />

)}

        {/* EXAMS */}
        {page === "exams" && (

          <Exams token={token} />

        )}

       
        {page === "analytics" && (

   <Analytics
      token={token}
   />

)}

        {/* CERTIFICATES */}
        {page ===
          "certificates" && (

          
          <Certificates
   token={token}
/>

        )}

        {page === "library" && (
  <Library token={token} />
)}

      </div>

    </div>
  );
}

/* SIDEBAR MENU STYLE */
function menuStyle(active) {

  return {

    padding: 12,

    marginBottom: 10,

    borderRadius: 8,

    cursor: "pointer",

    background: active
      ? "#374151"
      : "transparent"

  };
}