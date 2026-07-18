import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function TakeQuiz({

    quiz,
    token,
    goBack

}) {

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [attempt, setAttempt] = useState(null);

    const [quizData, setQuizData] = useState(null);

    const [questions, setQuestions] = useState([]);

    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [answers, setAnswers] = useState({});

    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {

        startQuiz();

    }, []);

    const startQuiz = async () => {

        try {

            setLoading(true);

            const response = await api(

                "/quizzes/start",

                "POST",

                {
                    quiz_id: quiz.id
                },

                token

            );

            setAttempt(response.attempt);

            setQuizData(response.quiz);

            setQuestions(response.questions || []);

            setTimeLeft(response.quiz.time_limit * 60);

        }

        catch (err) {

            console.error(err);

            setError(

                err.message ||

                "Unable to start quiz."

            );

        }

        finally {

            setLoading(false);

        }

    };

    /* TIMER */

    useEffect(() => {

        if (timeLeft <= 0) return;

        const timer = setInterval(() => {

            setTimeLeft(prev => prev - 1);

        }, 1000);

        return () => clearInterval(timer);

    }, [timeLeft]);

    if (loading) {

        return (

            <div style={{ padding: 40 }}>

                <h2>

                    Starting Quiz...

                </h2>

            </div>

        );

    }

    if (error) {

        return (

            <div style={{ padding: 40 }}>

                <h2>{error}</h2>

                <button onClick={goBack}>

                    Back

                </button>

            </div>

        );

    }

    const question = questions[currentQuestion];

    const minutes = Math.floor(timeLeft / 60);

    const seconds = timeLeft % 60;

    return (

        <div style={{ padding: 40 }}>

            <button onClick={goBack}>

                ← Back

            </button>

            <h1>

                {quizData.title}

            </h1>

            <p>

                Time Limit: {quizData.time_limit} minutes

            </p>

            <hr />

            {/* TIMER */}

            <div

                style={{

                    background: "#f9fafb",

                    padding: 20,

                    borderRadius: 10,

                    marginBottom: 30

                }}

            >

                <h2>

                    Time Remaining

                </h2>

                <h1

                    style={{

                        color: "#dc2626"

                    }}

                >

                    {minutes}:

                    {seconds

                        .toString()

                        .padStart(2, "0")}

                </h1>

            </div>

            {/* QUESTION PALETTE */}

            <div

                style={{

                    display: "flex",

                    flexWrap: "wrap",

                    gap: 10,

                    marginBottom: 30

                }}

            >

                {questions.map((q, index) => (

                    <button

                        key={q.id}

                        onClick={() =>
                            setCurrentQuestion(index)
                        }

                        style={{

                            width: 45,

                            height: 45,

                            borderRadius: "50%",

                            border: "none",

                            cursor: "pointer",

                            fontWeight: "bold",

                            background:

                                currentQuestion === index

                                    ? "#2563eb"

                                    : answers[q.id]

                                    ? "#16a34a"

                                    : "#d1d5db",

                            color: "white"

                        }}

                    >

                        {index + 1}

                    </button>

                ))}

            </div>

            <hr />

            <h2>

                Question {currentQuestion + 1} of {questions.length}

            </h2>

            <h3>

                {question.question}

            </h3>

            <div

                style={{

                    marginTop: 25

                }}

            >

                {/* MULTIPLE CHOICE */}

                {question.type === "multiple_choice" &&

                    Array.isArray(question.options) && (

                        question.options.map(option => (

                            <label

                                key={option}

                                style={{

                                    display: "block",

                                    marginBottom: 12

                                }}

                            >

                                <input

                                    type="radio"

                                    checked={

                                        answers[question.id] === option

                                    }

                                    onChange={() =>

                                        setAnswers({

                                            ...answers,

                                            [question.id]: option

                                        })

                                    }

                                />

                                {" "}

                                {option}

                            </label>

                        ))

                    )}

                {/* TRUE FALSE */}

                {question.type === "true_false" && (

                    <>

                        {["True", "False"].map(option => (

                            <label

                                key={option}

                                style={{

                                    display: "block",

                                    marginBottom: 12

                                }}

                            >

                                <input

                                    type="radio"

                                    checked={

                                        answers[question.id] === option

                                    }

                                    onChange={() =>

                                        setAnswers({

                                            ...answers,

                                            [question.id]: option

                                        })

                                    }

                                />

                                {" "}

                                {option}

                            </label>

                        ))}

                    </>

                )}

                {/* SHORT ANSWER */}

                {question.type === "short_answer" && (

                    <input

                        type="text"

                        value={

                            answers[question.id] || ""

                        }

                        onChange={(e) =>

                            setAnswers({

                                ...answers,

                                [question.id]:

                                    e.target.value

                            })

                        }

                        placeholder="Type your answer..."

                        style={{

                            width: "100%",

                            padding: 12

                        }}

                    />

                )}

                {/* ESSAY */}

                {question.type === "essay" && (

                    <textarea

                        rows={8}

                        value={

                            answers[question.id] || ""

                        }

                        onChange={(e) =>

                            setAnswers({

                                ...answers,

                                [question.id]:

                                    e.target.value

                            })

                        }

                        placeholder="Write your answer..."

                        style={{

                            width: "100%",

                            padding: 12

                        }}

                    />

                )}

            </div>

            {/* NAVIGATION */}

            <div

                style={{

                    display: "flex",

                    justifyContent: "space-between",

                    marginTop: 40

                }}

            >

                <button

                    disabled={currentQuestion === 0}

                    onClick={() =>

                        setCurrentQuestion(

                            currentQuestion - 1

                        )

                    }

                >

                    ← Previous

                </button>

                <button

                    disabled={

                        currentQuestion ===

                        questions.length - 1

                    }

                    onClick={() =>

                        setCurrentQuestion(

                            currentQuestion + 1

                        )

                    }

                >

                    Next →

                </button>

            </div>

        </div>

    );

}