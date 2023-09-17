//This is what will be rendered in the grid when viewing a student, and represents a student and their stream.
//We will need to replace the Webcam and make the card loading as a student is connecting.

import { Heading, Text, Box } from "@chakra-ui/react";
import Webcam from "react-webcam";
import setBorder from "../hooks/setBorder";

interface Props {
  name: string;
  warnings: number;
}

const StudentMiniCard = ({ name, warnings }: Props) => {
  return (
    <>
      <Box
        overflow={"hidden"}
        borderColor={setBorder(warnings)}
        borderWidth={"1px"}
        borderRadius={"lg"}
      >
        <Webcam />
        <Heading paddingTop={"2px"} paddingLeft={"2px"} fontSize="1xl">
          {name}
        </Heading>
        <Text paddingLeft={"2px"} paddingBottom={"2px"} fontSize={"x-small"}>
          Warnings: {warnings}
        </Text>
      </Box>
    </>
  );
};

export default StudentMiniCard;
