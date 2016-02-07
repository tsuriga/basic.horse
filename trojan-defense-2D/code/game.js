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
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];

        var mapBlockSizeX = 16;
        var mapBlockSizeY = 16;

        var itemLayer = game.createLayer('items');

        var currentBlockPosX = mapBlockSizeX;
        var currentBlockPosY = mapBlockSizeY;

        for(var i = 0; i < map1.length; i++) {
            var mapBlock = map1[i];

            for(var j = 0; j < mapBlock.length; j++) {
                if (map1[i][j] == 1) {
                    var wall = itemLayer.createEntity();
                    wall.size = { width: 32, height: 32 };

                    // Isometric conversion
                    wall.pos["x"] = gridOffset + currentBlockPosX - currentBlockPosY;
                    wall.pos["y"] = (currentBlockPosX + currentBlockPosY) / 2;

                    wall.asset = new PixelJS.Sprite();
                    wall.asset.prepare({
                        name: 'wall.png',
                    });
                } else {
                    var floor = itemLayer.createEntity();
                    floor.size = { width: 32, height: 32 };

                    // Isometric conversion
                    floor.pos["x"] = gridOffset + currentBlockPosX - currentBlockPosY;
                    floor.pos["y"] = (currentBlockPosX + currentBlockPosY) / 2;

                    floor.asset = new PixelJS.Sprite();
                    floor.asset.prepare({
                        name: 'floor.png',
                    });
                }
                currentBlockPosX = currentBlockPosX + mapBlockSizeX;
            }
            currentBlockPosY = currentBlockPosY + mapBlockSizeY;
            currentBlockPosX = mapBlockSizeX;
        }

        // Game loop
        game.loadAndRun(function (elapsedTime, dt) {
        });
    }
}