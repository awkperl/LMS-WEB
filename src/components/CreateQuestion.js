import { useState } from "react";
import { api } from "../services/api";

export default function CreateQuestion({
  quizId,
  token,
  refresh
}) {

  const [questionText, setQuestionText] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const createQuestion = async () => {

    try {

      await api(
        "/quizzes/question",
        "POST",
        {
          quiz_id: quizId,
          question: questionText,
          correct_answer: answer
          
        },
        token
      );

      setQuestionText("");
      setAnswer("");

      alert("Question added");

      refresh();

    } catch (err) {

      console.error(err);

    }
  };

  return (

    <div
      style={{
        marginTop: 15,
        padding: 15,
        background: "#f9fafb",
        borderRadius: 10
      }}
    >

      <input
        placeholder="Question"
        value={questionText}
        onChange={(e) =>
          setQuestionText(e.target.value)
        }
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10
        }}
      />

      <input
        placeholder="Correct answer"
        value={answer}
        onChange={(e) =>
          setAnswer(e.target.value)
        }
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10
        }}
      />

      <button
        onClick={createQuestion}
      >
        Add Question
      </button>

    </div>

  );
}