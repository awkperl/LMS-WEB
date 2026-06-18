/**export default function AssignmentStatusBadge({
  assignment,
  submissions,
  userId
}) {

  const userSubmissions = submissions.filter(
    s => s.user_id === userId
  );

  const attemptsUsed = userSubmissions.length;
  const attemptsLeft =
    assignment.attempt_limit - attemptsUsed;

  const isLocked =
    attemptsLeft <= 0;

  const now = new Date();
  const due = assignment.due_date
    ? new Date(assignment.due_date)
    : null;

  const isExpired =
    due ? now > due : false;

  let status = "ACTIVE";
  let color = "green";

  if (isLocked) {
    status = "LOCKED (Attempts used)";
    color = "red";
  } else if (isExpired) {
    status = "EXPIRED";
    color = "orange";
  }

  return (
    <div
      style={{
        padding: 10,
        borderRadius: 8,
        background: "#f9fafb",
        marginBottom: 10
      }}
    >

      <p style={{ color }}>
        Status: {status}
      </p>

      <p>
        Attempts used: {attemptsUsed}
      </p>

      <p>
        Attempts left: {attemptsLeft}
      </p>

    </div>
  );
}**/
export default function AssignmentStatusBadge({
  assignment,
  submissions,
  userId
}) {

  // ONLY THIS ASSIGNMENT
  const assignmentSubmissions =
    submissions.filter(
      s =>
        s.assignment_id === assignment.id &&
        s.student_id === userId
    );

  const attemptsUsed =
    assignmentSubmissions.length;

  const attemptsLeft =
    assignment.attempt_limit -
    attemptsUsed;

  const isLocked =
    attemptsLeft <= 0;

  const now = new Date();

  const due = assignment.due_date
    ? new Date(assignment.due_date)
    : null;

  const isExpired =
    due ? now > due : false;

  let status = "ACTIVE";
  let color = "green";

  if (isLocked) {

    status =
      "LOCKED (Attempts used)";
    color = "red";

  } else if (isExpired) {

    status = "EXPIRED";
    color = "orange";

  }

  return (

    <div
      style={{
        padding: 10,
        borderRadius: 8,
        background: "#f9fafb",
        marginBottom: 10,
        border: "1px solid #e5e7eb"
      }}
    >

      <p
        style={{
          color,
          fontWeight: "600",
          margin: 0,
          marginBottom: 6
        }}
      >
        Status: {status}
      </p>

      <p style={{ margin: 0 }}>
        Attempts used:
        {" "}
        {attemptsUsed}
      </p>

      <p
        style={{
          margin: 0,
          marginTop: 4
        }}
      >
        Attempts left:
        {" "}
        {attemptsLeft}
      </p>

    </div>

  );
}