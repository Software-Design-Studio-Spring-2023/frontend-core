import { useCountdown } from "./useCountdown";
import { Heading } from "@chakra-ui/react";
export const CountDownApp = () => {
  const initialTotalTimeMS = 9000 * 1000;
  const timeMS = useCountdown(initialTotalTimeMS, () =>
    console.log("Times up!!")
  );

  let timeTotalSeconds = timeMS / 1000;
  let timeTotalMinutes = Math.floor(timeTotalSeconds / 60);
  let timeTotalHours = Math.floor(timeTotalMinutes / 60);

  let displayMinutes = timeTotalMinutes % 60;
  let displaySeconds = timeTotalSeconds % 60;

  console.log("Seconds: ", timeMS / 1000);

  if (timeTotalSeconds === 0) {
    return <Heading textAlign={"right"}>TIMES UP!!!!</Heading>;
  } else {
    return (
      <Heading textAlign={"right"}>
        {timeTotalHours} : {displayMinutes} : {displaySeconds}
      </Heading>
    );
  }
};

export default CountDownApp;
