document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        var game = new PixelJS.Engine();
        game.init({
            container: 'game_container',
            width: 320,
            height: 200
        });

        game.run(function (elapsedTime, dt) {
        });
    }
}
