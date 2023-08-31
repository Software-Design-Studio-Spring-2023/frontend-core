import { Grid, GridItem } from "@chakra-ui/react";
import Webcam from "react-webcam";

import { currentUser, users } from "./LoginForm";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LogOut from "./alerts/LogOut";

// import TeacherView from "./TeacherView";

// interface Props {
//   user:User
// }

const TeacherHome = () => {
  const navigate = useNavigate();
  if (currentUser?.loggedIn === false) {
    useEffect(() => {
      navigate("/");
    }, []);
  } else if (currentUser?.userType === "student") {
    useEffect(() => {
      navigate("/*");
    }, []);
  }

  // let user:User

  // const subNavigate = (user:User) => {
  //   navigate(`/teacher/${user.id}`);
  // }

  return (
    <>
      <LogOut handleLogout={() => navigate("/")} />
      <Grid
        templateColumns={{
          //this is responsive grid scaling for different sized devices
          lg: "repeat(5, 1fr)",
          md: "repeat(3, 1fr)",
          sm: "repeat(2, 1fr)",
        }}
      >
        {users.map(
          (user) =>
            user.userType === "student" && (
              <GridItem
                cursor={"pointer"}
                key={user.id}
                onClick={() => navigate(`/teacher/${user.id}`)}
              >
                <Webcam />
                {user.firstName}
              </GridItem>
            )
        )}
      </Grid>
      <Outlet />
    </>
  );
};

export default TeacherHome;
