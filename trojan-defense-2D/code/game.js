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

        var map1 = [
            [1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1],
        ];

        var mapBlockSizeX = 46;
        var mapBlockSizeY = 19;

        var itemLayer = game.createLayer('items');

        var currentBlockSizeX = mapBlockSizeX;
        var currentBlockSizeY = mapBlockSizeY;

        for(var i = 0; i < map1.length; i++) {
            var mapBlock = map1[i];

            for(var j = 0; j < mapBlock.length; j++) {
                if (map1[i][j] == 1) {
                    var wall = itemLayer.createEntity();
                    wall.size = { width: 47, height: 37 };

                    wall.pos["x"] = currentBlockSizeX;
                    wall.pos["y"] = currentBlockSizeY;

                    wall.asset = new PixelJS.Sprite();
                    wall.asset.prepare({
                        name: 'wall.png',
                    });
                }
                currentBlockSizeX = currentBlockSizeX + mapBlockSizeX;
            }
            currentBlockSizeY = currentBlockSizeY + mapBlockSizeY;
            currentBlockSizeX = mapBlockSizeX;
        }

        // Game loop
        game.loadAndRun(function (elapsedTime, dt) {
        });
    }
}