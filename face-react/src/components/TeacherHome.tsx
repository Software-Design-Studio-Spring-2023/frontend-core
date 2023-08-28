import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import Webcam from "react-webcam";

import { users } from "./LoginForm";

let studentCount = users.length;

const TeacherHome = () => {
  return (
    <>
      <button onClick={() => studentCount++}>Increment</button>
      <Grid templateColumns="repeat(5, 1fr)">
        {users.map((item) => (
          <GridItem>
            <Webcam />
            {item.firstName}
          </GridItem>
        ))}
      </Grid>
    </>
  );
};

export default TeacherHome;
