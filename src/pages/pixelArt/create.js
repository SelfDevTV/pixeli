import { useRouter } from "next/router";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { supabase } from "../../lib/initSupabase";
import { useEffect, useState } from "react";
import { CirclePicker } from "react-color";
import { mapColorsToNumbers } from "../../utils/mapColorToNumber";
import useCanvas from "../../utils/useCanvas";
import { useWindowSize } from "../../utils/useWindowSize";

const CreatePixelArtPage = () => {
  const [pickedColor, setPickedColor] = useState("#f44336");
  const [pixels, setPixels] = useState([]);
  const [scale, setScale] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [spaceBarHoldDown, setSpaceBarHoldDown] = useState(false);
  const router = useRouter();
  const { pixelArtTitle, pixelArtHeight, pixelArtWidth } = router.query;
  const { size: rectSize } = router.query;
  const [rectCountX, setRectCountX] = useState(0);
  const [rectCountY, setRectCountY] = useState(0);

  const [canvasRef, draw, getCursorPosition, canvas] = useCanvas(0, 0);

  const windowSize = useWindowSize();

  const generateDrawingBoard = (ctx) => {
    // Generate an Array of pixels that have all the things we need to redraw

    for (var i = 0; i < rectCountX; i++) {
      for (var j = 0; j < rectCountY; j++) {
        // this is the quint essence whats saved in a huge array. 1000's of these pixels.
        // With the help of this, we can redraw the whole canvas although canvas has not state or save functionality :)
        const pixel = {
          x: i,
          y: j,
          pickedColor: "white",
        };
        setPixels((pixels) => [...pixels, pixel]);
        ctx.fillStyle = "white";
        ctx.strokeRect(i * rectSize, j * rectSize, rectSize, rectSize);
      }
    }
  };

  useEffect(() => {
    if (!canvas) return;
    console.log(windowSize);
    console.log(rectSize);
    const canvasWidth = windowSize.width * 0.8;
    const canvasHeight = windowSize.height * 0.7;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    setRectCountX(Math.floor(canvasWidth / rectSize));
    setRectCountY(Math.floor(canvasHeight / rectSize));
  }, [windowSize, rectSize]);

  useEffect(() => {
    draw((ctx) => {
      generateDrawingBoard(ctx);
    });
  }, [draw, rectCountX]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // remove the listeners after the page unmounts for performance and cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  });

  const handleMouseMove = (e) => {
    if (spaceBarHoldDown) return;
    handleDrawing(e);
  };

  // checks if spacebar is hold down
  const handleKeyDown = (e) => {
    if (e.which !== 32) return;
    setSpaceBarHoldDown(true);
  };

  // checks if spacebar has been released
  const handleKeyUp = (e) => {
    if (e.which !== 32) return;
    setSpaceBarHoldDown(false);
  };

  const handleDrawing = (e, isClick) => {
    if (!isDrawing && !isClick) {
      return;
    }
    const { x, y } = getCursorPosition(e);
    let rectX = Math.floor(x / (rectSize * scale));
    let rectY = Math.floor(y / (rectSize * scale));

    if (rectX > rectCountX - 1 || rectY > rectCountY - 1) return;

    const index = pixels.findIndex((o) => o.x === rectX && o.y === rectY);
    if (index > -1) {
      const newPixels = [...pixels];
      newPixels[index] = { ...pixels[index], pickedColor: pickedColor };
      setPixels(newPixels);
    }

    draw((ctx) => {
      ctx.fillStyle = pickedColor;
      ctx.fillRect(rectX * rectSize, rectY * rectSize, rectSize, rectSize);
      ctx.fillStyle = "black";
      ctx.strokeRect(rectX * rectSize, rectY * rectSize, rectSize, rectSize);
    });
  };

  function changeColor(color) {
    setPickedColor(color.hex);
  }

  const updatePixels = (pixel) => {
    setPixels((pixels) => [...pixels, pixel]);
  };

  const submitCanvasData = async () => {
    // inserts the current pixelArt Data into the datbase

    const { data, error } = await supabase.from("pixelArts").insert({
      pixelArtTitle,
      pixelArtWidth,
      pixelArtHeight,
      pixels: JSON.stringify(pixels),
      colors: JSON.stringify(mapColorsToNumbers(pixels)),
    });
    console.log(data);
    console.error(error);
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
      <CirclePicker color={pickedColor} onChangeComplete={changeColor} />
      <TransformWrapper onZoom={handleZoom} panning={{ activationKeys: [" "] }}>
        <TransformComponent>
          <canvas
            ref={canvasRef}
            className="border mt-8"
            onClick={(e) => {
              if (spaceBarHoldDown) return;
              handleDrawing(e, true);
            }}
            onMouseDown={(e) => {
              if (spaceBarHoldDown) return;
              setIsDrawing((prevDrawing) => true);

              handleDrawing(e);
            }}
            onMouseUp={() => setIsDrawing(false)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsDrawing(false)}
          />
        </TransformComponent>
      </TransformWrapper>
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
