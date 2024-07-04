import "./style.css";
import GameCanvas from "./canvas";
import { Tetrimino } from "./shapes";

const gameCanvas = new GameCanvas();
let gameGrid: any = [];
let t: any;
let nextShape: any;
let score = 0;
let level = 1;
let speed= 500;
let dropLoopInterval = null;

function createGameGrid() {
  let row = [];
  for (let i = 0; i < gameCanvas.gridHeight; i++) {
    for (let j = 0; j < gameCanvas.gridWidth; j++) {
      row[j] = 0;
    }
    gameGrid[i] = row;
  }
}

function drawShape(shapeObj: any) {
  const { x, y, color, currentRotation, rotations } = shapeObj;
  const cr = currentRotation;
  const shapeMap = rotations[cr];

  for (let i = 0; i < shapeMap.length; i++) {
    for (let j = 0; j < shapeMap[i].length; j++) {
      if (shapeMap[i][j]) {
        gameCanvas.draw(x + j, y + i, color);
      }
    }
  }
}

function isCollide(shape: any, dest: string): string | boolean {
  const { x, y, currentRotation, rotations } = shape;
  // Wait until shape appears on the grid
  if (y < 0) return false;

  for (let h = 0; h < rotations[currentRotation].length; h++) {
    for (let w = 0; w < rotations[currentRotation][h].length; w++) {
      // check if grid box below shape is free

      switch (dest) {
        case "Below":
          if (
            rotations[currentRotation][h][w] === 1 &&
            gameGrid[y + h + 1][x + w]
          ) {
            return true;
          }
          break;
        case "Left":
          if (
            rotations[currentRotation][h][w] === 1 &&
            gameGrid[y + h][x + w - 1]
          ) {
            return true;
          }
          break;
        case "Right":
          if (
            rotations[currentRotation][h][w] === 1 &&
            gameGrid[y + h][x + w + 1]
          ) {
            return true;
          }
          break;
      }
    }
  }
  return false;
}

function addToGrid(shape: any) {
  const { x, y, code, currentRotation: cr, rotations } = shape;

  for (let h = 0; h < rotations[cr].length; h++) {
    for (let w = 0; w < rotations[cr][h].length; w++) {
      if (rotations[cr][h][w] === 1) {
        let row = y + h;
        let col = x + w;
        gameGrid[row] = gameGrid[row].map(
          (item: typeof gameGrid, index: number) => {
            if (index === col) {
              return code;
            } else {
              return item;
            }
          }
        );
      }
    }
  }
  console.log("GRID", gameGrid);
}

const shapes = ["I", "J", "L", "O", "S", "T", "Z"];

function spawnNewShape() {
  const pieces: Array<string> = shapes;
  let piece;
  let r;
  // spawn a new shape
  if (nextShape) {
    t = nextShape;
  } else {
    r = Math.floor(Math.random() * pieces.length);
    piece = pieces[r];
    t = new Tetrimino(piece);
  }

  r = Math.floor(Math.random() * shapes.length);
  piece = shapes[r];
  nextShape = new Tetrimino(piece);
}

//create game grid
createGameGrid();

//create first shape
spawnNewShape();

// generate shapes on a timer
const dropLoop = () => {
  move("down");
  if (gameGrid[0].find((item: string) => item)) clearInterval(dropLoop);
};

dropLoopInterval = setInterval(dropLoop, speed);

document.onkeydown = function ({ code }) {
  if (code === "ArrowRight") {
    move("right");
  } else if (code === "ArrowLeft") {
    move("left");
  } else if (code === "ArrowDown") {
    if (t.currentShape.y > 0)
    move("down");
  } else if (code === "Space") {
    move("rotate");
  }
};

const redrawGrid = () => {
  gameCanvas.clearGrid();
  for (let y = 0; y < gameGrid.length; y++) {
    for (let x = 0; x < gameGrid[y].length; x++) {
      if (gameGrid[y][x]) {
        let code = gameGrid[y][x];
        //console.log(t.currentShape.getShape(code));
        let color = t.shapes[code].color; //Tetrimino::getShape(code).color;
        gameCanvas.draw(x, y, color);
      }
    }
  }
};

