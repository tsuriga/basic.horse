// Copyright Pandatom 2016

// 0 = floor, 1 = wall, 3 = backdoor, 4 = file
var map1 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 4, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 4, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 3, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// consts
const GRID_OFFSET = 260;
const ACTUAL_BLOCK_SIZE = 32;
const MAP_BLOCK_SIZE_X = 16;
const MAP_BLOCK_SIZE_Y = 16;
const BLOCK_RANGE = 2;
const PLAYER_RANGE = 16;

function countPositionInArray(posX, posY) {
    var pos = {};
    // Calculate real coordinates on map
    var mapX = (posX - GRID_OFFSET + posY * 2);
    var mapY = ((posY - ((posX - GRID_OFFSET) / 2 )) * 2);
    // Convert coordinates to block format
    pos["Y"] = Math.round(mapY / ACTUAL_BLOCK_SIZE);
    pos["X"] = Math.round(mapX / ACTUAL_BLOCK_SIZE);

    return pos;
}

function setItemInMap(posX, posY, map, type) {
    map[posX][posY] = type;
}


document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        var game = new PixelJS.Engine();

        // Init game container settings
        game.init({
            container: 'game_container',
            width: 640,
            height: 480
        });

        game.fullscreen = false;

        // Init game variables
        var currentlyStandingOn = null;

        var currentBlockPosX = MAP_BLOCK_SIZE_X;
        var currentBlockPosY = MAP_BLOCK_SIZE_Y;

        var wallArray = [];
        var wallFrontArray = [];
        var floorArray = [];
        var backdoorArray = [];
        var fileArray = [];
        var fogArray = [];
        var visibilityMap = map1;

        // Init layers
        var itemLayer = game.createLayer('items');
        var frontLayer = game.createLayer('front of player');
        var shadowLayer = game.createLayer('background shadow');
        var shadow = shadowLayer.createEntity();
        var fogLayer = game.createLayer('invisible area')
        var floorLayer = game.createLayer('floor')
        shadow.asset = new PixelJS.Sprite();
        shadow.asset.prepare({
            name: 'shadow.png',
        });

        shadow.pos["x"] = 35;
        shadow.pos["y"] = 10;

        // Set zIndexes
        itemLayer.zIndex = 3;
        frontLayer.zIndex = 5;
        shadowLayer.zIndex = 0;
        fogLayer.zIndex = 2;
        floorLayer.zIndex = 1;

        // Level generation
        for(var i = 0; i < map1.length; i++) {
            var mapBlock = map1[i];

            for(var j = 0; j < mapBlock.length; j++) {
                if (map1[i][j] == 1) {
                    var wall = itemLayer.createEntity();
                    wall.size["width"] = BLOCK_RANGE;
                    wall.size["height"] = BLOCK_RANGE;

                    // Isometric conversion
                    wall.pos["x"] = GRID_OFFSET + currentBlockPosX - currentBlockPosY;
                    wall.pos["y"] = (currentBlockPosX + currentBlockPosY) / 2;

                    wall.asset = new PixelJS.Sprite();
                    wall.asset.prepare({
                        name: 'wall.png',
                    });

                    wallArray.push(wall);

                    var wallFront = frontLayer.createEntity();
                    wallFront.size["width"] = BLOCK_RANGE;
                    wallFront.size["height"] = BLOCK_RANGE;

                    // Isometric conversion
                    wallFront.pos["x"] = GRID_OFFSET + currentBlockPosX - currentBlockPosY;
                    wallFront.pos["y"] = (currentBlockPosX + currentBlockPosY) / 2;
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

                    // Isometric conversion
                    backdoor.pos["x"] = GRID_OFFSET + currentBlockPosX - currentBlockPosY;
                    backdoor.pos["y"] = (currentBlockPosX + currentBlockPosY) / 2;


                    backdoor.asset = new PixelJS.Sprite();
                    backdoor.asset.prepare({
                        name: 'backdoor.png',
                    });

                    backdoorArray.push(backdoor);
                } else if (map1[i][j] == 4) {
                    var file = itemLayer.createEntity();
                    file.size["width"] = BLOCK_RANGE;
                    file.size["height"] = BLOCK_RANGE;

                    // Isometric conversion
                    file.pos["x"] = GRID_OFFSET + currentBlockPosX - currentBlockPosY;
                    file.pos["y"] = (currentBlockPosX + currentBlockPosY) / 2;


                    file.asset = new PixelJS.Sprite();
                    file.asset.prepare({
                        name: 'file.png',
                    });

                    fileArray.push(file);

                }

                var fog = fogLayer.createEntity();
                fog.size["width"] = BLOCK_RANGE;
                fog.size["height"] = BLOCK_RANGE;

                // Isometric conversion
                fog.pos["x"] = GRID_OFFSET + currentBlockPosX - currentBlockPosY;
                fog.pos["y"] = (currentBlockPosX + currentBlockPosY) / 2;

                fog.visible = false; // WIP, fog disabled at the moment
                fog.opacity = 0.4;
                fog.asset = new PixelJS.Sprite();
                fog.asset.prepare({
                    name: 'fog.png',
                });
                fogArray.push(fog);

                var floor = floorLayer.createEntity();
                floor.size["width"] = BLOCK_RANGE;
                floor.size["height"] = BLOCK_RANGE;

                // Isometric conversion
                floor.pos["x"] = GRID_OFFSET + currentBlockPosX - currentBlockPosY;
                floor.pos["y"] = (currentBlockPosX + currentBlockPosY) / 2;


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

        // Create players
        var playerLayer = game.createLayer('players');
        var player = new PixelJS.Player();

        player.addToLayer(playerLayer);

        player.pos = { x: 150, y: 100 };
        player.size["width"] = PLAYER_RANGE;
        player.size["height"] = PLAYER_RANGE;
        player.velocity = { x: 100, y: 50 };
        player.asset = new PixelJS.AnimatedSprite();
        playerLayer.zIndex = 3;

        player.asset.prepare({
            name: 'char.png',
            frames: 3,
            rows: 4,
            speed: 100,
            defaultFrame: 1
        });

        // Handle collisions
        player.onCollide(function (entity) {
            floorArray.forEach(function(entry) {
                if (entity === entry) {
                    currentlyStandingOn = entry;
                }
            });

            // @todo This is way too heavy, implement better later
            wallArray.forEach(function(entry) {
                if (entity === entry) {
                    // north
                    if (player.direction == 4) {
                        player.pos["y"] = player.pos["y"] + 5;
                    }

                    // north-east
                    if (player.direction == 6) {
                        player.pos["x"] = player.pos["x"] - 3;
                        player.pos["y"] = player.pos["y"] + 3;
                    }

                    // east
                    if (player.direction == 2) {
                        player.pos["x"] = player.pos["x"] - 5;
                    }

                    // east-south
                    if (player.direction == 10) {
                        player.pos["x"] = player.pos["x"] - 3;
                        player.pos["y"] = player.pos["y"] - 3;
                    }

                    // south
                    if (player.direction == 8) {
                        player.pos["y"] = player.pos["y"] - 5;
                    }

                    // south-west
                    if (player.direction == 9) {
                        player.pos["x"] = player.pos["x"] + 3;
                        player.pos["y"] = player.pos["y"] - 3;
                    }

                    // west
                    if (player.direction == 1) {
                        player.pos["x"] = player.pos["x"] + 5;
                    }

                    // west-north
                    if (player.direction == 5) {
                        player.pos["x"] = player.pos["x"] + 3;
                        player.pos["y"] = player.pos["y"] + 3;
                    }
                }
            });
        });


        // Register collidable layers
        playerLayer.registerCollidable(player);

        floorArray.forEach(function(entry) {
            itemLayer.registerCollidable(entry);
        });

        wallArray.forEach(function(entry) {
            itemLayer.registerCollidable(entry);
        });

        // Handle key events
        game.on('keyDown', function (keyCode) {
            if (keyCode === PixelJS.Keys.Space) {
                var posX = currentlyStandingOn.pos["x"] - currentlyStandingOn.pos["y"];
                var posY = (currentlyStandingOn.pos["x"] + currentlyStandingOn.pos["y"]) / 2;

                var posInArray = countPositionInArray(player.pos["x"], player.pos["y"]);
                setItemInMap(posInArray["X"], posInArray["Y"], map1, 1);
            }

            for(var i = 0; i < wallFrontArray.length; i++) {
                if(player.pos["y"] + MAP_BLOCK_SIZE_Y / 2 < wallFrontArray[i].pos["y"]){
                    wallFrontArray[i].visible = true;
                }
                else{
                    wallFrontArray[i].visible = false;
                }
            }


            //Visibility map debug
            if (keyCode === PixelJS.Keys.M) {
                visibilityMap = map1;
                var scanResolution = 10;
                var xMultipler;
                var yMultipler;

                for(var angle = 0; angle < 360; angle = angle + scanResolution ) {
                }
            }
        });

        // Game loop
        game.loadAndRun(function (elapsedTime, dt) {
            drawLine(player.pos.x, player.pos.y);
        });
    }
}

// SVG code starts here
var aSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
aSvg.setAttribute('width', 640);
aSvg.setAttribute('height', 480);
var radar = document.getElementById('radar_container');
document.getElementById("radar_container").style.zIndex = "6";
radar.appendChild(aSvg);


var SVGline = function (l) {
    this.l = l;
}

var Line
Line = new SVGline(Line);

SVGline.prototype.createLine = function (x1, y1, x2, y2, color, w) {
    var aLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    aLine.setAttribute('id', "LINE");
    aLine.setAttribute('x1', x1);
    aLine.setAttribute('y1', y1);
    aLine.setAttribute('x2', x2);
    aLine.setAttribute('y2', y2);
    aLine.setAttribute('stroke', color);
    aLine.setAttribute('stroke-width', w);
    return aLine;
}

function drawLine(posX, posY) {

    if(document.getElementById("LINE")) {
        document.getElementById("LINE").remove();
    }
    var xx = Line.createLine(posX, posY , 500, 500, 'rgb(100,200,200)', 5);
    aSvg.appendChild(xx);
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}