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
import { users } from "./components/LoginForm";
import TeacherView from "./components/TeacherView";
import { User } from "./hooks/useUsers";
import { useDatabase } from "./hooks/useDatabase";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/student" element={<StudentWebcam />} />
        <Route path="/teacher" element={<TeacherHome />}>
          {users.map(
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
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
