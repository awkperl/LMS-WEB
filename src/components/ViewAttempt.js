import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function ViewAttempt({

    attemptId,
    token,
    close

}) {

    const [loading, setLoading] = useState(true);

    const [attempt, setAttempt] = useState(null);

    const [questions, setQuestions] = useState([]);

    const [error, setError] = useState("");

    useEffect(() => {

        loadAttempt();

    }, [attemptId]);

    const loadAttempt = async () => {

        try {

            const data = await api(

                `/quizzes/attempt/${attemptId}`,

                "GET",

                null,

                token

            );

            setAttempt(data.attempt);

            setQuestions(data.questions);

        }

        catch (err) {

            console.error(err);

            setError(err.message);

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <h2>Loading attempt...</h2>;

    }

    if (error) {

        return <h2>{error}</h2>;

    }

    return (

        <div
            style={{
                marginTop:30,
                padding:25,
                background:"#fff",
                borderRadius:10,
                border:"1px solid #ddd"
            }}
        >

            <button
                onClick={close}
                style={{
                    marginBottom:20
                }}
            >
                ← Back
            </button>

            <h2>

                Student Attempt

            </h2>

            <hr/>

            <p>

                <b>Student:</b>

                {" "}

                {attempt.student}

            </p>

            <p>

                <b>Quiz:</b>

                {" "}

                {attempt.quiz}

            </p>

            <p>

                <b>Score:</b>

                {" "}

                {attempt.score}

                /

                {attempt.totalQuestions}

            </p>

            <p>

                <b>Percentage:</b>

                {" "}

                {attempt.percentage}%

            </p>

            <p>

                <b>Status:</b>

                {" "}

                {attempt.passed

                    ? "✅ PASS"

                    : "❌ FAIL"}

            </p>

            <hr/>

            {

                questions.map((q,index)=>(

                    <div

                        key={q.id}

                        style={{

                            marginBottom:30,

                            padding:20,

                            background:"#f9fafb",

                            borderRadius:10

                        }}

                    >

                        <h3>

                            Question {index+1}

                        </h3>

                        <p>

                            {q.question}

                        </p>

                        <hr/>

                        <p>

                            <b>

                                Student Answer

                            </b>

                        </p>

                        <div
                            style={{
                                marginBottom:15
                            }}
                        >

                            {q.student_answer || "-"}

                        </div>

                        {

                            q.type !== "essay" &&

                            <>

                                <p>

                                    <b>

                                        Correct Answer

                                    </b>

                                </p>

                                <div>

                                    {q.correct_answer}

                                </div>

                                <br/>

                                {

                                    q.is_correct

                                    ?

                                    <span
                                        style={{
                                            color:"green",
                                            fontWeight:"bold"
                                        }}
                                    >

                                        ✓ Correct

                                    </span>

                                    :

                                    <span
                                        style={{
                                            color:"red",
                                            fontWeight:"bold"
                                        }}
                                    >

                                        ✗ Incorrect

                                    </span>

                                }

                            </>

                        }

                    </div>

                ))

            }

        </div>

    );

}