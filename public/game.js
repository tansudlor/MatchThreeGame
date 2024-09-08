class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        // Load assets such as images
        this.load.image('background', 'Assets/image/backgrounds/game_bg.webp');
    }

    create() {
        // Add the background image to the game
        this.background = this.add.image(this.scale.width / 2, this.scale.height / 2, 'background');
        this.background.setOrigin(0.5, 0.5);
        this.scale.on('resize', this.resize, this);
        this.resize({width: innerWidth, height: innerHeight});
    }

    resize(gameSize, baseSize, displaySize, resolution) {
        const width = gameSize.width;
        const height = gameSize.height;
        this.background.displayWidth = width;
        this.background.displayHeight = height;

        // Adjust the position of the background when the window is resized
        this.background.setPosition(width / 2, height / 2);
    }
}

// Phaser configuration
const config = {
    type: Phaser.AUTO, // Use WebGL or Canvas depending on what's supported
    backgroundColor: '#2d2d2d', // Background color
    scene: Game,
    scale: {
        mode: Phaser.Scale.RESIZE,  // Automatically resize according to screen size
        autoCenter: Phaser.Scale.CENTER_BOTH, // Center both horizontally and vertically
    },
};

const game = new Phaser.Game(config);