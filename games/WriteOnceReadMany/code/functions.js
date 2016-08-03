function poke() {
    alert("You have been poked.");
}

/**
 * @return entity|null
 */
function getFreeFile() {
    for (var i = 0; i < NUM_FILES; i++) {
        var file = fileArray[i];

        if (!file.visible) {
            return file;
        }
    }

    return null;
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
 * @param int   posX
 * @param int   posY
 * @param array map
 * @param int   itemType
 */
function setItemInMap(posX, posY, map, itemType) {
    map[posY][posX] = itemType;
}

/**
 * @param int type
 * @param int spawnPoints
 * @return object entity
 */
function spawnFile(type, spawnPoints) {
    var entity = getFreeFile();

    if (entity == null) return;

    randomPoint = Math.floor((Math.random() * spawnPoints.length) + 0);
    spawnPoint = spawnPoints[randomPoint];

    entity.pos.x = spawnPoint.pos.x;
    entity.pos.y = spawnPoint.pos.y;

    entity.visible = true;

    return entity;
}

/**
 * @param int   posX
 * @param int   posY
 * @param int   itemType
 */
function drawItemInPosition(posX, posY, item) {
    if (item == 5) {
        var firewall = getFreeFirewall();

        if (firewall == null) return;

        firewall.pos.x = posX;
        firewall.pos.y = posY;

        firewall.visible = true;
    }
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
 * @param array map
 * @param object player
 */
function drawMiniMap(map, player) {
    miniMapCtx.clearRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);

    currentBlockPosX = MAP_BLOCK_SIZE_X;
    currentBlockPosY = MAP_BLOCK_SIZE_Y;

    for(var i = 0; i < map.length; i++) {
        var mapBlock = map[i];

        for(var j = 0; j < mapBlock.length; j++) {
            if (map[i][j] == 0) {
                miniMapCtx.fillStyle = "black";
                miniMapCtx.fillRect(currentBlockPosX * MINIMAP_SPACING, currentBlockPosY * MINIMAP_SPACING,10,10);
            }

            if (map[i][j] == 1) {
                miniMapCtx.fillStyle = "white";
                miniMapCtx.fillRect(currentBlockPosX * MINIMAP_SPACING, currentBlockPosY * MINIMAP_SPACING,10,10);
            }

            currentBlockPosX = currentBlockPosX + MAP_BLOCK_SIZE_X;
        }

        currentBlockPosY = currentBlockPosY + MAP_BLOCK_SIZE_Y;
        currentBlockPosX = MAP_BLOCK_SIZE_X;
    }

    var currentPlayerPositionInArray = getNearestPositionInArray(player.pos["x"], player.pos["y"]);

    miniMapCtx.fillStyle = "violet";
    miniMapCtx.fillRect(currentPlayerPositionInArray.x * BLOCK_RANGE, currentPlayerPositionInArray.y * BLOCK_RANGE, 10, 10);
}