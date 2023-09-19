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
import { Participant, Room } from "livekit-client";
import { LiveKitRoom } from "@livekit/components-react";

let room: Room;

const TeacherHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [itemClicked, setItemClicked] = useState(false);
  const [userClicked, setUserClicked] = useState("");
  const { data, loading, error } = useUsers();
  const [participants, setParticipants] = useState({});
  const [isConnected, setIsConnected] = useState(false);

  preventLoad(true, true);
  preventAccess("student");

  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/get_staff_token/${currentUser.id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        const tokenData = await response.json(); // assuming the response is in JSON format
        setToken(tokenData.token); // update the state with the fetched token

        room = new Room();
        await room.connect(
          "wss://eyedentify-90kai7lw.livekit.cloud",
          tokenData.token
        );

        console.log("Room instance:", room);
      } catch (error) {
        console.error("Error fetching the token:", error);
      }
    };

    fetchToken();
  }, [currentUser.id]);

  useEffect(() => {
    if (room) {
      const handleParticipantConnected = (participant: Participant) => {
        setParticipants((prevParticipants) => ({
          ...prevParticipants,
          [participant.identity]: participant,
        }));
      };

      const handleParticipantDisconnected = (participant: Participant) => {
        setParticipants((prevParticipants) => {
          const updatedParticipants = { ...prevParticipants };
          delete updatedParticipants[participant.identity];
          return updatedParticipants;
        });
      };

      room.on("participantConnected", handleParticipantConnected);
      room.on("participantDisconnected", handleParticipantDisconnected);
    }

    // Cleanup event listeners on component unmount
    // return () => {
    //   if (room) {
    //     room.off('participantConnected', handleParticipantConnected);
    //     room.off('participantDisconnected', handleParticipantDisconnected);
    //   }
    // };
  }, []);

  const fetchStreams = (identity) => {
    const participant = participants[identity];
    return (
      participant?.videoTracks.values().next().value?.track?.mediaStreamTrack ||
      null
    );
  };

  useEffect(() => {
    if (isConnected) {
      // Now, attempt to retrieve the room instance
      // since 'room' is a state variable, it should hold the latest room instance here
      console.log("Current room instance:", room);
    }
  }, [isConnected]);

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
      <LiveKitRoom
        video={false}
        audio={false}
        token={token}
        connectOptions={{ autoSubscribe: false }}
        connect={true}
        serverUrl={"wss://eyedentify-90kai7lw.livekit.cloud"}
        options={{ disconnectOnPageLeave: false }}
        room={room}
        onConnected={() => {
          // setRoom(room);
          console.log("Connected to the room");
          console.log("Current room instance:", room);
          setIsConnected(true);
        }}
      />
      {/* Navbar */}
      <HStack w="100%" justifyContent="space-between" alignItems="center">
        <Box paddingLeft={"10px"}>
          <HiEye color={"#81E6D9"} size={"3em"} />
        </Box>
        <Heading padding={"10px"}>
          {itemClicked ? userClicked : "Participants"}
        </Heading>
        <Spacer />
        {/* <CountDownApp></CountDownApp> */}

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
                    stream={fetchStreams(user.id)}
                  />
                ) : (
                  <StudentCard
                    name={user.name}
                    warnings={user.warnings}
                    stream={fetchStreams(user.id)}
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
