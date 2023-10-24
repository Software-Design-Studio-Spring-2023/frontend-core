//Colours are consistent with the warnings, so made into a hook

const setBorder = (warningColor: Number) => {
    switch (warningColor) {
      case 0:
        return "green";
      case 1:
        return "#D69E2E";
      case 2:
        return "red";
      default:
        return "gray"; // Default color in case warnings is undefined or out of range
    }
  };

  export default setBorder