import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function CertificateStudents({
    courseId,
    token
}) {

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadStudents();

    }, [courseId]);

    const loadStudents = async () => {

        try {

            const data = await api(
                `/certificates/course/${courseId}`,
                "GET",
                null,
                token
            );

            setStudents(data);

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    };
    const generateCertificate = async (studentId) => {

    try {

        const result = await api(
            "/certificates/generate",
            "POST",
            {
                courseId: courseId,
                studentId: studentId
            },
            token
        );

        alert(
            result.message ||
            "Certificate generated successfully."
        );

    } catch (err) {

        console.error(err);

        alert(
            err.message ||
            "Failed to generate certificate."
        );

    }

};

    if (loading) {

        return <p>Loading certificate eligibility...</p>;

    }

    return (

        <div style={{ marginTop: 30 }}>

            <h2>Certificate Eligibility</h2>

            {students.length === 0 ? (

                <p>No enrolled students found.</p>

            ) : (

                students.map(student => (

                    <div
                        key={student.student_id}
                        style={{
                            padding: 20,
                            marginBottom: 15,
                            border: "1px solid #ddd",
                            borderRadius: 10,
                            background: "#fff"
                        }}
                    >

                        <h3>
                            {student.student_name}
                        </h3>

                        <p>
                            {student.email}
                        </p>

                        <p>
                            Quizzes Passed:{" "}
                            {student.passed_quizzes}
                            {" / "}
                            {student.total_quizzes}
                        </p>

                        {student.quizzes_completed ? (

                            <div>

                                <span
                                    style={{
                                        color: "green",
                                        fontWeight: "bold",
                                        marginRight: 15
                                    }}
                                >
                                    ✅ Eligible
                                </span>

                                <button
                                    style={{
                                        background: "#16a34a",
                                        color: "white",
                                        border: "none",
                                        padding: "10px 18px",
                                        borderRadius: 6,
                                        cursor: "pointer"
                                    }}
    onClick={async () => {

    try {

        const result = await api(
    "/certificates/generate",
    "POST",
    {
        courseId: courseId,
        studentId: student.student_id
    },
    token
);

        alert(
            result.message ||
            "Certificate generated successfully."
        );

    } catch (err) {

        console.error(err);

        alert(
            err.message ||
            "Failed to generate certificate."
        );

    }

}}
                                >
                                    🎓 Generate Certificate
                                </button>

                            </div>

                        ) : (

                            <span
                                style={{
                                    color: "#dc2626",
                                    fontWeight: "bold"
                                }}
                            >
                                ❌ Not Eligible
                            </span>

                        )}

                    </div>

                ))

            )}

        </div>

    );

}