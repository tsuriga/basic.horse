function getFreeGhost() {
    for (var i = 0; i < NUM_GHOSTS; i++) {
        var ghost = ghostArray[i];

        if (!ghost.visible) {
            return ghost;
        }
    }

    return null;
}

function scanArea(
    scan,
    where,
    offsetX,
    offsetY,
    fogArray,
    wallArray,
    ghostArray,
    fileArray,
    increaseAngriness
) {
    var xMultipler = 0;
    var yMultipler = 0;
    var scanDistance = 0;
    var newOpacity = 0;

    scan.pos.x = where.x;
    scan.pos.y = where.y;

    for(scan.angle = 0; scan.angle <= 360; scan.angle = scan.angle + SCAN_RESOLUTION) {
        for(var j = 0; j < wallArray.length; j++) {
            if (collisonBetween(scan, wallArray[j])) {
                scan.pos.x = where.x + offsetX;
                scan.pos.y = where.y + offsetY;

                scanDistance = 0;
            }
        }

        for(var j = 0; j < fogArray.length; j++) {
            if (collisonBetween(scan, fogArray[j])) {
                newOpacity = scanDistance / 400;

                if (fogArray[j].opacity >= newOpacity) {
                    fogArray[j].opacity = newOpacity;
                }
            }
        }

        for(var j = 0; j < ghostArray.length; j++) {
             if (collisonBetween(scan, ghostArray[j])) {
                ghostArray[j].opacity = 100;

                if ((ghostArray[j].angriness < 100) && increaseAngriness) {
                    ghostArray[j].angriness = ghostArray[j].angriness + ANGRINESS_STEP;
                }
             }
        }

        for(var j = 0; j < fileArray.length; j++) {
             if (collisonBetween(scan, fileArray[j])) {
                 fileArray[j].opacity = 100;
             }
        }

        xMultipler = Math.cos(scan.angle * Math.PI / 180);
        yMultipler = Math.sin(scan.angle * Math.PI / 180);

        scan.pos.x = scan.pos.x + SCAN_SPEED * xMultipler;
        scan.pos.y = scan.pos.y + SCAN_SPEED * yMultipler;

        scanDistance = scanDistance + SCAN_SPEED
    }
}

function getFreeRadar() {
    for (var i = 0; i < NUM_RADARS; i++) {
        var radar = radarArray[i];

        if (!radar.visible) {
            return radar;
        }
    }

    return null;
}

function getFreeBullet() {
    for (var i = 0; i < NUM_BULLETS; i++) {
        var b = bulletArray[i];

        if (!b.visible) {
            return b;
        }
    }

    return null;
}

function getFreeFile() {
    for (var i = 0; i < NUM_FILES; i++) {
        var b = fileArray[i];

        if (!b.visible) {
            return b;
        }
    }

    return null;
}

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

function spawnFile(spawnPoints, player)
{
    var entity = getFreeFile();

    randomPoint = Math.floor((Math.random() * spawnPoints.length) + 0);
    spawnPoint = spawnPoints[randomPoint];

    while (spawnPoint.spawned) {
        spawnPoint.spawned = false;

        randomPoint = Math.floor((Math.random() * spawnPoints.length) + 0);
        spawnPoint = spawnPoints[randomPoint];
    }

    if (entity) {
        entity.pos.x = spawnPoint.pos.x;
        entity.pos.y = spawnPoint.pos.y;

        spawnPoint.spawned = true;
        entity.visible = true;

        return entity;
    }

    return null;
}

function spawnGhost(spawnPoints, player)
{
    var entity = getFreeGhost();

    randomPoint = Math.floor((Math.random() * spawnPoints.length) + 0);
    spawnPoint = spawnPoints[randomPoint];

    while (spawnPoint.spawned) {
        spawnPoint.spawned = false;

        randomPoint = Math.floor((Math.random() * spawnPoints.length) + 0);
        spawnPoint = spawnPoints[randomPoint];
    }

    if (Math.abs(player.pos.x - spawnPoint.pos.x) > 60 &&
        Math.abs(player.pos.y - spawnPoint.pos.y) > 60
    ) {
        if (entity) {
            entity.pos.x = spawnPoint.pos.x;
            entity.pos.y = spawnPoint.pos.y;

            entity.opacity = 0;
            entity.visible = true;

            spawnPoint.spawned = true;

            return entity;
        }
    }

    return null;
}

function moveEntityToTarget(entity, target)
{
    if (entity.visible) {
        entity.moveTo(target.pos.x, target.pos.y, 2000);
    } else {
        removeEntity(entity);
    }
}

