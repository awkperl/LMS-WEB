import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function QuizAttempts({

    quizId,
    token

}) {

    const [attempts, setAttempts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        loadAttempts();

    }, [quizId]);

    const loadAttempts = async () => {

        try {

            setLoading(true);

            const data = await api(

                `/quizzes/${quizId}/attempts`,
                "GET",
                null,
                token

            );

            setAttempts(data);

        }

        catch (err) {

            console.error(err);

            setError(err.message);

        }

        finally {

            setLoading(false);

        }

    };

    const formatDuration = (start, end) => {

        if (!start || !end) return "-";

        const diff = Math.floor(

            (new Date(end) - new Date(start)) / 1000

        );

        const mins = Math.floor(diff / 60);

        const secs = diff % 60;

        return `${mins}m ${secs}s`;

    };

    if (loading) {

        return <h3>Loading quiz attempts...</h3>;

    }

    if (error) {

        return <h3>{error}</h3>;

    }

    return (

        <div>

            <h2>

                Student Quiz Attempts

            </h2>

            <hr />

            {

                attempts.length === 0 ?

                (

                    <p>

                        No attempts found.

                    </p>

                )

                :

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        background: "white",
                        marginTop: 20
                    }}
                >

                    <thead>

                        <tr
                            style={{
                                background: "#111827",
                                color: "white"
                            }}
                        >

                            <th style={th}>Student</th>

                            <th style={th}>Score</th>

                            <th style={th}>Percentage</th>

                            <th style={th}>Pass/Fail</th>

                            <th style={th}>Submitted</th>

                            <th style={th}>Time Taken</th>

                            <th style={th}>View</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            attempts.map(attempt => (

                                <tr
                                    key={attempt.id}
                                >

                                    <td style={td}>

                                        {attempt.student_name}

                                    </td>

                                    <td style={td}>

                                        {attempt.score} / {attempt.total_questions}

                                    </td>

                                    <td style={td}>

                                        {attempt.percentage}%

                                    </td>

                                    <td style={td}>

                                        <span
                                            style={{
                                                color:

                                                attempt.passed

                                                ?

                                                "#16a34a"

                                                :

                                                "#dc2626",

                                                fontWeight: "bold"
                                            }}
                                        >

                                            {

                                                attempt.passed

                                                ?

                                                "PASS"

                                                :

                                                "FAIL"

                                            }

                                        </span>

                                    </td>

                                    <td style={td}>

                                        {

                                            attempt.submitted_at

                                            ?

                                            new Date(

                                                attempt.submitted_at

                                            ).toLocaleString()

                                            :

                                            "-"

                                        }

                                    </td>

                                    <td style={td}>

                                        {

                                            formatDuration(

                                                attempt.start_time,

                                                attempt.submitted_at

                                            )

                                        }

                                    </td>

                                    <td style={td}>

                                        <button

                                            style={{

                                                background:"#2563eb",

                                                color:"white",

                                                border:"none",

                                                borderRadius:6,

                                                padding:"8px 15px",

                                                cursor:"pointer"

                                            }}

                                            onClick={() => {

                                                alert(

                                                    "View Attempt coming in Phase 2.6"

                                                );

                                            }}

                                        >

                                            View

                                        </button>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            }

        </div>

    );

}

const th = {

    padding: 12,

    textAlign: "left"

};

const td = {

    padding: 12,

    borderBottom: "1px solid #e5e7eb"

};