export function getKeyNumbers(start = 48, end = 83) {
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
  this.lineTo(x + width, y);
  this.lineTo(x + width, y + height - cornerRadius);
  this.quadraticCurveTo(
    x + width,
    y + height,
    x + width - cornerRadius,
    y + height
  );
  this.lineTo(x + cornerRadius, y + height);
  this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius);
  this.lineTo(x, y + height - cornerRadius);
  this.lineTo(x, y + cornerRadius);
  this.lineTo(x, y);
  this.closePath();
};

export function drawPianoKeyboard(
  canvas: HTMLCanvasElement,
  selectedNotes,
  scaleNoteNumbers,
  currentMousePosition?: {
    x: number;
    y: number;
  }
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
  const hoverKeyColor = "gray";
  
  // Draw the background
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

    // Set shadow properties
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)"; // Shadow color with alpha
    ctx.shadowBlur = 5; // Blur radius
    ctx.shadowOffsetX = 5; // X-axis shadow offset
    ctx.shadowOffsetY = 5; // Y-axis shadow offset
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

    // Check if mouse is over key
    let isMouseOverKey = false;
    if (currentMousePosition) {
      const mouseInBottomHalf = currentMousePosition.y >= blackKeyHeight;

      const blackKeyOnLeft = i % 7 === 2 || i % 7 === 6;
      const blackKeyOnRight = i % 7 === 0 || i % 7 === 3;
      const blackKeyOnBothSides = i % 7 === 1 || i % 7 === 4 || i % 7 === 5;

      if (!mouseInBottomHalf) {
        // C and F notes have a black key on the right
        if (
          blackKeyOnRight &&
          currentMousePosition.x >= x &&
          currentMousePosition.x <= x + width - blackKeyWidth / 2
        ) {
          isMouseOverKey = true;
        }

        // E and B notes have a black key on the left
        if (
          blackKeyOnLeft &&
          currentMousePosition.x >= x + blackKeyWidth / 2 &&
          currentMousePosition.x <= x + width
        ) {
          isMouseOverKey = true;
        }

        // D, F and G notes have a black key on both sides
        if (
          blackKeyOnBothSides &&
          currentMousePosition.x >= x + blackKeyWidth / 2 &&
          currentMousePosition.x <= x + width - blackKeyWidth / 2
        ) {
          isMouseOverKey = true;
        }
      }

      if (mouseInBottomHalf) {
        isMouseOverKey =
          currentMousePosition.x >= x && currentMousePosition.x <= x + width;
      }

      if (isMouseOverKey) {
        ctx.fillStyle = hoverKeyColor;
      }
    }

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
      ctx.drawRoundedRect(
        x + canvas.width / 600,
        y + canvas.height / 100,
        width,
        height,
        cornerRadius
      ); // Adjust the offset as needed

      // Choose correct fill color
      if (selectedNotes[blackKeyNumbers[blackKeyIndex]]) {
        ctx.fillStyle = "#d189fd";
      } else if (scaleNoteNumbers.includes(blackKeyNumbers[blackKeyIndex])) {
        ctx.fillStyle = "#ffdb83";
      } else {
        ctx.fillStyle = "#212121";
      }

      ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
      ctx.lineWidth = 2;

      // check if mouse is over key
      if (currentMousePosition) {
        const mouseInTopHalf = currentMousePosition.y <= blackKeyHeight;
        const isMouseOverKey =
          currentMousePosition.x >= x &&
          currentMousePosition.x <= x + width &&
          mouseInTopHalf;
        if (isMouseOverKey) {
          ctx.fillStyle = hoverKeyColor;
        }
      }

      ctx.drawRoundedRect(x, y, width, height, cornerRadius);

      ctx.fill();
      ctx.stroke();

      // Increment the black key index
      // This ensures that the correct key is highlighted
      blackKeyIndex++;
    }
  }

  // remove shadow properties
  // ctx.shadowColor = "rgba(0, 0, 0, 0)";
  // ctx.shadowBlur = 0;
  // ctx.shadowOffsetX = 0;
  // ctx.shadowOffsetY = 0;

  // Draw red bar along top
  ctx.strokeStyle = "#e63333";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(canvas.width, 0);
  ctx.stroke();
}
