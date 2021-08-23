export const drawPixelArtFromState = (pixelArt, ctx) => {
  // how much pixels have been saved from the original scale when the art has been created
  const rectCount = JSON.parse(pixelArt.pixels).length;

  // total pixles (canvas height * canvas.width with the scale of 0.5 so it matches the canvas from the component before)
  // this should give me all the pixels inside the canvas
  // TODO: Get from parent
  const canvasPixelsCount = Math.fround(
    (pixelArt.pixelArtWidth - 10) * 0.5 * ((pixelArt.pixelArtHeight - 10) * 0.5)
  );
  // now i try to find out how big each pixel has to be
  const newRectSize = Math.floor(Math.sqrt(canvasPixelsCount / rectCount));

  // TODO: Parse it instantly where we fetch it
  JSON.parse(pixelArt.pixels).forEach((pixel) => {
    ctx.fillStyle = "white";
    ctx.strokeRect(
      pixel.x * newRectSize,
      pixel.y * newRectSize,
      newRectSize,
      newRectSize
    );

    ctx.fillStyle = pixel.pickedColor;
    ctx.fillRect(
      pixel.x * newRectSize,
      pixel.y * newRectSize,
      newRectSize,
      newRectSize
    );
  });
};
