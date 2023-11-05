import React, { useState, useEffect } from "react";
const useDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  }); // <-- don't invoke here
  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }
  useEffect(() => {
    function handleResize() {
      const data = getWindowDimensions();
      console.log("HI",data.height-windowDimensions.height)
      if (Math.abs(data.height - windowDimensions.height) > 100)
       {
        console.log("HI-INNER",data,windowDimensions)
         setWindowDimensions(getWindowDimensions());}
    }

    handleResize(); // <-- invoke this on component mount
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return windowDimensions;
};
export default useDimensions;
