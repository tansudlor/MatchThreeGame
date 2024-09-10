class GameLogic {
  colorTable = [];
  statusTable = [];
  constructor() {
    for (let i = 0; i < 64; i++) {
      this.colorTable[i] = (i % 6) + 1;
      this.statusTable[i] = "ready";
      if (i % 7 == 0) {
        this.colorTable[i] = 1;
      }
    }
    this.colorTable[4] = 3;
    this.colorTable[Math.trunc(Math.random() * 64) % 64] = 7;
    this.colorTable[Math.trunc(Math.random() * 64) % 64] = 8;
    this.colorTable[Math.trunc(Math.random() * 64) % 64] = 9;
  }

  getCell(x, y) {
    return { color: this.colorTable[y * 8 + x], status: this.statusTable[y * 8 + x] };
  }

  getCellByIndex(target) {
    return { color: this.colorTable[target], status: this.statusTable[target] };
  }

  setCell(x, y, color, status) {
    this.colorTable[y * 8 + x] = color;
    this.statusTable[y * 8 + x] = status;
  }
  setCellByIndex(target, color, status) {
    this.colorTable[target] = color;
    this.statusTable[target] = status;
  }

  swapCell(source, target) {
    console.log(source, target);
    this.printTable(this.colorTable);
    let result = null;
    let x = Math.trunc(source % 8);
    let y = Math.trunc(source / 8);
    if (x == 7 && target % 8 == 0) {
      return result;
    }
    if (x == 0 && target % 8 == 7) {
      return result;
    }

    if (!(target == y * 8 + x + 1 || target == y * 8 + x - 1 || target == (y + 1) * 8 + x || target == (y - 1) * 8 + x)) {
      return result;
    }
    result = this.checkAllowSwap(source, target);
    if (result != null) {
      let first = this.getCellByIndex(source);
      let second = this.getCellByIndex(target);
      this.setCellByIndex(source, second.color, second.status);
      this.setCellByIndex(target, first.color, first.status);
    }

    return result;
  }

  checkChain() {
    let testTable = Array.from(this.colorTable);
    let markTable = new Array(64).fill(0);
    let pairCount = 0;
    //Primary Mark
    for (let i = 0; i < 64; i++) {
      if (this.markCheck(i, testTable, markTable)) {
        pairCount++;
      }
    }
    //Secondary Mark (for Primary Mark not found pattern)
    for (let i = 0; i < 64; i++) {
      this.markCheck(i, testTable, markTable);
    }
    if (pairCount > 0) {
      return markTable;
    }
    return null;
  }

  checkAllowSwap(source, target) {
    if (target < 0) {
      console.log("1");
      return null;
    }
    let testTable = Array.from(this.colorTable);
    let markTable = new Array(64).fill(0);
    let temp = testTable[target];
    testTable[target] = testTable[source];
    testTable[source] = temp;
    let pairCount = 0;
    //Primary Mark
    for (let i = 0; i < 64; i++) {
      if (this.markCheck(i, testTable, markTable)) {
        pairCount++;
      }
    }
    //Secondary Mark (for Primary Mark not found pattern)
    for (let i = 0; i < 64; i++) {
      if (this.markCheck(i, testTable, markTable)) {
        pairCount++;
      }
    }
    if (pairCount > 0) {
      console.log("2");
      return markTable;
    }
    console.log("3");
    return null;
  }

  markCheck(cell, testTable, markTable) {
    let result = false;
    let x = Math.trunc(cell % 8);
    let y = Math.trunc(cell / 8);
    let markV = { up: -1, down: -1 };
    let markH = { left: -1, right: -1 };
    let up = (y - 1) * 8 + x;
    let down = (y + 1) * 8 + x;
    let left = y * 8 + x - 1;
    let right = y * 8 + x + 1;
    let color = testTable[cell];
    if (y > 0) {
      if (color == testTable[up] && color != 0) {
        if (markTable[up] == 3) {
          markTable[cell] = 3;
        }
        markV.up = up;
      }
    }
    if (y < 7) {
      if (color == testTable[down] && color != 0) {
        if (markTable[down] == 3) {
          markTable[cell] = 3;
        }
        markV.down = down;
      }
    }
    if (x > 0) {
      if (color == testTable[left] && color != 0) {
        if (markTable[left] == 3) {
          markTable[cell] = 3;
        }
        markH.left = left;
      }
    }
    if (x < 7) {
      if (color == testTable[right] && color != 0) {
        if (markTable[right] == 3) {
          markTable[cell] = 3;
        }
        markH.right = right;
      }
    }
    let pairCount = 0;
    for (const direction in markV) {
      if (markV[direction] != -1) {
        pairCount++;
      }
    }

    if (pairCount >= 2) {
      markTable[markV.up] = 3;
      markTable[markV.down] = 3;
      markTable[cell] = 3;
      result = true;
    }

    pairCount = 0;
    for (const direction in markH) {
      if (markH[direction] != -1) {
        pairCount++;
      }
    }

    if (pairCount >= 2) {
      markTable[markH.left] = 3;
      markTable[markH.right] = 3;
      markTable[cell] = 3;
      result = true;
    }
    console.log("4", pairCount);
    return result;
  }

  execute(markTable, effect) {
    for (const cell in markTable) {
      if (markTable[cell] == 3) {
        this.colorTable[cell] = 0;
      }
    }
    effect();
  }

  bomb(x, y, index) {
    console.log("bomb");
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        if (x == 0 && i == 0) {
          continue;
        }
        if (x == 7 && i == 2) {
          continue;
        }
        if (y == 0 && j == 0) {
          continue;
        }
        if (y == 7 && j == 2) {
          continue;
        }
        this.colorTable[(y - 1 + j) * 8 + (x - 1 + i)] = 0;
      }
    }
  }

  rocketHorizontal(x, y, index) {
    for (let i = 0; i < 8; i++) {
      this.colorTable[y * 8 + i] = 0;
    }
  }

  rocketVertical(x, y, index) {
    for (let i = 0; i < 8; i++) {
      this.colorTable[i * 8 + x] = 0;
    }
  }

  moveDown(colorTable) {
    let result = false;
    for (let i = 63; i >= 0; i--) {
      if (colorTable[i] == 0) {
        continue;
      }
      let x = Math.trunc(i % 8);
      let y = Math.trunc(i / 8);
      if (y < 7) {
        if (colorTable[(y + 1) * 8 + x] == 0) {
          colorTable[(y + 1) * 8 + x] = colorTable[i];
          colorTable[i] = 0;
          result = true;
        }
      }
    }
    return result;
  }

  refill() {
    for (let i = 63; i >= 0; i--) {
      if (this.colorTable[i] == 0) {
        this.colorTable[i] = (Math.trunc(Math.random() * 1000) % 6) + 1;
      }
    }
  }
  printTable(colorTable) {
    let table = "";
    for (let jj = 0; jj < 8; jj++) {
      for (let ii = 0; ii < 8; ii++) {
        table += colorTable[jj * 8 + ii] + "\t";
      }
      table += "\n";
    }
    console.log(table);
  }
}

