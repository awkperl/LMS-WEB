export default function TakeQuiz({

    quiz,
    goBack

}) {

    return (

        <div>

            <button

                onClick={goBack}

            >

                ← Back

            </button>

            <h1>

                {quiz.title}

            </h1>

            <p>

                Time Limit:

                {" "}

                {quiz.time_limit}

                {" "}

                minutes

            </p>

            <hr />

            <h2>

                Student Quiz Engine

            </h2>

            <p>

                This is where the timer, questions,
                navigation and answer saving will appear.

            </p>

        </div>

    );

}