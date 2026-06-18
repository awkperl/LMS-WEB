import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function BrowseCourses({
  token
}) {

  const [courses, setCourses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  // LOAD ALL COURSES
  useEffect(() => {

    loadCourses();

  }, []);

  const loadCourses = async () => {

    try {

      const data = await api(
        "/courses/all",
        "GET",
        null,
        token
      );

      setCourses(data);

    } catch (err) {

      console.error(err);

      setMessage(
        "Failed to load courses"
      );

    } finally {

      setLoading(false);

    }
  };

  // ENROLL
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

      alert("Successfully enrolled");

    } catch (err) {

      console.error(err);

      alert(
        err.message ||
        "Enrollment failed"
      );

    }
  };

  return (
    <div>

      {/* PAGE HEADER */}
      <div
        style={{
          marginBottom: 30
        }}
      >

        <h2
          style={{
            marginBottom: 10
          }}
        >
          Browse Courses
        </h2>

        <p
          style={{
            color: "gray"
          }}
        >
          Discover and enroll in
          available courses
        </p>

      </div>

      {/* MESSAGE */}
      {message && (

        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: 12,
            borderRadius: 8,
            marginBottom: 20
          }}
        >
          {message}
        </div>

      )}

      {/* LOADING */}
      {loading ? (

        <p>Loading courses...</p>

      ) : (

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: 20
          }}
        >

          {courses.map(
            (course, index) => (

              <div
                key={course.id}
                style={{
                  background: "white",
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.1)"
                }}
              >

                {/* HEADER */}
                <div
                  style={{
                    height: 90,

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
                    {course.title}
                  </h3>

                  <p
                    style={{
                      color: "gray",
                      marginTop: 10
                    }}
                  >
                    Course Code:
                    {" "}
                    <strong>
                      {course.code}
                    </strong>
                  </p>

                  <p
                    style={{
                      marginTop: 10,
                      color: "#4b5563"
                    }}
                  >
                    Instructor:
                    {" "}
                    <strong>
                      {course.instructor_name ||
                        "Unknown"}
                    </strong>
                  </p>

                  <button
                    onClick={() =>
                      enrollCourse(
                        course.id
                      )
                    }
                    style={{
                      marginTop: 20,
                      width: "100%",
                      padding:
                        "12px 16px",

                      background:
                        "#111827",

                      color: "white",

                      border: "none",

                      borderRadius: 8,

                      cursor: "pointer",

                      fontWeight: "bold"
                    }}
                  >
                    Enroll Now
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}