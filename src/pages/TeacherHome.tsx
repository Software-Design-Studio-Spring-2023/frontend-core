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
import CountDownApp from "../hooks/CountDownApp";
import { Room } from "livekit-client";

let room: Room | null = null;

const TeacherHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [itemClicked, setItemClicked] = useState(false);
  const [userClicked, setUserClicked] = useState("");
  const { data, loading, error } = useUsers();
  const [participants, setParticipants] = useState({});
  preventLoad(true, true);
  preventAccess("student");

  useEffect(() => {
    const initialiseLiveKitRoom = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/get_staff_token/${currentUser.id}`
        );
        const data = await response.json();

        room = new Room();
        await room.connect(
          "wss://eyedentify-90kai7lw.livekit.cloud",
          data.token
        );

        room.on("participantConnected", (participant) => {
          setParticipants((prevParticipants) => ({
            ...prevParticipants,
            [participant.identity]: participant,
          }));

          participant.on("trackPublished", (trackPublication) => {
            if (trackPublication.track) {
              setParticipants((prevParticipants) => {
                const updatedParticipants = { ...prevParticipants };
                updatedParticipants[participant.identity] = participant;
                return updatedParticipants;
              });
            }
          });
        });

        room.on("participantDisconnected", (participant) => {
          setParticipants((prevParticipants) => {
            const updatedParticipants = { ...prevParticipants };
            delete updatedParticipants[participant.identity];
            return updatedParticipants;
          });
        });

        // ... (Handle other room events)
      } catch (error) {
        console.error("Error initializing LiveKit room:", error);
      }
    };

    initialiseLiveKitRoom();
  }, []);

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
        <CountDownApp></CountDownApp>

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
                  <StudentMiniCard
                    name={user.name}
                    warnings={user.warnings}
                    stream={
                      participants[user.id]?.videoTracks.values().next().value
                        ?.track?.mediaStreamTrack
                    }
                  />
                ) : (
                  <StudentCard
                    name={user.name}
                    warnings={user.warnings}
                    stream={
                      participants[user.id]?.videoTracks.values().next().value
                        ?.track?.mediaStreamTrack
                    }
                  />
                )}
              </GridItem>
            )
        )}
      </Grid>
      <CopyrightVersion bottomVal={-8} />
    </>
  );
};

export default TeacherHome;
