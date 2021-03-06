import { useState, useEffect } from "react";
import Link from "next/link";
import PixelArtPreview from "../../components/pixelArtPreview";
import { supabase } from "../../lib/initSupabase";

const PlayPixelArtList = () => {
  // TODO: Fetch all the pixelArts from here and render a mini symbol with the help of "draw pixel from state", make another custom component that does all this
  // Then render a list where every pixelArt is a Link and brings you to the actual game which has yet to be implemented

  const [pixelArts, setPixelArts] = useState([]);

  const fetchPixelArt = async () => {
    const { data, error } = await supabase.from("pixelArts").select();
    console.log(data);
    setPixelArts(data);
    return { data, error };
  };

  useEffect(() => {
    fetchPixelArt();
  }, []);

  const renderPixelArtList = () => {
    // loop through all the pixelarts and render a custom component + link with query of the pixelart id

    const pixis = pixelArts.map((pixelArt) => (
      <div key={pixelArt.id} className="flex flex-col mt-12">
        <p className="text-center">
          Title: {pixelArt.pixelArtTitle ? pixelArt.pixelArtTitle : "No title"}
        </p>
        <Link
          href={{
            pathname: "/pixelArt/draw",
            query: { pixelArtId: pixelArt.id },
          }}
          passHref
        >
          <a>
            <PixelArtPreview pixelArt={pixelArt} />
          </a>
        </Link>
      </div>
    ));

    return pixis;
  };

  return <div className="flex flex-wrap">{renderPixelArtList()}</div>;
};

export default PlayPixelArtList;
