import { useState } from "react";
import { api } from "../services/api";

export default function EditQuiz({

  quiz,

  token,

  refresh,

  close

}) {

  const [title, setTitle] =
    useState(quiz.title);

  const [timeLimit, setTimeLimit] =
    useState(quiz.time_limit);

  const save = async () => {

    try {

      await api(

        `/quizzes/${quiz.id}`,

        "PUT",

        {

          title,

          time_limit: Number(timeLimit)

        },

        token

      );

      alert("Quiz updated successfully.");

      refresh();

      close();

    }

    catch (err) {

      console.error(err);

      alert(err.message);

    }

  };

  return (

    <div
      style={{
        background:"white",
        padding:20,
        borderRadius:10,
        marginTop:20,
        marginBottom:20
      }}
    >

      <h3>Edit Quiz</h3>

      <input

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

      <button onClick={save}>

        Save Changes

      </button>

      <button

        onClick={close}

        style={{
          marginLeft:10
        }}

      >

        Cancel

      </button>

    </div>

  );

}