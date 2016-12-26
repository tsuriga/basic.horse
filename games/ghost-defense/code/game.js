/*
 * Ghost Defense 2D
 * Copyright (C) 2016 Basic Horse (Olli Suoranta and Juho Saarelainen)
 *
 * This is the first game of Basic Horse.
 *
 * Version 0.9
 */

const GAME_WIDTH = 640;
const GAME_HEIGHT = 350;

const GRID_OFFSET = 320;
const ACTUAL_BLOCK_SIZE = 32;
const MAP_BLOCK_SIZE_X = 16;
const MAP_BLOCK_SIZE_Y = 16;
const BLOCK_RANGE = 15;
const PLAYER_RANGE = 15;
const ALARM_RANGE = 40;
const PLAYER_DEATH_RANGE = 14;
const ENEMY_DEATH_RANGE = 25;
const NUM_BULLETS = 10; /* amount of preloaded assets */
const NUM_FILES = 2; /* amount of preloaded assets */
const NUM_AUDIO = 25; /* amount of preloaded assets */
const NUM_GHOSTS = 10; /* amount of preloaded assets */
const NUM_RADARS = 1; /* amount of preloaded assets */
const BULLET_SPEED = 230;
const SCAN_RESOLUTION = 0.08;
const SCAN_SPEED = 5;
const ANGRINESS_STEP = 5;
const ANGRINESS_LIMIT = 90;
const SCAN_TIMEOUT = 500;

