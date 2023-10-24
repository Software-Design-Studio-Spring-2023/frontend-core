import { useEffect, useState } from "react";
/**
 *
 *@param initalTime initial countdown in ms
 *@param callback executed function whenever timer reaches zero
 *@param interval optional
 */

export const useCountdown = (
  initialTime: number,
  callback: () => void,
  interval = 1000
) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    const customInterval = setInterval(() => {
      if (time > 0) setTime((prev) => prev - interval);
    }, interval);

    if (time === 0) callback();

    return () => clearInterval(customInterval);
  }, [time]);

  return time;
};
