import "./style.css";
import GameCanvas from "./canvas";
import { Tetrimino } from "./shapes";

const gameCanvas = new GameCanvas();
let gameGrid: any = [];
let t: any;

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

function getShapeHeight(shape: any) {
  const cr = shape.currentRotation;
  return shape.rotations[cr].length;
}

function getShapeWidth(shape: any) {
  const cr = shape.currentRotation;
  return shape.rotations[cr][0].length;
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

function checkFloorBoundry(shape: any) {
  const { y } = shape;
  // world boundies - floor
  if (y + getShapeHeight(shape) === gameCanvas.gridHeight) return true;
  // world boundies - left and right
}

function checkRightBoundry(shape: any) {
  const { x } = shape;
  if (x + getShapeWidth(shape) === gameCanvas.gridWidth) {
    return true;
  }
}

function checkLeftBoundry(shape: any) {
  const { x } = shape;
  if (x === 0) {
    return true;
  }
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

function spawnNewShape() {
  const pieces: Array<string> = ["L", "J", "I", "O"];
  // spawn a new shape
  const r = Math.floor(Math.random() * pieces.length);
  let piece = pieces[r];
  t = new Tetrimino(piece);
}

//create game grid
createGameGrid();

//create first shape
spawnNewShape();

// generate shapes on a timer
const dropLoop = setInterval(() => {
  // spawn a new shape only when no peices are in play
  if (checkFloorBoundry(t.currentShape) || isCollide(t.currentShape, "Below")) {
    addToGrid(t.currentShape);
    spawnNewShape();
  } else {
    // move shape down the grid
    t.currentShape.y += 1;
  }
  if (gameGrid[0].find((item: string) => item)) clearInterval(dropLoop);
}, 500);

//const shapes = ["I", "J", "L", "O", "S", "T", "Z"];

document.onkeydown = function ({ code }) {
  if (code === "ArrowRight") {
    if (
      checkRightBoundry(t.currentShape) ||
      isCollide(t.currentShape, "Right")
    ) {
      return;
    }
    t.currentShape.x += 1;
    //renderShape(t.currentShape);
  } else if (code === "ArrowLeft") {
    if (checkLeftBoundry(t.currentShape) || isCollide(t.currentShape, "Left")) {
      return;
    }
    t.currentShape.x -= 1;
    //renderShape(t.currentShape);
  } else if (code === "ArrowDown") {
    if (
      checkFloorBoundry(t.currentShape) ||
      isCollide(t.currentShape, "Below")
    ) {
      addToGrid(t.currentShape);
      spawnNewShape();
    } else {
      t.currentShape.y += 1;
      //renderShape(t.currentShape);
    }
  } else if (code === "Space") {
    // TODO: don't rotate if collision affects rotation
    if (t.currentShape.currentRotation == 3) {
      t.currentShape.currentRotation = 0;
    } else t.currentShape.currentRotation += 1;
    //renderShape(t.currentShape);
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
  let myEvent = new Event("customEventName");

  for (let y = 0; y < gameGrid.length; y++) {
    for (let x = 0; x < gameGrid[y].length; x++) {
      if (gameGrid[y][x]) count++;
      if (count === gameCanvas.gridWidth) {
        //alert("Event Triggered");
        //window.dispatchEvent(myEvent);
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

window.addEventListener("customEventName", function (e) {
  alert("Event Triggered");
  // redraw grid here
});

// GAME LOOP
setInterval(() => {
  checkCompleteLines();
  redrawGrid();
  drawShape(t.currentShape);
}, 10);