var amountOfGhosts = 1;
var currentAmountOfGhosts = 0;
var score = 0;
var triggerScan = true;
var gameState = true;
var levelFinished = false;
var lastPosition = {x:0, y:0};
var fileArray = [];
var bulletArray = [];
var audioArray = [[],[],[],[],[], []];
var ghostArray = [];
var radarArray = [];
var angryGhostArray = [];
var progressSaved = false;

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        var game = new PixelJS.Engine();

        game.init({
            container: 'game_container',
            width: GAME_WIDTH,
            height: GAME_HEIGHT
        });

        game.fullscreen = false;

        var progressCookie = getCookie("progress");

        if (progressCookie) {
            var finishedLevels = JSON.parse(progressCookie);
        } else {
            var finishedLevels = [];
        }

        var unfinishedLevels = [];
        var availableMaps = maps;

        for (var i = 0; i < availableMaps.length; i++) {
            if ($.inArray(i, finishedLevels) === -1) {
                unfinishedLevels.push(i);
            }
        };

        if (unfinishedLevels.length != 0) {
            randomNumber = Math.floor(Math.random() * unfinishedLevels.length) + 0;
            map = maps[unfinishedLevels[randomNumber]];
            mapNumber = unfinishedLevels[randomNumber];
        } else {
            alert("Thank you for playing the first game of Basic Horse. Finishing this project was a long \
                   and bumpy journey, but it had to be done. With the knowledge and know-how gathered from this project, \
                   Basic Horse can create better projects in the future. See the latest buzz from our website basic.horse. \
                   If you want to play this game from the start all over again, clear your cookies. \
            ");
        }

        // State variables
        var currentlyStandingOn = null;
        var currentBlockPosX = MAP_BLOCK_SIZE_X;
        var currentBlockPosY = MAP_BLOCK_SIZE_Y;

        // General variables
        var debug = false;

        // Block arrays
        var wallArray = [];
        var wallFrontArray = [];
        var ghostSpawnArray = [];
        var fileSpawnArray = [];
        var fogArray = [];
        var scanArray = [];

        // Scan variables
        var playerScanLoop = 0;

        // Layers
        var backgroundLayer = game.createLayer('background');
        var guiLayer = game.createLayer('gui');
        var enemyLayer = game.createLayer('enemies');
        var itemLayer = game.createLayer('items');
        var frontLayer = game.createLayer('front of player');
        var shadowLayer = game.createLayer('background shadow');
        var shadow = shadowLayer.createEntity();
        var fogLayer = game.createLayer('invisible area')
        var scanLayer = game.createLayer('scan visible area')
        var scoreTextLayer = game.createLayer("scoreText");
        var creditsTextLayer = game.createLayer("creditsText");

        scoreTextLayer.static = true;
        creditsTextLayer.static = true;

        var motivations = [
            "Maybe try harder next time?",
            "Use the radars wisely.",
            "Ghosts got too spooky for ya, eh?",
            "Open your eyes.",
            "Hunt for the files, not ghosts.",
            "You fight like a dairy farmer.",
            "Now you've been turned into bits and pieces.",
            "By the way, check out http://basic.horse",
            "Remember the days when games itself teached you instead of tutorials?",
            "Bacon is good for me.",
            "Maybe you should shut down your pc and clean your apartment.",
            "You don't seem to be a very skilled player.",
            "2spooky4me.",
            "Did you know that this game stores level progress on cookies!",
            "This game took over an year to complete.",
            "Fun fact: This game uses pixel.js because Olli misheard pixi.js.",
            "Back in 2013, this game was 3D Puzzle FPS and called 'Trojan Defense'",
            "Fun fact: there once were footstep sounds but they lowered the fps.",
            "Fact: this game had a problematic and complex development history.",
            "Fun fact: you really should use Linux instead of Windows or OSX"
        ]

        var randomMotivation = Math.floor(
            Math.floor(Math.random() * motivations.length) + 0
        );

        shadow.asset = new PixelJS.Sprite();
        shadow.asset.prepare({
            name: 'shadow.png',
        });

        shadow.pos["x"] = 35;
        shadow.pos["y"] = 10;

        // zIndexes
        backgroundLayer.zIndex = 0;
        guiLayer.zIndex = 1;
        enemyLayer.zIndex = 6;
        scanLayer.zIndex = 6;
        itemLayer.zIndex = 3;
        frontLayer.zIndex = 5;
        shadowLayer.zIndex = 2;
        fogLayer.zIndex = 2;
        scoreTextLayer.zIndex = 10;
        creditsTextLayer.zIndex = 11;

        creditsTextLayer.x = 50;

        var music1 = game.createSound('sound-music-1');
        music1.prepare({ name: 'music01.ogg' });

        var music2 = game.createSound('sound-music-2');
        music2.prepare({ name: 'music02.ogg' });

        var music3 = game.createSound('sound-music-3');
        music3.prepare({ name: 'music03.ogg' });

        var music4 = game.createSound('sound-music-4');
        music4.prepare({ name: 'music04.ogg' });

        var music5 = game.createSound('sound-music-5');
        music5.prepare({ name: 'music05.ogg' });

        var music6 = game.createSound('sound-music-6');
        music6.prepare({ name: 'music06.ogg' });

        var music7 = game.createSound('sound-music-7');
        music7.prepare({ name: 'music07.ogg' });

        var gameOverMusic = game.createSound('sound-gameover');
        gameOverMusic.prepare({ name: 'gameover.ogg' });

        for (var i=0; i < NUM_AUDIO; i++) {
            var soundThrow = game.createSound('sound-throw' + i);
            var soundGhostKill = game.createSound('sound-ghost-kill' + i);
            var soundScore = game.createSound('sound-score' + i);
            var soundAppear = game.createSound('sound-appear' + i);
            var soundRadar = game.createSound('sound-radar' + i);
            var soundAlarm = game.createSound('sound-alarm' + i);

            soundThrow.prepare({ name: 'throw.ogg' });
            soundGhostKill.prepare({ name: 'ghostKill.ogg' });
            soundScore.prepare({ name: 'score.ogg' });
            soundAppear.prepare({ name: 'appear.ogg' });
            soundRadar.prepare({ name: 'radar.ogg' });
            soundAlarm.prepare({ name: 'alarm.ogg' });

            audioArray[0].push(soundThrow);
            audioArray[1].push(soundGhostKill);
            audioArray[2].push(soundScore);
            audioArray[3].push(soundAppear);
            audioArray[4].push(soundRadar);
            audioArray[5].push(soundAlarm);
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

        if (unfinishedLevels.length != 0) {
            for(var i = 0; i < map.length; i++) {
                var mapBlock = map[i];

                for(var j = 0; j < mapBlock.length; j++) {
                    if (map[i][j] == 4 || // wall-green
                        map[i][j] == 5 || // wall-blue
                        map[i][j] == 6 || // wall-red
                        map[i][j] == 7 || // walls-white
                        map[i][j] == 8 || // walls-short
                        map[i][j] == 9    // walls-sign
                    ) {
                        var wall = itemLayer.createEntity();

                        wall.size["width"] = BLOCK_RANGE;
                        wall.size["height"] = BLOCK_RANGE;

                        var isometricPosition = convertPositionToIsometric(currentBlockPosX, currentBlockPosY, GRID_OFFSET);

                        wall.pos["x"] = isometricPosition["x"];
                        wall.pos["y"] = isometricPosition["y"];

                        wall.asset = new PixelJS.Sprite();
                        wall.asset.prepare({
                            name: 'wall' + map[i][j] + '.png',
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
                            name: 'wall' + map[i][j] + '.png',
                        });

                        wallFrontArray.push(wallFront);

                    } else if (map[i][j] == 2) {
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
                    } else if (map[i][j] == 3) {
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
                    } else if (map[i][j] == 1) {
                        var playerLayer = game.createLayer('players');

                        var player = new PixelJS.Player();
                        player.addToLayer(playerLayer);

                        var isometricPosition = convertPositionToIsometric(currentBlockPosX, currentBlockPosY, GRID_OFFSET);

                        player.pos["x"] = isometricPosition["x"];
                        player.pos["y"] = isometricPosition["y"];
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
                    }

                    var fog = fogLayer.createEntity();

                    fog.size["width"] = BLOCK_RANGE;
                    fog.size["height"] = BLOCK_RANGE;

                    var isometricPosition = convertPositionToIsometric(currentBlockPosX, currentBlockPosY, GRID_OFFSET);

                    fog.pos["x"] = isometricPosition["x"];
                    fog.pos["y"] = isometricPosition["y"];

                    fog.visible = true; // WIP, fog disabled at the moment
                    fog.opacity = 0.5;
                    fog.asset = new PixelJS.Sprite();
                    fog.asset.prepare({
                        name: 'fog.png',
                    });

                    fogArray.push(fog);

                    currentBlockPosX = currentBlockPosX + MAP_BLOCK_SIZE_X;
                }

                currentBlockPosY = currentBlockPosY + MAP_BLOCK_SIZE_Y;
                currentBlockPosX = MAP_BLOCK_SIZE_X;
            }

            // -- Entities ------------------------------------------------------

            var backgroundImg2 = backgroundLayer.createEntity();

            backgroundImg2.visible = true;
            backgroundImg2.asset = new PixelJS.Sprite();
            backgroundImg2.pos = { x: 0, y: 0 - GAME_HEIGHT };

            backgroundImg2.asset.prepare({
                name: 'background.png'
            });

            var backgroundImg = backgroundLayer.createEntity();

            backgroundImg.visible = true;
            backgroundImg.asset = new PixelJS.Sprite();
            backgroundImg.pos = { x: 0, y: 0 };

            backgroundImg.asset.prepare({
                name: 'background.png'
            });

            var guiInfo = guiLayer.createEntity();

            guiInfo.visible = true;
            guiInfo.asset = new PixelJS.Sprite();
            guiInfo.pos = { x: 85, y: 110 };

            guiInfo.asset.prepare({
                name: 'info.png'
            });

            var guiAlarm = guiLayer.createEntity();

            guiAlarm.visible = false;
            guiAlarm.asset = new PixelJS.Sprite();
            guiAlarm.pos = { x: 160, y: 0 };

            guiAlarm.asset.prepare({
                name: 'alarm.png'
            });

            var floorImg = guiLayer.createEntity();

            floorImg.visible = true;
            floorImg.asset = new PixelJS.Sprite();
            floorImg.pos = { x: 88, y: 40 };

            floorImg.asset.prepare({
                name: 'floorImg.png'
            });

            for (var i=0; i < NUM_GHOSTS; i++) {
                var ghost = enemyLayer.createEntity();

                ghost.visible = false;
                ghost.asset = new PixelJS.AnimatedSprite();
                ghost.pos = { x: -10000, y: -10000 };
                ghost.velocity = { x: 100, y: 50 };
                ghost.size["width"] = PLAYER_RANGE;
                ghost.size["height"] = PLAYER_RANGE;
                ghost.opacity = 0;
                ghost.angriness = 0;

                ghost.asset.prepare({
                    name: 'ghost.png',
                    frames: 6,
                    rows: 1,
                    speed: 60,
                    defaultFrame: 1
                });

                ghostArray.push(ghost);
            }

            ghostSpawner = setInterval(function() {
                if (currentAmountOfGhosts < amountOfGhosts) {
                    var ghost = spawnGhost(ghostSpawnArray, player);

                    if (ghost) {
                        angryGhostArray.push(ghost);
                        currentAmountOfGhosts++;
                        getFreeAudio(3).play();
                    }
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

            wallArray.forEach(function(entry) {
                itemLayer.registerCollidable(entry);
            });

            fogArray.forEach(function(entry) {
                fogLayer.registerCollidable(entry);
            });

            player.onCollide(function (entity) {
                wallArray.forEach(function(entry) {
                    if (entity === entry) {
                        var nudged = false;

                        if (entry.pos["x"] > player.pos["x"]) {
                            if (!nudged) {
                                player.pos["x"] = player.pos["x"] - 3;
                            } else {
                                player.pos["x"] = player.pos["x"] - 1.5;
                            }
                            nudged = true;
                        }

                        if (entry.pos["x"] < player.pos["x"]) {
                            if (!nudged) {
                                player.pos["x"] = player.pos["x"] + 3;
                            } else {
                                player.pos["x"] = player.pos["x"] + 1.5;
                            }
                            nudged = true;
                        }

                        if (entry.pos["y"] > player.pos["y"]) {
                            if (!nudged) {
                                player.pos["y"] = player.pos["y"] - 3;
                            } else {
                                player.pos["y"] = player.pos["y"] - 1.5;
                            }
                            nudged = true;
                        }

                        if (entry.pos["y"] < player.pos["y"]) {
                            if (!nudged) {
                                player.pos["y"] = player.pos["y"] + 3;
                            } else {
                                player.pos["y"] = player.pos["y"] + 1.5;
                            }
                            nudged = true;
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

                    setItemInMap(currentlyStandingOn.x, currentlyStandingOn.y, map);

                    var radar = setRadarInPosition(isometricPosition.x, isometricPosition.y, 5);
                    var radarInterval = null;

                    if (radar) {
                        getFreeAudio(4).play();
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

                if (keyCode === PixelJS.Keys.R) {
                    location.reload();
                }
            });

            // -- Game loop ------------------------------------------------------

            spawnFile(fileSpawnArray, player);

            game.clamp = function(value) {
                return Math.max(0, Math.min(1, value));
            }

            game.smoothStep = function(min, max, value) {
                var x = game.clamp((value-min)/(max-min));
                return x*x*(3 - 2*x);
            };

            game.distance = function(a,b) {
                return Math.sqrt((a.pos.x - b.pos.x) * (a.pos.x - b.pos.x) + (a.pos.y - b.pos.y) * (a.pos.y - b.pos.y));
            }

            game.candleLight = function (distance) {
                return 1 - game.smoothStep(20, Math.sin(game.elapsedTime /(Math.cos(game.elapsedTime / 1000) * 30 + 200)) * 10 + 200, distance);
            }

            game.fogger = function(tile) {
                var tileBrightness = game.candleLight(game.distance(tile, player));

                for (var i=0;i<radarArray.length;i++) {
                    tileBrightness += game.candleLight(game.distance(radarArray[i], tile));
                }

                tile.opacity = game.clamp(tileBrightness);
            }

            game.loadAndRun(function (elapsedTime, dt) {
                game.elapsedTime = elapsedTime;

                if (gameState) {
                    if (score < 5) {
                        music1.play();
                        amountOfGhosts = 1;
                    }

                    if (score > 4) {
                        music1.pause();
                        music2.play();
                        amountOfGhosts = 2;
                    }

                    if (score > 9) {
                        music2.pause();
                        music3.play();
                        amountOfGhosts = 3;
                    }

                    if (score > 19) {
                        music3.pause();
                        music4.play();
                        amountOfGhosts = 4;
                    }

                    if (score > 29) {
                        music4.pause();
                        music5.play();
                        amountOfGhosts = 5;
                    }

                    if (score > 39) {
                        music5.pause();
                        music6.play();
                        amountOfGhosts = 6;
                    }

                    if (score > 44) {
                        music6.pause();
                        music7.play();
                        amountOfGhosts = 7;
                    }

                    if (score >= 50) {
                        music7.pause();

                        if (!progressSaved) {
                            levelFinished = true;
                            enterTheVoid(
                                mapNumber,
                                wallArray,
                                wallFrontArray,
                                ghostArray,
                                fogArray,
                                fileArray
                            );
                        }

                        fontSize = Math.floor((Math.random() * 12) + 9);

                        scoreTextLayer.redraw = true;

                        if (unfinishedLevels.length != 0) {
                            var levelsLeft = unfinishedLevels.length() - 1;

                            scoreTextLayer.drawText(
                                "Complete the rest " + levelsLeft + " levels!",
                                380,
                                player.pos.y,
                                fontSize + 'pt "Courier New", Helvetica, sans-serif',
                                'white',
                                'center'
                            );
                        } else {
                            scoreTextLayer.drawText(
                                "You beat the dragon, gongratulations!",
                                380,
                                player.pos.y,
                                fontSize + 'pt "Courier New", Helvetica, sans-serif',
                                'yellow',
                                'center'
                            );

                            backgroundImg.pos.y = 0;
                            backgroundImg2.pos.y = 0;
                        }
                    }

                    wallArray.map(game.fogger);
                    wallFrontArray.map(game.fogger);

                    guiAlarm.visible = false;

                    angryGhostArray.forEach(function(ghostEntry) {
                        if(ghostEntry.angriness >= ANGRINESS_LIMIT) {
                            moveEntityToTarget(ghostEntry, player);
                        }

                        if (isGhostNear(ghostEntry, player)) {
                            if (getFreeRadar()) {
                                guiAlarm.visible = true;

                                var audio = getFreeAudio(5);

                                if (audio) {
                                    audio.play();
                                }
                            }
                        }

                        bulletArray.forEach(function(bulletEntry) {
                            if(isEntityTouchingTarget(bulletEntry, ghostEntry, ENEMY_DEATH_RANGE)) {
                                removeEntity(bulletEntry);
                                removeEntity(ghostEntry);
                                getFreeAudio(1).play();
                                currentAmountOfGhosts--;
                            };
                        });

                        if (isEntityTouchingTarget(ghostEntry, player, PLAYER_DEATH_RANGE)) {
                            clearInterval(ghostSpawner);
                            gameState = false;

                            gameOverMusic.play();

                            guiAlarm.dispose();
                            floorImg.dispose();

                            music1.pause();
                            music2.pause();
                            music3.pause();
                            music4.pause();
                            music5.pause();
                            music6.pause();
                            music7.pause();
                            gameOver(
                                player,
                                ghostArray,
                                wallFrontArray,
                                wallArray,
                                fogArray,
                                fileArray
                            );
                        };
                    });

                    fileArray.forEach(function(fileEntry) {
                        if(isEntityTouchingTarget(player, fileEntry, BLOCK_RANGE)) {
                            getFreeAudio(2).play();
                            removeEntity(fileEntry);
                            score++;

                            scoreTextLayer.redraw = true;

                            scoreTextLayer.drawText(
                                score + "/50",
                                455,
                                75,
                                '50pt "Trebuchet MS", Helvetica, sans-serif',
                                'white',
                                'center'
                            );

                            spawnFile(fileSpawnArray, player);
                        };
                    });

                    for(var i = 0; i < wallFrontArray.length; i++) {
                        if (player.pos["y"] + MAP_BLOCK_SIZE_Y / 2 < wallFrontArray[i].pos["y"]) {
                            wallFrontArray[i].visible = true;
                        } else {
                            wallFrontArray[i].visible = false;
                        }
                    }

                    var currentPosInArray = getCoordinatesInMapByArrayPosition(player.pos.x, player.pos.y);

                    if (triggerScan) {
                        setTimeout(function() { setTriggerScan(); }, SCAN_TIMEOUT);
                    }

                    if ((lastPosition.x != currentPosInArray.x) ||
                        (lastPosition.y != currentPosInArray.y) || triggerScan) {

                        lastPosition =  currentPosInArray
                        triggerScan = false;

                        for(var j = 0; j < fogArray.length; j++) {
                            fogArray[j].opacity = 0.7;
                        }

                        for(var j = 0; j < ghostArray.length; j++) {
                            ghostArray[j].opacity = 0;
                        }

                        for(var j = 0; j < fileArray.length; j++) {
                            fileArray[j].opacity = 0;
                        }

                        for(var j = 0; j < radarArray.length; j++) {
                            if(radarArray[j].pos.x >= 1){
                                scanArea(
                                    scan,
                                    radarArray[j].pos,
                                    3,
                                    4,
                                    fogArray,
                                    wallArray,
                                    ghostArray,
                                    fileArray,
                                    false
                                )
                            }
                        }

                        scanArea(
                            scan,
                            player.pos,
                            3,
                            4,
                            fogArray,
                            wallArray,
                            ghostArray,
                            fileArray,
                            true
                        )

                        for(var j = 0; j < ghostArray.length; j++) {
                            if(ghostArray[j].opacity != 100) {
                                ghostArray[j].angriness = 0;
                            }
                        }


                    }
                }

                backgroundImg.pos.y++;
                backgroundImg2.pos.y++;

                if (backgroundImg.pos.y === GAME_HEIGHT) {
                    backgroundImg.pos.y = 0;
                }

                if (backgroundImg2.pos.y === 0) {
                    backgroundImg2.pos.y = 0 - GAME_HEIGHT;
                }


                if (!gameState) {
                    creditsTextLayer.redraw = true;

                    creditsTextLayer.drawText(
                        getCredits(),
                        creditsTextLayer.x,
                        10,
                        '7pt "Verdana", Helvetica, sans-serif',
                        'white',
                        'left'
                    );

                    scoreTextLayer.redraw = true;

                    if (!levelFinished) {
                        var gap = 50 - score;

                        scoreTextLayer.drawText(
                            'You were ' + gap + ' files away from the next level!',
                            318,
                            100,
                            '12pt "Lucida Console", Helvetica, sans-serif',
                            'white',
                            'center'
                        );

                        scoreTextLayer.drawText(
                            motivations[randomMotivation],
                            320,
                            110,
                            '10pt "Lucida Console", Helvetica, sans-serif',
                            'yellow',
                            'center'
                        );
                    }

                    if (creditsTextLayer.x == -2000) {
                        creditsTextLayer.x = GAME_WIDTH;
                    } else {
                        creditsTextLayer.x--;
                    }
                }
            });
        }
    }
}