class Canvas {
  public ctx: CanvasRenderingContext2D;
  public tileSize: number = 64;
  public gridWidth: number = 12;
  public gridHeight: number = 22;
  public canvas: HTMLCanvasElement;

  constructor() {
    this.canvas = <HTMLCanvasElement>document.querySelector("#canvas1");
    if (!this.canvas) {
      throw new ReferenceError("Canvas not found");
    }
    this.canvas.width = this.gridWidth * this.tileSize + 384;
    this.canvas.height = this.gridHeight * this.tileSize;
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
  }
  draw(x: number, y: number, color: string): void {
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

  undraw(x: number, y: number): void {
    if (!this.ctx) {
      throw new ReferenceError("2d Context not found");
    }
    x = x * this.tileSize;
    y = y * this.tileSize;
    this.ctx.clearRect(x, y, this.tileSize, this.tileSize);
  }
  clearGrid(): void {
    if (!this.ctx || !this.canvas) {
      throw new ReferenceError("2d Context not found");
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

export default Canvas;
