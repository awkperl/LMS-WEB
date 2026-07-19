import { useEffect, useState } from "react";
import { api } from "../services/api";
import CreateQuestion from "../components/CreateQuestion";
import EditQuestion from "../components/EditQuestion";
import EditQuiz from "../components/EditQuiz";
import QuizPreview from "../components/QuizPreview";
import QuizAttempts from "../components/QuizAttempts";

export default function QuizManagement({
  courseId,
  token
}) {

  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] =
  useState(null);
  const [editingQuiz, setEditingQuiz] =
  useState(null);
  const [previewQuiz, setPreviewQuiz] =
useState(null);
const [tab, setTab] = useState("questions");

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
  const deleteQuiz = async (id) => {

  const confirmDelete = window.confirm(

    "Delete this quiz and all its questions?"

  );

  if (!confirmDelete) return;

  try {

    await api(

      `/quizzes/${id}`,

      "DELETE",

      null,

      token

    );

    alert("Quiz deleted successfully.");

    if (

      selectedQuiz &&

      selectedQuiz.id === id

    ) {

      setSelectedQuiz(null);

      setQuestions([]);

    }

    loadQuizzes();

  }

  catch (err) {

    console.error(err);

    alert(

      err.message ||

      "Unable to delete quiz."

    );

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

  const deleteQuestion = async (id) => {

  const confirmDelete = window.confirm(
    "Delete this question?"
  );

  if (!confirmDelete) return;

  try {

    await api(

      `/quizzes/question/${id}`,

      "DELETE",

      null,

      token

    );

    alert("Question deleted.");

    loadQuestions(selectedQuiz.id);

  } catch (err) {

    console.error(err);

  alert(

    err.message ||

    "Unable to delete question."

  );

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
      <button
    onClick={() => setTab("questions")}
>
    Questions
</button>

<button
    onClick={() => setTab("attempts")}
>
    Attempts
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
<div
  style={{
    display:"flex",
    gap:10,
    marginTop:10,
    flexWrap:"wrap"
  }}
>

<button

onClick={()=>{

setSelectedQuiz(quiz);

loadQuestions(quiz.id);

}}

>

Open

</button>

<button
  onClick={async () => {

    await loadQuestions(quiz.id);

    setPreviewQuiz(quiz);

  }}
>
  👁 Preview
</button>

<button

onClick={()=>setEditingQuiz(quiz)}

>

✏ Edit

</button>

<button

onClick={()=>deleteQuiz(quiz.id)}

style={{

background:"#dc2626",

color:"white",

border:"none",

padding:"8px 16px",

borderRadius:6

}}

>

🗑 Delete

</button>

</div>

          </div>

        ))

      )}
      {tab === "questions" && (

    <QuestionManagement
        quizId={selectedQuiz.id}
        token={token}
    />

)}

{tab === "attempts" && (

    <QuizAttempts
        quizId={selectedQuiz.id}
        token={token}
    />

)}

{editingQuiz && (

  <EditQuiz

    quiz={editingQuiz}

    token={token}

    refresh={loadQuizzes}

    close={() =>
      setEditingQuiz(null)
    }

  />

)}
{previewQuiz && (

  <QuizPreview

    quiz={previewQuiz}

    questions={questions}

    close={() =>
      setPreviewQuiz(null)
    }

  />

)}

      {selectedQuiz && (

        <>

          <hr />

          <h2>{selectedQuiz.title}</h2>

          <p>Questions</p>

          {questions.length === 0 ? (

            <p>No questions yet.</p>

          ) : (

          questions.map((q,index)=>(

<div
  key={q.id}
  style={{
    border:"1px solid #ddd",
    borderRadius:10,
    padding:20,
    marginBottom:20,
    background:"white"
  }}
>

  <h4>

    Question {index+1}

  </h4>

  <p>

    {q.question}

  </p>

  {q.options && (

    <ul>

      {q.options.map((option,i)=>(

        <li key={i}>

          {option}

        </li>

      ))}

    </ul>

  )}

  <p>

    <b>

      Correct Answer:

    </b>

    {" "}

    {q.correct_answer}

  </p>

  <div
    style={{
      display:"flex",
      gap:10,
      marginTop:15
    }}
  >

   <div
  style={{
    display: "flex",
    gap: 10,
    marginTop: 15
  }}
>

  <button

    onClick={() =>
      setEditingQuestion(q)
    }

    style={{
      padding: "8px 16px",
      border: "none",
      borderRadius: 6,
      background: "#2563eb",
      color: "white",
      cursor: "pointer"
    }}

  >

    ✏ Edit

  </button>

  <button

    onClick={() =>
      deleteQuestion(q.id)
    }

    style={{
      padding: "8px 16px",
      border: "none",
      borderRadius: 6,
      background: "#dc2626",
      color: "white",
      cursor: "pointer"
    }}

  >

    🗑 Delete

  </button>

</div>

  </div>

</div>

))
          )}

          {editingQuestion ? (

  <EditQuestion
    questionData={editingQuestion}
    token={token}
    refresh={() =>
      loadQuestions(selectedQuiz.id)
    }
    close={() =>
      setEditingQuestion(null)
    }
  />

) : (

  <CreateQuestion
    quizId={selectedQuiz.id}
    token={token}
    refresh={() =>
      loadQuestions(selectedQuiz.id)
    }
  />

)}

        </>

      )}

    </div>

  );

}