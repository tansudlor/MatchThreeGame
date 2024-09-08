class Game extends Phaser.Scene {
  row = 8;
  column = 8;
  cubeSize = 100;
  gameObjectMap = {};
  refHeightSize = 960;
  refWidthSize = 1920;
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
  }

  create() {
    // Add the background image to the game
    this.background = this.add.image(this.scale.width / 2, this.scale.height / 2, "background");
    this.background.setOrigin(0.5, 0.5);
    this.gameObjectMap.background = this.background;

    //Create New Container
    this.gameArea = this.add.container(0, 0);
    this.gameArea.portrait = (gameObject, scaleFactor, cubeSize) => {
      gameObject.setScale(scaleFactor, scaleFactor);
      gameObject.x = this.scale.width / 2 - (cubeSize * this.column) / 2 + cubeSize / 2;
      gameObject.y = this.scale.height / 2 - (cubeSize * this.row) / 2 + cubeSize / 2;
    };
    this.gameArea.landscape = (gameObject, scaleFactor, cubeSize) => {
      let landscapeOffset = cubeSize * this.column * scaleFactor;
      gameObject.setScale(scaleFactor);
      //gameObject.x = this.scale.width / 2;
      //gameObject.y = this.scale.height * 0.2;
    };
    this.gameObjectMap.gameArea = this.gameArea;

    //Create Displayboard
    this.match3Area = this.add.container(0, 0);
    this.backgroundMatch3Area = this.add.graphics();
    this.backgroundMatch3Area.fillStyle(0xff0000, 0); // สีแดง (0xff0000), ความโปร่งใส 1 (ทึบเต็มที่)
    this.backgroundMatch3Area.fillRect(0, 0, 1200, 925); // สร้างสี่เหลี่ยมขนาด 300x300 ที่ตำแหน่ง (0,0) //12
    this.match3Area.add(this.backgroundMatch3Area);
    for (let j = 0; j < this.row; j++) {
      for (let i = 0; i < this.column; i++) {
        this.cube = this.add.image(i * this.cubeSize + 400, j * this.cubeSize + 125, "cube0");
        this.cube.displayHeight = this.cubeSize;
        this.cube.displayWidth = this.cubeSize;
        this.cube.setOrigin(0, 0);
        this.match3Area.add(this.cube);
        this.gameObjectMap["cube" + (j * this.row + i)] = this.cube;
      }
    }

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
      gameObject.x = 180;
      gameObject.y = 860;
    };
    this.ctaPlay.landscape = (gameObject, scaleFactor, cubeSize, contentWidth) => {
      gameObject.x = 180;
      gameObject.y = 860;
    };

    this.gameArea.add(this.ctaPlay);

    //Create Goal Counter Text

    /*this.goalCounter = this.add.text(0, 0, "LeveL", {
      font: "32px FredokaOne",
      fill: "#ffffff",
      align: "center",
    });
    this.goalCounter.setOrigin(0, 0);
    this.gameObjectMap.goalCounter = this.goalCounter;
    this.goalCounter.portrait = (gameObject, scaleFactor, cubeSize, contentWidth) => {
      gameObject.setScale(scaleFactor, scaleFactor);
      gameObject.x = this.scale.width / 2 - (cubeSize * this.column) / 2 + cubeSize / 2;
      gameObject.y = this.scale.height / 2 - (cubeSize * this.row) / 2 + cubeSize / 2;
    };
    this.goalCounter.landscape = (gameObject, scaleFactor, cubeSize, contentWidth) => {
      gameObject.x = this.logo.displayWidth + (this.column / 2) * cubeSize;
      gameObject.setFontSize(32 * scaleFactor * 1.35);
      gameObject.y = 60 * scaleFactor;
    };*/

    this.scale.on("resize", this.resize, this);
    this.resize({ width: innerWidth, height: innerHeight });
  }

  resize(gameSize, baseSize, displaySize, resolution) {
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
        /*let scaleFactor = gameSize.height / this.refHeightSize;
        let cubeSize = this.cubeSize * scaleFactor;
        let contentWidth = this.logo.displayWidth + this.column * cubeSize;
        this.gameArea.x = (gameSize.width - this.gameArea.width * scaleFactor) / 2;
        this.gameArea.y = (gameSize.height - this.gameArea.height * scaleFactor) / 2;*/
        this.gameArea.width = 800;
        this.gameArea.height = 1300;
        let scaleFactor = gameSize.width / this.gameArea.width;
        if (scaleFactor * this.gameArea.height > gameSize.height) {
          scaleFactor = gameSize.height / this.gameArea.height;
        }
        let cubeSize = this.cubeSize * scaleFactor;
        let contentWidth = this.column * this.cubeSize + this.cubeSize / 2 - this.logo.x - this.logo.displayWidth / 2;
        this.gameArea.x = (gameSize.width - this.gameArea.width * scaleFactor) / 2;
        this.gameArea.y = (gameSize.height - this.gameArea.height * scaleFactor) / 2;
        element.portrait ? element.portrait(element, scaleFactor, cubeSize, contentWidth) : null;
      } else {
        this.gameArea.width = 1200;
        this.gameArea.height = 925;
        let scaleFactor = gameSize.width / this.gameArea.width;
        if (scaleFactor * this.gameArea.height > gameSize.height) {
          scaleFactor = gameSize.height / this.gameArea.height;
        }
        let cubeSize = this.cubeSize * scaleFactor;
        let contentWidth = this.column * this.cubeSize + this.cubeSize / 2 - this.logo.x - this.logo.displayWidth / 2;
        this.gameArea.x = (gameSize.width - this.gameArea.width * scaleFactor) / 2;
        this.gameArea.y = (gameSize.height - this.gameArea.height * scaleFactor) / 2;
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
    container.setSize(image.width, image.height); // กำหนดขนาดให้ container ตามขนาดของ image
    container.setInteractive();

    container.on("pointerdown", callback);
    return container;
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
