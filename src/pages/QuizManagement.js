/**import { useEffect, useState } from "react";
import { api } from "../services/api";
import CreateQuestion from "./CreateQuestion";

export default function QuizManagement({

  courseId,

  token

}) {

  const [quizzes, setQuizzes] =
    useState([]);

  const [selectedQuiz, setSelectedQuiz] =
    useState(null);

  const [questions, setQuestions] =
    useState([]);

  const [title, setTitle] =
    useState("");

  const [timeLimit, setTimeLimit] =
    useState(30);

  useEffect(() => {

    loadQuizzes();

  }, []);

  const loadQuizzes = async () => {

    try {

      const data =
        await api(
          "/quizzes",
          "GET",
          null,
          token
        );

      const filtered =
        data.filter(
          q => q.course_id === courseId
        );

      setQuizzes(filtered);

    }

    catch (err) {

      console.error(err);

    }

  };

  const loadQuestions = async (quizId) => {

    try {

      const data =
        await api(
          `/quizzes/${quizId}/questions`,
          "GET",
          null,
          token
        );

      setQuestions(data);

    }

    catch (err) {

      console.error(err);

    }

  };

  const createQuiz = async () => {

    if (!title.trim()) {

      return alert("Quiz title required");

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

      setTitle("");

      setTimeLimit(30);

      loadQuizzes();

    }

    catch (err) {

      console.error(err);

      alert(err.message);

    }

  };

  return (

    <div
      style={{
        padding:30
      }}
    >

      <h2>

        Quiz Management

      </h2>

      <hr/>

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
          marginBottom:10
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
          marginBottom:20
        }}

      />

      <button

        onClick={createQuiz}

      >

        Create Quiz

      </button>

      <hr/>

      <h3>

        Available Quizzes

      </h3>

      {

        quizzes.map(q=>(

          <div

            key={q.id}

            style={{
              padding:15,
              border:"1px solid #ddd",
              borderRadius:8,
              marginBottom:10
            }}

          >

            <strong>

              {q.title}

            </strong>

            <br/>

            Time Limit:

            {q.time_limit} mins

            <br/><br/>

            <button

              onClick={()=>{

                setSelectedQuiz(q);

                loadQuestions(q.id);

              }}

            >

              Open Quiz

            </button>

          </div>

        ))

      }

      {

        selectedQuiz && (

          <>

            <hr/>

            <h2>

              {selectedQuiz.title}

            </h2>

            <p>

              Questions

            </p>

            {

              questions.length===0 ?

              <p>

                No questions yet.

              </p>

              :

              questions.map((q,index)=>(

                <div

                  key={q.id}

                  style={{
                    border:"1px solid #ddd",
                    padding:15,
                    marginBottom:10,
                    borderRadius:8
                  }}

                >

                  <strong>

                    {index+1}.

                    {q.question}

                  </strong>

                  <br/>

                  Correct Answer:

                  {q.correct_answer}

                </div>

              ))

            }

            <CreateQuestion

              quizId={
                selectedQuiz.id
              }

              token={token}

              refresh={()=>
                loadQuestions(
                  selectedQuiz.id
                )
              }

            />

          </>

        )

      }

    </div>

  );

}**/

import { useEffect, useState } from "react";
import { api } from "../services/api";

import CreateQuiz from "../components/CreateQuiz";
import CreateQuestion from "../components/CreateQuestion";

export default function QuizManagement({ token }) {

  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);

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

  const selectQuiz = (quiz) => {

    setSelectedQuiz(quiz);

    loadQuestions(quiz.id);

  };

  return (

    <div>

      <h2>Quiz Management</h2>

      <CreateQuiz
        token={token}
        refresh={loadQuizzes}
      />

      <hr />

      <h3>Available Quizzes</h3>

      {quizzes.map((quiz) => (

        <div
          key={quiz.id}
          style={{
            padding:15,
            marginBottom:10,
            border:"1px solid #ddd",
            borderRadius:8,
            cursor:"pointer"
          }}
          onClick={() => selectQuiz(quiz)}
        >

          <strong>{quiz.title}</strong>

          <br/>

          Time Limit: {quiz.time_limit} minutes

        </div>

      ))}

      {selectedQuiz && (

        <>

          <hr />

          <h3>

            Questions for:

            {" "}

            {selectedQuiz.title}

          </h3>

          <CreateQuestion
            quizId={selectedQuiz.id}
            token={token}
            refresh={() =>
              loadQuestions(selectedQuiz.id)
            }
          />

          <div style={{marginTop:30}}>

            {questions.map((q,index)=>(

              <div
                key={q.id}
                style={{
                  background:"#fff",
                  padding:15,
                  borderRadius:8,
                  marginBottom:10
                }}
              >

                <strong>

                  Q{index+1}

                </strong>

                <p>{q.question}</p>

                {q.options && (

                  <ul>

                    {q.options.map((opt,i)=>(

                      <li key={i}>{opt}</li>

                    ))}

                  </ul>

                )}

                <b>

                  Correct:

                </b>

                {" "}

                {q.correct_answer}

              </div>

            ))}

          </div>

        </>

      )}

    </div>

  );

}