class Game extends Phaser.Scene {
  row = 8;
  column = 8;
  cubeSize = 100;
  gameObjectMap = {};
  refHeightSize = 960;
  refWidthSize = 1920;
  first = null;
  second = null;
  gameSize = {};
  moveDown = false;
  state = "ready";
  markTable = null;
  ignoreState = 0;
  constructor() {
    super("Game");
  }

  preload() {
    // Load assets such as images
    this.load.image("background", "Assets/image/backgrounds/game_bg.webp");
    this.load.image("cube0", "Assets/image/standardBoardPieces/cube_blue.webp");
    this.load.image("cube1", "Assets/image/standardBoardPieces/cube_blue.webp");
    this.load.image("cube2", "Assets/image/standardBoardPieces/cube_green.webp");
    this.load.image("cube3", "Assets/image/standardBoardPieces/cube_orange.webp");
    this.load.image("cube4", "Assets/image/standardBoardPieces/cube_purple.webp");
    this.load.image("cube5", "Assets/image/standardBoardPieces/cube_red.webp");
    this.load.image("cube6", "Assets/image/standardBoardPieces/cube_yellow.webp");
    this.load.image("logo", "Assets/image/ui/logo.webp");
    this.load.image("cta", "Assets/image/ui/ctaButton.webp");
    this.load.image("endcard", "Assets/image/backgrounds/endcard_bg.webp");
    this.load.image("cube7", "Assets/image/boosters/bomb.webp");
    this.load.image("cube8", "Assets/image/boosters/RocketHorizontal.webp");
    this.load.image("cube9", "Assets/image/boosters/RocketVertical.webp");
  }

