import { useState } from "react";
import CertificateStudents from "../components/CertificateStudents";

export default function CertificateManagement({
    courses,
    token
}) {

    const [selectedCourse, setSelectedCourse] =
        useState("");

    return (

        <div style={{ padding: 30 }}>

            <h1>Certificate Management</h1>

            <p>
                Review student eligibility and generate certificates.
            </p>

            {/* COURSE SELECTION */}

            <div style={{ marginTop: 25 }}>

                <label
                    style={{
                        display: "block",
                        marginBottom: 8,
                        fontWeight: "bold"
                    }}
                >
                    Select Course
                </label>

                <select
                    value={selectedCourse}
                    onChange={(e) =>
                        setSelectedCourse(e.target.value)
                    }
                    style={{
                        width: "100%",
                        maxWidth: 500,
                        padding: 12,
                        border: "1px solid #ccc",
                        borderRadius: 6
                    }}
                >

                    <option value="">
                        -- Select a course --
                    </option>

                    {courses.map(course => (

                        <option
                            key={course.id}
                            value={course.id}
                        >
                            {course.title}
                        </option>

                    ))}

                </select>

            </div>


            {/* STUDENT ELIGIBILITY */}

            {selectedCourse && (

                <CertificateStudents
                    courseId={selectedCourse}
                    token={token}
                />

            )}

        </div>

    );

}