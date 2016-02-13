// Copyright Pandatom 2016

document.onreadystatechange = function () {
    if (document.readyState == "complete") {

        var game = new PixelJS.Engine();

        // Init settings
        game.init({
            container: 'game_container',
            width: 640,
            height: 480
        });

        game.fullscreen = true;
        var gridOffset = 260;

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

        var mapBlockSizeX = 16;
        var mapBlockSizeY = 16;
        var blockRange = 2;
        var playerRange = 16;
        var currentlyStandingOn = null;

        var itemLayer = game.createLayer('items');
        itemLayer.zIndex=0;
        var frontLayer = game.createLayer('front of player');
        frontLayer.zIndex=2;
        var wallArray = [];
        var wallFrontArray = [];
        var floorArray = [];
        var backdoorArray = [];
        var fileArray = [];

        var currentBlockPosX = mapBlockSizeX;
        var currentBlockPosY = mapBlockSizeY;
        var zIndex = 0;

        for(var i = 0; i < map1.length; i++) {
            var mapBlock = map1[i];
            zIndex++;

            for(var j = 0; j < mapBlock.length; j++) {
                if (map1[i][j] == 1) {
                    var wall = itemLayer.createEntity();
                    wall.size["width"] = blockRange;
                    wall.size["height"] = blockRange;

                    // Isometric conversion
                    wall.pos["x"] = gridOffset + currentBlockPosX - currentBlockPosY;
                    wall.pos["y"] = (currentBlockPosX + currentBlockPosY) / 2;

                    wall.zIndex = 2;

                    wall.asset = new PixelJS.Sprite();
                    wall.asset.prepare({
                        name: 'wall.png',
                    });

                    wallArray.push(wall);
                

                    var wallFront = frontLayer.createEntity();
                    wallFront.size["width"] = blockRange;
                    wallFront.size["height"] = blockRange;

                    // Isometric conversion
                    wallFront.pos["x"] = gridOffset + currentBlockPosX - currentBlockPosY;
                    wallFront.pos["y"] = (currentBlockPosX + currentBlockPosY) / 2;
                    wallFront.opacity = 1;
                    wallFront.zIndex = 2;

                    wallFront.asset = new PixelJS.Sprite();
                    wallFront.asset.prepare({
                        name: 'wall.png',
                    });

                    wallFrontArray.push(wallFront);
                    
                } else if (map1[i][j] == 3) {
                    var backdoor = itemLayer.createEntity();
                    backdoor.size["width"] = blockRange;
                    backdoor.size["height"] = blockRange;

                    // Isometric conversion
                    backdoor.pos["x"] = gridOffset + currentBlockPosX - currentBlockPosY;
                    backdoor.pos["y"] = (currentBlockPosX + currentBlockPosY) / 2;

                    backdoor.zIndex = zIndex;

                    backdoor.asset = new PixelJS.Sprite();
                    backdoor.asset.prepare({
                        name: 'backdoor.png',
                    });

                    backdoorArray.push(backdoor);
                } else if (map1[i][j] == 4) {
                    var file = itemLayer.createEntity();
                    file.size["width"] = blockRange;
                    file.size["height"] = blockRange;

                    // Isometric conversion
                    file.pos["x"] = gridOffset + currentBlockPosX - currentBlockPosY;
                    file.pos["y"] = (currentBlockPosX + currentBlockPosY) / 2;

                    file.zIndex = zIndex;

                    file.asset = new PixelJS.Sprite();
                    file.asset.prepare({
                        name: 'file.png',
                    });

                    fileArray.push(file);
                } else {
                    var floor = itemLayer.createEntity();
                    floor.size["width"] = blockRange;
                    floor.size["height"] = blockRange;

                    // Isometric conversion
                    floor.pos["x"] = gridOffset + currentBlockPosX - currentBlockPosY;
                    floor.pos["y"] = (currentBlockPosX + currentBlockPosY) / 2;

                    floor.zIndex = zIndex;

                    floor.asset = new PixelJS.Sprite();
                    floor.asset.prepare({
                        name: 'floor.png',
                    });

                    floorArray.push(floor);
                }
                currentBlockPosX = currentBlockPosX + mapBlockSizeX;
            }
            currentBlockPosY = currentBlockPosY + mapBlockSizeY;
            currentBlockPosX = mapBlockSizeX;
        }

        var playerLayer = game.createLayer('players');
        var player = new PixelJS.Player();

        player.addToLayer(playerLayer);


        player.pos = { x: 150, y: 100 };
        player.size["width"] = playerRange;
        player.size["height"] = playerRange;
        player.velocity = { x: 100, y: 100 };
        player.asset = new PixelJS.AnimatedSprite();
        playerLayer.zIndex = 1;
        player.asset.prepare({
            name: 'char.png',
            frames: 3,
            rows: 4,
            speed: 100,
            defaultFrame: 1
        });


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
                        wallArray[30].pos["x"] = 5;
                        wallArray[30].pos["y"] = 5;
                    }

                    // west-north
                    if (player.direction == 5) {
                        player.pos["x"] = player.pos["x"] + 3;
                        player.pos["y"] = player.pos["y"] + 3;
                    }
                }
            });
        });

        playerLayer.registerCollidable(player);

        floorArray.forEach(function(entry) {
            itemLayer.registerCollidable(entry);
        });

        wallArray.forEach(function(entry) {
            itemLayer.registerCollidable(entry);
        });

        game.on('keyDown', function (keyCode) {
            if (keyCode === PixelJS.Keys.Space) {
                var posX = currentlyStandingOn.pos["x"] - currentlyStandingOn.pos["y"];
                var posY = (currentlyStandingOn.pos["x"] + currentlyStandingOn.pos["y"]) / 2;

                console.log("Adding block on: " + posX + " " + posY);
            }

            for(var i = 0; i < wallFrontArray.length; i++) {
                if(player.pos["y"] + mapBlockSizeY / 2 < wallFrontArray[i].pos["y"]){
                    wallFrontArray[i].visible = true;
                }
                else{
                    wallFrontArray[i].visible = false;                
                }         
            }

        });


        // Game loop
        game.loadAndRun(function (elapsedTime, dt) {
        });
    }
}
