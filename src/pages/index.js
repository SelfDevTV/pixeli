import Canvas from "../components/canvas";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useEffect, useState } from "react";
import { CirclePicker } from "react-color";
import Link from "next/link";
import { useWindowSize } from "../utils/useWindowSize";

export default function Home() {
  const [selectedColor, setColor] = useState("#f44336");
  const [boardData, setBoardData] = useState([]);
  const [scale, setScale] = useState(1);
  const size = useWindowSize();

  function changeColor(color) {
    setColor(color.hex);
  }

  const updateBoardData = (pixel) => {
    setBoardData((boardData) => [...boardData, pixel]);
  };

  const submitCanvasData = () => {
    localStorage.setItem("canvasData", JSON.stringify(boardData));
  };

  const handleZoom = (ReactZoomPanPinchRef) => {
    setScale(ReactZoomPanPinchRef.state.scale);
  };
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <CirclePicker color={selectedColor} onChangeComplete={changeColor} />
      <TransformWrapper onZoom={handleZoom} panning={{ activationKeys: [" "] }}>
        <TransformComponent>
          <Canvas
            width={size.width * 0.8}
            height={size.height * 0.8}
            pickedColor={selectedColor}
            updateBoardData={updateBoardData}
            boardData={boardData}
            setBoardData={setBoardData}
            scale={scale}
            rectSize={30}
            style={{ flex: 1, marginTop: 40 }}
          />
        </TransformComponent>
      </TransformWrapper>
      {/* <button onClick={submitCanvasData}>Save</button>
      <Link href="/board">
        <a>Board</a>
      </Link> */}
    </div>
  );
}
