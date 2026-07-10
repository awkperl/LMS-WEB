import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function EditQuestion({

  questionData,
  token,
  refresh,
  close

}) {

  const [question, setQuestion] = useState("");

  const [options, setOptions] = useState([
    "",
    "",
    "",
    ""
  ]);

  const [correctAnswer, setCorrectAnswer] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (!questionData) return;

    setQuestion(questionData.question);

    setCorrectAnswer(questionData.correct_answer);

    if (
      questionData.options &&
      Array.isArray(questionData.options)
    ) {

      const temp = [
        "",
        "",
        "",
        ""
      ];

      questionData.options.forEach((opt, index) => {

        if (index < 4) {

          temp[index] = opt;

        }

      });

      setOptions(temp);

    }

  }, [questionData]);

  const updateQuestion = async () => {

    if (!question.trim()) {

      return alert("Question is required");

    }

    if (!correctAnswer.trim()) {

      return alert("Correct answer is required");

    }

    if (options.some(o => o.trim() !== "")) {

      if (!options.includes(correctAnswer)) {

        return alert(
          "Correct answer must match one of the options."
        );

      }

    }

    try {

      setLoading(true);

      await api(

        `/quizzes/question/${questionData.id}`,

        "PUT",

        {

          question,

          options:
            options.some(o => o.trim() !== "")
              ? options
              : null,

          correct_answer: correctAnswer

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
        background: "white",
        padding: 20,
        borderRadius: 10,
        marginTop: 20,
        border: "1px solid #ddd"
      }}
    >

      <h3>Edit Question</h3>

      <textarea

        rows={3}

        value={question}

        onChange={(e) =>
          setQuestion(e.target.value)
        }

        style={{
          width: "100%",
          padding: 10,
          marginBottom: 15
        }}

      />

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
            marginBottom: 10
          }}

        />

      ))}

      <input

        value={correctAnswer}

        onChange={(e) =>
          setCorrectAnswer(e.target.value)
        }

        placeholder="Correct Answer"

        style={{
          width: "100%",
          padding: 10,
          marginTop: 10
        }}

      />

      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 20
        }}
      >

        <button

          onClick={updateQuestion}

          disabled={loading}

          style={{
            flex: 1,
            padding: 12,
            border: "none",
            borderRadius: 8,
            background: "#2563eb",
            color: "white",
            cursor: "pointer"
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
            padding: 12,
            border: "none",
            borderRadius: 8,
            background: "#dc2626",
            color: "white",
            cursor: "pointer"
          }}

        >

          Cancel

        </button>

      </div>

    </div>

  );

}