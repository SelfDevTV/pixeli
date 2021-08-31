export const checkWinningCondition = (pixelArt) => {
  // We win if all pickedColors === currentColors

  let hasWon = true;

  pixelArt.pixels.forEach((pixel) => {
    if (
      pixel.pickedColor !== "white" &&
      pixel.pickedColor !== pixel.currentColor
    )
      hasWon = false;
  });

  return hasWon;
};
