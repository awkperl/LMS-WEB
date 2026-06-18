import { useEffect, useState } from "react";
import { api } from "../services/api";
import CreateQuestion from "../components/CreateQuestion";

export default function Exams({ token }) {

  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [attemptId, setAttemptId] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);

  // TIMER
  const [timeLeft, setTimeLeft] = useState(0);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // LOAD QUIZZES
  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {

    try {

      const data = await api(
        "/quizzes",
        "GET",
        null,
        token
      );

      setQuizzes(data);

    } catch (err) {

      console.error(err);

    }
  };

  // START QUIZ
  const startQuiz = async (quiz) => {

    try {

      const attempt = await api(
        "/quizzes/start",
        "POST",
        {
          quiz_id: quiz.id
        },
        token
      );

      setAttemptId(attempt.id);

      setCurrentQuiz(quiz);

      // TIMER IN SECONDS
      setTimeLeft(quiz.time_limit * 60);

      // LOAD QUESTIONS
      const qs = await api(
        `/quizzes/${quiz.id}/questions`,
        "GET",
        null,
        token
      );

      setQuestions(qs);

    } catch (err) {

      console.error(err);

      alert(
        err.message || "Failed to start quiz"
      );

    }
  };

  // TIMER EFFECT
  useEffect(() => {

    if (!currentQuiz || timeLeft <= 0)
      return;

    const timer = setInterval(() => {

      setTimeLeft((prev) => prev - 1);

    }, 1000);

    return () => clearInterval(timer);

  }, [timeLeft, currentQuiz]);

  // AUTO SUBMIT
  useEffect(() => {

    if (timeLeft === 0 && attemptId) {

      submitQuiz(true);

    }

  }, [timeLeft]);

  // FORMAT TIME
  const formatTime = () => {

    const mins = Math.floor(
      timeLeft / 60
    );

    const secs = timeLeft % 60;

    return `${mins}:${
      secs < 10 ? "0" : ""
    }${secs}`;

  };

  // SAVE ANSWER
  const saveAnswer = async (
    questionId,
    answer
  ) => {

    try {

      await api(
        "/quizzes/answer",
        "POST",
        {
          attempt_id: attemptId,
          question_id: questionId,
          answer
        },
        token
      );

    } catch (err) {

      console.error(err);

    }
  };

  // SUBMIT QUIZ
  const submitQuiz = async (
    auto = false
  ) => {

    try {

      await api(
        "/quizzes/submit",
        "POST",
        {
          attempt_id: attemptId
        },
        token
      );

      if (auto) {

        alert(
          "Time expired. Quiz auto-submitted."
        );

      } else {

        alert("Quiz submitted");

      }

      setQuestions([]);
      setCurrentQuiz(null);
      setAttemptId(null);
      setTimeLeft(0);

    } catch (err) {

      console.error(err);

    }
  };

  // QUIZ SCREEN
  if (currentQuiz) {

    return (

      <div
        style={{
          padding: 30
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20
          }}
        >

          <div>

            <h2>
              {currentQuiz.title}
            </h2>

            <p>
              Time Limit:
              {" "}
              {currentQuiz.time_limit}
              {" "}
              mins
            </p>

          </div>

          {/* TIMER */}
          <div
            style={{
              background:
                timeLeft < 60
                  ? "#dc2626"
                  : "#111827",
              color: "white",
              padding: "14px 20px",
              borderRadius: 10,
              fontSize: 22,
              fontWeight: "bold"
            }}
          >
            ⏳ {formatTime()}
          </div>

        </div>

        {questions.map((q, index) => (

          <div
            key={q.id}
            style={{
              background: "white",
              padding: 20,
              borderRadius: 12,
              marginBottom: 20
            }}
          >

            <h3>
              Q{index + 1}.
              {" "}
              {q.question_text}
            </h3>

            {/* MCQ */}
            {q.question_type === "mcq" && (

              <div
                style={{
                  marginTop: 15
                }}
              >

                {[q.option_a,
                  q.option_b,
                  q.option_c,
                  q.option_d]
                  .filter(Boolean)
                  .map((opt, i) => (

                    <label
                      key={i}
                      style={{
                        display: "block",
                        marginBottom: 10
                      }}
                    >

                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        onChange={(e) =>
                          saveAnswer(
                            q.id,
                            e.target.value
                          )
                        }
                      />

                      {" "}
                      {opt}

                    </label>

                  ))}

              </div>

            )}

            {/* TEXT QUESTION */}
            {q.question_type !== "mcq" && (

              <textarea
                placeholder="Your answer"
                onBlur={(e) =>
                  saveAnswer(
                    q.id,
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: 12,
                  marginTop: 15,
                  minHeight: 120
                }}
              />

            )}

          </div>

        ))}

        <button
          onClick={() =>
            submitQuiz(false)
          }
          style={{
            padding: "12px 20px",
            background: "#111827",
            color: "white",
            border: "none",
            borderRadius: 8
          }}
        >
          Submit Quiz
        </button>

      </div>

    );
  }

  // QUIZZES LIST
  return (

    <div style={{ padding: 30 }}>

      <h2>
        Exams / Quizzes
      </h2>

      {/* CREATE QUESTION */}
      {["instructor", "admin"].includes(
        user?.role
      ) && (

        <CreateQuestion
          token={token}
          refresh={loadQuizzes}
        />

      )}

      {quizzes.length === 0 && (
        <p>No exams available</p>
      )}

      {quizzes.map((q) => (

        <div
          key={q.id}
          style={{
            background: "white",
            padding: 20,
            marginTop: 10,
            borderRadius: 10
          }}
        >

          <h3>
            {q.title}
          </h3>

          <p>
            Time Limit:
            {" "}
            {q.time_limit}
            {" "}
            mins
          </p>

          <button
            onClick={() =>
              startQuiz(q)
            }
            style={{
              padding: "10px 16px",
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: 8
            }}
          >
            Start Exam
          </button>

        </div>

      ))}

    </div>

  );
}