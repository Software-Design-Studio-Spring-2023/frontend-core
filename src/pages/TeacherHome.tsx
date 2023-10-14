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
import {
  DefaultReconnectPolicy,
  Participant,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
  Track,
  VideoPresets,
} from "livekit-client";
import { LiveKitRoom } from "@livekit/components-react";
import { StreamsContext } from "../contexts/StreamContext";
import patchData from "../hooks/patchData";
import CheatDetectionAlert from "../components/alerts/CheatDetectionAlert";

const TeacherHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [itemClicked, setItemClicked] = useState(false);
  const [userClicked, setUserClicked] = useState("");
  const { data, loading, error } = useUsers();
  const [participants, setParticipants] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [streams, setStreams] = useState({});

  preventLoad(true, true);
  preventAccess("student");

  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(
          `https://eyedentify-69d961d5a478.herokuapp.com/api/get_staff_token/${currentUser.id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        const tokenData = await response.json(); // assuming the response is in JSON format
        setToken(tokenData.token); // update the state with the fetched token
        // console.log(token);
      } catch (error) {
        console.error("Error fetching the token:", error);
      }
    };
    fetchToken();
  }, [currentUser.id]);

  useEffect(() => {
    const connectToRoom = async () => {
      try {
        const room = new Room({
          // automatically manage subscribed video quality
          adaptiveStream: true,

          // optimize publishing bandwidth and CPU for published tracks
          dynacast: true,

          disconnectOnPageLeave: false,

          // default capture settings
          videoCaptureDefaults: {
            facingMode: "user",
          },
        });
        setRoom(room);
        room.prepareConnection(
          "wss://eyedentify-90kai7lw.livekit.cloud",
          token
        );

        await room.connect("wss://eyedentify-90kai7lw.livekit.cloud", token);
        console.log("connected to room", room.name);

        room
          .on(RoomEvent.Disconnected, handleDisconnect)
          .on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
          .on(RoomEvent.TrackUnpublished, handleTrackUnpublished);

        room.participants.forEach(handleExistingParticipant);

        function handleExistingParticipant(participant: RemoteParticipant) {
          participant.tracks.forEach((publication) => {
            if (publication.track) {
              handleTrackSubscribed(
                publication.track,
                publication,
                participant
              );
            }
          });
        }

        function handleTrackUnpublished(
          publication: RemoteTrackPublication,
          participant: RemoteParticipant
        ) {
          console.log(
            `${participant.identity} has stopped publishing track: ${publication.trackSid}`
          );
          const userId = parseInt(participant.identity); // Assuming the user ID is stored as the identity.
          patchData({ terminated: true }, "update_terminate", userId);
        }

        function handleTrackSubscribed(
          track: RemoteTrack,
          publication: RemoteTrackPublication,
          participant: RemoteParticipant
        ) {
          if (track.kind === Track.Kind.Video) {
            // Get the user ID from the participant identity (assuming it's stored there)
            const userId = parseInt(participant.identity);

            // Create the video or audio element
            const element = track.attach();
            console.log(
              "Element Type:",
              typeof element,
              element instanceof MediaStream
            );
            // Update the streams state variable with the new element
            setStreams((prevStreams) => ({
              ...prevStreams,
              [userId]: element,
            }));
          }
        }
      } catch (error) {
        console.error("Error connecting to room:", room);
      }
    };
    connectToRoom();
  }, [token !== null]);

  // Cleanup event listeners on component unmount
  // return () => {
  //   if (room) {
  //     room.off('participantConnected', handleParticipantConnected);
  //     room.off('participantDisconnected', handleParticipantDisconnected);
  //   }
  // };

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
    <StreamsContext.Provider value={streams}>
      <>
        {/* Navbar */}
        <HStack w="100%" justifyContent="space-between" alignItems="center">
          <Box paddingLeft={"20px"}>
            <HiEye
              color={"#81E6D9"}
              size={
                /Android|iPhone/i.test(navigator.userAgent) ? "2.5em" : "3em"
              }
            />
          </Box>
          <Heading
            padding={"10px"}
            marginLeft={
              /Android|iPhone/i.test(navigator.userAgent) ? "-6px" : ""
            }
            marginBottom={/Android|iPhone/i.test(navigator.userAgent) ? "" : 1}
            overflow={"hidden"}
            size={/Android|iPhone/i.test(navigator.userAgent) ? "lg" : "xl"}
          >
            {itemClicked ? userClicked : "Participants"}
          </Heading>
          <Spacer />
          {/* <CountDownApp></CountDownApp> */}

          <Button
            marginRight={"10px"}
            hidden={itemClicked ? false : true}
            fontSize={/Android|iPhone/i.test(navigator.userAgent) ? "xs" : ""}
            onClick={() => {
              setItemClicked(false);
              navigate("/teacher");
            }}
            bgColor="gray.600"
            size={/Android|iPhone/i.test(navigator.userAgent) ? "sm" : "md"}
          >
            {/Android|iPhone/i.test(navigator.userAgent) ? "Back " : "Go Back"}
          </Button>
          <Box
            marginRight={
              /Android|iPhone/i.test(navigator.userAgent) ? "14px" : "30px"
            }
          >zv
            <LogOut handleLogout={() => navigate("/")} />
          </Box>
        </HStack>
        {/* Where Teacher view appears */}
        <Outlet />
        <Box padding={"10px"} paddingBottom={"0px"}>
          <hr hidden={itemClicked ? false : true} />
        </Box>
        {/Android|iPhone/i.test(navigator.userAgent) ? <></> : <LoginSuccess />}
        {/* The grid */}
        <Grid
          paddingTop={itemClicked ? "10px" : "0px"}
          paddingLeft={"10px"}
          paddingRight={"10px"}
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
          {data
            .sort((a, b) => (streams[b.id] ? 1 : streams[a.id] ? -1 : 0))
            .map((user) => {
              if (user.userType !== "student" || user.terminated === true) {
                return null;
              }

              if (itemClicked && userClicked === user.name) {
                return null; // This will not render the GridItem at all for the clicked user
              }
              return (
                <GridItem
                  _hover={
                    streams[user.id]
                      ? {
                          transform: "scale(1.03)", // Increase the scale when hovered
                          transition: "transform 0.1s", // Smooth transition
                        }
                      : {}
                  }
                  borderRadius={"10px"}
                  cursor={streams[user.id] ? "pointer" : "auto"}
                  key={user.id}
                  onClick={
                    streams[user.id]
                      ? () => {
                          setItemClicked(true);
                          setUserClicked(user.name);
                          navigate(`/teacher/${user.id}`); //opens teacher view for student on click
                        }
                      : null
                  }
                >
                  {itemClicked ? (
                    userClicked === user.name ? (
                      <></>
                    ) : (
                      <StudentMiniCard
                        name={user.name}
                        warnings={user.warnings}
                        id={user.id}
                        loading={streams[user.id] ? false : true}
                      />
                    )
                  ) : (
                    <StudentCard
                      name={user.name}
                      warnings={user.warnings}
                      id={user.id}
                      loading={streams[user.id] ? false : true}
                    />
                  )}
                </GridItem>
              );
            })}
        </Grid>
        <CopyrightVersion bottomVal={-8} />
      </>
    </StreamsContext.Provider>
  );
};

export default TeacherHome;

function handleDisconnect() {
  console.log("disconnected from room");
}
