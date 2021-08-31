import { useEffect, useState } from "react";
import { useWindowSize } from "../../utils/useWindowSize";
import useCanvas from "../../utils/useCanvas";

const Canvas = ({ size = 20 }) => {
  const windowSize = useWindowSize();

  const [rectCountX, setRectCountX] = useState(0);
  const [rectCountY, setRectCountY] = useState(0);

  const [canvasRef, draw, getCursorPosition, canvas] = useCanvas();

  const generateDrawingBoard = (ctx) => {
    // Generate an Array of pixels that have all the things we need to redraw
    console.log("serveus, ", ctx);
    for (var i = 0; i < rectCountX; i++) {
      for (var j = 0; j < rectCountY; j++) {
        // this is the quint essence whats saved in a huge array. 1000's of these pixels.
        // With the help of this, we can redraw the whole canvas although canvas has not state or save functionality :)
        const pixel = {
          x: i,
          y: j,
          pickedColor: "white",
        };

        ctx.fillStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(i * size, j * size, size, size);
      }
    }
  };

  useEffect(() => {
    console.log(windowSize);
    setRectCountX(Math.floor((windowSize.width * 0.25) / size));
    setRectCountY(Math.floor((windowSize.height * 0.25) / size));
  }, [windowSize]);

  useEffect(() => {
    if (!canvas) return;
    canvas.width = Math.floor(windowSize.width * 0.25);
    canvas.height = Math.floor(windowSize.height * 0.25);
    draw((ctx) => {
      generateDrawingBoard(ctx);
    });
  }, [draw, rectCountX]);

  return <canvas className="" ref={canvasRef} />;
};

export default Canvas;
