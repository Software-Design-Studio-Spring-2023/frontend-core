import React from "react";
import LoginForm from "./components/LoginForm";
import WebCam from "./components/StudentWeb";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StudentWeb from "./components/StudentWeb";
import StudentExam from "./components/StudentExam";
import TeacherHome from "./components/TeacherHome";
import TeacherView from "./components/TeacherView";
import StudentWebcam from "./components/StudentWebcam";
import PageNotFound from "./components/PageNotFound";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={LoginForm} />
        <Route path="/student" Component={StudentWebcam} />
        <Route path="/teacher" Component={TeacherHome} />
        <Route path="/teacherview" Component={TeacherView} />
        <Route path="/*" Component={PageNotFound} />
      </Routes>
    </Router>
  );
};

export default App;
