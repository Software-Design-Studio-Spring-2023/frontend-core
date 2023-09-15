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
} from "@chakra-ui/react";
import { HiEye, HiOutlineEye } from "react-icons/hi";
import { update_loggedin } from "../services/user-utils";
import LoginFailed from "./alerts/LoginFailed";
import Terminated from "./alerts/Terminated";
import AlreadyLoggedIn from "./alerts/AlreadyLoggedIn";

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
};
// localhost:8080/api/all_users

const LoginForm = () => {
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);
  const { data, loading, error } = useUsers();
  const [email, setEmail] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [examTerminated, setExamTerminated] = useState(false);
  const [alreadyLogged, setAlreadyLogged] = useState(false);

  useEffect(() => {
    if (email.trim() !== "" && password.trim() !== "") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [email, password]);

  const handleLogin = (event, email: string, password: string) => {
    event.preventDefault();
    if (
      data.some(
        (user) =>
          user.email === email &&
          user.password === password &&
          // user.userType === "student"
          email.includes("@student.uts.edu.au") &&
          user.loggedIn === false &&
          user.terminated === false
      )
    ) {
      currentUser = data.find(
        (user) => user.email === email && user.password === password
      );
      if (currentUser !== undefined) {
        update_loggedin(currentUser.id, true);
        currentUser.loggedIn = true; //gotta send this to the database, students can't login again until after exam is done
      }
      navigate("/privacy");
    } else if (
      data.some(
        (user) =>
          user.email === email &&
          user.password === password &&
          // user.userType === "teacher"
          email.includes("@staff.uts.edu.au")
      )
    ) {
      currentUser = data.find(
        (user) => user.email === email && user.password === password
      );
      if (currentUser !== undefined) {
        update_loggedin(currentUser.id, true);
        currentUser.loggedIn = true;
      }
      navigate("/teacher");
    } else if (
      data.some(
        (user) =>
          user.email === email &&
          user.password === password &&
          // user.userType === "student"
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
          // user.userType === "student"
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
      }}
    >
      <Box position="absolute" top="10" width="100%" zIndex="1000">
        {failed && <LoginFailed />}
      </Box>
      <Box position="absolute" top="10" width="100%" zIndex="1000">
        {examTerminated && <Terminated />}
      </Box>
      <Box position="absolute" top="10" width="100%" zIndex="1000">
        {alreadyLogged && <AlreadyLoggedIn />}
      </Box>
      <VStack justifyContent="center" alignItems="center" spacing={5}>
        <HStack paddingTop={5}>
          <HiEye color={"#81E6D9"} size={"3em"} />
          <Heading fontStyle={"italic"} paddingBottom={2}>
            eyedentify
          </Heading>
        </HStack>
        <form>
          <FormControl isRequired>
            <FormLabel>Enter your UTS Email Address</FormLabel>
            <Input
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired paddingTop={5} paddingBottom={5}>
            <FormLabel>Password</FormLabel>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                onChange={(e) => setPassword(e.target.value)}
                type={show ? "text" : "password"} // this might be a problem...
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

          <HStack justifyContent="center" alignItems="center" spacing={5}>
            <Button
              onClick={(e) => handleLogin(e, email, password)}
              type="submit"
              colorScheme={disabled ? "gray" : "teal"}
              variant="solid"
              disabled={disabled}
            >
              Login
            </Button>
          </HStack>
        </form>
      </VStack>
    </div>
  );
};

export default LoginForm;
