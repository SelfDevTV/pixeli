export const calculateRectSize = (pixelArt, scale) => {
  const rectCount = JSON.parse(pixelArt.pixels).length;

  let canvasPixelsCount;

  if (scale) {
    canvasPixelsCount = Math.fround(
      pixelArt.pixelArtWidth * scale * (pixelArt.pixelArtHeight * scale)
    );
  } else {
    canvasPixelsCount = Math.fround(
      pixelArt.pixelArtWidth * pixelArt.pixelArtHeight
    );
  }
  // total pixles (canvas height * canvas.width with the scale of 0.5 so it matches the canvas from the component before)
  // this should give me all the pixels inside the canvas
  // TODO: Get from parent

  // now i try to find out how big each pixel has to be
  const newRectSize = Math.floor(Math.sqrt(canvasPixelsCount / rectCount));
  return newRectSize;
};
