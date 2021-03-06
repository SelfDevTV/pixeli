import { mapColorsToNumbers } from "./mapColorToNumber";

export const drawGame = (pixelArt, ctx, { width, height }, scale) => {
  const rectCount = pixelArt.pixels.length;

  // total pixles (canvas height * canvas.width with the scale of 0.5 so it matches the canvas from the component before)
  // this should give me all the pixels inside the canvas
  // TODO: Get from parent
  const canvasPixelsCount = Math.floor(width * height);

  // TODO: Figure out why its not working 100 %
  // now i try to find out how big each pixel has to be
  const newRectSize = Math.floor(Math.sqrt(canvasPixelsCount / rectCount));

  const colorsWithCodes = mapColorsToNumbers(pixelArt.pixels);

  pixelArt.pixels.forEach((pixel) => {
    // this does not work.

    // This does work and the coordinates are even in the array
    // ctx.fillText("1", 585, 585);

    if (pixel.pickedColor !== "white") {
      if (pixel.hasOwnProperty("paintedCorrectly")) {
        if (pixel.paintedCorrectly) {
          ctx.fillStyle = pixel.pickedColor;
          ctx.fillRect(
            pixel.x * newRectSize,
            pixel.y * newRectSize,
            newRectSize,
            newRectSize
          );
        } else if (!pixel.paintedCorrectly && !pixel.currentColor) {
          ctx.fillStyle = "grey";
          ctx.fillRect(
            pixel.x * newRectSize,
            pixel.y * newRectSize,
            newRectSize,
            newRectSize
          );

          ctx.fillStyle = "white";
          ctx.font = "12px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const textX = pixel.x * newRectSize + newRectSize / 2;
          const textY = pixel.y * newRectSize + newRectSize / 2;
          const colorNumber = colorsWithCodes.find(
            (color) => color.color === pixel.pickedColor
          );
          ctx.fillText(colorNumber.colorNumber, textX, textY, newRectSize);
        } else if (!pixel.paintedCorrectly && pixel.currentColor) {
          ctx.fillStyle = pixel.currentColor;
          ctx.fillRect(
            pixel.x * newRectSize,
            pixel.y * newRectSize,
            newRectSize,
            newRectSize
          );

          ctx.fillStyle = "white";
          ctx.font = "12px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const textX = pixel.x * newRectSize + newRectSize / 2;
          const textY = pixel.y * newRectSize + newRectSize / 2;
          const colorNumber = colorsWithCodes.find(
            (color) => color.color === pixel.pickedColor
          );
          ctx.fillText(colorNumber.colorNumber, textX, textY, newRectSize);
        }
      } else {
        ctx.fillStyle = "grey";
        ctx.fillRect(
          pixel.x * newRectSize,
          pixel.y * newRectSize,
          newRectSize,
          newRectSize
        );

        ctx.fillStyle = "white";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const textX = pixel.x * newRectSize + newRectSize / 2;
        const textY = pixel.y * newRectSize + newRectSize / 2;
        const colorNumber = colorsWithCodes.find(
          (color) => color.color === pixel.pickedColor
        );
        ctx.fillText(colorNumber.colorNumber, textX, textY, newRectSize);
      }

      // drawColorCode(ctx, pixel, newRectSize, colorsWithCodes);
    } else {
      ctx.fillStyle = "white";

      ctx.fillRect(
        pixel.x * newRectSize,
        pixel.y * newRectSize,
        newRectSize,
        newRectSize
      );

      // drawColorCode(ctx, pixel, newRectSize, colorsWithCodes);
    }
  });
};