const checkCompleteLines = () => {
  let count = 0;

  for (let y = 0; y < gameGrid.length; y++) {
    for (let x = 0; x < gameGrid[y].length; x++) {
      if (gameGrid[y][x]) count++;
      if (count === gameCanvas.gridWidth) {
        score += 100;
        if (score === 2000) {
          level = 2;
          speed = 400;
          clearInterval(dropLoopInterval);
          dropLoopInterval = setInterval(dropLoop, speed);
        } else if (score === 4000) {
          level = 3;
          speed = 300;
          clearInterval(dropLoopInterval);
          dropLoopInterval = setInterval(dropLoop, speed);
     
        } else if (score === 6000) {
          level = 4;
          speed = 200;
          clearInterval(dropLoopInterval);
          dropLoopInterval = setInterval(dropLoop, speed);
     
        } else if (score === 8000) {
          level = 5;
          speed = 150;
          clearInterval(dropLoopInterval);
          dropLoopInterval = setInterval(dropLoop, speed);
     
        } else if (score === 10000) {
          level = 6;
          
        }
        count = 0;
        gameGrid.splice(y, 1);
        gameGrid.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        //gameGrid.splice(0, 0, [0].fill(0, 0, gameCanvas.gridWidth));
        redrawGrid();
      }
    }
    count = 0; // reset for next row
  }
};

function move(dir: string) {
  let x = t.currentShape.x;
  let y = t.currentShape.y;
  let c = t.currentShape.currentRotation;
  let w = t.currentShape.rotations[c][0].length;
  let h = t.currentShape.rotations[c].length;
  let r = t.currentShape.rotations.length - 1;

  switch (dir) {
    case "right":
      if (x + w < gameCanvas.gridWidth && !isCollide(t.currentShape, "Right"))
        t.currentShape.x += 1;
      break;
    case "left":
      if (x > 0 && !isCollide(t.currentShape, "Left")) t.currentShape.x -= 1;
      break;
    case "down":
      if (
        y + h === gameCanvas.gridHeight ||
        isCollide(t.currentShape, "Below")
      ) {
        addToGrid(t.currentShape);
        spawnNewShape();
      } else {
        
          t.currentShape.y += 1;
      }
      break;
    case "rotate":
      if (
        isCollide(t.currentShape, "Right") ||
        isCollide(t.currentShape, "Left")
      ) {
        return;
      }

      // TODO: don't rotate if collision affects rotation
      if (t.currentShape.currentRotation === r) {
        t.currentShape.currentRotation = 0;
      } else t.currentShape.currentRotation += 1;
      break;
  }
}

function drawNextShape() {
  gameCanvas.ctx.beginPath();
  gameCanvas.ctx.lineWidth=7;

  gameCanvas.ctx.strokeStyle = "white";

  gameCanvas.ctx.strokeRect(
    gameCanvas.canvas.width - 384,
    0,
    384,
    gameCanvas.canvas.height
  );
  gameCanvas.ctx.fillStyle = "#444444";

  gameCanvas.ctx.fillRect(gameCanvas.canvas.width-384, 0, 384, gameCanvas.canvas.height)

  gameCanvas.ctx.font = "50px Arial";
  gameCanvas.ctx.fillStyle = "white";
  gameCanvas.ctx?.fillText("Next Piece", gameCanvas.canvas.width - 300, 80);
  gameCanvas.ctx?.fillText("Score", gameCanvas.canvas.width - 250, 480);
  gameCanvas.ctx?.fillText(score, gameCanvas.canvas.width - 250, 580);

  gameCanvas.ctx?.fillText("Level", gameCanvas.canvas.width - 250, 880);
  gameCanvas.ctx?.fillText(level, gameCanvas.canvas.width - 250, 980);

  gameCanvas.ctx.closePath();
  // gameCanvas.ctx?.fillText(
  //   nextShape.currentShape.code,
  //   gameCanvas.canvas.width - 150,
  //   140
  // );
  const next = structuredClone(nextShape.currentShape)
  let offsetx = 3 - Math.floor(next.rotations[next.currentRotation][0].length / 2);
  next.x=gameCanvas.gridWidth + offsetx;
  next.y=2;
  drawShape(next);
}

// GAME LOOP
setInterval(() => {
  checkCompleteLines();
  redrawGrid();
  drawShape(t.currentShape);
  drawNextShape();
}, 10);
