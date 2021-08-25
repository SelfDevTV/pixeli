import { useRouter } from "next/router";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { supabase } from "../lib/initSupabase";
import { useState } from "react";
import { CirclePicker } from "react-color";
import { useWindowSize } from "../utils/useWindowSize";
import CreatePixelArt from "../components/createPixelArt";
import { mapColorsToNumbers } from "../utils/mapColorToNumber";

const CreatePixelArtPage = () => {
  const [selectedColor, setColor] = useState("#f44336");
  const [boardData, setBoardData] = useState([]);
  const [scale, setScale] = useState(1);
  const size = useWindowSize();
  const router = useRouter();
  const { pixelArtTitle, pixelArtHeight, pixelArtWidth } = router.query;

  function changeColor(color) {
    setColor(color.hex);
  }

  const updateBoardData = (pixel) => {
    setBoardData((boardData) => [...boardData, pixel]);
  };

  const submitCanvasData = async () => {
    // inserts the current pixelArt Data into the datbase

    const { data, error } = await supabase.from("pixelArts").insert({
      pixelArtTitle,
      pixelArtWidth,
      pixelArtHeight,
      pixels: JSON.stringify(boardData),
      colors: JSON.stringify(mapColorsToNumbers(boardData)),
    });
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
      <div className="text-yellow-700 text-center mb-4">
        <h2>Chose a Color and Click or Click + Drag to Draw on the canvas</h2>
        <p>Tipp: You can zoom in and out with mousewheel. </p>
        <p>Tipp: You can pan while holding space bar + Drag</p>
      </div>
      <CirclePicker color={selectedColor} onChangeComplete={changeColor} />
      <TransformWrapper onZoom={handleZoom} panning={{ activationKeys: [" "] }}>
        <TransformComponent>
          <CreatePixelArt
            width={pixelArtWidth}
            height={pixelArtHeight}
            pickedColor={selectedColor}
            updateBoardData={updateBoardData}
            boardData={boardData}
            setBoardData={setBoardData}
            scale={scale}
            rectSize={12}
            className="mt-4 flex-1 w-full"
          />
        </TransformComponent>
      </TransformWrapper>
      {/* TODO: Include the already saved id of the canvas in the query props */}
      {/* <Link href="/savePixelArtForm">
        <a
          className="py-2 px-5 mt-4 rounded-lg bg-yellow-700 text-white"
          onClick={submitCanvasData}
        >
          Go to Save Screen
        </a>
      </Link> */}
      <button
        className="py-2 px-5 mt-4 rounded-lg bg-yellow-700 text-white"
        onClick={submitCanvasData}
      >
        Save Canvas
      </button>
    </div>
  );
};

export default CreatePixelArtPage;
