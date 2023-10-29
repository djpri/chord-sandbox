// canvas.d.ts
interface CanvasRenderingContext2D {
  /**
   * Creates a rectangle object with rounded edges at the bottom, similar to the CSS `border-radius` property.
   * @param x The x-coordinate of the top-left corner of the rectangle.
   * @param y The y-coordinate of the top-left corner of the rectangle.
   * @param width The width of the rectangle.
   * @param height The height of the rectangle.
   * @param cornerRadius The radius of the rectangle.
   */
  drawRoundedRect(
    x: number,
    y: number,
    width: number,
    height: number,
    cornerRadius: number
  ): void;

  setShadow(): void;
}
