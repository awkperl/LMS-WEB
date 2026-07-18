import { useState } from "react";
import { api } from "../services/api";

export default function EditQuestion({

    questionData,
    token,
    refresh,
    close

}) {

    const [question, setQuestion] =
        useState(questionData.question);

    const [type, setType] =
        useState(questionData.type || "multiple_choice");

    const [points, setPoints] =
        useState(questionData.points || 1);

    const [options, setOptions] =
        useState(

            questionData.options ||

            ["", "", "", ""]

        );

    const [correctAnswer, setCorrectAnswer] =
        useState(questionData.correct_answer || "");

    const [loading, setLoading] =
        useState(false);

    const updateQuestion = async () => {

        if (!question.trim()) {

            alert("Question is required.");

            return;

        }

        if (points < 1) {

            alert("Points must be at least 1.");

            return;

        }

        if (type === "multiple_choice") {

            for (let i = 0; i < options.length; i++) {

                if (!options[i].trim()) {

                    alert(`Option ${i + 1} is empty`);

                    return;

                }

            }

            if (!correctAnswer) {

                alert("Select the correct answer.");

                return;

            }

        }

        if (

            type === "short_answer" &&

            !correctAnswer.trim()

        ) {

            alert("Correct answer required.");

            return;

        }

        if (

            type === "true_false" &&

            !correctAnswer

        ) {

            alert("Select True or False.");

            return;

        }

        try {

            setLoading(true);

            await api(

                `/quizzes/question/${questionData.id}`,

                "PUT",

                {

                    question,

                    type,

                    points,

                    options:

                        type === "multiple_choice"

                            ? options

                            : type === "true_false"

                                ? ["True", "False"]

                                : null,

                    correct_answer:

                        type === "essay"

                            ? null

                            : correctAnswer

                },

                token

            );

            alert("Question updated successfully.");

            refresh();

            close();

        }

        catch (err) {

            console.error(err);

            alert(err.message);

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div

            style={{

                marginTop: 25,

                padding: 25,

                background: "#fff",

                border: "1px solid #ddd",

                borderRadius: 10

            }}

        >

            <h3>Edit Question</h3>

            <div style={{ marginBottom: 15 }}>

                <label>Question Type</label>

                <select

                    value={type}

                    onChange={(e) => {

                        setType(e.target.value);

                        setCorrectAnswer("");

                    }}

                    style={{

                        width: "100%",

                        padding: 10,

                        marginTop: 5

                    }}

                >

                    <option value="multiple_choice">

                        Multiple Choice

                    </option>

                    <option value="true_false">

                        True / False

                    </option>

                    <option value="short_answer">

                        Short Answer

                    </option>

                    <option value="essay">

                        Essay

                    </option>

                </select>

            </div>

            <div style={{ marginBottom: 15 }}>

                <label>Points</label>

                <input

                    type="number"

                    min={1}

                    value={points}

                    onChange={(e) =>

                        setPoints(Number(e.target.value))

                    }

                    style={{

                        width: "100%",

                        padding: 10,

                        marginTop: 5

                    }}

                />

            </div>

            <div style={{ marginBottom: 20 }}>

                <label>Question</label>

                <textarea

                    rows={3}

                    value={question}

                    onChange={(e) =>

                        setQuestion(e.target.value)

                    }

                    style={{

                        width: "100%",

                        padding: 10,

                        marginTop: 5

                    }}

                />

            </div>

            {type === "multiple_choice" && (

                <>

                    <label>Options</label>

                    {options.map((option, index) => (

                        <input

                            key={index}

                            value={option}

                            placeholder={`Option ${index + 1}`}

                            onChange={(e) => {

                                const updated = [...options];

                                updated[index] = e.target.value;

                                setOptions(updated);

                            }}

                            style={{

                                width: "100%",

                                padding: 10,

                                marginTop: 10

                            }}

                        />

                    ))}

                    <div style={{ marginTop: 20 }}>

                        <label>Correct Answer</label>

                        <select

                            value={correctAnswer}

                            onChange={(e) =>

                                setCorrectAnswer(e.target.value)

                            }

                            style={{

                                width: "100%",

                                padding: 10,

                                marginTop: 5

                            }}

                        >

                            <option value="">

                                Select Correct Answer

                            </option>

                            {options.map((option, index) => (

                                <option

                                    key={index}

                                    value={option}

                                >

                                    {option || `Option ${index + 1}`}

                                </option>

                            ))}

                        </select>

                    </div>

                </>

            )}

            {type === "true_false" && (

                <div style={{ marginTop: 20 }}>

                    <label>Correct Answer</label>

                    <select

                        value={correctAnswer}

                        onChange={(e) =>

                            setCorrectAnswer(e.target.value)

                        }

                        style={{

                            width: "100%",

                            padding: 10,

                            marginTop: 5

                        }}

                    >

                        <option value="">

                            Select

                        </option>

                        <option value="True">

                            True

                        </option>

                        <option value="False">

                            False

                        </option>

                    </select>

                </div>

            )}

            {type === "short_answer" && (

                <div style={{ marginTop: 20 }}>

                    <label>Correct Answer</label>

                    <input

                        value={correctAnswer}

                        onChange={(e) =>

                            setCorrectAnswer(e.target.value)

                        }

                        placeholder="Correct Answer"

                        style={{

                            width: "100%",

                            padding: 10,

                            marginTop: 5

                        }}

                    />

                </div>

            )}

            {type === "essay" && (

                <div

                    style={{

                        marginTop: 20,

                        padding: 15,

                        background: "#fef3c7",

                        borderRadius: 8

                    }}

                >

                    Essay questions are manually graded.

                </div>

            )}

            <div

                style={{

                    display: "flex",

                    gap: 10,

                    marginTop: 25

                }}

            >

                <button

                    onClick={updateQuestion}

                    disabled={loading}

                    style={{

                        flex: 1,

                        padding: 14,

                        border: "none",

                        borderRadius: 8,

                        background: "#2563eb",

                        color: "white"

                    }}

                >

                    {loading

                        ? "Saving..."

                        : "Save Changes"}

                </button>

                <button

                    onClick={close}

                    style={{

                        flex: 1,

                        padding: 14,

                        border: "none",

                        borderRadius: 8,

                        background: "#6b7280",

                        color: "white"

                    }}

                >

                    Cancel

                </button>

            </div>

        </div>

    );

}