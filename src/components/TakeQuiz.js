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

            setQuestions(response.questions);

            setTimeLeft(response.quiz.time_limit * 60);

        }

        catch (err) {

            console.error(err);

            setError(err.message);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        if (timeLeft <= 0) {

            if (attempt) {

                submitQuiz();

            }

            return;

        }

        const timer = setInterval(() => {

            setTimeLeft(prev => prev - 1);

        }, 1000);

        return () => clearInterval(timer);

    }, [timeLeft]);

    const saveAnswer = async (questionId, answer) => {

        if (!attempt) return;

        try {

            await api(

                "/quizzes/answer",

                "POST",

                {

                    attempt_id: attempt.id,

                    question_id: questionId,

                    answer

                },

                token

            );

        }

        catch (err) {

            console.error(err);

        }

    };

    const handleAnswer = (questionId, value) => {

        setAnswers(prev => ({

            ...prev,

            [questionId]: value

        }));

        saveAnswer(questionId, value);

    };

    const submitQuiz = async () => {

        try {

            const result = await api(

                "/quizzes/submit",

                "POST",

                {

                    attempt_id: attempt.id

                },

                token

            );

            alert(

                `Quiz Submitted\n\nScore: ${result.score}/${result.totalQuestions}\nPercentage: ${result.percentage}%`

            );

            goBack();

        }

        catch (err) {

            console.error(err);

        }

    };

    if (loading) {

        return <h2>Starting Quiz...</h2>;

    }

    if (error) {

        return <h2>{error}</h2>;

    }

    const question = questions[currentQuestion];

    const minutes = Math.floor(timeLeft / 60);

    const seconds = String(timeLeft % 60).padStart(2, "0");

    return (

        <div style={{ padding:40 }}>

            <button onClick={goBack}>

                ← Back

            </button>

            <h1>

                {quizData.title}

            </h1>

            <p>

                Time Limit: {quizData.time_limit} minutes

            </p>

            <hr/>

            <div

                style={{

                    background:"#f9fafb",

                    padding:20,

                    borderRadius:10,

                    marginBottom:30

                }}

            >

                <h2>Time Remaining</h2>

                <h1 style={{color:"#dc2626"}}>

                    {minutes}:{seconds}

                </h1>

            </div>

            <div

                style={{

                    display:"flex",

                    gap:10,

                    flexWrap:"wrap",

                    marginBottom:25

                }}

            >

                {questions.map((q,index)=>(

                    <button

                        key={q.id}

                        onClick={()=>setCurrentQuestion(index)}

                        style={{

                            width:45,

                            height:45,

                            borderRadius:"50%",

                            border:"none",

                            cursor:"pointer",

                            background:

                                answers[q.id]

                                ? "#16a34a"

                                : index===currentQuestion

                                ? "#2563eb"

                                : "#d1d5db",

                            color:"white"

                        }}

                    >

                        {index+1}

                    </button>

                ))}

            </div>

            <h2>

                Question {currentQuestion+1} of {questions.length}

            </h2>

            <h3>

                {question.question}

            </h3>

            <div

                style={{

                    marginTop:20,

                    display:"flex",

                    flexDirection:"column",

                    gap:12

                }}

            >

                {Array.isArray(question.options)

                && question.options.length>0 ? (

                    question.options.map(option=>(

                        <label key={option}>

                            <input

                                type="radio"

                                checked={

                                    answers[question.id]===option

                                }

                                onChange={()=>

                                    handleAnswer(

                                        question.id,

                                        option

                                    )

                                }

                            />

                            {" "}

                            {option}

                        </label>

                    ))

                )

                :

                (

                    <textarea

                        rows={4}

                        value={

                            answers[question.id] || ""

                        }

                        onChange={(e)=>

                            handleAnswer(

                                question.id,

                                e.target.value

                            )

                        }

                        style={{

                            width:"100%",

                            padding:10

                        }}

                    />

                )}

            </div>

            <div

                style={{

                    display:"flex",

                    justifyContent:"space-between",

                    marginTop:40

                }}

            >

                <button

                    disabled={currentQuestion===0}

                    onClick={()=>

                        setCurrentQuestion(

                            currentQuestion-1

                        )

                    }

                >

                    ← Previous

                </button>

                {

                    currentQuestion===questions.length-1

                    ?

                    <button

                        onClick={submitQuiz}

                        style={{

                            background:"#16a34a",

                            color:"white",

                            padding:"10px 20px",

                            border:"none",

                            borderRadius:8

                        }}

                    >

                        Submit Quiz

                    </button>

                    :

                    <button

                        onClick={()=>

                            setCurrentQuestion(

                                currentQuestion+1

                            )

                        }

                    >

                        Next →

                    </button>

                }

            </div>

        </div>

    );

}