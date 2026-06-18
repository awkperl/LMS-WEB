/**import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [token, setToken] = useState(null);

  return (
    <div>
      {!token
        ? <Login setToken={setToken} />
        : <Dashboard token={token} />}
    </div>
  );
}

export default App;**/
import { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {

  //const [token, setToken] = useState(null);
const storedToken =
  localStorage.getItem("token");

const [token, setToken] = useState(
  storedToken || null
);

  const [page, setPage] = useState("login");

  // LOGIN SUCCESS
  if (token) {
    return <Dashboard token={token} />;
  }

  // REGISTER PAGE
  if (page === "register") {
    return (
      <Register
        goToLogin={() => setPage("login")}
      />
    );
  }

  // LOGIN PAGE
  return (
    <Login
      setToken={setToken}
      goToRegister={() =>
        setPage("register")
      }
    />
  );
}

export default App;