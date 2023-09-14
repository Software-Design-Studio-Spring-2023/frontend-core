import LoginForm from "./components/LoginForm";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import TeacherHome from "./components/TeacherHome";
import StudentWebcam from "./components/StudentWebcam";
import PageNotFound from "./components/PageNotFound";
import TeacherView from "./components/TeacherView";
import TermsAndConditions from "./components/TermsAndConditions";
import useUsers, { User } from "./hooks/useUsers";

const App = () => {
  const { data, loading, error } = useUsers();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/student" element={<StudentWebcam />} />
        <Route path="/teacher" element={<TeacherHome />}>
          {data?.map(
            (user: User) =>
            user.userType === "student" && (
              <Route
              path={user.id.toString()}
              key={user.id}
              element={<TeacherView user={user} />}
              />
            )
          )}
        </Route>
        <Route path="/privacy" element={<TermsAndConditions />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
