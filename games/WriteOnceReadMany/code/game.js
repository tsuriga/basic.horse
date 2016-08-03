// Write Once Read Many 0.3
//   Copyright (C) 2016 Basic Horse (philpanda, saarelaine)
//
// This game is under development and using Pixel.js library by rastating

const GRID_OFFSET = 260;
const ACTUAL_BLOCK_SIZE = 32;
const MAP_BLOCK_SIZE_X = 16;
const MAP_BLOCK_SIZE_Y = 16;
const BLOCK_RANGE = 12;
const PLAYER_RANGE = 12;
const NUM_AUDIO = 20;
const NUM_FILES = 100;
const MINIMAP_SPACING = 0.75;

var miniMapCanvas = document.getElementById("minimap_canvas");
var miniMapCtx = miniMapCanvas.getContext("2d");

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        var game = new PixelJS.Engine();

        game.init({
            container: 'game_container',
            width: 640,
            height: 480
        });

        game.fullscreen = false;

        // State variables
        var currentlyStandingOn = null;
        var currentBlockPosX = MAP_BLOCK_SIZE_X;
        var currentBlockPosY = MAP_BLOCK_SIZE_Y;

        // General variables
        var debug = false;

        // Block arrays
        var wallArray = [];
        var floorArray = [];

        // Layers
        var playerLayer = game.createLayer('players');
        var itemLayer = game.createLayer('items');
        var floorLayer = game.createLayer('floor')

        // zIndexes
        itemLayer.zIndex = 3;
        floorLayer.zIndex = 1;

        // -- Level generation ------------------------------------------------------

        for(var i = 0; i < map1.length; i++) {
            var mapBlock = map1[i];

            for(var j = 0; j < mapBlock.length; j++) {
                if (map1[i][j] == 1) {
                    var wall = itemLayer.createEntity();

                    wall.size["width"] = BLOCK_RANGE;
                    wall.size["height"] = BLOCK_RANGE;

                    var isometricPosition = convertPositionToIsometric(currentBlockPosX, currentBlockPosY, GRID_OFFSET);

                    wall.pos["x"] = isometricPosition["x"];
                    wall.pos["y"] = isometricPosition["y"];

                    wall.asset = new PixelJS.Sprite();
                    wall.asset.prepare({
                        name: 'wall.png',
                    });

                    wallArray.push(wall);
                }

                var floor = floorLayer.createEntity();

                floor.size["width"] = BLOCK_RANGE;
                floor.size["height"] = BLOCK_RANGE;

                var isometricPosition = convertPositionToIsometric(currentBlockPosX, currentBlockPosY, GRID_OFFSET);

                floor.pos["x"] = isometricPosition["x"];
                floor.pos["y"] = isometricPosition["y"];

                floor.asset = new PixelJS.Sprite();
                floor.asset.prepare({
                    name: 'floor.png',
                });

                floorArray.push(floor);

                currentBlockPosX = currentBlockPosX + MAP_BLOCK_SIZE_X;
            }

            currentBlockPosY = currentBlockPosY + MAP_BLOCK_SIZE_Y;
            currentBlockPosX = MAP_BLOCK_SIZE_X;
        }

        var player = new PixelJS.Player();

        player.addToLayer(playerLayer);

        player.pos = { x: 280, y: 100 };
        player.size["width"] = PLAYER_RANGE;
        player.size["height"] = PLAYER_RANGE;
        player.velocity = { x: 100, y: 50 };
        player.asset = new PixelJS.AnimatedSprite();
        playerLayer.zIndex = 3;

        player.asset.prepare({
            name: 'char.png',
            frames: 1,
            rows: 4,
            speed: 100,
            defaultFrame: 0
        });

        // -- Collisions ------------------------------------------------------

        playerLayer.registerCollidable(player);

        floorArray.forEach(function(entry) {
            itemLayer.registerCollidable(entry);
        });

        wallArray.forEach(function(entry) {
            itemLayer.registerCollidable(entry);
        });

        player.onCollide(function (entity) {
            floorArray.forEach(function(entry) {
                if (entity === entry) {
                    currentlyStandingOn = entry;
                }
            });

            wallArray.forEach(function(entry) {
                if (entity === entry) {
                    if (entry.pos["x"] > player.pos["x"]) {
                        alert("DEATH");
                    }

                    if (entry.pos["x"] < player.pos["x"]) {
                        alert("DEATH");
                    }

                    if (entry.pos["y"] > player.pos["y"]) {
                        alert("DEATH");
                    }

                    if (entry.pos["y"] < player.pos["y"]) {
                        alert("DEATH");
                    }
                }
            });
        });

        // -- Additional key events  ------------------------------------------------------

        game.on('keyDown', function (keyCode) {
            // Toggle debug mode
            if (keyCode === PixelJS.Keys.Space) {
                if(debug) {
                    console.debug("Debug mode off");
                    debug = false;
                } else {
                    console.debug("Debug mode on");
                    debug = true;
                }
            }
        });

        game.loadAndRun(function (elapsedTime, dt) {
            drawMiniMap(map1, player);
        });
    }
}