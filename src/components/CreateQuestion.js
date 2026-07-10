import { useState } from "react";
import { api } from "../services/api";

export default function CreateQuestion({
  quizId,
  token,
  refresh
}) {

  const [question, setQuestion] = useState("");

  const [type, setType] = useState("short");

  const [options, setOptions] = useState([
    "",
    "",
    "",
    ""
  ]);

  const [correctAnswer, setCorrectAnswer] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const createQuestion = async () => {

    if (!question.trim()) {
      alert("Question is required");
      return;
    }

    if (!correctAnswer.trim()) {
      alert("Correct answer is required");
      return;
    }

    if (type === "mcq") {

      for (let i = 0; i < options.length; i++) {

        if (!options[i].trim()) {
          alert(`Option ${i + 1} is empty`);
          return;
        }

      }

      if (!options.includes(correctAnswer)) {

        alert(
          "Correct answer must match one of the options."
        );

        return;

      }

    }

    try {

      setLoading(true);

      const body = {

        quiz_id: quizId,

        question,

        correct_answer: correctAnswer,

        options:
          type === "mcq"
            ? options
            : null

      };

      await api(
        "/quizzes/question",
        "POST",
        body,
        token
      );

      alert("Question added successfully.");

      setQuestion("");

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
          onChange={(e) =>
            setType(e.target.value)
          }
          style={{
            width: "100%",
            padding: 10,
            marginTop: 5
          }}
        >

          <option value="short">
            Short Answer
          </option>

          <option value="mcq">
            Multiple Choice
          </option>

        </select>

      </div>

      <div style={{ marginBottom: 15 }}>

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

      {type === "mcq" && (

        <div>

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

        </div>

      )}

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

      <button

        onClick={createQuestion}

        disabled={loading}

        style={{

          marginTop: 20,

          width: "100%",

          padding: 14,

          border: "none",

          borderRadius: 8,

          background: "#111827",

          color: "white",

          cursor: "pointer"

        }}

      >

        {loading
          ? "Saving..."
          : "Add Question"}

      </button>

    </div>

  );

}