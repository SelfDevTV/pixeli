export const calculateRectSize = (pixelArt, scale = 1) => {
  const rectCount = JSON.parse(pixelArt.pixels).length;

  const canvasPixelsCount = Math.fround(
    pixelArt.pixelArtWidth * scale * (pixelArt.pixelArtHeight * scale)
  );
  // total pixles (canvas height * canvas.width with the scale of 0.5 so it matches the canvas from the component before)
  // this should give me all the pixels inside the canvas

  // now i try to find out how big each pixel has to be
  const newRectSize = Math.floor(Math.sqrt(canvasPixelsCount / rectCount));
  return newRectSize;
};
