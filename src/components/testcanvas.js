import { useEffect, useRef, useState } from "react";

const TestCanvas = (props) => {
  const {
    draw,
    width,
    height,
    pickedColor,
    updateBoardData,
    boardData,
    setBoardData,
    ...rest
  } = props;
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  //   const [drawingBoard, setDrawingBoard] = useState([]);
  const [rectCount, setRectCount] = useState(30);
  const [rectSize, setRectSize] = useState(Math.floor(width / rectCount));

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    setCanvas(canvas);
    const context = canvas.getContext("2d");
    setCtx(context);

    //draw

    generateDrawingBoard(context);
  }, [boardData]);

  const generateDrawingBoard = (ctx) => {
    // Todo:
    if (boardData.length === 0) return;
    // Generate an Array of pixels that have all the things we need to redraw
    console.log("board data length: ", boardData.length);
    console.log("board data", boardData);

    boardData.forEach((pixel) => {
      ctx.fillStyle = pixel.currentColor;
      ctx.fillRect(pixel.x * rectSize, pixel.y * rectSize, rectSize, rectSize);

      ctx.fillStyle = "white";
      ctx.strokeRect(
        pixel.x * rectSize,
        pixel.y * rectSize,
        rectSize,
        rectSize
      );
    });
  };

  function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return { x: x, y: y };
  }

  const paint = (e, isClick) => {
    if (!isDrawing && !isClick) {
      return;
    }

    const coordinates = getCursorPosition(canvas, e);

    let rectX = Math.floor(coordinates.x / rectSize);
    let rectY = Math.floor(coordinates.y / rectSize);
    // stop drawing when it's outside of the bounds (i have a grid 100 x 100)
    if (rectX > rectCount - 1 || rectY > rectCount - 1) {
      console.log("im here");
      return;
    }

    const index = boardData.findIndex((o) => o.x === rectX && o.y === rectY);
    if (index > -1) {
      const newBoard = [...boardData];
      newBoard[index] = { ...boardData[index], currentColor: pickedColor };
      setBoardData(newBoard);
    }

    ctx.fillStyle = pickedColor;
    ctx.fillRect(rectX * rectSize, rectY * rectSize, rectSize, rectSize);
  };

  return (
    <canvas
      onClick={(e) => {
        paint(e, true);
      }}
      onMouseDown={(e) => {
        setIsDrawing((prevDrawing) => true);

        paint(e);
      }}
      onMouseUp={() => setIsDrawing(false)}
      onMouseMove={paint}
      onMouseLeave={() => setIsDrawing(false)}
      {...rest}
      ref={canvasRef}
    />
  );
};

export default TestCanvas;