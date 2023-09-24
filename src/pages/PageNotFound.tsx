import React from "react";
import CopyrightVersion from "../components/CopyrightVersion";
import { Box, Flex, Heading, VStack } from "@chakra-ui/react";
import { AiFillEyeInvisible } from "react-icons/ai";

const PageNotFound = () => {
  return (
    <div>
      <Flex
        direction="column"
        align="center"
        justify="center"
        h={/Android|iPhone/i.test(navigator.userAgent) ? "80vh" : "90vh"}
        minH="min-content"
      >
        <VStack>
          <Heading
            fontSize={
              /Android|iPhone/i.test(navigator.userAgent) ? "3xl" : "5xl"
            }
            paddingTop={"20px"}
          >
            404 Not Found
          </Heading>
          <Heading
            textAlign={"justify"}
            fontSize={
              /Android|iPhone/i.test(navigator.userAgent) ? "1xl" : "3xl"
            }
            paddingTop={"10px"}
          >
            Don't worry, we weren't looking.
          </Heading>
          <Box
            color={"#81E6D9"}
            paddingTop={
              /Android|iPhone/i.test(navigator.userAgent) ? "20%" : ""
            }
          >
            <AiFillEyeInvisible
              size={
                /Android|iPhone/i.test(navigator.userAgent) ? "20em" : "30em"
              }
            />
          </Box>
        </VStack>
        <CopyrightVersion
          bottomVal={/Android|iPhone/i.test(navigator.userAgent) ? -2 : -16}
        />
      </Flex>
    </div>
  );
};

export default PageNotFound;
