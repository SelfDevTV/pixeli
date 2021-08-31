import { useEffect, useRef, useState } from "react";
import { drawPixelArtFromState } from "../utils/drawPixelArtFromState";
import { parsePixelArt } from "../utils/parsePixelArt";
import useCanvas from "../utils/useCanvas";

const PixelArtPreview = ({ pixelArt }) => {
  const [canvasRef, draw, getCursorPosition] = useCanvas(
    pixelArt.pixelArtWidth * 0.5,
    pixelArt.pixelArtHeight * 0.5
  );

  useEffect(() => {
    draw((ctx) => {
      drawPixelArtFromState(parsePixelArt(pixelArt), ctx, 30);
    });
  }, [pixelArt, draw]);
  return <canvas className="m-4" ref={canvasRef} />;
};

export default PixelArtPreview;
