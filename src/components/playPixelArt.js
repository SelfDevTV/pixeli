import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { drawPixelArtFromState } from "../utils/drawPixelArtFromState";
import { supabase } from "../lib/initSupabase";

// In this component the user can play the actual "coloring pixel" style game.

const PlayPixelArt = () => {
  const router = useRouter();

  // grab the chosen pixelArtId from the URL
  const { pixelArtId } = router.query;
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [pixelArt, setPixelArt] = useState(null);

  const fetchPixelArt = async () => {
    const { data, error } = await supabase.from("pixelArts").select();

    setPixelArt(JSON.parse(data[data.length - 1].pixels));
    return { data, error };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 1200;
    canvas.height = 600;
    setCanvas(canvas);
    const context = canvas.getContext("2d");
    setCtx(context);
    fetchPixelArt();
  }, []);

  useEffect(() => {
    if (!pixelArt) return;
    drawPixelArtFromState(pixelArt, ctx, 30);
  }, [pixelArt]);

  return (
    <div className="flex flex-col items-stretch justify-center">
      <h1 className="mb-8">
        Right now it only shows this. This is fetched from a database, later it
        shows you a list with all the arts, just select one and you come to the
        actual play screen
      </h1>
      <canvas className="flex-1" ref={canvasRef} />
    </div>
  );
};

export default PlayPixelArt;
