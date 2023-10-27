import { drawPianoKeyboard } from "canvas/pianoCanvas";
import { useEffect } from "react";
import { useAppSelector } from "redux/hooks";

function PianoCanvasView() {
  const pianoState = useAppSelector((state) => state.piano);

  useEffect(() => {
    // get width of parent element
    const canvas = document.getElementById(
      "keyboardCanvas"
    ) as HTMLCanvasElement;
    
    function setNewCanvas() {
      const parentWidth = canvas.parentElement?.clientWidth;
      if (parentWidth) {
        canvas.width = parentWidth * 0.8;
        canvas.height = (parentWidth * 0.8) / 6;
      } else {
        canvas.width = 1200;
        canvas.height = 200;
      }
      drawPianoKeyboard(
        canvas,
        pianoState.selectedKeys,
        pianoState.scaleNoteNumbers
      );
    }

    window.addEventListener("resize", setNewCanvas);

    setNewCanvas();

    return () => {
      window.removeEventListener("resize", setNewCanvas);
    };
    // if (document.getElementById("ukeleleCanvas")) {
    //   const canvas = document.getElementById(
    //     "ukeleleCanvas"
    //   ) as HTMLCanvasElement;
    //   drawUkuleleFretboard(canvas);
    //   drawRedDot(canvas, 4, 5);
    // }
  }, [pianoState.selectedKeys]);
  return (
    <div id="keyboardCanvasContainer">
      <canvas id="keyboardCanvas" width="1200" height="200"></canvas>
      {/* <canvas id="ukeleleCanvas" width="300" height="400"></canvas> */}
    </div>
  );
}

export default PianoCanvasView;
