interface shapesT {
  [index: string]: shapeT;
}

export type shapeT = {
  x: number;
  y: number;
  currentRotation: number;
  color: string;
  code: string;
  rotations: Array<Array<Array<number>>>;
};

export class Tetrimino {
  private homePosX = 5;
  private homePosY = -3;
  public currentShape: shapeT;
  public shapes: shapesT = {
    J: {
      x: this.homePosX,
      y: this.homePosY,
      currentRotation: 0,
      code: "J",
      color: "blue",
      rotations: [
        [
          [1, 0, 0],
          [1, 1, 1],
        ],
        [
          [1, 1],
          [1, 0],
          [1, 0],
        ],
        [
          [1, 1, 1],
          [0, 0, 1],
        ],
        [
          [0, 1],
          [0, 1],
          [1, 1],
        ],
      ],
    },
    L: {
      x: this.homePosX,
      y: this.homePosY,
      currentRotation: 0,
      color: "orange",
      code: "L",
      rotations: [
        [
          [0, 0, 1],
          [1, 1, 1],
        ],
        [
          [1, 0],
          [1, 0],
          [1, 1],
        ],
        [
          [1, 1, 1],
          [1, 0, 0],
        ],
        [
          [1, 1],
          [0, 1],
          [0, 1],
        ],
      ],
    },
    I: {
      x: this.homePosX,
      y: this.homePosY,
      currentRotation: 0,
      color: "cyan",
      code: "I",
      rotations: [
        [[1], [1], [1], [1]],
        [[1, 1, 1, 1]],
        [[1], [1], [1], [1]],
        [[1, 1, 1, 1]],
      ],
    },
    O: {
      x: this.homePosX,
      y: this.homePosY,
      currentRotation: 0,
      color: "yellow",
      code: "O",
      rotations: [
        [
          [1, 1],
          [1, 1],
        ],
      ],
    },
  };
  constructor(code: string) {
    this.currentShape = this.shapes[code];
  }
}
