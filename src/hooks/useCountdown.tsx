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
  interval = 1000,
  shouldStart: boolean
) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (shouldStart) {
      setTime(initialTime);
    }
  }, [shouldStart]);

  useEffect(() => {
    if (!shouldStart) return;

    const customInterval = setInterval(() => {
      if (time > 0) setTime((prev) => prev - interval);
    }, interval);

    if (time === 0) {
      callback();
      clearInterval(customInterval);
    }

    return () => clearInterval(customInterval);
  }, [time, shouldStart]);

  return time;
};
