CanvasRenderingContext2D.prototype.setShadow = function () {
  // Draw the shadow
  this.fillStyle = "rgba(0, 0, 0, 0.8)";
  // Set shadow properties
  this.shadowColor = "rgba(0, 0, 0, 0.5)"; // Shadow color with alpha
  this.shadowBlur = 5; // Blur radius
  this.shadowOffsetX = 5; // X-axis shadow offset
  this.shadowOffsetY = 5; // Y-axis shadow offset
};

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

  this.fill();
  this.stroke();
};

export {}