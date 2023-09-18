import { Button, Grid, GridItem, Heading } from "@chakra-ui/react";
import Webcam from "react-webcam";

import { currentUser } from "./LoginForm";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import LogOut from "./alerts/LogOut";
import StudentCard from "./StudentCard";
import StudentMiniCard from "./StudentMiniCard";
import useUsers from "../hooks/useUsers";

import style from "style.css";

import { useCountdown } from "./useCountdown";
import CountDownApp from "./CountDownApp";
//

const TeacherHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [itemClicked, setItemClicked] = useState(false);
  const { data, loading, error } = useUsers();

  const initialTotalTimeMS = 9000 * 1000;
  const timeMS = useCountdown(initialTotalTimeMS, () =>
    console.log("Times up!!")
  );

  let timeTotalSeconds = timeMS / 1000;
  let timeTotalMinutes = Math.floor(timeTotalSeconds / 60);
  let timeTotalHours = Math.floor(timeTotalMinutes / 60);

  let displayMinutes = timeTotalMinutes % 60;
  let displaySeconds = timeTotalSeconds % 60;

  console.log("Seconds: ", timeMS / 1000);

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
    if (location.pathname === "/teacher") {
      setItemClicked(false);
    }
  }, [location]);

  useEffect(() => {
    setItemClicked(false);
  }, []);

  return (
    <>
      <LogOut handleLogout={() => navigate("/")} />

      <Heading padding={"10px"}>Participants</Heading>
      <Grid
        padding={"10px"}
        templateColumns={
          itemClicked
            ? //this is for the small grids
              {
                //this is responsive grid scaling for different sized devices
                lg: "repeat(10, 1fr)",
                md: "repeat(8, 1fr)",
                sm: "repeat(7, 1fr)",
              }
            : {
                //this is responsive grid scaling for different sized devices
                lg: "repeat(5, 1fr)",
                md: "repeat(3, 1fr)",
                sm: "repeat(2, 1fr)",
              }
        }
        gap={4} // Add some gap between GridItems
      >
        {data.map(
          (user) =>
            user.userType === "student" && (
              <GridItem
                // overflow={"hidden"}
                // borderRadius={"4px"}
                cursor={"pointer"}
                //manually set the width and height of the camera boxes in the display
                // w={itemClicked ? "100%" : "100%"}
                // h={itemClicked ? "100%" : "100%"}
                key={user.id}
                onClick={() => {
                  setItemClicked(true);
                  navigate(`/teacher/${user.id}`);
                }}
              >
                {itemClicked ? (
                  <StudentMiniCard name={user.name} warnings={user.warnings} />
                ) : (
                  <StudentCard name={user.name} warnings={user.warnings} />
                )}
              </GridItem>
            )
        )}
      </Grid>
      <hr hidden={itemClicked ? false : true} />
      <Button
        hidden={itemClicked ? false : true}
        onClick={() => {
          setItemClicked(false);
          navigate("/teacher");
        }}
        bgColor="gray.600"
      >
        Go Back
      </Button>
      <Outlet />
    </>
  );
};

export default TeacherHome;
