// Beardless Runner (Prototype)
//   Copyright (C) 2016 Basic Horse (Olli Suoranta)
//
// Version 0.1
// This game is under development and using Pixel.js library by rastating
//

const PLAYER_RANGE = 70;
const MAX_OBSTACLES = 20;

var obstacleArray = [];

/**
 * @param int type
 * @param int spawnPoints
 * @return object entity
 */
function spawnObstacle(position) {
    var entity = getFreeObstacle(position);

    if (entity == null) return;

    entity.visible = true;

    console.log(entity);
    return entity;
}

/**
 * @param  int position
 * @return entity|null
 */
function getFreeObstacle(position) {
    for (var i = 0; i < MAX_OBSTACLES; i++) {
        var obstacle = obstacleArray[i];

        if (!obstacle.visible) {
            return obstacle;
        }
    }

    obstacle.pos.x = position;

    return null;
}

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        var game = new PixelJS.Engine();

        game.init({
            container: 'game_container',
            width: 640,
            height: 480
        });

        game.fullscreen = false;

        var playerLayer = game.createLayer('players');
        var obstacleLayer = game.createLayer('obstacles');

        playerLayer.zIndex = 1;
        obstacleLayer.zIndex = 2;

        var player = new PixelJS.Player();
        player.addToLayer(playerLayer);

        player.pos = { x: 320, y: 220 };
        player.size["width"] = PLAYER_RANGE;
        player.size["height"] = PLAYER_RANGE;
        player.velocity = { x: 330, y: 0 };
        player.asset = new PixelJS.AnimatedSprite();

        player.asset.prepare({
            name: 'char.png',
            frames: 2,
            rows: 8,
            speed: 100,
            defaultFrame: 1
        });

        for (var i=0; i < MAX_OBSTACLES; i++) {
            var obstacle = obstacleLayer.createEntity();

            obstacle.visible = false;
            obstacle.asset = new PixelJS.Sprite();
            obstacle.pos = { x: -10000, y: 250 };
            obstacle.velocity = { x: 0, y: 50 };
            obstacle.size = { width: 50, height: 50 };

            obstacle.asset.prepare({
                name: 'obstacle.png',
            });

            obstacleArray.push(obstacle);
        }

        game.on('keyDown', function (keyCode) {
            if (keyCode === PixelJS.Keys.Space) {
                var obstacle = spawnObstacle(300);
            }
        });

        game.loadAndRun(function (elapsedTime, dt) {
        });
    }
}