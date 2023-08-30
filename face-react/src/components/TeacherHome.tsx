import { Grid, GridItem } from "@chakra-ui/react";
import Webcam from "react-webcam";

import { currentUser, users } from "./LoginForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LogOut from "./alerts/LogOut";

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
  return (
    <>
      <LogOut handleLogout={() => navigate("/")} />
      <Grid templateColumns="repeat(5, 1fr)">
        {users.map(
          (user) =>
            user.userType === "student" && (
              <GridItem
                cursor={"pointer"}
                key={user.id}
                onClick={() => navigate("/teacherview")}
              >
                <Webcam />
                {user.firstName}
              </GridItem>
            )
        )}
      </Grid>
    </>
  );
};

export default TeacherHome;
