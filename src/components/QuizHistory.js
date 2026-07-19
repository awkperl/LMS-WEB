import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function QuizHistory({ token }) {

    const [history, setHistory] = useState([]);

    useEffect(() => {

        loadHistory();

    }, []);

    const loadHistory = async () => {

        try {

            const data = await api(

                "/quizzes/history",

                "GET",

                null,

                token

            );

            setHistory(data);

        }

        catch(err){

            console.error(err);

        }

    };

    return (

        <div>

            <h2>

                Quiz History

            </h2>

            <hr />

            {

                history.length===0 ?

                (

                    <p>

                        No quiz attempts yet.

                    </p>

                )

                :

                history.map(item=>(

                    <div

                        key={item.id}

                        style={{

                            background:"white",

                            borderRadius:10,

                            padding:20,

                            marginBottom:20,

                            border:"1px solid #ddd"

                        }}

                    >

                        <h3>

                            {item.title}

                        </h3>

                        <p>

                            Score:

                            {" "}

                            {item.score}

                            /

                            {item.total_questions}

                        </p>

                        <p>

                            Percentage:

                            {" "}

                            {item.percentage}%

                        </p>

                        <p>

                            Status:

                            {" "}

                            <strong

                                style={{

                                    color:

                                        item.passed

                                        ? "green"

                                        : "red"

                                }}

                            >

                                {

                                    item.passed

                                    ? "PASS"

                                    : "FAIL"

                                }

                            </strong>

                        </p>

                    </div>

                ))

            }

        </div>

    );

}