import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { CirclePicker, CustomPicker } from "react-color";
import { supabase } from "../lib/initSupabase";
import { calculateRectSize } from "../utils/calculateRectSize";
import { drawGame } from "../utils/drawGame";
import { mapColorsToNumbers } from "../utils/mapColorToNumber";
import CustomColorPicker from "./customColorPicker";

// In this component the user can play the actual "coloring pixel" style game.

const PlayPixelArt = ({ scale = 1 }) => {
  const router = useRouter();
  const { pixelArtId } = router.query;
  const [pixelArt, setPixelArt] = useState(null);
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [canvas, setCanvas] = useState(null);
  // TODO: Initialize with the first color in the saved colors array in pixelArt
  const [pickedColor, setPickedColor] = useState("white");
  const [spaceBarHoldDown, setSpaceBarHoldDown] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const [colorsWithCodes, setColorsWithCodes] = useState(null);

  // fetch the correct pixelArt

  const fetchPixelArt = async () => {
    const { data, error } = await supabase
      .from("pixelArts")
      .select()
      .single()
      .eq("id", pixelArtId);

    setPixelArt(data);
    console.log("data is: ", data);
    console.log("error is: ", error);
    return { data, error };
  };

  useEffect(() => {
    if (!pixelArtId) return;
    fetchPixelArt();
  }, [pixelArtId]);

  useEffect(() => {
    if (!pixelArt) return;
    const canvas = canvasRef.current;
    // This is where I scale the original size
    // the whole pixelArt comes from the database and looks like this (example data):

    // { pixelArtTitle: "some title", pixelArtWidth: 1234, pixelArtHeight: 1234, pixels: [... (the array I shows above with pixels)]}
    canvas.width = pixelArt.pixelArtWidth + 100;
    canvas.height = pixelArt.pixelArtHeight + 100;
    setCanvas(canvas);
    const context = canvas.getContext("2d");
    setCtx(context);

    // handles the spacebar events since canvas has no onkeydown listener.
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // remove the listeners after the page unmounts for performance and cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [pixelArt]);

  useEffect(() => {
    if (!ctx || !pixelArt) return;

    const test = mapColorsToNumbers(JSON.parse(pixelArt.pixels));
    setPickedColor(test[0].color);
    setColorsWithCodes(test);
    // Draw the game
    drawGame(pixelArt, ctx);
  }, [ctx, pixelArt]);

  function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return { x, y };
  }

  const paint = (e, isClick) => {
    if (!isDrawing && !isClick) {
      return;
    }

    console.log(colorsWithCodes);

    const coordinates = getCursorPosition(canvas, e);

    const rectSize = calculateRectSize(pixelArt);

    // some magic to know where we clicked and where to draw the rectangle in the right coordinate system
    let rectX = Math.floor(coordinates.x / (rectSize * scale));
    let rectY = Math.floor(coordinates.y / (rectSize * scale));

    const rectCountX = Math.floor(pixelArt.pixelArtWidth / rectSize);
    const rectCountY = Math.floor(pixelArt.pixelArtHeight / rectSize);
    // stop drawing when it's outside of the bounds (i have a grid 100 x 100)
    if (rectX > rectCountX - 1 || rectY > rectCountY - 1) return;

    // update the boaredData Array so we can save the canvas state
    const index = JSON.parse(pixelArt.pixels).findIndex(
      (o) => o.x === rectX && o.y === rectY
    );

    if (JSON.parse(pixelArt.pixels)[index].pickedColor === "white") {
      return;
    }
    // if (index > -1) {
    //   const newBoard = [...boardData];
    //   newBoard[index] = { ...boardData[index], pickedColor: pickedColor };
    //   setBoardData(newBoard);
    // }

    // draw the colored rect where clicked / hovered on
    ctx.fillStyle = pickedColor;
    ctx.fillRect(rectX * rectSize, rectY * rectSize, rectSize, rectSize);
    ctx.fillStyle = "black";
    ctx.strokeRect(rectX * rectSize, rectY * rectSize, rectSize, rectSize);

    // draw the number again

    ctx.fillStyle = "white";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const textX = rectX * rectSize + rectSize / 2;
    const textY = rectY * rectSize + rectSize / 2;
    const foundNum = colorsWithCodes.find(
      (color) => color.color === JSON.parse(pixelArt.pixels)[index].pickedColor
    );

    if (pickedColor === JSON.parse(pixelArt.pixels)[index].pickedColor) {
      return;
    }
    console.log("found num, ", foundNum);
    ctx.fillText(foundNum.colorNumber, textX, textY, rectSize);

    // TODO: Implement game logic
    // find out when a pixel is colored correctly
  };

  const handleColorChange = (color) => {
    setPickedColor(color);
  };

  const handleMouseMove = (e) => {
    if (spaceBarHoldDown) return;
    paint(e);
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

  // with the data initialize the port

  // draw the rects with gray color and map each color to a number and display it
  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="mb-8">
        Here is the pixelArt all in grey. Each color has a color Code. We need
        to paint it with the correct color. WIP
      </h1>
      {/* TODO: i need to display the used colors with the specific color code */}
      <CustomColorPicker
        pixelArt={pixelArt}
        handleColorChange={handleColorChange}
        pickedColor={pickedColor}
      />
      <canvas
        onClick={(e) => {
          if (spaceBarHoldDown) return;
          paint(e, true);
        }}
        onMouseDown={(e) => {
          if (spaceBarHoldDown) return;
          setIsDrawing((prevDrawing) => true);

          paint(e);
        }}
        onMouseUp={() => setIsDrawing(false)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsDrawing(false)}
        className="flex-1"
        ref={canvasRef}
      />
    </div>
  );
};

export default PlayPixelArt;
