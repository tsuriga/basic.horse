// Ghost Defense 2D
//   Copyright (C) 2016 Basic Horse (philpanda, saarelaine)
//
// Version 0.4
// This game is under development and using (modified) Pixel.js library by rastating

const GRID_OFFSET = 320;
const ACTUAL_BLOCK_SIZE = 32;
const MAP_BLOCK_SIZE_X = 16;
const MAP_BLOCK_SIZE_Y = 16;
const BLOCK_RANGE = 12;
const PLAYER_RANGE = 12;
const NUM_BULLETS = 20;
const NUM_AUDIO = 20;
const NUM_GHOSTS = 20;
const NUM_FIREWALLS = 20;
const BULLET_SPEED = 230;
const SCAN_RESOLUTION = 0.05;
const SCAN_SPEED = 7;
const SCAN_FREQUENCY = 4;

const ENTITY_TYPE_GHOST = 1;

var lastPosition = {x:0, y:0};
var bulletArray = [];
var audioArray = [];
var ghostArray = [];
var firewallArray = [];
var angryGhostArray = [];

/**
 * @return entity|null
 */
function getFreeGhost() {
    for (var i = 0; i < NUM_GHOSTS; i++) {
        var ghost = ghostArray[i];

        if (!ghost.visible) {
            return ghost;
        }
    }

    return null;
}

/**
 * @param object scan
 * @param object where
 * @param int    offsetX
 * @param int    offsetY
 * @param object fogArray
 * @param object wallArray
 * @param int    loopNum
 * @return int   loopNum
 */
function scanArea(scan, where, offsetX, offsetY, fogArray, wallArray) {
  console.log("SCAN!");

    var xMultipler = 0;
    var yMultipler = 0;

    for(var j = 0; j < fogArray.length; j++) {
        fogArray[j].visible = true;
    }
    for(scan.angle = 0; scan.angle <= 360; scan.angle = scan.angle + SCAN_RESOLUTION) {
        for(var j = 0; j < wallArray.length; j++) {
            if (collisonBetween(scan, wallArray[j])) {
                scan.pos.x = where.x + offsetX;
                scan.pos.y = where.y + offsetY;
            }
        }
        for(var j = 0; j < fogArray.length; j++) {
            if (collisonBetween(scan, fogArray[j])) {
                fogArray[j].visible = false;
            }
        }
        xMultipler = Math.cos(scan.angle * Math.PI / 180);
        yMultipler = Math.sin(scan.angle * Math.PI / 180);
        scan.pos.x = scan.pos.x + SCAN_SPEED * xMultipler;
        scan.pos.y = scan.pos.y + SCAN_SPEED * yMultipler;
    }
}

/**
 * @return entity|null
 */
function getFreeFirewall() {
    for (var i = 0; i < NUM_FIREWALLS; i++) {
        var firewall = firewallArray[i];

        if (!firewall.visible) {
            return firewall;
        }
    }

    return null;
}

/**
 * @return entity|null
 */
function getFreeBullet() {
    for (var i = 0; i < NUM_BULLETS; i++) {
        var b = bulletArray[i];

        if (!b.visible) {
            return b;
        }
    }

    return null;
}

/**
 * @return entity|null
 */
function getFreeAudio() {
    for (var i = 0; i < NUM_AUDIO; i++) {
        var audio = this.audioArray[i];

        if (audio.paused) {
            return audio;
        }
    }

    return null;
}

/**
 * @param int type
 * @param int spawnPoints
 * @return object entity
 */
function spawnEntity(type, spawnPoints)
{
    var entity = getFreeGhost();

    randomPoint = Math.floor((Math.random() * spawnPoints.length) + 0);
    spawnPoint = spawnPoints[randomPoint];

    randomDistance = Math.floor((Math.random() * 30) + -30);
    entity.pos.x = spawnPoint.pos.x + randomDistance;
    entity.pos.y = spawnPoint.pos.y + randomDistance;

    entity.visible = true;

    return entity;
}

/**
 * @param object entity
 * @param object target
 */
function moveEntityToTarget(entity, target)
{
    if (entity.visible) {
        entity.moveTo(target.pos.x, target.pos.y, 2000);
    }
}

/**
 * @param object entity
 * @param object target
 */
