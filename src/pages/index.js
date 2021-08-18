import Canvas from "../components/canvas";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useEffect, useState } from "react";
import { CirclePicker } from "react-color";
import Link from "next/link";

export default function Home() {
  const [selectedColor, setColor] = useState("#f44336");
  const [boardData, setBoardData] = useState([]);

  useEffect(() => {
    // setBoardData(localStorage.getItem("canvasData") || []);
  }, []);

  function changeColor(color) {
    setColor(color.hex);
  }

  const updateBoardData = (pixel) => {
    console.log("hi");
    setBoardData((boardData) => [...boardData, pixel]);
  };

  const submitCanvasData = () => {
    console.log("board data", boardData);
    localStorage.setItem("canvasData", JSON.stringify(boardData));
  };
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CirclePicker color={selectedColor} onChangeComplete={changeColor} />
      <Canvas
        width="1200"
        height="1200"
        pickedColor={selectedColor}
        updateBoardData={updateBoardData}
        boardData={boardData}
        setBoardData={setBoardData}
      />
      <button onClick={submitCanvasData}>Save</button>
      <Link href="/board">
        <a>Board</a>
      </Link>
    </div>
  );
}
