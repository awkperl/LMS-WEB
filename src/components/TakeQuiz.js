import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function TakeQuiz({

    quiz,
    token,
    goBack

}) {

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [attempt, setAttempt] =
        useState(null);

    const [quizData, setQuizData] =
        useState(null);

    const [questions, setQuestions] =
        useState([]);
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

            setAttempt(

                response.attempt

            );

            setQuizData(

                response.quiz

            );

            setQuestions(

                response.questions || []

            );
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
    useEffect(() => {

    if (timeLeft <= 0) return;

    const timer = setInterval(() => {

        setTimeLeft(prev => prev - 1);

    }, 1000);

    return () => clearInterval(timer);

}, [timeLeft]);
const minutes = Math.floor(timeLeft / 60);

const seconds = timeLeft % 60;
const question = questions[currentQuestion];

    if (loading) {

        return (

            <div style={{ padding:40 }}>

                <h2>

                    Starting Quiz...

                </h2>

            </div>

        );

    }

    if (error) {

        return (

            <div style={{ padding:40 }}>

                <h2>

                    {error}

                </h2>

                <button

                    onClick={goBack}

                >

                    Back

                </button>

            </div>

        );

    }

    return (

        <div
            style={{
                padding:40
            }}
        >

            <button
                onClick={goBack}
            >
                ← Back
            </button>

            <h1>

                {quizData.title}

            </h1>

            <p>

                Time Limit:

                {" "}

                {quizData.time_limit}

                {" "}

                minutes

            </p>

            <hr />

            <h2>

                Quiz Ready

            </h2>

            <p>

                Attempt ID:

                {" "}

                {attempt.id}

            </p>

            <p>

                Questions Loaded:

                {" "}

                {questions.length}

            </p>

        </div>

    );

}