import { useRouter } from "next/router";

// In this component the user can play the actual "coloring pixel" style game.

const PlayPixelArt = () => {
  const router = useRouter();

  // grab the chosen pixelArtId from the URL
  const { pixelArtId } = router.query;

  if (!pixelArtId) return <p>Loading...</p>;

  return <p>PlayPixelArt {pixelArtId}</p>;
};

export default PlayPixelArt;
