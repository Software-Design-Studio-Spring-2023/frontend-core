import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Heading,
  Spacer,
} from "@chakra-ui/react";
import Webcam from "react-webcam";

import { currentUser } from "./LoginForm";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import LogOut from "./alerts/LogOut";
import StudentCard from "./StudentCard";
import StudentMiniCard from "./StudentMiniCard";
import useUsers from "../hooks/useUsers";
import { HiEye } from "react-icons/hi";

//

const TeacherHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [itemClicked, setItemClicked] = useState(false);
  const { data, loading, error } = useUsers();

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
      <HStack>
        <Box paddingLeft={"10px"}>
          <HiEye color={"#81E6D9"} size={"3em"} />
        </Box>
        <Heading padding={"10px"}>Participants</Heading>
        <Spacer />
        <Box paddingRight={"30px"}>
          <LogOut handleLogout={() => navigate("/")} />
        </Box>
      </HStack>

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
      <HStack padding={"10px"}>
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
      </HStack>
      <Outlet />
    </>
  );
};

export default TeacherHome;
