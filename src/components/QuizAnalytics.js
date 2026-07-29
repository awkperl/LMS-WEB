import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function QuizAnalytics({

    quizId,
    token

}) {

    const [stats, setStats] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadAnalytics();

    }, [quizId]);

    const loadAnalytics = async () => {

        try {

            const data = await api(

                `/quizzes/${quizId}/analytics`,

                "GET",

                null,

                token

            );

            setStats(data);

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <h3>Loading analytics...</h3>;

    }

    if (!stats) {

        return <h3>No analytics available.</h3>;

    }

    const cardStyle = {

        background: "#fff",

        border: "1px solid #ddd",

        borderRadius: 10,

        padding: 20,

        textAlign: "center",

        boxShadow: "0 2px 5px rgba(0,0,0,.08)"

    };

    return (

        <div style={{ marginTop: 30 }}>

            <h2>Quiz Analytics</h2>

            <div
                style={{

                    display: "grid",

                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(220px,1fr))",

                    gap: 20

                }}
            >

                <div style={cardStyle}>
                    <h4>Total Attempts</h4>
                    <h1>{stats.totalAttempts}</h1>
                </div>

                <div style={cardStyle}>
                    <h4>Average Score</h4>
                    <h1>{stats.averageScore}%</h1>
                </div>

                <div style={cardStyle}>
                    <h4>Pass Rate</h4>
                    <h1>{stats.passRate}%</h1>
                </div>

                <div style={cardStyle}>
                    <h4>Highest Score</h4>
                    <h1>
                        {stats.highestScore}/{stats.totalPoints}
                    </h1>
                </div>

                <div style={cardStyle}>
                    <h4>Lowest Score</h4>
                    <h1>
                        {stats.lowestScore}/{stats.totalPoints}
                    </h1>
                </div>

                <div style={cardStyle}>
                    <h4>Total Points</h4>
                    <h1>{stats.totalPoints}</h1>
                </div>

            </div>

        </div>

    );

}