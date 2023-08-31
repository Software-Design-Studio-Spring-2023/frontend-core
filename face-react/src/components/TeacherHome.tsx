import { Grid, GridItem } from "@chakra-ui/react";
import Webcam from "react-webcam";

import { currentUser, users } from "./LoginForm";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LogOut from "./alerts/LogOut";

// import TeacherView from "./TeacherView";

// interface Props {
//   user:User
// }

const TeacherHome = () => {
  const navigate = useNavigate();
  const [itemClicked, setItemClicked] = useState(false);

  // setItemClicked(false);

  if (currentUser?.loggedIn === false) {
    useEffect(() => {
      navigate("/");
    }, []);
  } else if (currentUser?.userType === "student") {
    useEffect(() => {
      navigate("/*");
    }, []);
  }

  useEffect(() => {
    setItemClicked(false);
  }, []);

  // const navigateHelper = () => {};

  // let user:User

  // const subNavigate = (user:User) => {
  //   navigate(`/teacher/${user.id}`);
  // }

  return (
    <>
      <LogOut handleLogout={() => navigate("/")} />
      <Grid
        templateColumns={
          itemClicked
            ? //this is for the small grids
              "repeat(10, 1fr)"
            : {
                //this is responsive grid scaling for different sized devices
                lg: "repeat(5, 1fr)",
                md: "repeat(3, 1fr)",
                sm: "repeat(2, 1fr)",
              }
        }
      >
        {users.map(
          (user) =>
            user.userType === "student" && (
              <GridItem
                cursor={"pointer"}
                // w={itemClicked ? "100%" : "100%"}
                // h={itemClicked ? "100%" : "100%"}
                key={user.id}
                onClick={() => {
                  setItemClicked(true);
                  navigate(`/teacher/${user.id}`);
                }}
              >
                <Webcam />
                {user.firstName}
              </GridItem>
            )
        )}
      </Grid>
      <hr hidden={itemClicked ? false : true} />
      <button
        hidden={itemClicked ? false : true}
        onClick={() => {
          setItemClicked(false);
          navigate("/teacher");
        }}
      >
        Go Back
      </button>
      <Outlet />
    </>
  );
};

export default TeacherHome;
