import { useState, useEffect } from "react";
import Link from "next/link";
import PixelArtPreview from "../components/pixelArtPreview";
import { supabase } from "../lib/initSupabase";

const PlayPixelArtList = () => {
  // TODO: Fetch all the pixelArts from here and render a mini symbol with the help of "draw pixel from state", make another custom component that does all this
  // Then render a list where every pixelArt is a Link and brings you to the actual game which has yet to be implemented

  const [pixelArts, setPixelArts] = useState([]);

  const fetchPixelArt = async () => {
    const { data, error } = await supabase.from("pixelArts").select();

    setPixelArts(data);
    console.log("data is: ", data);
    console.log("error is: ", error);
    return { data, error };
  };

  useEffect(() => {
    fetchPixelArt();
  }, []);

  const renderPixelArtList = () => {
    // loop through all the pixelarts and render a custom component
    const pixis = pixelArts.map((pixelArt) => (
      <PixelArtPreview key={pixelArt.id} pixelArt={pixelArt} />
    ));

    return pixis;
  };

  return <div className="flex flex-wrap">{renderPixelArtList()}</div>;
};

export default PlayPixelArtList;
