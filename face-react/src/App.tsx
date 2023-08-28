import React from "react";
import LoginForm from "./components/LoginForm";
import WebCam from "./components/StudentWeb";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StudentWeb from "./components/StudentWeb";
import StudentExam from "./components/StudentExam";
import TeacherHome from "./components/TeacherHome";
import TeacherView from "./components/TeacherView";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={LoginForm} />
        <Route path="/student" Component={StudentWeb} />
        <Route path="/studentexam" Component={StudentExam} />
        <Route path="/teacher" Component={TeacherHome} />
        <Route path="/teacherview" Component={TeacherView} />
      </Routes>
    </Router>
  );
};

export default App;