  logicLoop() {
    if (this.ignoreState-- > 0) {
      return;
    }
    if (this.state == "swap") {
      this.logic.execute(this.markTable, () => {
        this.ignoreState = 3;
        this.state = "movedown";
      });
    }
    if (this.state == "movedown") {
      let moveDown = this.logic.moveDown(this.logic.colorTable);
      if (!moveDown) {
        this.ignoreState = 10;
        this.state = "checkchain";
      }
    }
    if (this.state == "checkchain") {
      let chain = this.logic.checkChain();
      if (!chain) {
        this.ignoreState = 10;
        this.state = "refill";
      } else {
        this.logic.execute(chain, () => {
          this.ignoreState = 3;
          this.state = "movedown";
        });
      }
    }
    if (this.state == "refill") {
      this.logic.refill();
      this.ignoreState = 10;
      this.state = "checkchain_after_refill";
    }
    if (this.state == "checkchain_after_refill") {
      let chain = this.logic.checkChain();
      if (!chain) {
        this.markTable = null;
        this.state = "ready";
      } else {
        this.logic.execute(chain, () => {
          this.ignoreState = 3;
          this.state = "movedown";
        });
      }
    }
  }

  create() {
    this.logic = new GameLogic();
    setInterval(this.logicLoop.bind(this), 50);
    // Add the background image to the game
    this.background = this.add.image(this.scale.width / 2, this.scale.height / 2, "background");

    this.gameObjectMap.background = this.background;

    //Create New Container
    this.gameArea = this.add.container(0, 0);
    this.gameArea.portrait = (gameObject, scaleFactor, cubeSize) => {
      gameObject.setScale(scaleFactor);
    };
    this.gameArea.landscape = (gameObject, scaleFactor, cubeSize) => {
      gameObject.setScale(scaleFactor);
    };
    this.gameObjectMap.gameArea = this.gameArea;
    this.background.setOrigin(0.5, 0.5);
    this.backgroundMatch3Area = this.add.rectangle(-5, -5, 1200, 925, 0xffffff, 0.1);
    this.backgroundMatch3Area.setOrigin(0);
    this.gameArea.add(this.backgroundMatch3Area);

    //Create Displayboard
    this.match3Area = this.add.container(0, 0);
    for (let j = this.row - 1; j >= 0; j--) {
      for (let i = 0; i < this.column; i++) {
        this.cube = this.add.image(i * this.cubeSize + this.cubeSize / 2, j * this.cubeSize + this.cubeSize / 2, "cube0");
        this.cube.displayHeight = this.cubeSize;
        this.cube.displayWidth = this.cubeSize;
        this.cube.index = j * 8 + i;
        this.cube.setOrigin(0.5);
        this.cube.game = this;
        this.cube.update = (cube) => {
          let cubeData = this.logic.getCellByIndex(cube.index);
          cube.displayHeight = cube.game.cubeSize;
          cube.displayWidth = cube.game.cubeSize; //(cube.displayHeight / thcube.displayOriginY) * cube.displayOriginX;
          if (cubeData.color > 6) {
            cube.setScale(0.175);
          }
          cube.setTexture("cube" + cubeData.color);
          cube.setVisible(true);
          if (cubeData.color == 0) {
            cube.setVisible(false);
          }
        };
        this.cube.setInteractive();
        this.cube.on(
          "pointerdown",
          function () {
            if (this.game.state != "ready") {
              return;
            }

            let x = Math.trunc(this.index % 8);
            let y = Math.trunc(this.index / 8);
            if (this.game.logic.getCellByIndex(this.index).color == 7) {
              //bomb
              this.game.logic.bomb(x, y, this.index);
              this.game.state = "movedown";
              return;
            }
            if (this.game.logic.getCellByIndex(this.index).color == 8) {
              //RocketHorizontal
              this.game.logic.rocketHorizontal(x, y, this.index);
              this.game.state = "movedown";
              return;
            }
            if (this.game.logic.getCellByIndex(this.index).color == 9) {
              //RocketVertical
              this.game.logic.rocketVertical(x, y, this.index);
              this.game.state = "movedown";
              return;
            }

            this.game.first = this;
          },
          this.cube
        );
        this.cube.on(
          "pointerup",
          function () {
            if (this.game.first == null) {
              return;
            }
            if (this.game.first == this) {
              return;
            }
            if (this.game.state != "ready") {
              return;
            }

            this.game.second = this;
            this.game.markTable = this.game.logic.swapCell(this.game.first.index, this.game.second.index);
            if (this.game.markTable != null) {
              this.game.ignoreState = 5;
              this.game.state = "swap";
            }
          },
          this.cube
        );
        this.cube.on(
          "click",
          function () {
            console.log(this.index);
          },
          this.cube
        );
        this.match3Area.add(this.cube);
        this.gameObjectMap["cube" + (j * this.row + i)] = this.cube;
      }
    }
    this.match3Area.portrait = (gameObject, scaleFactor, cubeSize) => {
      gameObject.x = 0;
      gameObject.y = 400;
    };
    this.match3Area.landscape = (gameObject, scaleFactor, cubeSize) => {
      gameObject.x = 400;
      gameObject.y = 125;
    };
    this.gameArea.add(this.match3Area);
    this.gameObjectMap.match3Area = this.match3Area;

    //Create Logo
    this.logo = this.add.image(0, 0, "logo");
    this.logo.displayHeight = 300;
    this.logo.displayWidth = (this.logo.displayHeight / this.logo.displayOriginY) * this.logo.displayOriginX;
    this.logo.setOrigin(0, 0);
    this.gameObjectMap.logo = this.logo;
    this.logo.portrait = (gameObject, scaleFactor, cubeSize, contentWidth) => {
      gameObject.x = 0;
      gameObject.y = 0;
    };
    this.logo.landscape = (gameObject, scaleFactor, cubeSize, contentWidth) => {
      gameObject.x = 0;
      gameObject.y = 0;
    };
    this.gameArea.add(this.logo);

    //Create CTA Button
    this.ctaPlay = this.createCTAButton("Play Now!", "cta", () => {
      console.log("CTA Click");
    });
    this.ctaPlay.image.displayHeight = 125;
    this.ctaPlay.image.displayWidth = (this.ctaPlay.image.displayHeight / this.ctaPlay.image.displayOriginY) * this.ctaPlay.image.displayOriginX;
    this.ctaPlay.setSize(this.ctaPlay.image.displayWidth, this.ctaPlay.image.displayHeight);
    this.gameObjectMap.ctaPlay = this.ctaPlay;
    this.ctaPlay.portrait = (gameObject, scaleFactor, cubeSize, contentWidth) => {
      gameObject.x = 800 - gameObject.displayWidth / 2;
      gameObject.y = 225;
    };
    this.ctaPlay.landscape = (gameObject, scaleFactor, cubeSize, contentWidth) => {
      gameObject.x = 180;
      gameObject.y = 860;
    };

    this.gameArea.add(this.ctaPlay);

    //Create Goal Counter
    for (let i = 1; i < 7; i++) {
      this.createGoal("5/5", 90 + 135 * (i - 1), "cube" + i, (i - 1) * 135);
    }

    //Create End Card
    this.endCardArea = this.add.container(0, 0);
    this.endCardContent = this.add.container(0, 0);

    this.endCard = this.add.image(0, 0, "endcard");
    this.endCard.resize = (gameObject) => {
      gameObject.displayWidth = this.gameSize.width;
      gameObject.displayHeight = this.gameSize.height;
    };
    this.endCard.setOrigin(0);

    this.endCardArea.add(this.endCard);
    this.endCardArea.add(this.endCardContent);
    this.gameObjectMap.endCard = this.endCard;
    this.gameObjectMap.endCardContent = this.endCardContent;
    this.gameObjectMap.endCardArea = this.endCardArea;

    this.endCardLogo = this.add.image(0, 0, "logo");
    this.endCardLogo.setScale(0.25);
    this.endCardLogo.x = 0;
    this.endCardLogo.y = 0;
    this.endCardLogo.setOrigin(0);

    this.gameObjectMap.endCardLogo = this.endCardLogo;
    this.endCardContent.add(this.endCardLogo);

    this.ctaEndCardPlay = this.createCTAButton("Play Now!", "cta", () => {
      console.log("ctaEndCardPlay Click");
    });

    this.ctaEndCardPlay.setScale(0.25);
    this.ctaEndCardPlay.text.setStyle({ fontSize: "80px" });
    this.ctaEndCardPlay.x = this.endCardLogo.displayWidth / 2;
    this.ctaEndCardPlay.y = 280;
    this.gameObjectMap.ctaEndCardPlay = this.ctaEndCardPlay;

    this.endCardContent.add(this.ctaEndCardPlay);
    this.endCardArea.setVisible(false);

    this.endCardContent.resize = (gameObject, scaleFactor, gameSize) => {
      let scale = scaleFactor * 2;
      gameObject.setScale(scale);
      gameObject.width = this.endCardLogo.displayWidth * scale;
      gameObject.height = 350 * scale;
      gameObject.x = (gameSize.width - gameObject.width) / 2;
      gameObject.y = (gameSize.height - gameObject.height) / 2;
    };

    this.scale.on("resize", this.resize, this);

    this.resize({ width: innerWidth, height: innerHeight });
  }

