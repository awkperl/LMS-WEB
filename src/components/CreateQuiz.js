import { useState } from "react";
import { api } from "../services/api";

export default function CreateQuiz({
  courseId,
  token,
  refresh
}) {

  const [title, setTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);

  const [loading, setLoading] =
    useState(false);

  const createQuiz = async () => {

    if (!title.trim()) {
      alert("Quiz title is required");
      return;
    }

    try {

      setLoading(true);

      await api(
        "/quizzes",
        "POST",
        {
          course_id: courseId,
          title,
          time_limit: Number(timeLimit)
        },
        token
      );

      alert("Quiz created successfully");

      setTitle("");
      setTimeLimit(30);

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
        background: "white",
        padding: 20,
        borderRadius: 10,
        marginBottom: 20
      }}
    >

      <h3>Create Quiz</h3>

      <input
        placeholder="Quiz Title"
        value={title}
        onChange={(e)=>
          setTitle(e.target.value)
        }
        style={{
          width:"100%",
          padding:10,
          marginBottom:15
        }}
      />

      <input
        type="number"
        placeholder="Time Limit"
        value={timeLimit}
        onChange={(e)=>
          setTimeLimit(e.target.value)
        }
        style={{
          width:"100%",
          padding:10,
          marginBottom:15
        }}
      />

      <button
        onClick={createQuiz}
        disabled={loading}
      >
        {
          loading
            ? "Creating..."
            : "Create Quiz"
        }
      </button>

    </div>

  );

}