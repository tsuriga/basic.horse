// Trojan Defense 2D
//   Copyright (C) 2016 Pandatom (philpanda, Firzenizer)
//
// Version 0.1
// This game is under development and using (modified) Pixel.js library by rastating

const GRID_OFFSET = 260;
const ACTUAL_BLOCK_SIZE = 32;
const MAP_BLOCK_SIZE_X = 16;
const MAP_BLOCK_SIZE_Y = 16;
const BLOCK_RANGE = 12;
const PLAYER_RANGE = 12;
const NUM_BULLETS = 15;
const BULLET_SPEED = 230;

/**
 * @param object       player
 * @param object       player
 */
var bullets = [];

function getFreeBullet() {
    for (var i=0;i<NUM_BULLETS;i++) {
        var b = bullets[i];
        if (!b.visible) {
            return b;
        }
    }
    return null;
}

function shootFrom(player) {
    var bullet = getFreeBullet();
    if (bullet == null) return;

    bullet.direction = player.lastDirection;
    if (bullet.direction == 0) return;

    bullet.pos.x = player.pos.x + 9;
    bullet.pos.y = player.pos.y + 9;
    bullet.visible = true;

    switch (bullet.direction) {
        case PixelJS.Directions.Up:
            bullet.velocity.x = 0;
            bullet.velocity.y = BULLET_SPEED;
            break;
        case PixelJS.Directions.UpRight:
            bullet.velocity.x = BULLET_SPEED;
            bullet.velocity.y = BULLET_SPEED / 2;
            break;
        case PixelJS.Directions.UpLeft:
            bullet.velocity.x = BULLET_SPEED;
            bullet.velocity.y = BULLET_SPEED / 2;
            break;

        case PixelJS.Directions.Left:
            bullet.velocity.x = BULLET_SPEED;
            bullet.velocity.y = BULLET_SPEED;
            break;

        case PixelJS.Directions.Right:
            bullet.velocity.x = BULLET_SPEED;
            bullet.velocity.y = 0;
            break;

        case PixelJS.Directions.DownRight:
            bullet.velocity.x = BULLET_SPEED;
            bullet.velocity.y = BULLET_SPEED / 2;
            break;
        case PixelJS.Directions.Down:
            bullet.velocity.x = 0;
            bullet.velocity.y = BULLET_SPEED;
            break;
        case PixelJS.Directions.DownLeft:
            bullet.velocity.x = BULLET_SPEED;
            bullet.velocity.y = BULLET_SPEED / 2;
            break;
    }
}

/**
 * @param int          posX
 * @param int          posY
 * @param int|optional offsetX
 */
function convertPositionToIsometric(posX, posY, offsetX) {
    var offsetX = (offsetX == undefined) ? 0 : offsetX;
    var pos = {};

    pos["x"] = offsetX + posX - posY;
    pos["y"] = (posX + posY) / 2;

    return pos;
}

/**
 * @param int          posX
 * @param int          posY
 * @param int|optional offsetX
 */
function convertPositionToCartesian(posX, posY, offsetX) {
    var offsetX = (offsetX == undefined) ? 0 : offsetX;
    var pos = {};

    pos["x"] = offsetX + (2 * posY + posX) / 2;
    pos["y"] = (2 * posY - posX) / 2;

    return pos;
}

/**
 * @param int posX
 * @param int posY
 */
function getClosestPositionInArray(posX, posY) {
    var pos = {};

    // Calculate real coordinates on map
    var mapX = (posX - GRID_OFFSET + posY * 2);
    var mapY = ((posY - ((posX - GRID_OFFSET) / 2 )) * 2);

    // Convert coordinates to block format
    pos["Y"] = Math.round(mapY / ACTUAL_BLOCK_SIZE);
    pos["X"] = Math.round(mapX / ACTUAL_BLOCK_SIZE);

    return pos;
}

/**
 * @param int   posX
 * @param int   posY
 * @param array map
 * @param int   itemType
 */
function setItemInMap(posX, posY, map, itemType) {
    map[posX][posY] = itemType;
}

