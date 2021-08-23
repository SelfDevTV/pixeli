import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/initSupabase";
import { drawGame } from "../utils/drawGame";

// In this component the user can play the actual "coloring pixel" style game.

const PlayPixelArt = () => {
  const router = useRouter();
  const { pixelArtId } = router.query;
  const [pixelArt, setPixelArt] = useState(null);
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [canvas, setCanvas] = useState(null);

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
  }, [pixelArt]);

  useEffect(() => {
    if (!ctx || !pixelArt) return;

    // Draw the game
    drawGame(pixelArt, ctx);
  }, [ctx, pixelArt]);

  // with the data initialize the port

  // draw the rects with gray color and map each color to a number and display it
  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="mb-8">
        Here is the pixelArt all in grey. Each color has a color Code. We need
        to paint it with the correct color. WIP
      </h1>
      <canvas className="flex-1" ref={canvasRef} />
    </div>
  );
};

export default PlayPixelArt;
