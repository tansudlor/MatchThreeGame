class Game extends Phaser.Scene {
  row = 8;
  column = 8;
  cubeSize = 100;
  gameObjectMap = {};
  refHeightSize = 960;
  refWidthSize = 1920;
  gameSize = {};
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
  }

  create() {
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
    for (let j = 0; j < this.row; j++) {
      for (let i = 0; i < this.column; i++) {
        this.cube = this.add.image(i * this.cubeSize, j * this.cubeSize, "cube0");
        this.cube.displayHeight = this.cubeSize;
        this.cube.displayWidth = this.cubeSize;
        this.cube.setOrigin(0, 0);
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
    container.setSize(image.width, image.height); // กำหนดขนาดให้ container ตามขนาดของ image
    container.setInteractive();

    container.on("pointerdown", callback);
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