  resize(gameSize, baseSize, displaySize, resolution) {
    this.gameSize = gameSize;
    let areaSizeFactor = 0.97;
    const width = gameSize.width;
    const height = gameSize.height;
    //console.log(width, height);

    this.background.displayWidth = width;
    this.background.displayHeight = height;

    // Adjust the position of the background when the window is resized
    this.background.setPosition(width / 2, height / 2);

    for (const key in this.gameObjectMap) {
      const element = this.gameObjectMap[key];

      if (gameSize.width < gameSize.height) {
        this.gameArea.width = 800;
        this.gameArea.height = 1300;
        this.backgroundMatch3Area.setSize(this.gameArea.width + 10, this.gameArea.height - 100 + 10);
        let scaleFactor = (gameSize.width / this.gameArea.width) * areaSizeFactor;
        if (scaleFactor * this.gameArea.height > gameSize.height) {
          scaleFactor = (gameSize.height / this.gameArea.height) * areaSizeFactor;
        }
        let cubeSize = this.cubeSize * scaleFactor;
        let contentWidth = this.column * this.cubeSize + this.cubeSize / 2 - this.logo.x - this.logo.displayWidth / 2;
        this.gameArea.x = (gameSize.width - this.gameArea.width * scaleFactor) / 2;
        this.gameArea.y = 75; //(gameSize.height - this.gameArea.height * scaleFactor) / 2;
        element.resize ? element.resize(element, scaleFactor, gameSize) : null;
        element.portrait ? element.portrait(element, scaleFactor, cubeSize, contentWidth) : null;
      } else {
        this.gameArea.width = 1200;
        this.gameArea.height = 925;
        this.backgroundMatch3Area.setSize(this.gameArea.width + 10, this.gameArea.height + 10);
        let scaleFactor = (gameSize.width / this.gameArea.width) * areaSizeFactor;
        if (scaleFactor * this.gameArea.height > gameSize.height) {
          scaleFactor = (gameSize.height / this.gameArea.height) * areaSizeFactor;
        }
        let cubeSize = this.cubeSize * scaleFactor;
        let contentWidth = this.column * this.cubeSize + this.cubeSize / 2 - this.logo.x - this.logo.displayWidth / 2;
        this.gameArea.x = (gameSize.width - this.gameArea.width * scaleFactor) / 2;
        this.gameArea.y = (gameSize.height - this.gameArea.height * scaleFactor) / 2;
        element.resize ? element.resize(element, scaleFactor, gameSize) : null;
        element.landscape ? element.landscape(element, scaleFactor, cubeSize, contentWidth) : null;
      }
    }
  }