function isEntityTouchingTarget(entity, target, range)
{
    if (entity.visible) {
        var targetDimensionStartX = target.pos.x - range;
        var targetDimensionEndX = target.pos.x + range;
        var targetDimensionStartY = target.pos.y - range;
        var targetDimensionEndY = target.pos.y + range;

        if (
            entity.pos.x < targetDimensionEndX && entity.pos.x > targetDimensionStartX &&
            entity.pos.y < targetDimensionEndY && entity.pos.y > targetDimensionStartY
        ) {
            return true;
        }
    }

    return false;
}

function removeEntity(entity)
{
    entity.pos.x = -10000;
    entity.pos.y = -10000;
    entity.visible = false;
}

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

function collisonBetween(firstObject, secondObject) {
    return firstObject.pos["x"] + firstObject.size.width > secondObject.pos.x &&
        firstObject.pos["x"] < secondObject.pos["x"] + secondObject.size.width &&
        firstObject.pos.y + firstObject.size.height > secondObject.pos.y &&
        firstObject.pos.y < secondObject.pos.y + secondObject.size.height;
}

function convertPositionToIsometric(posX, posY, offsetX) {
    var offsetX = (offsetX == undefined) ? 0 : offsetX;
    var pos = {};

    pos["x"] = offsetX + posX - posY;
    pos["y"] = (posX + posY) / 2;

    return pos;
}

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

function isGhostNear(entity, ghost) {
    if (
        entity.pos["x"] + entity.size.width + ALARM_RANGE > ghost.pos.x &&
        entity.pos["x"] < ghost.pos["x"] + ghost.size.width + ALARM_RANGE &&
        entity.pos.y + entity.size.height + ALARM_RANGE > ghost.pos.y &&
        entity.pos.y < ghost.pos.y + ghost.size.height + ALARM_RANGE
    ) {
        return true;
    } else {
        return false;
    }
}

function setItemInMap(posX, posY, map, itemType) {
    map[posX][posY] = itemType;
}

function setRadarInPosition(posX, posY) {
    var radar = getFreeRadar();

    if (radar == null) return null;

    radar.pos.x = posX;
    radar.pos.y = posY;

    radar.visible = true;

    setTimeout(function() {
        removeEntity(radar);
    }, 3000);

    return radar;
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");

    if (parts.length == 2) {
        return parts.pop().split(";").shift();
    }
}

function saveProgress(mapNumber) {
    var savedProgress = getCookie("progress");

    if (savedProgress === undefined) {
        var progress = [];

        progress.push(mapNumber);

        var progressJson = "progress=" + JSON.stringify(progress);

        document.cookie = progressJson + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    } else {
        var savedProgressArray = JSON.parse(savedProgress);

        if ($.inArray(mapNumber, savedProgressArray) == -1) {
            savedProgressArray.push(mapNumber);
            var progressJson = "progress=" + JSON.stringify(savedProgressArray);

            document.cookie = progressJson + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
        }
    }

    progressSaved = true;
}

function gameOver(
    player,
    ghostArray,
    wallFrontArray,
    wallArray,
    fogArray,
    fileArray
) {
    player.dispose();

    fogArray.forEach(function(entry) {
        entry.dispose();
    });

    setInterval(function () {
        if (fileArray.length > 0) {
            fileArray[0].dispose();
            fileArray.shift();
        }

        if (ghostArray.length > 0) {
            ghostArray[0].dispose();
            ghostArray.shift();
        }

        if (wallArray.length > 0) {
            wallArray[0].dispose();
            wallArray.shift();
        }

        if (wallFrontArray.length > 0) {
            wallFrontArray[0].dispose();
            wallFrontArray.shift();
        }
    }, 5);
}

function enterTheVoid(mapNumber, wallArray, wallFrontArray, ghostArray, fogArray, fileArray) {
    saveProgress(mapNumber);

    fileArray.forEach(function(entry) {
        entry.dispose();
    });

    ghostArray.forEach(function(entry) {
        entry.dispose();
    });

    wallArray.forEach(function(entry) {
        entry.dispose();
    });

    wallFrontArray.forEach(function(entry) {
        entry.dispose();
    });

    setInterval(function () {
        if (fogArray.length > 0) {
            fogArray[0].opacity = 1;
            fogArray.shift();
        }
    }, 5000);
}

function setTriggerScan() {
    triggerScan = true;
}

function getCredits() {
    return "Ghost Defense (v.1.0) is a game by basic horse.\
        Implemented by using pixel.js engine by rastating\
        If you want to value the work of Olli Suoranta, Juho Saarelainen, consider doing a paypal donation via our website (basic.horse).\
        Special thanks to Mikko Vieru, Tomi Ruusala and Petri Mölläri.";
}