document.onreadystatechange = function () {
    if (document.readyState == "complete") {

        // -- Initialization ------------------------------------------------------

        // Engine
        var game = new PixelJS.Engine();

        game.init({
            container: 'game_container',
            width: 640,
            height: 480
        });

        game.fullscreen = false;

        // Level layout arrays (0 = floor, 1 = wall, 3 = backdoor, 4 = file)
        var map1 = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];

        // State variables
        var currentlyStandingOn = null;
        var currentBlockPosX = MAP_BLOCK_SIZE_X;
        var currentBlockPosY = MAP_BLOCK_SIZE_Y;

        // Block arrays
        var wallArray = [];
        var wallFrontArray = [];
        var floorArray = [];
        var backdoorArray = [];
        var fileArray = [];
        var fogArray = [];
        var visibilityMap = map1;

        // Scan / radar variables
        var scanResolution = 10;
        var xMultipler = 0;
        var yMultipler = 0;
        var scanAngle = 0;

        // Layers
        var itemLayer = game.createLayer('items');
        var frontLayer = game.createLayer('front of player');
        var shadowLayer = game.createLayer('background shadow');
        var shadow = shadowLayer.createEntity();
        var fogLayer = game.createLayer('invisible area')
        var floorLayer = game.createLayer('floor')
        var scanLayer = game.createLayer('scan visible area')

        shadow.asset = new PixelJS.Sprite();
        shadow.asset.prepare({
            name: 'shadow.png',
        });

        shadow.pos["x"] = 35;
        shadow.pos["y"] = 10;

        // zIndexes
        scanLayer.zIndex = 6;
        itemLayer.zIndex = 3;
        frontLayer.zIndex = 5;
        shadowLayer.zIndex = 0;
        fogLayer.zIndex = 2;
        floorLayer.zIndex = 1;

        // -- Level generation ------------------------------------------------------

        for (var i=0;i<NUM_BULLETS;i++) {
            var b = itemLayer.createEntity();
            b.visible = false;
            b.asset = new PixelJS.Sprite();
            b.asset.prepare({
                name: 'bullet.png'
            });
            b.onCollide(function (entity) {
                if (wallArray.indexOf(entity) > 0)  {
                    this.visible = false;
                }
            });

            bullets.push(b);
        }

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

                    var wallFront = frontLayer.createEntity();
                    wallFront.size["width"] = BLOCK_RANGE;
                    wallFront.size["height"] = BLOCK_RANGE;

                    wallFront.pos["x"] = isometricPosition["x"];
                    wallFront.pos["y"] = isometricPosition["y"];

                    wallFront.opacity = 1;

                    wallFront.asset = new PixelJS.Sprite();
                    wallFront.asset.prepare({
                        name: 'wall.png',
                    });

                    wallFrontArray.push(wallFront);

                } else if (map1[i][j] == 3) {
                    var backdoor = itemLayer.createEntity();

                    backdoor.size["width"] = BLOCK_RANGE;
                    backdoor.size["height"] = BLOCK_RANGE;

                    var isometricPosition = convertPositionToIsometric(currentBlockPosX, currentBlockPosY, GRID_OFFSET);

                    backdoor.pos["x"] = isometricPosition["x"];
                    backdoor.pos["y"] = isometricPosition["y"];

                    backdoor.asset = new PixelJS.Sprite();
                    backdoor.asset.prepare({
                        name: 'backdoor.png',
                    });

                    backdoorArray.push(backdoor);

                } else if (map1[i][j] == 4) {
                    var file = itemLayer.createEntity();

                    file.size["width"] = BLOCK_RANGE;
                    file.size["height"] = BLOCK_RANGE;

                    var isometricPosition = convertPositionToIsometric(currentBlockPosX, currentBlockPosY, GRID_OFFSET);

                    file.pos["x"] = isometricPosition["x"];
                    file.pos["y"] = isometricPosition["y"];

                    file.asset = new PixelJS.Sprite();
                    file.asset.prepare({
                        name: 'file.png',
                    });

                    fileArray.push(file);
                }

                var fog = fogLayer.createEntity();

                fog.size["width"] = BLOCK_RANGE;
                fog.size["height"] = BLOCK_RANGE;

                var isometricPosition = convertPositionToIsometric(currentBlockPosX, currentBlockPosY, GRID_OFFSET);

                fog.pos["x"] = isometricPosition["x"];
                fog.pos["y"] = isometricPosition["y"];

                fog.visible = true; // WIP, fog disabled at the moment
                fog.opacity = 0.4;
                fog.asset = new PixelJS.Sprite();
                fog.asset.prepare({
                    name: 'fog.png',
                });

                fogArray.push(fog);

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

        // -- Entities ------------------------------------------------------

        var playerLayer = game.createLayer('players');
        var player = new PixelJS.Player();

        player.addToLayer(playerLayer);

        player.pos = { x: 200, y: 100 };
        player.size["width"] = PLAYER_RANGE;
        player.size["height"] = PLAYER_RANGE;
        player.velocity = { x: 100, y: 50 };
        player.asset = new PixelJS.AnimatedSprite();
        playerLayer.zIndex = 3;

        player.asset.prepare({
            name: 'char.png',
            frames: 3,
            rows: 8,
            speed: 100,
            defaultFrame: 1
        });

        var scan = scanLayer.createEntity();

        scan.pos.x = player.pos.x;
        scan.pos.y = player.pos.y;
        scan.size["width"] = 20;
        scan.size["height"] = 20;

        scan.visible = false;
        scan.asset = new PixelJS.Sprite();
        scan.asset.prepare({
            name: 'scan.png',
        });

        // -- Collisions ------------------------------------------------------

        playerLayer.registerCollidable(player);
        scanLayer.registerCollidable(scan);

        floorArray.forEach(function(entry) {
            itemLayer.registerCollidable(entry);
        });

        wallArray.forEach(function(entry) {
            itemLayer.registerCollidable(entry);
        });

        fogArray.forEach(function(entry) {
            fogLayer.registerCollidable(entry);
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
                        console.log("wall at right");
                        player.pos["x"] = player.pos["x"] - 2;
                    }

                    if (entry.pos["x"] < player.pos["x"]) {
                        console.log("wall at left");
                        player.pos["x"] = player.pos["x"] + 2;
                    }

                    if (entry.pos["y"] > player.pos["y"]) {
                        console.log("wall at up");
                        player.pos["y"] = player.pos["y"] - 2;
                    }

                    if (entry.pos["y"] < player.pos["y"]) {
                        console.log("wall at down");
                        player.pos["y"] = player.pos["y"] + 2;
                    }
                }
            });
        });

        scan.onCollide(function (entity) {
            wallArray.forEach(function(entry) {
                if (entity === entry) {
                    scan.pos.x = player.pos.x;
                    scan.pos.y = player.pos.y;

                    scanAngle = scanAngle + scanResolution;
                }
            });

            fogArray.forEach(function(entry) {
                if (entity === entry) {
                    entry.visible = false;
                }
             });
        });

        // -- Additional key events  ------------------------------------------------------

        game.on('keyDown', function (keyCode) {
            if (keyCode === PixelJS.Keys.Space) {
                var posX = currentlyStandingOn.pos["x"] - currentlyStandingOn.pos["y"];
                var posY = (currentlyStandingOn.pos["x"] + currentlyStandingOn.pos["y"]) / 2;
                var posInArray = getClosestPositionInArray(player.pos["x"], player.pos["y"]);

                setItemInMap(posInArray["X"], posInArray["Y"], map1, 1);
            }

            if (keyCode === PixelJS.Keys.X) {
                shootFrom(player);
            }

            for(var i = 0; i < wallFrontArray.length; i++) {
                if (player.pos["y"] + MAP_BLOCK_SIZE_Y / 2 < wallFrontArray[i].pos["y"]) {
                    wallFrontArray[i].visible = true;
                } else {
                    wallFrontArray[i].visible = false;
                }
            }
        });

        // -- Game loop ------------------------------------------------------

        game.loadAndRun(function (elapsedTime, dt) {
            scanResolution = 15;

            xMultipler = Math.cos(scanAngle * Math.PI / 180);
            yMultipler = Math.sin(scanAngle * Math.PI / 180);
            scan.pos.x = scan.pos.x + 15 * xMultipler;
            scan.pos.y = scan.pos.y + 15 * yMultipler;

            if (scanAngle >= 360) {
                scanAngle = scanAngle - 360;
            }
        });
    }
}