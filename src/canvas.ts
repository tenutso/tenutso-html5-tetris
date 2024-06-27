class Canvas {
  private ctx: CanvasRenderingContext2D | null;
  public gridSize = 64;
  public gridWidth = 12;
  public gridHeight = 22;
  constructor() {
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas1");
    if (!canvas) {
      throw new ReferenceError("Canvas not found");
    }
    canvas.width = this.gridWidth * this.gridSize;
    canvas.height = this.gridHeight * this.gridSize;
    this.ctx = canvas.getContext("2d");
  }
  draw(x: number, y: number, color: string) {
    if (!this.ctx) {
      throw new ReferenceError("2d Context not found");
    }
    x = x * this.gridSize;
    y = y * this.gridSize;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, 64, 64);
    this.ctx.strokeRect(x, y, 64, 64);
  }

  undraw(x: number, y: number) {
    if (!this.ctx) {
      throw new ReferenceError("2d Context not found");
    }
    x = x * this.gridSize;
    y = y * this.gridSize;
    this.ctx.clearRect(x, y, 64, 64);
  }
  clearGrid() {
    if (!this.ctx) {
      throw new ReferenceError("2d Context not found");
    }
    this.ctx.clearRect(
      0,
      0,
      this.gridWidth * this.gridSize,
      this.gridHeight * this.gridSize
    );
  }
}

export default Canvas;
