import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function AnalyticsOverview({ token }) {

    const [stats, setStats] = useState({

        totalAttempts: 0,
        averageScore: 0,
        passRate: 0,
        failRate: 0

    });

    useEffect(() => {

        if (token) {

            loadAnalytics();

        }

    }, [token]);

    const loadAnalytics = async () => {

        try {

            const data = await api(

                "/quizzes/analytics/overview",

                "GET",

                null,

                token

            );

            setStats(data);

        }

        catch (err) {

            console.error(err);

        }

    };

    const cardStyle = {

        flex: 1,
        background: "#ffffff",
        padding: 20,
        borderRadius: 10,
        border: "1px solid #ddd",
        textAlign: "center"

    };

    return (

        <div>

            <h2>

                Quiz Analytics

            </h2>

            <hr />

            <div

                style={{

                    display: "flex",
                    gap: 20,
                    flexWrap: "wrap"

                }}

            >

                <div style={cardStyle}>

                    <h3>

                        Total Attempts

                    </h3>

                    <h1>

                        {stats.totalAttempts}

                    </h1>

                </div>

                <div style={cardStyle}>

                    <h3>

                        Average Score

                    </h3>

                    <h1>

                        {stats.averageScore}%

                    </h1>

                </div>

                <div style={cardStyle}>

                    <h3>

                        Pass Rate

                    </h3>

                    <h1>

                        {stats.passRate}%

                    </h1>

                </div>

                <div style={cardStyle}>

                    <h3>

                        Fail Rate

                    </h3>

                    <h1>

                        {stats.failRate}%

                    </h1>

                </div>

            </div>

        </div>

    );

}