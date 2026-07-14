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