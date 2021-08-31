import { calculateRectSize } from "./calculateRectSize";

export const drawPixelArtFromState = (pixelArt, ctx, _, dimensions) => {
  // how much pixels have been saved from the original scale when the art has been created
  const newRectSize = calculateRectSize(pixelArt, 1, dimensions);

  // TODO: Parse it instantly where we fetch it
  pixelArt.pixels.forEach((pixel) => {
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
