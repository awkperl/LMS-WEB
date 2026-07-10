import { useEffect, useState } from "react";
import { api } from "../services/api";
import CreateQuestion from "./CreateQuestion";

export default function QuizManagement({
  courseId,
  token
}) {

  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [title, setTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);

  useEffect(() => {

    if (courseId) {
      loadQuizzes();
    }

  }, [courseId]);

  const loadQuizzes = async () => {

    try {

      const data = await api(
        "/quizzes",
        "GET",
        null,
        token
      );

      const filtered = data.filter(
        q => q.course_id === courseId
      );

      setQuizzes(filtered);

    } catch (err) {

      console.error(err);

    }

  };

  const loadQuestions = async (quizId) => {

    try {

      const data = await api(
        `/quizzes/${quizId}/questions`,
        "GET",
        null,
        token
      );

      setQuestions(data);

    } catch (err) {

      console.error(err);

    }

  };

  const createQuiz = async () => {

    if (!title.trim()) {

      alert("Quiz title is required");

      return;

    }

    try {

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

      alert("Quiz created successfully.");

      setTitle("");
      setTimeLimit(30);

      await loadQuizzes();

    } catch (err) {

      console.error(err);

      alert(err.message);

    }

  };

  return (

    <div style={{ padding: 30 }}>

      <h2>Quiz Management</h2>

      <hr />

      <h3>Create Quiz</h3>

      <input
        placeholder="Quiz Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10
        }}
      />

      <input
        type="number"
        placeholder="Time Limit"
        value={timeLimit}
        onChange={(e) =>
          setTimeLimit(e.target.value)
        }
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 20
        }}
      />

      <button onClick={createQuiz}>
        Create Quiz
      </button>

      <hr />

      <h3>Available Quizzes</h3>

      {quizzes.length === 0 ? (

        <p>No quizzes created for this course.</p>

      ) : (

        quizzes.map((quiz) => (

          <div
            key={quiz.id}
            style={{
              padding: 15,
              border: "1px solid #ddd",
              borderRadius: 8,
              marginBottom: 10
            }}
          >

            <strong>{quiz.title}</strong>

            <br />

            Time Limit: {quiz.time_limit} minutes

            <br />
            <br />

            <button
              onClick={() => {

                setSelectedQuiz(quiz);

                loadQuestions(quiz.id);

              }}
            >
              Open Quiz
            </button>

          </div>

        ))

      )}

      {selectedQuiz && (

        <>

          <hr />

          <h2>{selectedQuiz.title}</h2>

          <p>Questions</p>

          {questions.length === 0 ? (

            <p>No questions yet.</p>

          ) : (

            questions.map((q, index) => (

              <div
                key={q.id}
                style={{
                  border: "1px solid #ddd",
                  padding: 15,
                  marginBottom: 10,
                  borderRadius: 8,
                  background: "#fff"
                }}
              >

                <strong>
                  {index + 1}. {q.question}
                </strong>

                {q.options && (

                  <ul style={{ marginTop: 10 }}>

                    {q.options.map((option, i) => (

                      <li key={i}>
                        {option}
                      </li>

                    ))}

                  </ul>

                )}

                <p>

                  <strong>Correct Answer:</strong>{" "}
                  {q.correct_answer}

                </p>

              </div>

            ))

          )}

          <CreateQuestion
            quizId={selectedQuiz.id}
            token={token}
            refresh={() =>
              loadQuestions(selectedQuiz.id)
            }
          />

        </>

      )}

    </div>

  );

}