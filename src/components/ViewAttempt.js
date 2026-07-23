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
    const [grades, setGrades] = useState({});

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
const saveGrade = async (answerId) => {

    try {

        await api(

            `/quizzes/answer/${answerId}/grade`,

            "PUT",

            {
                points: Number(grades[answerId])
            },

            token

        );

        // Reload the updated attempt
        await loadAttempt();

        // Clear temporary input state
        setGrades({});

        alert("Grade saved successfully.");

    }

    catch (err) {

        console.error(err);

        alert(err.message);

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

q.type === "essay" && (

<div
    style={{
        marginTop:20,
        padding:15,
        background:"#f3f4f6",
        borderRadius:8
    }}
>

<h4>

Instructor Grade

</h4>

<p>

Maximum Points:

<b>

{" "}

{q.points}

</b>

</p>

<input

type="number"

min={0}

max={q.points}

value={
    grades[q.answer_id] !== undefined
        ? grades[q.answer_id]
        : (q.awarded_points ?? "")
}

onChange={(e)=>

setGrades({

...grades,

[q.answer_id]: e.target.value

})

}

style={{

width:120,

padding:8,

marginRight:10

}}

/>

<button

onClick={()=>

saveGrade(

q.answer_id

)

}

style={{

background:"#2563eb",

color:"white",

border:"none",

padding:"8px 15px",

borderRadius:6,

cursor:"pointer"

}}

>

Save Grade

</button>

</div>

)

}

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