function isEntityTouchingTarget(entity, target)
{
    if (entity.visible) {
        var targetDimensionStartX = target.pos.x - 16;
        var targetDimensionEndX = target.pos.x + 16;
        var targetDimensionStartY = target.pos.y - 16;
        var targetDimensionEndY = target.pos.y + 16;

        if (
            entity.pos.x < targetDimensionEndX && entity.pos.x > targetDimensionStartX &&
            entity.pos.y < targetDimensionEndY && entity.pos.y > targetDimensionStartY
        ) {
            return true;
        }
    }

    return false;
}

/**
 * @param object entity
 */
function removeEntity(entity)
{
    entity.visible = false;
    entity.pos.x = -10000;
    entity.pos.y = -10000;
}

/**
 * @param object player
 */
function shootFrom(player) {
    var bullet = getFreeBullet();

    if (bullet == null) return;

    bullet.direction = player.lastDirection;
    if (bullet.direction == 0) return;

    getFreeAudio().play();

    bullet.pos.x = player.pos.x + 9;
    bullet.pos.y = player.pos.y + 20;
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
 * @param object firstObject
 * @param object secondObject
 */
function collisonBetween(firstObject, secondObject) {
    return firstObject.pos["x"] + firstObject.size.width > secondObject.pos.x &&
        firstObject.pos["x"] < secondObject.pos["x"] + secondObject.size.width &&
        firstObject.pos.y + firstObject.size.height > secondObject.pos.y &&
        firstObject.pos.y < secondObject.pos.y + secondObject.size.height;
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


function getCoordinatesInMapByArrayPosition(posX, posY) {
    var currentPosition = getNearestPositionInArray(posX, posY);
    var pos = convertPositionToIsometric(currentPosition.x *
        MAP_BLOCK_SIZE_X, currentPosition.y * MAP_BLOCK_SIZE_Y, GRID_OFFSET);

    return pos;
}
/**
 * @param int posX
 * @param int posY
 */
function getNearestPositionInArray(posX, posY)
{
    var pos = {};

    // Calculate real coordinates on map
    var mapX = (posX - GRID_OFFSET + posY * 2);
    var mapY = ((posY - ((posX - GRID_OFFSET) / 2 )) * 2);

    // Convert coordinates to block format
    pos["y"] = Math.round(mapY / ACTUAL_BLOCK_SIZE);
    pos["x"] = Math.round(mapX / ACTUAL_BLOCK_SIZE);

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

function drawItemInPosition(posX, posY, item) {
    if (item == 5) {
        var firewall = getFreeFirewall();

        if (firewall == null) return;

        firewall.pos.x = posX;
        firewall.pos.y = posY;

        firewall.visible = true;
    }
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

        setInterval(function() {
            var ghost = spawnEntity(ENTITY_TYPE_GHOST, backdoorArray);
            angryGhostArray.push(ghost);
        }, Math.floor((Math.random() * 5000) + 1000));

        // Level layout arrays (0 = floor, 1 = wall, 3 = backdoor, 4 = file, 5 = firewall)
        var map1 = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];

        // State variables
        var currentlyStandingOn = null;
        var currentBlockPosX = MAP_BLOCK_SIZE_X;
        var currentBlockPosY = MAP_BLOCK_SIZE_Y;

        // General variables
        var debug = false;

        // Block arrays
        var wallArray = [];
        var wallFrontArray = [];
        var floorArray = [];
        var backdoorArray = [];
        var fileArray = [];
        var fogArray = [];
        var scanArray = [];

        // Scan variables
        var playerScanLoop = 0;

        // Layers
        var enemyLayer = game.createLayer('enemies');
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
        enemyLayer.zIndex = 6;
        scanLayer.zIndex = 6;
        itemLayer.zIndex = 3;
        frontLayer.zIndex = 5;
        shadowLayer.zIndex = 0;
        fogLayer.zIndex = 2;
        floorLayer.zIndex = 1;

        for (var i=0; i < NUM_AUDIO; i++) {
            var soundDefaultGun = game.createSound('sound-default-gun' + i);
            soundDefaultGun.prepare({ name: 'default_gun.ogg' });

            audioArray.push(soundDefaultGun);
        }

        for (var i = 0; i < NUM_BULLETS; i++) {
            var bullet = itemLayer.createEntity();
            bullet.visible = false;
            bullet.asset = new PixelJS.Sprite();

            bullet.asset.prepare({
                name: 'bullet.png'
            });

            bullet.onCollide(function (entity) {
                if (wallArray.indexOf(entity) > 0)  {
                    this.visible = false;
                }
            });

            bulletArray.push(bullet);
        }

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

                    backdoor.opacity = 0.0;

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
            frames: 4,
            rows: 8,
            speed: 100,
            defaultFrame: 1
        });

        for (var i=0; i < NUM_GHOSTS; i++) {
            var ghost = enemyLayer.createEntity();

            ghost.visible = false;
            ghost.asset = new PixelJS.AnimatedSprite();
            ghost.pos = { x: -10000, y: -10000 };
            ghost.velocity = { x: 100, y: 50 };
            ghost.size["width"] = PLAYER_RANGE;
            ghost.size["height"] = PLAYER_RANGE;
            ghost.active = 0;

            ghost.asset.prepare({
                name: 'ghost.png',
                frames: 1,
                rows: 8,
                speed: 100,
                defaultFrame: 1
            });

            ghostArray.push(ghost);
        }

        for (var i=0; i < NUM_FIREWALLS; i++) {
            var firewall = itemLayer.createEntity();
            firewall.visible = false;
            firewall.asset = new PixelJS.Sprite();

            firewall.asset.prepare({
                name: 'firewall.png'
            });

            firewall.onCollide(function (entity) {
                if (firewallArray.indexOf(entity) > 0)  {
                    this.visible = false;
                }
            });

            firewallArray.push(firewall);
        }

        var scan = scanLayer.createEntity();

        scan.pos.x = player.pos.x;
        scan.pos.y = player.pos.y;
        scan.size["width"] = 4;
        scan.size["height"] = 4;

        scan.angle = 90 * i;
        scan.visible = false;
        scan.asset = new PixelJS.Sprite();
        scan.asset.prepare({
            name: 'scan.png',
        });

        // -- Collisions ------------------------------------------------------

        playerLayer.registerCollidable(player);

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
                        player.pos["x"] = player.pos["x"] - 2;
                    }

                    if (entry.pos["x"] < player.pos["x"]) {
                        player.pos["x"] = player.pos["x"] + 2;
                    }

                    if (entry.pos["y"] > player.pos["y"]) {
                        player.pos["y"] = player.pos["y"] - 2;
                    }

                    if (entry.pos["y"] < player.pos["y"]) {
                        player.pos["y"] = player.pos["y"] + 2;
                    }
                }
            });
        });


        // -- Additional key events  ------------------------------------------------------

        game.on('keyDown', function (keyCode) {
            if (keyCode === PixelJS.Keys.Space) {
                shootFrom(player);
            }

            if (keyCode === PixelJS.Keys.Shift) {
                var currentlyStandingOn = getNearestPositionInArray(player.pos["x"], player.pos["y"]);
                var isometricPosition = convertPositionToIsometric(currentlyStandingOn.x * MAP_BLOCK_SIZE_X, currentlyStandingOn.y * MAP_BLOCK_SIZE_Y, GRID_OFFSET);

                setItemInMap(currentlyStandingOn.x, currentlyStandingOn.y, map1, 5);
                drawItemInPosition(isometricPosition.x, isometricPosition.y, 5);
            }

            for(var i = 0; i < wallFrontArray.length; i++) {
                if (player.pos["y"] + MAP_BLOCK_SIZE_Y / 2 < wallFrontArray[i].pos["y"]) {
                    wallFrontArray[i].visible = true;
                } else {
                    wallFrontArray[i].visible = false;
                }
            }

            // Toggle debug mode
            if (keyCode === PixelJS.Keys.D) {
                if(debug) {
                    debug = false;
                } else {
                    debug = true;
                }
                // Debug radar
                for(var i = 0; i < scanArray.length; i++) {
                    scanArray[i].visible = debug;
                }
            }
        });

        // -- Game loop ------------------------------------------------------

        game.loadAndRun(function (elapsedTime, dt) {

            angryGhostArray.forEach(function(ghostEntry) {
                moveEntityToTarget(ghostEntry, player);

                if (isEntityTouchingTarget(ghostEntry, player)) {
                    removeEntity(player);
                };

                bulletArray.forEach(function(bulletEntry) {
                    if(isEntityTouchingTarget(bulletEntry, ghostEntry)) {
                        removeEntity(ghostEntry);
                        removeEntity(bulletEntry);
                    };
                });
            });
            var currentPosInArray = getCoordinatesInMapByArrayPosition(player.pos.x, player.pos.y);
            if ((lastPosition.x !=  currentPosInArray.x) && (lastPosition.y !=  currentPosInArray.y)) {
                lastPosition =  currentPosInArray
            }
                scanArea(scan, player.pos , 3, 4, fogArray, wallArray)
        });
    }
}