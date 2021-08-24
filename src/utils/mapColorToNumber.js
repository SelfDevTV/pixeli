export const mapColorsToNumbers = (pixels) => {
  // all unique colors
  const colors = [];

  const colorCodes = {};

  pixels.forEach;

  pixels.forEach((pixel) => {
    if (pixel.pickedColor === "white") return;
    if (colors.includes(pixel.pickedColor)) {
      colorCodes[pixel.pickedColor] = colorCodes[pixel.pickedColor] + 1;
      return;
    } else {
      colors.push(pixel.pickedColor);
      colorCodes[pixel.pickedColor] = 1;
    }
  });

  // TODO: FInd out how often each color is included

  const newColors = colors.map((color) => {
    return {
      color,
      colorCount: colorCodes[color],
    };
  });

  console.log(newColors);

  const sortedColors = newColors
    .sort((a, b) => {
      console.log(a);
      console.log(b);
      return a.colorCount - b.colorCount;
    })
    .reverse();

  console.log("sorted colors", sortedColors);

  const colorsWithNumber = sortedColors.map((color, i) => {
    return {
      ...color,
      colorNumber: i + 1,
    };
  });

  console.log("Colors with number: ", colorsWithNumber);

  // Now order the colors array with the most

  // TODO: Set numbers to = color that is used often gets key of 1 , second most used = 2 , etc ...
  // all unique colors with color code

  return colorsWithNumber;
};
