import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Analytics({ token }) {

  const [data, setData] = useState({
    courses: [],
    assignments: [],
    notifications: []
  });

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadAnalytics();

  }, []);

  const loadAnalytics = async () => {

    try {

      const result = await api(
        "/dashboard",
        "GET",
        null,
        token
      );

      console.log(result);

      setData(result);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return <h3>Loading analytics...</h3>;

  }

  return (

    <div>

      <h1>
        📊 Analytics
      </h1>

      <div
        style={{
          display:"grid",
          gridTemplateColumns:
          "repeat(auto-fit,minmax(250px,1fr))",
          gap:20,
          marginBottom:30
        }}
      >

        <Card
          title="Courses"
          value={data.courses.length}
          icon="📚"
        />

        <Card
          title="Assignments"
          value={data.assignments.length}
          icon="📝"
        />

        <Card
          title="Notifications"
          value={data.notifications.length}
          icon="🔔"
        />

      </div>

      <div
        style={{
          background:"white",
          padding:20,
          borderRadius:10
        }}
      >

        <h2>
          Upcoming Assignments
        </h2>

        {data.assignments.map(a=>(

          <div
            key={a.id}
            style={{
              borderBottom:
              "1px solid #eee",
              padding:10
            }}
          >

            <h4>
              {a.title}
            </h4>

            <p>
              Due:
              {" "}
              {
                a.due_date
                ?
                new Date(
                  a.due_date
                ).toLocaleString()
                :
                "No deadline"
              }
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}

function Card({
 title,
 value,
 icon
}){

 return(

   <div
     style={{
      background:"white",
      padding:20,
      borderRadius:10,
      textAlign:"center"
     }}
   >

     <h1>{icon}</h1>

     <h2>{value}</h2>

     <p>{title}</p>

   </div>

 );

}