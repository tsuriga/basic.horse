/*
 * Ghost Defense 2D
 *   Copyright (C) 2016 Basic Horse (Olli Suoranta, Juho Saarelainen)
 *
 * Version 0.4
 * This game is under development and using Pixel.js library by rastating
 */

const ENABLE_MUSIC = true;

const GRID_OFFSET = 320;
const ACTUAL_BLOCK_SIZE = 32;
const MAP_BLOCK_SIZE_X = 16;
const MAP_BLOCK_SIZE_Y = 16;
const BLOCK_RANGE = 15;
const PLAYER_RANGE = 12;
const DEATH_RANGE = 20;
const NUM_BULLETS = 10;
const NUM_FILES = 3;
const NUM_AUDIO = 10;
const NUM_GHOSTS = 10;
const NUM_RADARS = 5;
const BULLET_SPEED = 230;
const SCAN_RESOLUTION = 0.08;
const SCAN_SPEED = 7;
const SCAN_FREQUENCY = 4;
const MINIMAP_SPACING = 0.75;

var miniMapCanvas = document.getElementById("minimap_canvas");
var miniMapCtx = miniMapCanvas.getContext("2d");

var score = 0;

var lastPosition = {x:0, y:0};
var fileArray = [];
var bulletArray = [];
var audioArray = [[],[],[]];
var ghostArray = [];
var radarArray = [];
var angryGhostArray = [];

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        var game = new PixelJS.Engine();

        game.init({
            container: 'game_container',
            width: 640,
            height: 480
        });

        game.fullscreen = false;

        // Level layout arrays (0 = floor, 1 = wall, 2 = ghost spawn, 3 = file spawn)
        var map1 = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 3, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
            [1, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 3, 0, 1],
            [1, 0, 2, 0, 1, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 3, 0, 1, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 2, 0, 1, 1, 1, 1, 1, 0, 0, 3, 0, 2, 0, 1],
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
        var ghostSpawnArray = [];
        var fileSpawnArray = [];
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

        var music = game.createSound('sound-music');
        music.prepare({ name: 'music.ogg' });

        var music2 = game.createSound('sound-music-2');
        music2.prepare({ name: 'music2.ogg' });

        var gameOverMusic = game.createSound('sound-gameover');
        gameOverMusic.prepare({ name: 'gameover.ogg' });

        for (var i=0; i < NUM_AUDIO; i++) {
            var soundThrow = game.createSound('sound-throw' + i);
            var soundGhostKill = game.createSound('sound-ghost-kill' + i);
            var soundScore = game.createSound('sound-score' + i);

            soundThrow.prepare({ name: 'throw.ogg' });
            soundGhostKill.prepare({ name: 'ghostKill.ogg' });
            soundScore.prepare({ name: 'score.ogg' });

            audioArray[0].push(soundThrow);
            audioArray[1].push(soundGhostKill);
            audioArray[2].push(soundScore);
        }

        for (var i = 0; i < NUM_FILES; i++) {
            var file = itemLayer.createEntity();
            file.visible = false;
            file.asset = new PixelJS.Sprite();
            file.size["width"] = BLOCK_RANGE;
            file.size["height"] = BLOCK_RANGE;


            file.asset.prepare({
                name: 'file.png'
            });

            fileArray.push(file);
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

                } else if (map1[i][j] == 2) {
                    var ghostSpawn = itemLayer.createEntity();

                    ghostSpawn.size["width"] = BLOCK_RANGE;
                    ghostSpawn.size["height"] = BLOCK_RANGE;

                    var isometricPosition = convertPositionToIsometric(currentBlockPosX, currentBlockPosY, GRID_OFFSET);

                    ghostSpawn.pos["x"] = isometricPosition["x"];
                    ghostSpawn.pos["y"] = isometricPosition["y"];

                    ghostSpawn.asset = new PixelJS.Sprite();
                    ghostSpawn.asset.prepare({
                        name: 'ghostSpawn.png',
                    });

                    ghostSpawn.opacity = 0.0;
                    ghostSpawnArray.push(ghostSpawn);
                } else if (map1[i][j] == 3) {
                    var fileSpawn = itemLayer.createEntity();

                    fileSpawn.size["width"] = BLOCK_RANGE;
                    fileSpawn.size["height"] = BLOCK_RANGE;

                    var isometricPosition = convertPositionToIsometric(currentBlockPosX, currentBlockPosY, GRID_OFFSET);

                    fileSpawn.asset = new PixelJS.Sprite();
                    fileSpawn.asset.prepare({
                        name: 'ghostSpawn.png',
                    });

                    fileSpawn.opacity = 0.0;

                    fileSpawn.pos["x"] = isometricPosition["x"];
                    fileSpawn.pos["y"] = isometricPosition["y"];

                    fileSpawnArray.push(fileSpawn);
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

        for (var i=0; i < NUM_GHOSTS; i++) {
            var ghost = enemyLayer.createEntity();

            ghost.visible = false;
            ghost.asset = new PixelJS.AnimatedSprite();
            ghost.pos = { x: -10000, y: -10000 };
            ghost.velocity = { x: 100, y: 50 };
            ghost.size["width"] = PLAYER_RANGE;
            ghost.size["height"] = PLAYER_RANGE;

            ghost.asset.prepare({
                name: 'ghost.png',
                frames: 6,
                rows: 1,
                speed: 100,
                defaultFrame: 1
            });

            ghostArray.push(ghost);
        }

        ghostSpawner = setInterval(function() {
            var ghost = spawnGhost(ghostSpawnArray, player);

            if (ghost) {
                angryGhostArray.push(ghost);
            }
        }, Math.floor((Math.random() * 700) + 200));

        for (var i=0; i < NUM_RADARS; i++) {
            var radar = itemLayer.createEntity();
            radar.visible = false;
            radar.asset = new PixelJS.Sprite();

            radar.asset.prepare({
                name: 'radar.png'
            });

            radar.onCollide(function (entity) {
                if (radarArray.indexOf(entity) > 0)  {
                    this.visible = false;
                }
            });

            radarArray.push(radar);
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
                        player.pos["x"] = player.pos["x"] - 4;
                    }

                    if (entry.pos["x"] < player.pos["x"]) {
                        player.pos["x"] = player.pos["x"] + 4;
                    }

                    if (entry.pos["y"] > player.pos["y"]) {
                        player.pos["y"] = player.pos["y"] - 4;
                    }

                    if (entry.pos["y"] < player.pos["y"]) {
                        player.pos["y"] = player.pos["y"] + 4;
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

        spawnFile(fileSpawnArray, player);

        game.loadAndRun(function (elapsedTime, dt) {
            if (ENABLE_MUSIC) {
                music.play();
            }

            if (score > 9) {
                music.pause();
                music2.play();
            }

            angryGhostArray.forEach(function(ghostEntry) {
                moveEntityToTarget(ghostEntry, player);

                if (isEntityTouchingTarget(ghostEntry, player)) {
                    clearInterval(ghostSpawner);
                    gameOverMusic.play();
                    gameOver(player, ghostArray, wallFrontArray, wallArray, floorArray);
                };

                bulletArray.forEach(function(bulletEntry) {
                    if(isEntityTouchingTarget(bulletEntry, ghostEntry)) {
                        removeEntity(ghostEntry);
                        removeEntity(bulletEntry);
                        getFreeAudio(1).play();
                    };
                });
            });

            fileArray.forEach(function(fileEntry) {
                if(isEntityTouchingTarget(player, fileEntry)) {
                    getFreeAudio(2).play();
                    removeEntity(fileEntry);
                    score++;
                    spawnFile(fileSpawnArray, player);
                };
            });

            var currentPosInArray = getCoordinatesInMapByArrayPosition(player.pos.x, player.pos.y);

            if ((lastPosition.x !=  currentPosInArray.x) && (lastPosition.y !=  currentPosInArray.y)) {
                lastPosition =  currentPosInArray

                for(var j = 0; j < fogArray.length; j++) {
                    fogArray[j].visible = true;
                }
                for(var j = 0; j < ghostArray.length; j++) {
                    ghostArray[j].opacity = 0;
                }
                for(var j = 0; j < fileArray.length; j++) {
                    fileArray[j].opacity = 0;
                }

                for(var j = 0; j < radarArray.length; j++) {
                    if(radarArray[j].pos.x >= 1){
                        scanArea(scan,  radarArray[j].pos , 3, 4, fogArray, wallArray, ghostArray, fileArray)
                    }
                }
                scanArea(scan, player.pos , 3, 4, fogArray, wallArray, ghostArray, fileArray)
            }



            drawMiniMap(map1, player);

            miniMapCtx.font="100px Tahoma";
            miniMapCtx.fillStyle = 'yellow';
            miniMapCtx.textAlign="center";
            miniMapCtx.fillText(score,108,136);
        });
    }
}