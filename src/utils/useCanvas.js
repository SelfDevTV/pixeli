import { useRef, useEffect, useState, useCallback } from "react";

const useCanvas = (width, height) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [context, setContext] = useState(null);
  const [frameCount, setFrameCount] = useState(0);

  function resizeCanvasToDisplaySize() {
    const { width, height } = canvas.getBoundingClientRect();

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      return true; // here you can return some usefull information like delta width and delta height instead of just true
      // this information can be used in the next redraw...
    }

    return false;
  }

  function resizeCanvas(canvas) {
    const { width, height } = canvas.getBoundingClientRect();

    if (canvas.width !== width || canvas.height !== height) {
      const { devicePixelRatio: ratio = 1 } = window;
      const context = canvas.getContext("2d");
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.scale(ratio, ratio);
      return true;
    }

    return false;
  }

  const handleResizeWindow = () => {
    console.log("resizing");
    context.save();
    resizeCanvasToDisplaySize(canvas);
    resizeCanvas(canvas);
    context.restore();
  };

  function getCursorPosition(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return { x, y };
  }

  const paint = useCallback(
    (drawFunc) => {
      if (!context) return;
      drawFunc(context);
    },
    [context]
  );

  // function paint(drawFunc) {
  //   if (!context) return;
  //   drawFunc(context);
  // }

  //   useEffect(() => {
  //     window.addEventListener("resize", handleResizeWindow);

  //     return () => {
  //       window.removeEventListener("resize", handleResizeWindow);
  //     };
  //   });

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    setCanvas(canvas);
    const ctx = canvas.getContext("2d");

    setContext(ctx);

    let animationFrameId;

    const render = () => {
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return [
    canvasRef,
    paint,
    getCursorPosition,
    canvas,
    resizeCanvasToDisplaySize,
  ];
};
export default useCanvas;
