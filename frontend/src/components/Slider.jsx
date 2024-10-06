import { useState } from "react";
import "../css/Slider.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

export const Slider = ({ min, max, value, handleChange }) => {
  const [height, setHeight] = useState(value);

  const increaseIntensity = () => {
    setHeight((prevHeight) => prevHeight + 10);
    handleChange(height);
  }

  const decreaseIntensity = () => {
    setHeight((prevHeight) => Math.max(0, prevHeight - 10));
    handleChange(height);
  }

  return (
    <>
      <div className="controls-top">
        <FontAwesomeIcon icon={faPlus} onClick={increaseIntensity} />
      </div>
      <div className="column-container">
        <div className="pink-section" style={{ height: `${height}px`, maxHeight: { max } }}></div>
      </div>
      <div className="controls-down">
        <FontAwesomeIcon icon={faMinus} onClick={decreaseIntensity} />
      </div>
    </>
  )
};