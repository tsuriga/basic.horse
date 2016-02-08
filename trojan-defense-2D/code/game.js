document.onreadystatechange = function () {
    if (document.readyState == "complete") {

        var game = new PixelJS.Engine();

        // Init settings
        game.init({
            container: 'game_container',
            width: 320,
            height: 200
        });

        game.fullscreen = true;
        var gridOffset = 144;

        var map1 = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 0, 0, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];

        var mapBlockSizeX = 16;
        var mapBlockSizeY = 16;
        var blockRange = 2;
        var playerRange = 16;

        var itemLayer = game.createLayer('items');

        var wallArray = [];
        var floorArray = [];

        var currentBlockPosX = mapBlockSizeX;
        var currentBlockPosY = mapBlockSizeY;

        for(var i = 0; i < map1.length; i++) {
            var mapBlock = map1[i];

            for(var j = 0; j < mapBlock.length; j++) {
                if (map1[i][j] == 1) {
                    var wall = itemLayer.createEntity();
                    wall.size["width"] = blockRange;
                    wall.size["height"] = blockRange;

                    // Isometric conversion
                    wall.pos["x"] = gridOffset + currentBlockPosX - currentBlockPosY;
                    wall.pos["y"] = (currentBlockPosX + currentBlockPosY) / 2;

                    wall.asset = new PixelJS.Sprite();
                    wall.asset.prepare({
                        name: 'wall.png',
                    });

                    wallArray.push(wall);
                } else {
                    var floor = itemLayer.createEntity();
                    floor.size["width"] = blockRange;
                    floor.size["height"] = blockRange;

                    // Isometric conversion
                    floor.pos["x"] = gridOffset + currentBlockPosX - currentBlockPosY;
                    floor.pos["y"] = (currentBlockPosX + currentBlockPosY) / 2;

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

        var playerLayer = game.createLayer("players");
        var player = new PixelJS.Player();

        player.addToLayer(playerLayer);

        player.pos = { x: 100, y: 100 };
        player.size["width"] = playerRange;
        player.size["height"] = playerRange;
        player.velocity = { x: 100, y: 100 };
        player.asset = new PixelJS.AnimatedSprite();
        player.asset.prepare({
            name: 'char.png',
            frames: 3,
            rows: 4,
            speed: 100,
            defaultFrame: 1
        });

        player.onCollide(function (entity) {
            // @todo This is way too heavy, implement better later
            wallArray.forEach(function(entry) {
                if (entity === entry) {
                    player.canMoveLeft = true;
                    player.canMoveRight = true;
                    player.canMoveDown = true;
                    player.canMoveUp = true;

                    if (player.direction === 8) {
                        player.canMoveDown = false;
                        player.canMoveUp = true;
                        player.canMoveLeft = true;
                        player.canMoveRight = true;
                    }

                    if (player.direction === 4) {
                        player.canMoveUp = false;
                        player.canMoveDown = true;
                        player.canMoveLeft = true;
                        player.canMoveRight = true;
                    }

                    if (player.direction === 2) {
                        player.canMoveRight = false;
                        player.canMoveLeft = true;
                        player.canMoveDown = true;
                        player.canMoveUp = true;
                    }

                    if (player.direction === 1) {
                        player.canMoveLeft = false;
                        player.canMoveRight = true;
                        player.canMoveDown = true;
                        player.canMoveUp = true;
                    }
                }
            });
        });

        playerLayer.registerCollidable(player);

        wallArray.forEach(function(entry) {
            itemLayer.registerCollidable(entry);
        });

        // Game loop
        game.loadAndRun(function (elapsedTime, dt) {
        });
    }
}