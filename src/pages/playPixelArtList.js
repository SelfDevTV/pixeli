import Link from "next/link";

const PlayPixelArtList = () => {
  return (
    <div>
      <p>Chose a Pixel Art: </p>
      <Link
        href={{ pathname: "/playPixelArtPage", query: { pixelArtId: 1234 } }}
      >
        <a>A</a>
      </Link>
    </div>
  );
};

export default PlayPixelArtList;