  update() {
    for (const key in this.gameObjectMap) {
      const element = this.gameObjectMap[key];
      if (element.update != null) {
        element.update(element);
      }
    }
  }

  createCTAButton(caption, img, callback) {
    let container = this.add.container(0, 0);

    // เพิ่ม image เข้าไปใน container
    let image = this.add.image(0, 0, img);
    image.setOrigin(0.5);
    container.add(image);
    container.image = image;
    // เพิ่มข้อความ (child) เข้าไปใน container
    let text = this.add.text(0, 0, caption, {
      font: "32px FredokaOne",
      fill: "#ffffff",
      align: "center",
    });
    text.setOrigin(0.5); // ตั้งให้ข้อความอยู่กึ่งกลางของ image
    container.add(text);
    container.text = text;
    // ตั้งค่า interactive ให้ container (รวมถึง image และ text)
    //container.setSize(image.displayWidth * container.scale, image.displayHeight * container.scale); // กำหนดขนาดให้ container ตามขนาดของ image
    image.setInteractive();

    image.on("pointerdown", callback);
    return container;
  }

  createGoal(caption, captionX, img, imgX) {
    let cubeY = -75;
    let cubeSize = 60;
    let cubeGoal = this.add.image(imgX, cubeY, img);
    cubeGoal.setOrigin(0);
    cubeGoal.displayHeight = cubeSize;
    cubeGoal.displayWidth = cubeSize;
    this.match3Area.add(cubeGoal);
    let goalCounter = this.add.text(captionX, cubeY + cubeSize / 2, caption, {
      font: "700 32px FredokaOne",
      fill: "#ffffff",
      align: "center",
    });
    goalCounter.setOrigin(0.5);
    this.match3Area.add(goalCounter);

    let goal = {};
    goal.cubeGoal = cubeGoal;
    goal.goalCounter = goalCounter;
    return goal;
  }
}

// Phaser configuration
const config = {
  type: Phaser.AUTO, // Use WebGL or Canvas depending on what's supported
  backgroundColor: "#2d2d2d", // Background color
  scene: Game,
  scale: {
    mode: Phaser.Scale.RESIZE, // Automatically resize according to screen size
    autoCenter: Phaser.Scale.CENTER_BOTH, // Center both horizontally and vertically
  },
};

const game = new Phaser.Game(config);
