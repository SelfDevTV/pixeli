import { useEffect, useRef, useState } from "react";

// On this component we create a new Pixel Art for other to draw.

const CreatePixelArt = ({
  draw,
  width,
  height,
  pickedColor,
  updateBoardData,
  boardData,
  setBoardData,
  scale,
  rectSize,
  ...rest
}) => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [spaceBarHoldDown, setSpaceBarHoldDown] = useState(false);
  const [rectCountX, setRectCountX] = useState(Math.round(width / rectSize));
  const [rectCountY, setRectCountY] = useState(Math.round(height / rectSize));

  // first render, initiate the canvas, draw the board
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    setCanvas(canvas);
    const context = canvas.getContext("2d");
    setCtx(context);

    generateDrawingBoard(context);

    // handles the spacebar events since canvas has no onkeydown listener.
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // remove the listeners after the page unmounts for performance and cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
    //draw
  }, []);

  // reset Canvas Dimensions after width / height / rectsize changes
  useEffect(() => {
    if (canvas === null) return;

    canvas.width = width;
    canvas.height = height;
    setRectCountX(Math.floor(width / rectSize));
    setRectCountY(Math.floor(height / rectSize));
  }, [width, height, rectSize]);

  // re generate the board after the rectCountX / rectCountY changes changes

  useEffect(() => {
    if (canvas === null) return;
    generateDrawingBoard(ctx);
  }, [rectCountX, rectCountY]);

  // draws the initial board on the screen
  const generateDrawingBoard = (ctx) => {
    // Generate an Array of pixels that have all the things we need to redraw

    for (var i = 0; i < rectCountX; i++) {
      for (var j = 0; j < rectCountY; j++) {
        // this is the quint essence whats saved in a huge array. 1000's of these pixels.
        // With the help of this, we can redraw the whole canvas although canvas has not state or save functionality :)
        const pixel = {
          x: i,
          y: j,
          pickedColor: "white",
          // we don't know the color code yet, we generate that afterwards
          colorCode: null,
        };
        updateBoardData(pixel);
        ctx.fillStyle = "white";
        ctx.strokeRect(i * rectSize, j * rectSize, rectSize, rectSize);
      }
    }
  };

  // gets the cursor position relative to the mouse position on the canvas

  function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return { x, y };
  }

  // paints pixel by pixel when clicked / hovered

  const paint = (e, isClick) => {
    if (!isDrawing && !isClick) {
      return;
    }

    const coordinates = getCursorPosition(canvas, e);

    // some magic to know where we clicked and where to draw the rectangle in the right coordinate system
    let rectX = Math.floor(coordinates.x / (rectSize * scale));
    let rectY = Math.floor(coordinates.y / (rectSize * scale));

    // stop drawing when it's outside of the bounds (i have a grid 100 x 100)
    if (rectX > rectCountX - 1 || rectY > rectCountY - 1) return;

    // update the boaredData Array so we can save the canvas state
    const index = boardData.findIndex((o) => o.x === rectX && o.y === rectY);
    if (index > -1) {
      const newBoard = [...boardData];
      newBoard[index] = { ...boardData[index], pickedColor: pickedColor };
      setBoardData(newBoard);
    }

    // draw the colored rect where clicked / hovered on
    ctx.fillStyle = pickedColor;
    ctx.fillRect(rectX * rectSize, rectY * rectSize, rectSize, rectSize);
    ctx.fillStyle = "black";
    ctx.strokeRect(rectX * rectSize, rectY * rectSize, rectSize, rectSize);
  };

  const handleMouseMove = (e) => {
    if (spaceBarHoldDown) return;
    paint(e);
  };

  // checks if spacebar is hold down
  const handleKeyDown = (e) => {
    if (e.which !== 32) return;
    setSpaceBarHoldDown(true);
  };

  // checks if spacebar has been released
  const handleKeyUp = (e) => {
    if (e.which !== 32) return;
    setSpaceBarHoldDown(false);
  };

  return (
    <canvas
      onClick={(e) => {
        if (spaceBarHoldDown) return;
        paint(e, true);
      }}
      onMouseDown={(e) => {
        if (spaceBarHoldDown) return;
        setIsDrawing((prevDrawing) => true);

        paint(e);
      }}
      onMouseUp={() => setIsDrawing(false)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsDrawing(false)}
      {...rest}
      ref={canvasRef}
    />
  );
};

export default CreatePixelArt;
