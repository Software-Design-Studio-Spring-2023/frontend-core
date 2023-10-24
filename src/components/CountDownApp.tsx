import { Fragment } from "react";
import { useCountdown } from "./useCountdown";
import { Heading } from "@chakra-ui/react";
import { motion } from "framer-motion";
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

  if (timeTotalSeconds === 0) {
    return <Heading>TIMES UP!!!!</Heading>;
  } else {
    return (
      <Fragment>
        <Heading>
          {timeTotalHours} : {displayMinutes} : {displaySeconds}
        </Heading>

        <div>
          <div className="progressbar">
            <motion.div
              className="bar"
              animate={{
                width: "0%",
              }}
              transition={{ duration: timeTotalSeconds }}
            />
          </div>
        </div>
      </Fragment>
    );
  }
};

export default CountDownApp;
