import { useEffect, useRef, useState } from "react";
import { drawPixelArtFromState } from "../utils/drawPixelArtFromState";

const PixelArtPreview = ({ pixelArt }) => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    // This is where I scale the original size
    // the whole pixelArt comes from the database and looks like this (example data):

    // { pixelArtTitle: "some title", pixelArtWidth: 1234, pixelArtHeight: 1234, pixels: [... (the array I shows above with pixels)]}
    canvas.width = pixelArt.pixelArtWidth * 0.5;
    canvas.height = pixelArt.pixelArtHeight * 0.5;
    setCanvas(canvas);
    const context = canvas.getContext("2d");
    setCtx(context);
  }, []);

  useEffect(() => {
    if (!ctx) return;
    drawPixelArtFromState(pixelArt, ctx, 30);
  }, [pixelArt, ctx]);
  return <canvas className="m-4" ref={canvasRef} />;
};

export default PixelArtPreview;
