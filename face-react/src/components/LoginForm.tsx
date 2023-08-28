import React, { useState } from "react";
import { User } from "../hooks/useUsers";
import { useNavigate } from "react-router-dom";

// interface Props {
//   students: Student[];
// }

// interface Props {
//   onLogin: (email: string, password: string) => void;
// }

const users: User[] = [
  { email: "marko@student.uts.edu.au", password: "password" },
  { email: "sydney@staff.uts.edu.au", password: "hello" },
  { email: "michael@student.uts.edu.au", password: "goodbye" },
];

const LoginForm = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (email: string, password: string) => {
    if (
      users.some(
        (user) =>
          user.email === email &&
          //   loggedIn === false &&
          user.password === password &&
          email.includes("@student.uts.edu.au")
      )
    ) {
      alert("Welcome Student");
      setLoggedIn(true);
      console.log(loggedIn);
      navigate("/student");
    } else if (
      users.some(
        (user) =>
          user.email === email &&
          user.password === password &&
          email.includes("@staff.uts.edu.au")
      )
    ) {
      alert("Welcome Staff Member");
      navigate("/teacher");
    } else {
      alert("Invalid username or password");
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form>
      <div>
        <label>
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <button onClick={() => handleLogin(email, password)} type="submit">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
