class Canvas {
  private ctx: CanvasRenderingContext2D | null;
  public tileSize = 64;
  public gridWidth = 12;
  public gridHeight = 22;
  
  constructor() {
    this.canvas = document.querySelector<HTMLCanvasElement>("#canvas1");
    if (!this.canvas) {
      throw new ReferenceError("Canvas not found");
    }
    this.canvas.width = this.gridWidth * this.tileSize + 350;
    this.canvas.height = this.gridHeight * this.tileSize;
    this.ctx = this.canvas.getContext("2d");
  }
  draw(x: number, y: number, color: string) {
    if (!this.ctx) {
      throw new ReferenceError("2d Context not found");
    }
    x = x * this.tileSize;
    y = y * this.tileSize;
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = "black";
    this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
    this.ctx.strokeRect(x, y, this.tileSize, this.tileSize);
  }

  undraw(x: number, y: number) {
    if (!this.ctx) {
      throw new ReferenceError("2d Context not found");
    }
    x = x * this.tileSize;
    y = y * this.tileSize;
    this.ctx.clearRect(x, y, this.tileSize, this.tileSize);
  }
  clearGrid() {
    if (!this.ctx) {
      throw new ReferenceError("2d Context not found");
    }
    this.ctx.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }
  
}

export default Canvas;
