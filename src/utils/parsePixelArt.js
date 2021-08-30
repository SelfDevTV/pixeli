export const parsePixelArt = (pixelArt) => {
  const newPixelArt = {
    ...pixelArt,
    pixels: JSON.parse(pixelArt.pixels),
    colors: JSON.parse(pixelArt.colors),
  };

  return newPixelArt;
};
