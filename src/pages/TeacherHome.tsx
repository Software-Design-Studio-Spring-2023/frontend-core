//This is where the teachers will view an enlarged grid of all students

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
import LogOut from "../components/alerts/LogOut";
import StudentCard from "../components/StudentCard";
import StudentMiniCard from "../components/StudentMiniCard";
import useUsers from "../hooks/useUsers";
import { HiEye } from "react-icons/hi";
import LoginSuccess from "../components/alerts/LoginSuccess";
import CopyrightVersion from "../components/CopyrightVersion";
import preventLoad from "../hooks/preventLoad";
import preventAccess from "../hooks/preventAccess";
import setBorder from "../hooks/setBorder";

const TeacherHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [itemClicked, setItemClicked] = useState(false);
  const [userClicked, setUserClicked] = useState("");
  const { data, loading, error } = useUsers();
  preventLoad(true, true);
  preventAccess("student");

  useEffect(() => {
    if (location.pathname === "/teacher") {
      setItemClicked(false);
    }
  }, [location]);

  useEffect(() => {
    setItemClicked(false);
  }, []);

  //
  return (
    <>
      {/* Navbar */}
      <HStack w="100%" justifyContent="space-between" alignItems="center">
        <Box paddingLeft={"10px"}>
          <HiEye color={"#81E6D9"} size={"3em"} />
        </Box>
        <Heading padding={"10px"}>
          {itemClicked ? userClicked : "Participants"}
        </Heading>
        <Spacer />
        <Button
          marginRight={"10px"}
          hidden={itemClicked ? false : true}
          onClick={() => {
            setItemClicked(false);
            navigate("/teacher");
          }}
          bgColor="gray.600"
        >
          Go Back
        </Button>
        <Box marginRight={"30px"}>
          <LogOut handleLogout={() => navigate("/")} />
        </Box>
      </HStack>
      {/* Where Teacher view appears */}
      <Outlet />
      <Box padding={"10px"} paddingBottom={"0px"}>
        <hr hidden={itemClicked ? false : true} />
      </Box>
      <div hidden={itemClicked ? true : false}>
        <LoginSuccess />
      </div>
      {/* The grid */}
      <Grid
        padding={"10px"}
        paddingTop={itemClicked ? "10px" : "0px"}
        templateColumns={
          itemClicked
            ? //this is for the small grids
              {
                //this is responsive grid scaling for different sized devices
                lg: "repeat(10, 1fr)",
                md: "repeat(5, 1fr)",
                sm: "repeat(4, 1fr)",
              }
            : {
                //this is responsive grid scaling for different sized devices
                lg: "repeat(5, 1fr)",
                md: "repeat(3, 1fr)",
                sm: "repeat(2, 1fr)",
              }
        }
        gap={4}
        style={
          itemClicked ? { width: "calc(100% - 10px)", margin: "0 auto" } : {}
        }
      >
        {data.map(
          (user) =>
            user.userType === "student" &&
            user.terminated === false && (
              <GridItem
                _hover={{
                  transform: "scale(1.03)", // Increase the scale when hovered
                  transition: "transform 0.1s", // Smooth transition
                  boxShadow: ` 0 0 8px 1px ${setBorder(user.warnings)}`,
                }}
                borderRadius={"10px"}
                cursor={"pointer"}
                key={user.id}
                onClick={() => {
                  setItemClicked(true);
                  setUserClicked(user.name);
                  navigate(`/teacher/${user.id}`); //opens teacher view for student on click
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
      <Box paddingTop={"2%"}>
        <CopyrightVersion />
      </Box>
    </>
  );
};

export default TeacherHome;
