//This is the main login page

import { useEffect, useState } from "react";
import useUsers, { User } from "../hooks/useUsers";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  InputGroup,
  HStack,
  InputRightElement,
  Heading,
  Box,
  Text,
} from "@chakra-ui/react";
import { HiEye, HiOutlineEye } from "react-icons/hi";
import LoginFailed from "../components/alerts/LoginFailed";
import Terminated from "../components/alerts/Terminated";
import AlreadyLoggedIn from "../components/alerts/AlreadyLoggedIn";
import ExamStartedError from "../components/alerts/ExamStartedError";
import patchData from "../hooks/patchData";
import CopyrightVersion from "../components/CopyrightVersion";
import preventLoad from "../hooks/preventLoad";

export var currentUser: User | undefined = {
  id: 0,
  name: "",
  loggedIn: false,
  userType: "",
  email: "",
  password: "",
  warnings: 0,
  imageURL: "",
  encodeIP: 0,
  terminated: false,
  ready: false,
  warningOne: "",
  warningTwo: "",
  isSuspicious: false,
}; //this is the logged in current user exported for the current sessiion, app-wide

const LoginForm = () => {
  preventLoad(false, true);
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);
  const { data, loading, error } = useUsers();
  const [email, setEmail] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [examTerminated, setExamTerminated] = useState(false);
  const [alreadyLogged, setAlreadyLogged] = useState(false);
  const [examStarted, setexamStarted] = useState(false);

  //disabled login button if no data
  useEffect(() => {
    if (email.trim() !== "" && password.trim() !== "") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [email, password]);

  //handler for all possible login conditions and events
  const handleLogin = (event: any, email: string, password: string) => {
    event.preventDefault();
    if (
      data.some(
        (user) =>
          user.email === email &&
          user.password === password &&
          email.includes("@student.uts.edu.au") &&
          user.loggedIn === false &&
          user.terminated === false
      )
    ) {
      currentUser = data.find(
        (user) => user.email === email && user.password === password
      );
      if (currentUser !== undefined) {
        currentUser.loggedIn = true;
      }
      navigate("/privacy");
    } else if (
      data.some(
        (user) =>
          user.email === email &&
          user.password === password &&
          email.includes("@staff.uts.edu.au")
      )
    ) {
      currentUser = data.find(
        (user) => user.email === email && user.password === password
      );
      if (currentUser !== undefined) {
        patchData({ loggedIn: true }, "update_login", currentUser.id);
        currentUser.loggedIn = true;
      }
      navigate("/teacher");
    } else if (
      data.some(
        (user) =>
          user.email === email &&
          user.password === password &&
          email.includes("@student.uts.edu.au") &&
          user.loggedIn === true &&
          user.terminated === false
      )
    ) {
      setFailed(false);
      setAlreadyLogged(false);
      setExamTerminated(false);
      setTimeout(() => {
        setAlreadyLogged(true);
      }, 0);
    } else if (
      data.some(
        (user) =>
          user.email === email &&
          user.password === password &&
          email.includes("@student.uts.edu.au") &&
          user.terminated === true
      )
    ) {
      setFailed(false);
      setExamTerminated(false);
      setAlreadyLogged(false);
      setTimeout(() => {
        setExamTerminated(true);
      }, 0);
    } else if (email.trim() === "" || password.trim() === "") {
      return;
    } else {
      setFailed(false);
      setExamTerminated(false);
      setAlreadyLogged(false);
      setTimeout(() => {
        setFailed(true);
      }, 0);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Login errors */}
      <Box position="absolute" top="10" width="100%" zIndex="1000">
        {failed && <LoginFailed />}
      </Box>
      <Box position="absolute" top="10" width="100%" zIndex="1000">
        {examTerminated && <Terminated />}
      </Box>
      <Box position="absolute" top="10" width="100%" zIndex="1000">
        {alreadyLogged && <AlreadyLoggedIn />}
      </Box>
      <VStack
        justifyContent="center"
        alignItems="center"
        spacing={5}
        marginBottom={16}
      >
        {/* Logo */}
        <HStack paddingTop={10}>
          <HiEye
            color={"#81E6D9"}
            size={/Android|iPhone/i.test(navigator.userAgent) ? "4em" : "6em"}
          />
          <Heading
            marginTop={/Android|iPhone/i.test(navigator.userAgent) ? 2 : ""}
            fontSize={
              /Android|iPhone/i.test(navigator.userAgent) ? "4xl" : "7xl"
            }
            fontStyle={"italic"}
            paddingBottom={4}
          >
            eyedentify
          </Heading>
        </HStack>
        {/* Login form */}
        <form>
          <FormControl isRequired>
            <FormLabel
              fontSize={"xl"}
              marginLeft={
                /Android|iPhone/i.test(navigator.userAgent) ? "" : "-15%"
              }
            >
              Enter your UTS Email Address
            </FormLabel>
            <Input
              width={
                /Android|iPhone/i.test(navigator.userAgent) ? "100%" : "130%"
              }
              marginLeft={
                /Android|iPhone/i.test(navigator.userAgent) ? "" : "-15%"
              }
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired paddingTop={5} paddingBottom={5}>
            <FormLabel
              fontSize={"xl"}
              marginLeft={
                /Android|iPhone/i.test(navigator.userAgent) ? "" : "-15%"
              }
            >
              Password
            </FormLabel>
            <InputGroup
              width={
                /Android|iPhone/i.test(navigator.userAgent) ? "100%" : "130%"
              }
              marginLeft={
                /Android|iPhone/i.test(navigator.userAgent) ? "" : "-15%"
              }
            >
              <Input
                pr="4.5rem"
                onChange={(e) => setPassword(e.target.value)}
                type={show ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
              />
              <InputRightElement cursor={"pointer"} marginRight={2}>
                <HiOutlineEye
                  size="1.5em"
                  color={show ? "gray" : "white"}
                  onMouseDown={() => setShow(true)}
                  onMouseUp={() => setShow(false)}
                  onMouseLeave={() => setShow(false)}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <HStack
            paddingTop={"8px"}
            justifyContent="center"
            alignItems="center"
            spacing={5}
          >
            <Button
              onClick={(e) => handleLogin(e, email, password)}
              type="submit"
              fontSize={"lg"}
              width={"50%"}
              colorScheme={disabled ? "gray" : "teal"}
              variant="solid"
              disabled={disabled}
            >
              Login
            </Button>
          </HStack>
        </form>
      </VStack>
      <CopyrightVersion bottomVal={2} />
    </div>
  );
};

export default LoginForm;
