import Link from "next/link";

// this component is the landing page, and lets the user chose what to do, also later on, login and all that good stuff

const Welcome = () => {
  return (
    <div>
      <h1 className="text-center text-xl mt-8 text-yellow-700 font-bold">
        Welcome to Pixeli. Its a coloring pixels clone
      </h1>
      <div className="flex justify-center p-24">
        <Link href="/createPixelArtPage">
          <a className="mr-10 p-4 border-4 border-yellow-700 rounded-lg">
            Create a Pixel Art
          </a>
        </Link>
        <Link href="/playPixelArtPage">
          <a className="p-4 border-4 border-yellow-700 rounded-lg">
            Chose a Pixel Art to Play
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
