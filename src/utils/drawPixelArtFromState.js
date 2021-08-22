export const drawPixelArtFromState = (pixelArt, ctx, rectSize) => {
  console.log("pixel art", pixelArt);
  pixelArt.forEach((pixel) => {
    ctx.fillStyle = "white";
    ctx.strokeRect(pixel.x * rectSize, pixel.y * rectSize, rectSize, rectSize);

    ctx.fillStyle = pixel.pickedColor;
    ctx.fillRect(pixel.x * rectSize, pixel.y * rectSize, rectSize, rectSize);
  });
};
