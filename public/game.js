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
      //gameObject.setScale(scaleFactor, scaleFactor);
      //gameObject.x = this.scale.width / 2;
      //gameObject.y = this.scale.height * 0.2;
    };
    this.gameObjectMap.gameArea = this.gameArea;

    //Create Displayboard
    for (let j = 0; j < this.row; j++) {
      for (let i = 0; i < this.column; i++) {
        this.cube = this.add.image(i * this.cubeSize + 400, j * this.cubeSize + 125, "cube0");
        this.cube.displayHeight = this.cubeSize;
        this.cube.displayWidth = this.cubeSize;
        this.cube.setOrigin(0, 0);
        this.gameArea.add(this.cube);
        this.gameObjectMap["cube" + (j * this.row + i)] = this.cube;
      }
    }

    //Create Logo
    this.logo = this.add.image(0, 0, "logo");
    this.gameArea.add(this.logo);
    this.logo.setOrigin(0, 0);
    this.gameObjectMap.logo = this.logo;
    this.logo.portrait = (gameObject, scaleFactor, cubeSize, contentWidth) => {
      gameObject.setScale(scaleFactor, scaleFactor);
      gameObject.x = this.scale.width / 2 - (cubeSize * this.column) / 2 + cubeSize / 2;
      gameObject.y = this.scale.height / 2 - (cubeSize * this.row) / 2 + cubeSize / 2;
    };
    this.logo.landscape = (gameObject, scaleFactor, cubeSize, contentWidth) => {
      gameObject.x = 0;
      gameObject.y = 0;
    };
    //Create CTA Button
    this.cta = this.add.image(0, this.cubeSize * this.column, "cta");
    this.gameArea.add(this.cta);
    this.cta.setOrigin(0, 0);
    this.cta.setScale(0.4);
    this.gameObjectMap.cta = this.cta;
    this.cta.portrait = (gameObject, scaleFactor, cubeSize, contentWidth) => {
      gameObject.setScale(scaleFactor, scaleFactor);
      gameObject.x = this.scale.width / 2 - (cubeSize * this.column) / 2 + cubeSize / 2;
      gameObject.y = this.scale.height / 2 - (cubeSize * this.row) / 2 + cubeSize / 2;
    };
    this.cta.landscape = (gameObject, scaleFactor, cubeSize, contentWidth) => {
      this.cta.setScale(0.4 * scaleFactor);
      gameObject.x = 0;
      gameObject.y = cubeSize * this.column;
    };

    //Create Goal Counter Text
    this.goalCounter = this.add.text(100, 100, "Hello Phaser!", {
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
      gameObject.x = 500 * scaleFactor;
      gameObject.y = 0;
    };

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
        let scaleFactor = gameSize.height / this.refHeightSize;
        let cubeSize = this.cubeSize * scaleFactor;
        this.logo.setScale(0.3 * scaleFactor);
        let contentWidth = this.logo.displayWidth + this.column * cubeSize;
        element.portrait ? element.portrait(element, scaleFactor, cubeSize, contentWidth) : null;
      } else {
        //this.gameArea
        //if(gameSize.height < )
        let scaleFactor = gameSize.width / this.refWidthSize;
        let cubeSize = this.cubeSize * scaleFactor;
        this.logo.setScale(0.3 * scaleFactor);
        let contentWidth = this.column * this.cubeSize + this.cubeSize / 2 - this.logo.x - this.logo.displayWidth / 2;
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
