export function drawUkuleleFretboard(canvas: HTMLCanvasElement) {
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  const numStrings = 3; // Number of strings
  const numFrets = 6;  // Number of frets

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const fretboardWidth = canvasWidth * 0.8;
  const fretboardHeight = canvasHeight * 1;

  // Calculate the width and height of each cell
  const cellWidth = fretboardWidth / numStrings;
  const cellHeight = fretboardHeight / (numFrets + 1);

  //draw the background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const startX = (canvasWidth - fretboardWidth) / 2
  const endX = (canvasWidth - fretboardWidth) / 2 + fretboardWidth;

  const startY = (canvasHeight - fretboardHeight) / 2;
  const endY = fretboardHeight + ((canvasHeight - fretboardHeight) / 2);

  // Draw the strings
  for (let i = 0; i <= numStrings; i++) {
      const x = i * cellWidth + startX;
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
      ctx.stroke();
  }

  // Draw the frets
  for (let i = 1; i <= numFrets; i++) {
      const y = i * cellHeight;
      ctx.strokeStyle = "black";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
  }
}

export function drawRedDot(canvas: HTMLCanvasElement, stringNumber, fretNumber) {
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  const numStrings = 3; // Number of strings
  const numFrets = 6;  // Number of frets

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  // Calculate the width and height of each cell
  const cellWidth = canvasWidth / numStrings;
  const cellHeight = canvasHeight / (numFrets + 1);

  // Calculate the coordinates for the dot
  const x = (stringNumber - 1) * cellWidth;
  const y = fretNumber * cellHeight + cellHeight / 2;

  // Draw the dot
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, 2 * Math.PI);
  ctx.fill();
}
