import { useEffect } from 'react'

const warningCountdown = (setProgress, setShowAlert) => {
    useEffect(() => {
        const sound = new Audio("/sounds/warning.mp3");
        sound.play(); // Play vine boom sound
        const totalDuration = 3000; // 3 seconds in total for the progress bar
        const startTime = Date.now();
    
        function updateProgress() {
          const elapsed = Date.now() - startTime;
    
          if (elapsed >= totalDuration) {
            setProgress(0);
            setShowAlert(false);
          } else {
            setProgress(totalDuration - elapsed);
            requestAnimationFrame(updateProgress);
          }
        }
    
        requestAnimationFrame(updateProgress);
    
        return () => {};
      }, []);
}

export default warningCountdown