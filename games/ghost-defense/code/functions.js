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

    scan.pos.x = where.x;
    scan.pos.y = where.y;

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
function getFreeRadar() {
    for (var i = 0; i < NUM_RADARS; i++) {
        var radar = radarArray[i];

        if (!radar.visible) {
            return radar;
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
 * @param int type
 * @return entity|null
 */
function getFreeAudio(type) {

    if (type === 0) {
        for (var i = 0; i < NUM_AUDIO; i++) {
            var audio = this.audioArray[0][i];

            if (audio.paused) {
                return audio;
            }
        }
    }

    if (type === 1) {
        for (var i = 0; i < NUM_AUDIO; i++) {
            var audio = this.audioArray[1][i];

            if (audio.paused) {
                return audio;
            }
        }
    }

    return null;
}

/**
 * @param int spawnPoints
 * @return object entity
 */
function spawnGhost(spawnPoints)
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
        var targetDimensionStartX = target.pos.x - DEATH_RANGE;
        var targetDimensionEndX = target.pos.x + DEATH_RANGE;
        var targetDimensionStartY = target.pos.y - DEATH_RANGE;
        var targetDimensionEndY = target.pos.y + DEATH_RANGE;

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

    getFreeAudio(0).play();

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
        var radar = getFreeRadar();

        if (radar == null) return;

        radar.pos.x = posX;
        radar.pos.y = posY;

        radar.visible = true;

        return radar;
    }
}

function gameOver(player, ghostArray, wallFrontArray, wallArray, floorArray) {
    removeEntity(player);

    ghostArray.forEach(function(entry) {
        removeEntity(entry);
    });

    // Game over animation

    wallArrayLength = wallArray.length;
    wallFrontArrayLength = wallFrontArray.length;

    setInterval(function () {
        removeEntity(wallArray[0]);
        wallArray.shift();
    }, 60);

    setInterval(function () {
        removeEntity(floorArray[0]);
        floorArray.shift();
    }, 30);

    setInterval(function () {
        removeEntity(wallFrontArray[0]);
        wallFrontArray.shift();
    }, 80);
}