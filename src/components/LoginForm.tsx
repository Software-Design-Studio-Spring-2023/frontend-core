import { useState } from "react";
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
} from "@chakra-ui/react";
import { HiEye, HiOutlineEye } from "react-icons/hi";
import { update_loggedin } from "../services/user-utils";

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
  const { data, loading, error } = useUsers();

  const handleLogin = (email: string, password: string) => {
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
        alert(`Welcome Student ${currentUser.name}`);
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
        alert(`Welcome Teacher ${currentUser.name}`);
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
      //start of handler for students already logged in. will retrieve value from database
      alert("Student is already logged in!!");
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
      //start of handler for students already logged in. will retrieve value from database
      alert(
        "Your exam has been terminated. Contact the University for support."
      );
    } else {
      alert("Invalid username or password");
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  // const handleClick = () => setShow(!show);

  return (
    <VStack
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
      spacing={5}
    >
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
            onClick={() => handleLogin(email, password)}
            type="submit"
            colorScheme="teal"
            variant="solid"
          >
            Login
          </Button>
        </HStack>
      </form>
    </VStack>
  );
};

export default LoginForm;
