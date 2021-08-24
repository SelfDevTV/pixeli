import { CustomPicker } from "react-color";
import { mapColorsToNumbers } from "../utils/mapColorToNumber";
var { EditableInput } = require("react-color/lib/components/common");

const CustomColorPicker = ({ pixelArt, handleColorChange, pickedColor }) => {
  // TODO: Get colors from props

  if (!pixelArt) return <p></p>;
  const colors = mapColorsToNumbers(JSON.parse(pixelArt.pixels));
  return (
    <div className="flex">
      {colors.map((color) => (
        <div
          key={color.color}
          className="flex flex-col items-center justify-center mb-10 mr-4"
        >
          <div
            className="w-10 h-10 rounded-full p-1 flex justify-center items-center cursor-pointer"
            style={{ background: color.color }}
            onClick={(e) => handleColorChange(color.color)}
          >
            <p className="text-black font-bold">{color.colorNumber}</p>
          </div>
          <p>{color.colorCount}</p>
        </div>
      ))}
      <p className="w-64" style={{ color: pickedColor }}>
        picked color: {pickedColor}
      </p>
    </div>
  );
};

export default CustomPicker(CustomColorPicker);
