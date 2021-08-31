import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-center text-xl mt-8 text-yellow-700 font-bold">
        Welcome to Pixeli. Its a coloring pixels clone
      </h1>
      <div className="flex justify-center p-24">
        <Link href="/pixelArt/config">
          <a className="mr-10 p-4 border-4 border-yellow-700 rounded-lg">
            Create a Pixel Art
          </a>
        </Link>
        <Link href="/pixelArt">
          <a className="p-4 border-4 border-yellow-700 rounded-lg">
            Chose a Pixel Art to Play
          </a>
        </Link>
      </div>
    </div>
  );
}

// TODO: get rid of all the JSON.parse stuff with pixelArt.pixels
// TODO: Refactor the whole codebase, it is messy
