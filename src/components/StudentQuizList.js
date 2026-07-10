import { useEffect, useState } from "react";
import { api } from "../services/api";
import TakeQuiz from "../components/TakeQuiz";

export default function StudentQuizList({

    courseId,
    token

}) {

    const [quizzes, setQuizzes] = useState([]);

    const [selectedQuiz, setSelectedQuiz] =
        useState(null);

    useEffect(() => {

        loadQuizzes();

    }, [courseId]);

    const loadQuizzes = async () => {

        try {

            const data = await api(

                "/quizzes",
                "GET",
                null,
                token

            );

            setQuizzes(

                data.filter(

                    q => q.course_id === courseId

                )

            );

        }

        catch (err) {

            console.error(err);

        }

    };

    if (selectedQuiz) {

        return (

            <TakeQuiz

                quiz={selectedQuiz}

                token={token}

                goBack={() =>
                    setSelectedQuiz(null)
                }

            />

        );

    }

    return (

        <div>

            <h2>

                Available Quizzes

            </h2>

            <hr />

            {

                quizzes.length === 0 ?

                (

                    <p>

                        No quizzes available.

                    </p>

                )

                :

                quizzes.map(quiz => (

                    <div

                        key={quiz.id}

                        style={{

                            background:"white",

                            borderRadius:10,

                            padding:20,

                            marginBottom:20,

                            border:"1px solid #ddd"

                        }}

                    >

                        <h3>

                            {quiz.title}

                        </h3>

                        <p>

                            Time Limit:

                            {" "}

                            {quiz.time_limit}

                            {" "}

                            minutes

                        </p>

                        <button

                            onClick={() =>
                                setSelectedQuiz(quiz)
                            }

                            style={{

                                background:"#2563eb",

                                color:"white",

                                border:"none",

                                padding:"10px 20px",

                                borderRadius:8,

                                cursor:"pointer"

                            }}

                        >

                            ▶ Start Quiz

                        </button>

                    </div>

                ))

            }

        </div>

    );

}