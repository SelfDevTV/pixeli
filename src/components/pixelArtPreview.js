import { useEffect, useRef, useState } from "react";
import { drawPixelArtFromState } from "../utils/drawPixelArtFromState";
import { parsePixelArt } from "../utils/parsePixelArt";
import useCanvas from "../utils/useCanvas";
import { useWindowSize } from "../utils/useWindowSize";

const PixelArtPreview = ({ pixelArt }) => {
  const windowSize = useWindowSize();

  const [canvasRef, draw, getCursorPosition, canvas] = useCanvas(0, 0);

  useEffect(() => {
    if (!canvas) return;

    const newWidth = windowSize.width * 0.35;
    const newHeight = windowSize.height * 0.35;
    canvas.width = newWidth;
    canvas.height = newHeight;

    draw((ctx) => {
      drawPixelArtFromState(parsePixelArt(pixelArt), ctx, 30, {
        width: newWidth,
        height: newHeight,
      });
    });
  }, [pixelArt, draw]);
  return <canvas className="m-4" ref={canvasRef} />;
};

export default PixelArtPreview;
