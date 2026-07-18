import { useState } from "react";
import { api } from "../services/api";

export default function CreateQuestion({
  quizId,
  token,
  refresh
}) {

  const [question, setQuestion] = useState("");

  const [type, setType] = useState("multiple_choice");

  const [points, setPoints] = useState(1);

  const [options, setOptions] = useState([
    "",
    "",
    "",
    ""
  ]);

  const [correctAnswer, setCorrectAnswer] = useState("");

  const [loading, setLoading] = useState(false);

  const createQuestion = async () => {

    if (!question.trim()) {
      alert("Question is required");
      return;
    }

    if (points < 1) {
      alert("Points must be at least 1");
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
      alert("Correct answer is required.");
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

      const body = {

        quiz_id: quizId,

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

      };

      await api(
        "/quizzes/question",
        "POST",
        body,
        token
      );

      alert("Question added successfully.");

      setQuestion("");

      setType("multiple_choice");

      setPoints(1);

      setCorrectAnswer("");

      setOptions([
        "",
        "",
        "",
        ""
      ]);

      refresh();

    } catch (err) {

      console.error(err);

      alert(err.message);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div
      style={{
        marginTop: 20,
        padding: 20,
        borderRadius: 10,
        background: "#f3f4f6"
      }}
    >

      <h3>Add Question</h3>

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

          placeholder="Enter question"

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

              onChange={(e)=>
                setCorrectAnswer(e.target.value)
              }

              style={{
                width:"100%",
                padding:10,
                marginTop:5
              }}

            >

              <option value="">
                Select Correct Answer
              </option>

              {options.map((option,index)=>(

                <option
                  key={index}
                  value={option}
                >

                  {option || `Option ${index+1}`}

                </option>

              ))}

            </select>

          </div>

        </>

      )}

      {type === "true_false" && (

        <div style={{ marginTop:20 }}>

          <label>Correct Answer</label>

          <select

            value={correctAnswer}

            onChange={(e)=>
              setCorrectAnswer(e.target.value)
            }

            style={{
              width:"100%",
              padding:10,
              marginTop:5
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

        <div style={{ marginTop:20 }}>

          <label>Correct Answer</label>

          <input

            value={correctAnswer}

            onChange={(e)=>
              setCorrectAnswer(e.target.value)
            }

            placeholder="Correct Answer"

            style={{
              width:"100%",
              padding:10,
              marginTop:5
            }}

          />

        </div>

      )}

      {type === "essay" && (

        <div
          style={{
            marginTop:20,
            padding:15,
            background:"#fef3c7",
            borderRadius:8
          }}
        >

          Essay questions are manually graded.
          No correct answer is required.

        </div>

      )}

      <button

        onClick={createQuestion}

        disabled={loading}

        style={{

          marginTop:25,

          width:"100%",

          padding:14,

          border:"none",

          borderRadius:8,

          background:"#111827",

          color:"white",

          cursor:"pointer"

        }}

      >

        {loading ? "Saving..." : "Add Question"}

      </button>

    </div>

  );

}