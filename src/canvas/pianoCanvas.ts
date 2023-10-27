function getKeyNumbers(start = 48, end = 83) {
  const whiteKeyNumbers: number[] = [];
  const blackKeyNumbers: number[] = [];

  for (let i = start; i <= end; i++) {
    const isBlackKey = [1, 3, 6, 8, 10].includes(i % 12);
    if (isBlackKey) {
      blackKeyNumbers.push(i);
    } else {
      whiteKeyNumbers.push(i);
    }
  }
  return {
    whiteKeyNumbers,
    blackKeyNumbers,
  };
}

CanvasRenderingContext2D.prototype.drawRoundedRect = function (
  x: number,
  y: number,
  width: number,
  height: number,
  cornerRadius: number
) {
  this.beginPath();
  this.moveTo(x + cornerRadius, y);
  this.lineTo(x + width - cornerRadius, y);
  this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius);
  this.lineTo(x + width, y + height - cornerRadius);
  this.quadraticCurveTo(
    x + width,
    y + height,
    x + width - cornerRadius,
    y + height
  );
  this.lineTo(x + cornerRadius, y + height);
  this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius);
  this.lineTo(x, y + cornerRadius);
  this.quadraticCurveTo(x, y, x + cornerRadius, y);
  this.closePath();
};

export function drawPianoKeyboard(
  canvas: HTMLCanvasElement,
  selectedNotes,
  scaleNoteNumbers
) {
  if (!canvas) {
    return;
  }
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  // Set up key sizes and positions
  const keyWidth = canvas.width / (3 * 7); // 3 octaves, 7 white keys per octave
  const keyHeight = canvas.height;
  const blackKeyWidth = keyWidth / 2;
  const blackKeyHeight = keyHeight * 0.6;
  const cornerRadius = canvas.width / 200;

  ctx.fillStyle = "white";
  ctx.drawRoundedRect(0, 0, canvas.width, keyHeight, cornerRadius);

  const { whiteKeyNumbers, blackKeyNumbers } = getKeyNumbers();

  // Calculate and draw white keys
  for (let i = 0; i < whiteKeyNumbers.length; i++) {
    const x = i * keyWidth;
    const y = 0;
    const width = keyWidth;
    const height = keyHeight;

    // Draw the shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.drawRoundedRect(x + 5, y + 5, width, height, cornerRadius); // Adjust the offset as needed

    // Choose correct fill color
    if (selectedNotes[whiteKeyNumbers[i]]) {
      ctx.fillStyle = "#d189fd";
    } else if (scaleNoteNumbers.includes(whiteKeyNumbers[i])) {
      ctx.fillStyle = "#ffdb83";
    } else {
      ctx.fillStyle = "white";
    }

    ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
    ctx.lineWidth = 3;

    ctx.drawRoundedRect(x, y, width, height, cornerRadius);

    ctx.fill();
    ctx.stroke();
  }

  let blackKeyIndex = 0;

  // Calculate and draw black keys
  for (let i = 0; i < 20; i++) {
    // Skip the positions of the black keys
    if ([0, 1, 3, 4, 5, 7].includes(i % 7)) {
      const x = i * keyWidth + (keyWidth - blackKeyWidth / 2);
      const y = 0;
      const width = blackKeyWidth;
      const height = blackKeyHeight;

      // Draw the shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.drawRoundedRect(x + (canvas.width / 600), y + (canvas.height / 100), width, height, cornerRadius); // Adjust the offset as needed

      // Choose correct fill color
      if (selectedNotes[blackKeyNumbers[blackKeyIndex]]) {
        ctx.fillStyle = "#d189fd";
      } else if (scaleNoteNumbers.includes(blackKeyNumbers[blackKeyIndex])) {
        ctx.fillStyle = "#ffdb83";
      } else {
        ctx.fillStyle = "black";
      }

      ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
      ctx.lineWidth = 2;

      ctx.drawRoundedRect(x, y, width, height, cornerRadius);

      ctx.fill();
      ctx.stroke();

      // Increment the black key index
      // This ensures that the correct key is highlighted
      blackKeyIndex++;
    }
  }
}
