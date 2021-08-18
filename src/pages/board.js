import { useState, useEffect } from "react";
import TestCanvas from "../components/testcanvas";
import { CirclePicker } from "react-color";

const Board = () => {
  const [boardData, setBoardData] = useState([]);
  const [selectedColor, setColor] = useState("#f44336");

  useEffect(() => {
    setBoardData(JSON.parse(localStorage.getItem("canvasData")));
    const test = localStorage.getItem("canvasData");
  }, []);

  const updateBoardData = (pixel) => {
    console.log("hi");
    setBoardData((boardData) => [...boardData, pixel]);
  };

  return (
    <div>
      <CirclePicker />
      <TestCanvas
        width="1200"
        height="1200"
        pickedColor={selectedColor}
        updateBoardData={updateBoardData}
        boardData={boardData}
        setBoardData={setBoardData}
      />
    </div>
  );
};

export default Board;
