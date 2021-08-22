import { useEffect, useRef, useState } from "react";

const Canvas = (props) => {
  const {
    draw,
    width,
    height,
    pickedColor,
    updateBoardData,
    boardData,
    setBoardData,
    scale,
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
  }, []);

  useEffect(() => {
    if (canvas === null) return;
    // resizeCanvas(canvas);
  }, [scale]);

  const generateDrawingBoard = (ctx) => {
    // Todo:

    // Generate an Array of pixels that have all the things we need to redraw

    for (var i = 0; i < rectCount; i++) {
      for (var j = 0; j < rectCount; j++) {
        //for debugging

        const pixel = {
          x: i,
          y: j,
          currentColor: "white",
          desiredColor: "blue",
          colorCode: 1,
        };
        updateBoardData(pixel);
        ctx.fillStyle = "white";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(i * rectSize, j * rectSize, rectSize, rectSize);

        //   ctx.font = "30px Arial";
        //   ctx.textAlign = "center";
        //   ctx.textBaseline = "middle";
        //   ctx.fillText("1", i * 10 + 10 / 2, j * 10 + 10 / 2);
      }
    }
  };

  function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return { x: x, y: y };
  }

  function resizeCanvas(canvas) {
    const { width, height } = canvas.getBoundingClientRect();

    if (canvas.width !== width || canvas.height !== height) {
      console.log("scroll");
      const { devicePixelRatio: ratio = 1 } = window;

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.scale(ratio, ratio);
      return true;
    }
    canvas.width = width;
    canvas.height = height;
    return false;
  }

  const paint = (e, isClick) => {
    if (!isDrawing && !isClick) {
      return;
    }

    const coordinates = getCursorPosition(canvas, e);

    let rectX = Math.floor(coordinates.x / (rectSize * scale));
    let rectY = Math.floor(coordinates.y / (rectSize * scale));
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
    ctx.fillStyle = "black";
    ctx.strokeRect(rectX * rectSize, rectY * rectSize, rectSize, rectSize);
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

export default Canvas;
