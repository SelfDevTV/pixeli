import { useState } from "react";
import { useRouter } from "next/router";
import { useWindowSize } from "../utils/useWindowSize";

// In this page we provide the user with a little form so he can configure some data of the canvas

const CreatePixelArtConfig = () => {
  const [pixelArtTitle, setPixelArtTitle] = useState("");
  const [pixelArtWidth, setPixelArtWidth] = useState(800);
  const [pixelArtHeight, setPixelArtHeight] = useState(600);
  const [error, setError] = useState(false);
  const windowSize = useWindowSize();
  const router = useRouter();

  const handleSetHeight = (e) => {
    const { value: height } = e.target;

    if (height > windowSize.height * 0.8)
      return setError(
        `Maximum of ${Math.floor(windowSize.height * 0.6)}px is allowed`
      );

    setError(false);

    setPixelArtHeight(Math.floor(height));
  };

  const handleSetWidth = (e) => {
    const { value: width } = e.target;

    if (width > windowSize.width * 0.8)
      return setError(
        `Maximum of ${Math.floor(windowSize.width * 0.8)}px is allowed`
      );

    setError(false);

    setPixelArtWidth(Math.floor(width));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (error) return;

    router.push({
      pathname: "/createPixelArtPage",
      query: { pixelArtTitle, pixelArtWidth, pixelArtHeight },
    });
  };

  return (
    <div>
      {error ? <p className="text-red-900">{error}</p> : <p></p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="pixelArtTitle">Name your Pixel Art:</label>
          <input
            type="text"
            id="pixelArtTitle"
            name="pixelArtTitle"
            value={pixelArtTitle}
            onChange={(e) => setPixelArtTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="pixelArtWidth">Give it a Width:</label>
          <input
            type="number"
            id="pixelArtWidth"
            name="pixelArtWidth"
            value={pixelArtWidth}
            onChange={handleSetWidth}
          />
        </div>
        <div>
          <label htmlFor="pixelArtHeight">Give it a height:</label>
          <input
            type="number"
            id="pixelArtHeight"
            name="pixelArtHeight"
            value={pixelArtHeight}
            onChange={handleSetHeight}
          />
        </div>
        <button type="submit">Start Drawing</button>
      </form>
    </div>
  );
};

export default CreatePixelArtConfig;
