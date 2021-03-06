import { useRouter } from "next/router";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Confetti from "react-confetti";
import { useEffect, useRef, useState } from "react";
import { CirclePicker, CustomPicker } from "react-color";
import { supabase } from "../../lib/initSupabase";
import { calculateRectSize } from "../../utils/calculateRectSize";
import { drawGame } from "../../utils/drawGame";
import { parsePixelArt } from "../../utils/parsePixelArt";
import CustomColorPicker from "../../components/customColorPicker";
import useCanvas from "../../utils/useCanvas";
import { useWindowSize } from "../../utils/useWindowSize";
import { checkWinningCondition } from "../../utils/checkWinningCondition";

// In this component the user can play the actual "coloring pixel" style game.

const DrawPixelArt = () => {
  const router = useRouter();
  const { pixelArtId } = router.query;
  const [pixelArt, setPixelArt] = useState(null);
  const [scale, setScale] = useState(1);
  // TODO: Initialize with the first color in the saved colors array in pixelArt
  const [pickedColor, setPickedColor] = useState("white");
  const [spaceBarHoldDown, setSpaceBarHoldDown] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const windowSize = useWindowSize();
  const [canvasRef, draw, getCursorPosition, canvas] = useCanvas(0, 0);
  const [hasWon, setHasWon] = useState(false);

  const [colorsWithCodes, setColorsWithCodes] = useState(null);

  // fetch the correct pixelArt

  const fetchPixelArt = async () => {
    const { data, error } = await supabase
      .from("pixelArts")
      .select()
      .single()
      .eq("id", pixelArtId);

    const parsedData = parsePixelArt(data);
    const pixelArt = {
      ...parsedData,
      pixels: parsedData.pixels.map((pixel) => ({
        ...pixel,
        paintedCorrectly: false,
        currentColor: null,
      })),
    };
    setPixelArt(pixelArt);
    return { data, error };
  };

  useEffect(() => {
    if (!pixelArtId) return;

    fetchPixelArt();
  }, [pixelArtId]);

  useEffect(() => {
    if (!pixelArt) return;

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
    if (!pixelArt) return;

    const hasWonStatus = checkWinningCondition(pixelArt);
    console.log(hasWonStatus);

    if (hasWonStatus) {
      setHasWon(true);
    }

    canvas.width = Math.floor(windowSize.width * 0.8);
    canvas.height = Math.floor(windowSize.height * 0.7);

    const colors = pixelArt.colors;

    setColorsWithCodes(colors);

    console.log(windowSize.height * 0.7);
    // Draw the game
    draw((ctx) => {
      drawGame(
        pixelArt,
        ctx,
        {
          width: windowSize.width * 0.8,
          height: windowSize.height * 0.7,
        },
        scale
      );
    });
  }, [pixelArt, draw]);

  const paint = (e, isClick) => {
    if (!isDrawing && !isClick) {
      return;
    }

    console.log("hi");

    const coordinates = getCursorPosition(e);

    const pixelArtWidth = windowSize.width * 0.8;
    const pixelArtHeight = windowSize.height * 0.7;

    const rectSize = calculateRectSize(pixelArt, scale, {
      width: pixelArtWidth,
      height: pixelArtHeight,
    });

    console.log(scale);
    // some magic to know where we clicked and where to draw the rectangle in the right coordinate system
    let rectX = Math.floor(coordinates.x / (rectSize * scale));
    let rectY = Math.floor(coordinates.y / (rectSize * scale));

    const rectCountX = Math.floor(pixelArtWidth / rectSize);
    const rectCountY = Math.floor(pixelArtHeight / rectSize);
    // stop drawing when it's outside of the bounds (i have a grid 100 x 100)
    if (rectX > rectCountX - 1 || rectY > rectCountY - 1) return;

    // update the boaredData Array so we can save the canvas state
    const index = pixelArt.pixels.findIndex(
      (o) => o.x === rectX && o.y === rectY
    );

    if (pixelArt.pixels[index].pickedColor === "white") {
      return;
    }

    if (
      pixelArt.pixels[index].pickedColor === pickedColor &&
      !pixelArt.pixels[index].paintedCorrectly
    ) {
      const newColors = pixelArt.colors.map((color) => {
        if (color.color === pickedColor) {
          return {
            ...color,
            colorCount: color.colorCount - 1,
          };
        } else {
          return color;
        }
      });
      const newPixels = pixelArt.pixels;
      newPixels[index].paintedCorrectly = true;
      newPixels[index].currentColor = pickedColor;
      const newPixelArt = {
        ...pixelArt,
        colors: newColors,
        pixels: newPixels,
      };

      setPixelArt(newPixelArt);
    } else if (
      pixelArt.pixels[index].pickedColor !== pickedColor &&
      pixelArt.pixels[index].paintedCorrectly
    ) {
      const newColors = pixelArt.colors.map((color) => {
        if (color.color === pixelArt.pixels[index].pickedColor) {
          return {
            ...color,
            colorCount: color.colorCount + 1,
          };
        } else {
          return color;
        }
      });
      const newPixels = pixelArt.pixels;
      newPixels[index].paintedCorrectly = false;
      newPixels[index].currentColor = pickedColor;
      const newPixelArt = {
        ...pixelArt,
        colors: newColors,
        pixels: newPixels,
      };

      setPixelArt(newPixelArt);
    } else {
      const newPixels = pixelArt.pixels;

      newPixels[index].currentColor = pickedColor;
      const newPixelArt = {
        ...pixelArt,

        pixels: newPixels,
      };
      setPixelArt(newPixelArt);
    }

    draw((ctx) => {
      // draw the colored rect where clicked / hovered on

      ctx.fillStyle = pickedColor;

      ctx.fillRect(rectX * rectSize, rectY * rectSize, rectSize, rectSize);

      // draw the number again

      ctx.fillStyle = "white";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const textX = rectX * rectSize + rectSize / 2;
      const textY = rectY * rectSize + rectSize / 2;
      const foundNum = colorsWithCodes.find(
        (color) => color.color === pixelArt.pixels[index].pickedColor
      );

      if (pickedColor === pixelArt.pixels[index].pickedColor) {
        return;
      }
      ctx.fillText(foundNum.colorNumber, textX, textY, rectSize);
    });

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

  const handleZoom = (ReactZoomPanPinchRef) => {
    setScale(ReactZoomPanPinchRef.state.scale);
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
      <TransformWrapper onZoom={handleZoom} panning={{ activationKeys: [" "] }}>
        <TransformComponent>
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
            className="flex-1 border"
            ref={canvasRef}
          />
        </TransformComponent>
      </TransformWrapper>
      {hasWon ? (
        <Confetti width={windowSize.width} height={windowSize.height} />
      ) : (
        <h1></h1>
      )}
    </div>
  );
};

export default DrawPixelArt;
