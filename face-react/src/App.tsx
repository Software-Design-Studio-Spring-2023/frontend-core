import React from "react";
import LoginForm from "./components/LoginForm";
import WebCam from "./components/StudentWeb";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StudentWeb from "./components/StudentWeb";
import StudentExam from "./components/StudentExam";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={LoginForm} />
        <Route path="/student" Component={StudentWeb} />
        <Route path="/studentexam" Component={StudentExam} />
        <Route path="/teacher" Component={LoginForm} />
      </Routes>
    </Router>
  );
};

export default App;
