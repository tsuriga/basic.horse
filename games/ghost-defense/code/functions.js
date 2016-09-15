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
function scanArea(scan, where, offsetX, offsetY, fogArray, wallArray, ghostArray, fileArray) {
    var xMultipler = 0;
    var yMultipler = 0;

    scan.pos.x = where.x;
    scan.pos.y = where.y;

    for(scan.angle = 0; scan.angle <= 360; scan.angle = scan.angle + SCAN_RESOLUTION) {
        for(var j = 0; j < wallArray.length; j++) {
            if (scan.collidesWith(wallArray[j])) {
                scan.pos.x = where.x + offsetX;
                scan.pos.y = where.y + offsetY;
            }
        }
        for(var j = 0; j < fogArray.length; j++) {
            if (scan.collidesWith(fogArray[j])) {
                fogArray[j].visible = false;
            }
        }
        for(var j = 0; j < ghostArray.length; j++) {
             if (scan.collidesWith(ghostArray[j])) {
                 ghostArray[j].opacity = 100;
             }
        }
        for(var j = 0; j < fileArray.length; j++) {
             if (scan.collidesWith(fileArray[j])) {
                 fileArray[j].opacity = 100;
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
 * @return entity|null
 */
function getFreeFile() {
    for (var i = 0; i < NUM_FILES; i++) {
        var b = fileArray[i];

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

    if (type === 2) {
        for (var i = 0; i < NUM_AUDIO; i++) {
            var audio = this.audioArray[2][i];

            if (audio.paused) {
                return audio;
            }
        }
    }

    if (type === 3) {
        for (var i = 0; i < 1; i++) {
            var audio = this.audioArray[3][i];

            if (audio.paused) {
                return audio;
            }
        }
    }

    if (type === 4) {
        for (var i = 0; i < 1; i++) {
            var audio = this.audioArray[4][i];

            if (audio.paused) {
                return audio;
            }
        }
    }

    if (type === 5) {
        for (var i = 0; i < 1; i++) {
            var audio = this.audioArray[5][i];

            if (audio.paused) {
                return audio;
            }
        }
    }

    return null;
}

/**
 * @param int spawnPoints
 * @param object player
 * @return object entity
 */
function spawnFile(spawnPoints, player)
{
    var entity = getFreeFile();

    randomPoint = Math.floor((Math.random() * spawnPoints.length) + 0);
    spawnPoint = spawnPoints[randomPoint];

/* @todo Implement logic not to spawn near player
    if (Math.abs(player.pos.x - spawnPoint.pos.x) > 40 &&
        Math.abs(player.pos.y - spawnPoint.pos.y) > 40
    ) {
*/
        randomDistance = Math.floor((Math.random() * 20) + -20);
        entity.pos.x = spawnPoint.pos.x + randomDistance;
        entity.pos.y = spawnPoint.pos.y + randomDistance;

        entity.visible = true;
        console.log("spawned");

        return entity;
//    }

    console.log("not spawned");

    return null;
}

/**
 * Spawns ghosts but bewares of spawning next to player
 *
 * @param int spawnPoints
 * @param object player
 * @return object entity
 */
function spawnGhost(spawnPoints, player)
{
    var entity = getFreeGhost();

    randomPoint = Math.floor((Math.random() * spawnPoints.length) + 0);
    spawnPoint = spawnPoints[randomPoint];

    if (Math.abs(player.pos.x - spawnPoint.pos.x) > 40 &&
        Math.abs(player.pos.y - spawnPoint.pos.y) > 40
    ) {
        if (entity) {
            randomDistance = Math.floor((Math.random() * 20) + -20);
            entity.pos.x = spawnPoint.pos.x + randomDistance;
            entity.pos.y = spawnPoint.pos.y + randomDistance;

            entity.visible = true;

            return entity;
        }
    }

    return null;
}

/**
 * @param object entity
 * @param object target
 */
function moveEntityToTarget(entity, target)
{
    if (entity.visible) {
        entity.moveTo(target.pos.x, target.pos.y, 2000);
    } else {
        removeEntity(entity);
    }
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

function isGhostNear(player, ghost) {
    if (
        player.pos["x"] + player.size.width + ALARM_RANGE > ghost.pos.x &&
        player.pos["x"] < ghost.pos["x"] + ghost.size.width + ALARM_RANGE &&
        player.pos.y + player.size.height + ALARM_RANGE > ghost.pos.y &&
        player.pos.y < ghost.pos.y + ghost.size.height + ALARM_RANGE
    ) {
        return true;
    } else {
        return false;
    }
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

function setRadarInPosition(posX, posY) {
    var radar = getFreeRadar();

    if (radar == null) return null;

    radar.pos.x = posX;
    radar.pos.y = posY;

    radar.visible = true;

    return true;
}

function gameOver(
    player,
    ghostArray,
    wallFrontArray,
    wallArray,
    floorArray,
    fogArray,
    fileArray,
    radarArray
) {
    removeEntity(player);

    radarArray.forEach(function(entry) {
        removeEntity(entry);
    });

    fogArray.forEach(function(entry) {
        removeEntity(entry);
    });

    setInterval(function () {
        if (fileArray.length > 0) {
            removeEntity(fileArray[0]);
            fileArray.shift();
        }

        if (ghostArray.length > 0) {
            removeEntity(ghostArray[0]);
            ghostArray.shift();
        }

        if (floorArray.length > 0) {
            removeEntity(floorArray[0]);
            floorArray.shift();
        }

        if (wallArray.length > 0) {
            removeEntity(wallArray[0]);
            wallArray.shift();
        }

        if (wallFrontArray.length > 0) {
            removeEntity(wallFrontArray[0]);
            wallFrontArray.shift();
        }
    }, 1);
}

function enterTheVoid(wallArray, wallFrontArray) {
    wallArray.forEach(function(entry) {
       entry.opacity = 0;
    });

    wallFrontArray.forEach(function(entry) {
        entry.opacity = 0;
    });
}