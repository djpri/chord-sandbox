import { drawPianoKeyboard } from "canvas/pianoCanvas";
import { useEffect, useRef } from "react";
import { useAppSelector } from "redux/hooks";

function PianoCanvasView() {
  const pianoState = useAppSelector((state) => state.piano);
  const keyboardRef = useRef<HTMLCanvasElement>(null);

  const handleMouseMove = (event) => {
    const canvas = document.getElementById(
      "keyboardCanvas"
    ) as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const mouse2dPosition = {
      x: x,
      y: y,
    };

    drawPianoKeyboard(
      canvas,
      pianoState.selectedKeys,
      pianoState.scaleNoteNumbers,
      mouse2dPosition
    );
  };

  const handleMouseLeave = () => {
    setNewCanvas();
  };

  function setNewCanvas() {
    const canvas = keyboardRef.current;
    if (!canvas) {
      return;
    }
    const parentWidth = canvas.parentElement?.clientWidth;
    if (parentWidth) {
      canvas.width = parentWidth * 0.8;
      canvas.height = (parentWidth * 0.8) / 5.5;
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

  useEffect(() => {
    setNewCanvas();
  }, [pianoState.selectedKeys]);

  return (
    <div id="keyboardCanvasContainer">
      <canvas
        ref={keyboardRef}
        id="keyboardCanvas"
        width="1200"
        height="200"
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onResize={setNewCanvas}
      ></canvas>
      {/* <canvas id="ukeleleCanvas" width="300" height="400"></canvas> */}
    </div>
  );
}

export default PianoCanvasView;
