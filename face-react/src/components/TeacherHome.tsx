import { Grid, GridItem } from "@chakra-ui/react";
import Webcam from "react-webcam";

import { users } from "./LoginForm";
import { useNavigate } from "react-router-dom";

const TeacherHome = () => {
  const navigate = useNavigate();
  return (
    <>
      <Grid templateColumns="repeat(5, 1fr)">
        {users.map(
          (item) =>
            item.userType === "student" && (
              <GridItem
                cursor={"pointer"}
                onClick={() => navigate("/teacherview")}
              >
                <Webcam />
                {item.firstName}
              </GridItem>
            )
        )}
      </Grid>
    </>
  );
};

export default TeacherHome;
