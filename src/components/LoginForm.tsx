import { useState } from "react";
import { User } from "../hooks/useUsers";
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
} from "@chakra-ui/react";
import React from "react";

//set logged in variable, which will be true throughout duration of exam. only way to revert false is by finishing exam

export var currentUser: User | undefined = {
  id: 0,
  firstName: "",
  loggedIn: false,
  userType: "",
  email: "",
  password: "",
  warnings: 0,
};

export const users: User[] = [
  {
    id: 0,
    firstName: "Marko",
    loggedIn: false,
    userType: "student",
    email: "marko@student.uts.edu.au",
    password: "password",
    warnings: 0,
  },
  {
    id: 1,
    firstName: "Sydney",
    loggedIn: false,
    userType: "staff",
    email: "sydney@staff.uts.edu.au",
    password: "hello",
    warnings: 0,
  },
  {
    id: 2,
    firstName: "Michael",
    loggedIn: false,
    userType: "student",
    email: "michael@student.uts.edu.au",
    password: "goodbye",
    warnings: 0,
  },

  {
    id: 3,
    firstName: "Reuben",
    loggedIn: false,
    userType: "student",
    email: "reuben@student.uts.edu.au",
    password: "123456",
    warnings: 0,
  },

  {
    id: 4,
    firstName: "Liam",
    loggedIn: false,
    userType: "student",
    email: "liam@student.uts.edu.au",
    password: "09876",
    warnings: 0,
  },

  {
    id: 5,
    firstName: "Daniel",
    loggedIn: false,
    userType: "student",
    email: "daniel@student.uts.edu.au",
    password: "utsiscool",
    warnings: 0,
  },

  {
    id: 6,
    firstName: "Shephon",
    loggedIn: false,
    userType: "student",
    email: "shephon@student.uts.edu.au",
    password: "utsisnotcool",
    warnings: 0,
  },
];

const LoginForm = () => {
  const navigate = useNavigate();
  // useEffect(() => {
  //   navigate("/");
  // }, []);
  // const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (email: string, password: string) => {
    if (
      users.some(
        (user) =>
          user.email === email &&
          user.password === password &&
          // user.userType === "student"
          email.includes("@student.uts.edu.au") &&
          user.loggedIn === false
      )
    ) {
      currentUser = users.find(
        (user) => user.email === email && user.password === password
      );
      if (currentUser !== undefined) {
        alert(`Welcome Student ${currentUser.firstName}`);
        currentUser.loggedIn = true; //gotta send this to the database, students can't login again until after exam is done
      }
      navigate("/student");
    } else if (
      users.some(
        (user) =>
          user.email === email &&
          user.password === password &&
          // user.userType === "teacher"
          email.includes("@staff.uts.edu.au")
      )
    ) {
      currentUser = users.find(
        (user) => user.email === email && user.password === password
      );
      if (currentUser !== undefined) {
        alert(`Welcome Teacher ${currentUser.firstName}`);
        currentUser.loggedIn = true;
      }
      navigate("/teacher");
    } else if (
      currentUser?.loggedIn === true &&
      currentUser?.userType === "student"
    ) {
      //start of handler for students already logged in. will retrieve value from database
      alert("Student is already logged in!!");
    } else {
      alert("Invalid username or password");
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <VStack
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
      spacing={5}
    >
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
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onMouseDown={() => setShow(true)}
                onMouseUp={() => setShow(false)}
                onMouseLeave={() => setShow(false)}
              >
                {show ? "Hide" : "Show"}
              </Button>
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
