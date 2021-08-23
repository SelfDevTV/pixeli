import { mapColorsToNumbers } from "./mapColorToNumber";

export const drawGame = (pixelArt, ctx) => {
  const rectCount = JSON.parse(pixelArt.pixels).length;

  // total pixles (canvas height * canvas.width with the scale of 0.5 so it matches the canvas from the component before)
  // this should give me all the pixels inside the canvas
  // TODO: Get from parent
  const canvasPixelsCount = Math.floor(
    pixelArt.pixelArtWidth * pixelArt.pixelArtHeight
  );

  // TODO: Figure out why its not working 100 %
  // now i try to find out how big each pixel has to be
  const newRectSize = Math.floor(Math.sqrt(canvasPixelsCount / rectCount));

  const colorsWithCodes = mapColorsToNumbers(JSON.parse(pixelArt.pixels));
  //   console.log(JSON.parse(pixelArt.pixels));

  JSON.parse(pixelArt.pixels).forEach((pixel) => {
    // this does not work.

    // This does work and the coordinates are even in the array
    // ctx.fillText("1", 585, 585);
    ctx.fillStyle = "white";
    ctx.strokeRect(
      pixel.x * newRectSize,
      pixel.y * newRectSize,
      newRectSize,
      newRectSize
    );

    if (pixel.pickedColor !== "white") {
      ctx.fillStyle = "grey";
      ctx.fillRect(
        pixel.x * newRectSize,
        pixel.y * newRectSize,
        newRectSize,
        newRectSize
      );

      // drawColorCode(ctx, pixel, newRectSize, colorsWithCodes);
      ctx.fillStyle = "white";
      ctx.font = "22px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const textX = pixel.x * newRectSize + newRectSize / 2;
      const textY = pixel.y * newRectSize + newRectSize / 2;
      ctx.fillText(colorsWithCodes[pixel.pickedColor], textX, textY);
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

// const drawColorCode = (ctx, pixel, newRectSize, colorsWithCodes) => {
//   if (pixel.pickedColor === "white") return;
// ctx.fillStyle = "red";
// ctx.font = "18px serif";
// ctx.textAlign = "center";
// ctx.textBaseline = "middle";
//   //   ctx.fillText("1", 15, 15);
//   //   ctx.fillText("1", 45, 15);
//   //   ctx.fillText("1", 45, 15);

//   //   ctx.fillText(
//   //     "HalloWeltasdfasdfasdf",
//   //     pixel.x * newRectSize + newRectSize / 2,
//   //     pixel.y * newRectSize + newRectSize / 2
//   //   );

//   ctx.fillText("1", 15, 15);
//   ctx.fillText("1", 15, 45);
//   console.log(
//     `pixel y ${pixel.y * newRectSize + newRectSize / 2} vs pixel x ${
//       pixel.x * newRectSize + Math.round(newRectSize / 2)
//     }`
//   );
// };
