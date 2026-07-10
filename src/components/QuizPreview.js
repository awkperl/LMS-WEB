import React from "react";

export default function QuizPreview({

  quiz,

  questions,

  close

}) {

  return (

    <div
      style={{
        position:"fixed",
        inset:0,
        background:"rgba(0,0,0,.55)",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        zIndex:1000
      }}
    >

      <div
        style={{
          width:"80%",
          maxWidth:900,
          maxHeight:"90vh",
          overflowY:"auto",
          background:"white",
          borderRadius:12,
          padding:30
        }}
      >

        <div
          style={{
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center"
          }}
        >

          <div>

            <h2>

              {quiz.title}

            </h2>

            <p>

              Time Limit:
              {" "}
              {quiz.time_limit}
              {" "}
              minutes

            </p>

          </div>

          <button

            onClick={close}

            style={{
              background:"#dc2626",
              color:"white",
              border:"none",
              padding:"10px 18px",
              borderRadius:8,
              cursor:"pointer"
            }}

          >

            Close

          </button>

        </div>

        <hr />

        {

          questions.length === 0 ?

          (

            <p>

              No questions available.

            </p>

          )

          :

          (

            questions.map((q,index)=>(

              <div

                key={q.id}

                style={{
                  border:"1px solid #ddd",
                  borderRadius:10,
                  padding:20,
                  marginBottom:25
                }}

              >

                <h3>

                  Question {index+1}

                </h3>

                <p>

                  {q.question}

                </p>

                <ul>

  {Array.isArray(q.options) ? (

    q.options.map((option, i) => (

      <li key={i}>
        {option}
      </li>

    ))

  ) : (

    <li>No options available.</li>

  )}

</ul>
                <div
                  style={{
                    marginTop:15,
                    padding:12,
                    background:"#ecfdf5",
                    borderRadius:8
                  }}
                >

                  <strong>

                    Correct Answer:

                  </strong>

                  {" "}

                  {q.correct_answer}

                </div>

              </div>

            ))

          )

        }

      </div>

    </div>

  );

}