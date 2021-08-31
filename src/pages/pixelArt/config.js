import { useState } from "react";
import { useRouter } from "next/router";
import { useWindowSize } from "../../utils/useWindowSize";
import Canvas from "../../components/sandbox/canvas";
import Link from "next/link";

// In this page we provide the user with a little form so he can configure some data of the canvas

const ConfigPixelArt = () => {
  const sizes = {
    small: 30,
    medium: 20,
    large: 12,
  };

  const select = ["small", "medium", "large"];

  const renderCanvasList = () => {
    return select.map((size) => (
      <div key={size}>
        <h3>{size}</h3>
        <Link
          href={{ pathname: "/pixelArt/create", query: { size: sizes[size] } }}
        >
          <a>
            <Canvas size={sizes[size]} />
          </a>
        </Link>
      </div>
    ));
  };
  return (
    <div className="flex h-4/6 mt-4 flex-col items-center justify-between">
      <h1>Chose a Canvas that fits your style:</h1>
      {renderCanvasList()}
    </div>
  );
};

export default ConfigPixelArt;
