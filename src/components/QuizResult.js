export default function QuizResult({

    result,

    quiz,

    onFinish

}) {

    const passed = result.percentage >= 50;

    return (

        <div
            style={{
                maxWidth:700,
                margin:"50px auto",
                background:"white",
                borderRadius:12,
                padding:40,
                boxShadow:"0 4px 12px rgba(0,0,0,.1)",
                textAlign:"center"
            }}
        >

            <h1>

                Quiz Completed

            </h1>

            <h2>

                {quiz.title}

            </h2>

            <hr/>

            <h3>

                Score

            </h3>

            <h1
                style={{
                    color:"#2563eb",
                    fontSize:60
                }}
            >

                {result.score}

                /

                {result.totalQuestions}

            </h1>

            <h2>

                {result.percentage}%

            </h2>

            <h2
                style={{
                    color: passed
                        ? "#16a34a"
                        : "#dc2626"
                }}
            >

                {

                    passed

                    ?

                    "PASS"

                    :

                    "FAIL"

                }

            </h2>

            <div
                style={{
                    marginTop:40
                }}
            >

                <button

                    onClick={onFinish}

                    style={{

                        padding:"14px 30px",

                        border:"none",

                        borderRadius:8,

                        background:"#2563eb",

                        color:"white",

                        cursor:"pointer"

                    }}

                >

                    Back To Course

                </button>

            </div>

        </div>

    );

}