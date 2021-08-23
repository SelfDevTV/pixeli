export const mapColorsToNumbers = (pixels) => {
  // all unique colors
  const colors = [];
  const colorCodes = {};

  pixels.forEach((pixel) => {
    if (pixel.pickedColor === "white") return;
    if (colors.includes(pixel.pickedColor)) {
      return;
    } else {
      colors.push(pixel.pickedColor);
    }
  });

  // all unique colors with color code
  colors.forEach((color, i) => {
    colorCodes[color] = i + 1;
  });

  return colorCodes;
};
