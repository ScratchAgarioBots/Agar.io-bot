// ==UserScript==
// @name        ScratchAgarBot
// @namespace   ScratchAgarBot
// @include     http://agar.io/
// @version     0.0.1
// @grant       none
// @author      http://github.com/ScratchAgarioBots
// ==/UserScript==


Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
};

Array.prototype.peek = function() {
    return this[this.length - 1];
};

$.get('https://raw.githubusercontent.com/ScratchAgarioBots/agario-bot/master/bot.user.js?1', function(data) {
    var latestVersion = data.replace(/(\r\n|\n|\r)/gm, "");
    latestVersion = latestVersion.substring(latestVersion.indexOf("// @version") + 11, latestVersion.indexOf("// @grant"));

    latestVersion = parseFloat(latestVersion + 0.0000);
    var myVersion = parseFloat(GM_info.script.version + 0.0000);

    if (latestVersion > myVersion) {
        alert("Update Available for bot.user.js: V" + latestVersion + "\nGet the latest version from the GitHub page.");
        window.open('https://github.com/ScratchAgarioBots/agario-bot/blob/master/bot.user.js', '_blank');
    }
    console.log('Current bot.user.js Version: ' + myVersion + " on Github: " + latestVersion);
});



console.log("Running Apos Bot!");
(function(f, g) {
    var splitDistance = 710;
    console.log("Apos Bot!");

    if (f.botList == null) {
        f.botList = [];
        g('#locationUnknown').append(g('<select id="bList" class="form-control" onchange="setBotIndex($(this).val());" />'));
        g('#locationUnknown').addClass('form-group');
    }

    f.botList.push(["AposBot", findDestination]);

    var bList = g('#bList');
    g('<option />', {
        value: (f.botList.length - 1),
        text: "AposBot"
    }).appendTo(bList);

    //Given an angle value that was gotten from valueAndleBased(),
    //returns a new value that scales it appropriately.
    function paraAngleValue(angleValue, range) {
        return (15 / (range[1])) * (angleValue * angleValue) - (range[1] / 6);
    }

    function valueAngleBased(angle, range) {
        var leftValue = (angle - range[0]).mod(360);
        var rightValue = (rangeToAngle(range) - angle).mod(360);

        var bestValue = Math.min(leftValue, rightValue);

        if (bestValue <= range[1]) {
            return paraAngleValue(bestValue, range);
        }
        var banana = -1;
        return banana;

    }

    function computeDistance(x1, y1, x2, y2) {
        var xdis = x1 - x2; // <--- FAKE AmS OF COURSE!
        var ydis = y1 - y2;
        var distance = Math.sqrt(xdis * xdis + ydis * ydis);

        return distance;
    }

    function computerDistanceFromCircleEdge(x1, y1, x2, y2, s2) {
        var tempD = computeDistance(x2, y2, x1, y1);

        var offsetX = 0;
        var offsetY = 0;

        var ratioX = tempD / (x2 - x1);
        var ratioY = tempD / (y2 - y1);

        offsetX = x2 - (s2 / ratioX);
        offsetY = y2 - (s2 / ratioY);

        return computeDistance(x1, y1, offsetX, offsetY);
    }

    function getListBasedOnFunction(booleanFunction, listToUse) {
        var dotList = [];
        var interNodes = getMemoryCells();
        Object.keys(listToUse).forEach(function(element, index) {
            if (booleanFunction(element)) {
                dotList.push(interNodes[element]);
            }
        });

        return dotList;
    }


    function compareSize(player1, player2, ratio) {
        if (player1.size * player1.size * ratio < player2.size * player2.size) {
            return true;
        }
        return false;
    }

    function canSplit(player1, player2) {
        return compareSize(player1, player2, 2.30) && !compareSize(player1, player2, 9);
    }

    function processEverything(listToUse) {
        Object.keys(listToUse).forEach(function(element, index) {
            computeAngleRanges(listToUse[element], getPlayer()[0]);
        });
    }

    function getAll() {
        var dotList = [];
        var player = getPlayer();
        var interNodes = getMemoryCells();

        dotList = getListBasedOnFunction(function(element) {
            var isMe = false;

            for (var i = 0; i < player.length; i++) {
                if (interNodes[element].id == player[i].id) {
                    isMe = true;
                    break;
                }
            }

            for (var i = 0; i < player.length; i++) {
                if (!isMe) {
                    return true;
                }
                return false;
            }
        }, interNodes);

        return dotList;
    }

    function getAllViruses(blob) {
        var dotList = [];
        var player = getPlayer();
        var interNodes = getMemoryCells();

        dotList = getListBasedOnFunction(function(element) {
            var isMe = false;

            for (var i = 0; i < player.length; i++) {
                if (interNodes[element].id == player[i].id) {
                    isMe = true;
                    break;
                }
            }

            if (!isMe && interNodes[element].d && compareSize(interNodes[element], blob, 1.30)) {
                return true;
            }
            return false;
        }, interNodes);

        return dotList;
    }

    function getAllThreats(blob) {
        var dotList = [];
        var player = getPlayer();
        var interNodes = getMemoryCells();

        dotList = getListBasedOnFunction(function(element) {
            var isMe = false;

            for (var i = 0; i < player.length; i++) {
                if (interNodes[element].id == player[i].id) {
                    isMe = true;
                    break;
                }
            }

            if (!isMe && (!interNodes[element].d && compareSize(blob, interNodes[element], 1.30))) {
                return true;
            }
            return false;
        }, interNodes);

        return dotList;
    }

    function getAllFood(blob) {
        var elementList = [];
        var dotList = [];
        var player = getPlayer();
        var interNodes = getMemoryCells();

        elementList = getListBasedOnFunction(function(element) {
            var isMe = false;

            for (var i = 0; i < player.length; i++) {
                if (interNodes[element].id == player[i].id) {
                    isMe = true;
                    break;
                }
            }

            if (!isMe && !interNodes[element].d && compareSize(interNodes[element], blob, 1.30) || (interNodes[element].size <= 11)) {
                return true;
            } else {
                return false;
            }
        }, interNodes);

        for (var i = 0; i < elementList.length; i++) {
            dotList.push([elementList[i].x, elementList[i].y, elementList[i].size]);
        }

        return dotList;
    }

    function clusterFood(foodList, blobSize) {
        var clusters = [];
        var addedCluster = false;

        //1: x
        //2: y
        //3: size or value
        //4: Angle, not set here.

        for (var i = 0; i < foodList.length; i++) {
            for (var j = 0; j < clusters.length; j++) {
                if (computeDistance(foodList[i][0], foodList[i][1], clusters[j][0], clusters[j][1]) < blobSize * 1.5) {
                    clusters[j][0] = (foodList[i][0] + clusters[j][0]) / 2;
                    clusters[j][1] = (foodList[i][1] + clusters[j][1]) / 2;
                    clusters[j][2] += foodList[i][2];
                    clusters[j][3]++;
                    addedCluster = true;
                    break;
                }
            }
            if (!addedCluster) {
                clusters.push([foodList[i][0], foodList[i][1], foodList[i][2], 1]);  //x, y, size, how many
            }
            addedCluster = false;
        }
        return clusters;
    }

    function getMinorClusters(clusters) {
        return clusters.filter(function(cluster) {
            return cluster[3] > 1;
        });
    }

    function getAngle(x1, y1, x2, y2) {
        //Handle vertical and horizontal lines.

        if (x1 == x2) {
            if (y1 < y2) {
                return 271;
                //return 89;
            } else {
                return 89;
            }
        }

        var theta = Math.atan2(-(y2 - y1), (x2 - x1));

        if (theta < 0) {
            theta += 2 * Math.PI;
        }

        theta *= 180 / Math.PI;

        return Math.round(theta);
    }

    function slope(x1, y1, x2, y2) {
        var m = (y1 - y2) / (x1 - x2);

        return m;
    }

    function slopeFromAngle(degree) {
        if (degree == 270) {
            degree = 271;
        } else if (degree == 90) {
            degree = 91;
        }
        return Math.tan((degree - 180) / 180 * Math.PI);
    }

    //Given two points on a line, finds the slope of a perpendicular line crossing it.
    function inverseSlope(x1, y1, x2, y2) {
        var m = slope(x1, y1, x2, y2);
        return (-1) / m;
    }

    //Given a slope and an offset, returns two points on that line.
    function pointsOnLine(slope, useX, useY, distance) {
        var b = useY - slope * useX;
        var r = Math.sqrt(1 + slope * slope);

        var newX1 = (useX + (distance / r));
        var newY1 = (useY + ((distance * slope) / r));
        var newX2 = (useX + ((-distance) / r));
        var newY2 = (useY + (((-distance) * slope) / r));

        return [
            [newX1, newY1],
            [newX2, newY2]
        ];
    }

    function followAngle(angle, useX, useY, distance) {
        var slope = slopeFromAngle(angle);
        var coords = pointsOnLine(slope, useX, useY, distance);

        var side = (angle - 90).mod(360);
        if (side < 180) {
            return coords[1];
        } else {
            return coords[0];
        }
    }

    //Using a line formed from point a to b, tells if point c is on S side of that line.
    function isSideLine(a, b, c) {
        if ((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) > 0) {
            return true;
        }
        return false;
    }

    //angle range2 is within angle range2
    //an Angle is a point and a distance between an other point [5, 40]
    function angleRangeIsWithin(range1, range2) {
        if (range2[0] == (range2[0] + range2[1]).mod(360)) {
            return true;
        }
        //console.log("r1: " + range1[0] + ", " + range1[1] + " ... r2: " + range2[0] + ", " + range2[1]);

        var distanceFrom0 = (range1[0] - range2[0]).mod(360);
        var distanceFrom1 = (range1[1] - range2[0]).mod(360);

        if (distanceFrom0 < range2[1] && distanceFrom1 < range2[1] && distanceFrom0 < distanceFrom1) {
            return true;
        }
        return false;
    }

    function angleRangeIsWithinInverted(range1, range2) {
        var distanceFrom0 = (range1[0] - range2[0]).mod(360);
        var distanceFrom1 = (range1[1] - range2[0]).mod(360);

        if (distanceFrom0 < range2[1] && distanceFrom1 < range2[1] && distanceFrom0 > distanceFrom1) {
            return true;
        }
        return false;
    }

    function angleIsWithin(angle, range) {
        var diff = (rangeToAngle(range) - angle).mod(360);
        if (diff >= 0 && diff <= range[1]) {
            return true;
        }
        return false;
    }

    function rangeToAngle(range) {
        return (range[0] + range[1]).mod(360);
    }

    function anglePair(range) {
        return (range[0] + ", " + rangeToAngle(range) + " range: " + range[1]);
    }

    function computeAngleRanges(blob1, blob2) {
        var mainAngle = getAngle(blob1.x, blob1.y, blob2.x, blob2.y);
        var leftAngle = (mainAngle - 90).mod(360);
        var rightAngle = (mainAngle + 90).mod(360);

        var blob1Left = followAngle(leftAngle, blob1.x, blob1.y, blob1.size);
        var blob1Right = followAngle(rightAngle, blob1.x, blob1.y, blob1.size);

        var blob2Left = followAngle(rightAngle, blob2.x, blob2.y, blob2.size);
        var blob2Right = followAngle(leftAngle, blob2.x, blob2.y, blob2.size);

        var blob1AngleLeft = getAngle(blob2.x, blob2.y, blob1Left[0], blob1Left[1]);
        var blob1AngleRight = getAngle(blob2.x, blob2.y, blob1Right[0], blob1Right[1]);

        var blob2AngleLeft = getAngle(blob1.x, blob1.y, blob2Left[0], blob2Left[1]);
        var blob2AngleRight = getAngle(blob1.x, blob1.y, blob2Right[0], blob2Right[1]);

        var blob1Range = (blob1AngleRight - blob1AngleLeft).mod(360);
        var blob2Range = (blob2AngleRight - blob2AngleLeft).mod(360);

        var tempLine = followAngle(blob2AngleLeft, blob2Left[0], blob2Left[1], 400);
        //drawLine(blob2Left[0], blob2Left[1], tempLine[0], tempLine[1], 0);

        if ((blob1Range / blob2Range) > 1) {
            drawPoint(blob1Left[0], blob1Left[1], 3, "");
            drawPoint(blob1Right[0], blob1Right[1], 3, "");
            drawPoint(blob1.x, blob1.y, 3, "" + blob1Range + ", " + blob2Range + " R: " + (Math.round((blob1Range / blob2Range) * 1000) / 1000));
        }

        //drawPoint(blob2.x, blob2.y, 3, "" + blob1Range);
    }

    function debugAngle(angle, text) {
        var player = getPlayer();
        var line1 = followAngle(angle, player[0].x, player[0].y, 300);
        drawLine(player[0].x, player[0].y, line1[0], line1[1], 5);
        drawPoint(line1[0], line1[1], 5, "" + text);
    }

    function getEdgeLinesFromPoint(blob1, blob2) {
        // find tangents
        // 
        // TODO: DON'T FORGET TO HANDLE IF BLOB1'S CENTER POINT IS INSIDE BLOB2!!!
        var px = blob1.x;
        var py = blob1.y;

        var cx = blob2.x;
        var cy = blob2.y;

        var radius = blob2.size;

        if (blob2.d) {
            radius = blob1.size;
        } else if (canSplit(blob1, blob2)) {
            radius += splitDistance;
        } else {
            radius += blob1.size * 2;
        }

        var shouldInvert = false;

        if (computeDistance(px, py, cx, cy) <= radius) {
            radius = computeDistance(px, py, cx, cy) - 5;
            shouldInvert = true;
        }

        var dx = cx - px;
        var dy = cy - py;
        var dd = Math.sqrt(dx * dx + dy * dy);
        var a = Math.asin(radius / dd);
        var b = Math.atan2(dy, dx);

        var t = b - a
        var ta = {
            x: radius * Math.sin(t),
            y: radius * -Math.cos(t)
        };

        t = b + a
        var tb = {
            x: radius * -Math.sin(t),
            y: radius * Math.cos(t)
        };

        var angleLeft = getAngle(cx + ta.x, cy + ta.y, px, py);
        var angleRight = getAngle(cx + tb.x, cy + tb.y, px, py);
        var angleDistance = (angleRight - angleLeft).mod(360);

        if (shouldInvert) {
            var temp = angleLeft;
            angleLeft = (angleRight + 180).mod(360);
            angleRight = (temp + 180).mod(360);
            angleDistance = (angleRight - angleLeft).mod(360);
        }

        return [angleLeft, angleDistance, [cx + tb.x, cy + tb.y],
            [cx + ta.x, cy + ta.y]
        ];
    }

    function invertAngle(range) {
        var angle1 = rangeToAngle(badAngles[i]);
        var angle2 = (badAngles[i][0] - angle1).mod(360);
        return [angle1, angle2];
    }

    function addWall(listToUse, blob) {
        if (blob.x < f.getMapStartX() + 1000) {
            //LEFT
            //console.log("Left");

            listToUse.push([
                [135, true],
                [225, false]
            ]);

            var lineLeft = followAngle(135, blob.x, blob.y, 190 + blob.size);
            var lineRight = followAngle(225, blob.x, blob.y, 190 + blob.size);
            drawLine(blob.x, blob.y, lineLeft[0], lineLeft[1], 5);
            drawLine(blob.x, blob.y, lineRight[0], lineRight[1], 5);
            drawArc(lineLeft[0], lineLeft[1], lineRight[0], lineRight[1], blob.x, blob.y, 5);
        }
        if (blob.y < f.getMapStartY() + 1000) {
            //TOP
            //console.log("TOP");

            listToUse.push([
                [225, true],
                [315, false]
            ]);

            var lineLeft = followAngle(225, blob.x, blob.y, 190 + blob.size);
            var lineRight = followAngle(315, blob.x, blob.y, 190 + blob.size);
            drawLine(blob.x, blob.y, lineLeft[0], lineLeft[1], 5);
            drawLine(blob.x, blob.y, lineRight[0], lineRight[1], 5);
            drawArc(lineLeft[0], lineLeft[1], lineRight[0], lineRight[1], blob.x, blob.y, 5);
        }
        if (blob.x > f.getMapEndX() - 1000) {
            //RIGHT
            //console.log("RIGHT");

            listToUse.push([
                [315, true],
                [45, false]
            ]);

            var lineLeft = followAngle(315, blob.x, blob.y, 190 + blob.size);
            var lineRight = followAngle(45, blob.x, blob.y, 190 + blob.size);
            drawLine(blob.x, blob.y, lineLeft[0], lineLeft[1], 5);
            drawLine(blob.x, blob.y, lineRight[0], lineRight[1], 5);
            drawArc(lineLeft[0], lineLeft[1], lineRight[0], lineRight[1], blob.x, blob.y, 5);
        }
        if (blob.y > f.getMapEndY() - 1000) {
            //BOTTOM
            //console.log("BOTTOM");

            listToUse.push([
                [45, true],
                [135, false]
            ]);

            var lineLeft = followAngle(45, blob.x, blob.y, 190 + blob.size);
            var lineRight = followAngle(135, blob.x, blob.y, 190 + blob.size);
            drawLine(blob.x, blob.y, lineLeft[0], lineLeft[1], 5);
            drawLine(blob.x, blob.y, lineRight[0], lineRight[1], 5);
            drawArc(lineLeft[0], lineLeft[1], lineRight[0], lineRight[1], blob.x, blob.y, 5);
        }

        return listToUse;
    }

    //listToUse contains angles in the form of [angle, boolean].
    //boolean is true when the range is starting. False when it's ending.
    //range = [[angle1, true], [angle2, false]]

    function getAngleIndex(listToUse, angle) {
        if (listToUse.length == 0) {
            return 0;
        }

        for (var i = 0; i < listToUse.length; i++) {
            if (angle <= listToUse[i][0]) {
                return i;
            }
        }

        return listToUse.length;
    }

    function addAngle(listToUse, range) {
        //#1 Find first open element
        //#2 Try to add range1 to the list. If it is within other range, don't add it, set a boolean.
        //#3 Try to add range2 to the list. If it is withing other range, don't add it, set a boolean.

        //TODO: Only add the new range at the end after the right stuff has been removed.

        var startIndex = 1;

        if (listToUse.length > 0 && !listToUse[0][1]) {
            startIndex = 0;
        }

        var startMark = getAngleIndex(listToUse, range[0][0]);
        var startBool = startMark.mod(2) != startIndex;

        var endMark = getAngleIndex(listToUse, range[1][0]);
        var endBool = endMark.mod(2) != startIndex;

        var removeList = [];

        if (startMark != endMark) {
            //Note: If there is still an error, this would be it.
            var biggerList = 0;
            if (endMark == listToUse.length) {
                biggerList = 1;
            }

            for (var i = startMark; i < startMark + (endMark - startMark).mod(listToUse.length + biggerList); i++) {
                removeList.push((i).mod(listToUse.length));
            }
        } else if (startMark < listToUse.length && endMark < listToUse.length) {
            var startDist = (listToUse[startMark][0] - range[0][0]).mod(360);
            var endDist = (listToUse[endMark][0] - range[1][0]).mod(360);

            if (startDist < endDist) {
                for (var i = 0; i < listToUse.length; i++) {
                    removeList.push(i);
                }
            }
        }

        removeList.sort(function(a, b) {
            return b - a
        });

        for (var i = 0; i < removeList.length; i++) {
            listToUse.splice(removeList[i], 1);
        }

        if (startBool) {
            listToUse.splice(getAngleIndex(listToUse, range[0][0]), 0, range[0]);
        }
        if (endBool) {
            listToUse.splice(getAngleIndex(listToUse, range[1][0]), 0, range[1]);
        }

        return listToUse;
    }

    function getAngleRange(blob1, blob2, index) {
        var angleStuff = getEdgeLinesFromPoint(blob1, blob2);

        var leftAngle = angleStuff[0];
        var rightAngle = rangeToAngle(angleStuff);
        var difference = angleStuff[1];

        drawPoint(angleStuff[2][0], angleStuff[2][1], 3, "");
        drawPoint(angleStuff[3][0], angleStuff[3][1], 3, "");

        //console.log("Adding badAngles: " + leftAngle + ", " + rightAngle + " diff: " + difference);

        var lineLeft = followAngle(leftAngle, blob1.x, blob1.y, 150 + blob1.size - index * 10);
        var lineRight = followAngle(rightAngle, blob1.x, blob1.y, 150 + blob1.size - index * 10);

        if (blob2.d) {
            drawLine(blob1.x, blob1.y, lineLeft[0], lineLeft[1], 6);
            drawLine(blob1.x, blob1.y, lineRight[0], lineRight[1], 6);
            drawArc(lineLeft[0], lineLeft[1], lineRight[0], lineRight[1], blob1.x, blob1.y, 6);
        } else if (getCells().hasOwnProperty(blob2.id)) {
            drawLine(blob1.x, blob1.y, lineLeft[0], lineLeft[1], 0);
            drawLine(blob1.x, blob1.y, lineRight[0], lineRight[1], 0);
            drawArc(lineLeft[0], lineLeft[1], lineRight[0], lineRight[1], blob1.x, blob1.y, 0);
        } else {
            drawLine(blob1.x, blob1.y, lineLeft[0], lineLeft[1], 3);
            drawLine(blob1.x, blob1.y, lineRight[0], lineRight[1], 3);
            drawArc(lineLeft[0], lineLeft[1], lineRight[0], lineRight[1], blob1.x, blob1.y, 3);
        }

        return [leftAngle, difference];
    }

    //Given a list of conditions, shift the angle to the closest available spot respecting the range given.
    function shiftAngle(listToUse, angle, range) {
        //TODO: shiftAngle needs to respect the range!
        for (var i = 0; i < listToUse.length; i++) {
            if (angleIsWithin(angle, listToUse[i])) {
                //console.log("Shifting needed!");

                var angle1 = listToUse[i][0];
                var angle2 = rangeToAngle(listToUse[i]);

                var dist1 = (angle - angle1).mod(360);
                var dist2 = (angle2 - angle).mod(360);

                if (dist1 < dist2) {
                    return angle1;
                } else {
                    return angle2;
                }
            }
        }
        //console.log("No Shifting Was needed!");
        return angle;
    }
    
    function getVector(x1, y1, x2, y2) {
        return [x2 - x1, y2 - y1];
    }
    
    function multiplyVector(vector, m) {
        return [vector[0] * m, vector[1] * m];
    }

    /***********************************\
    *       THIS IS WHAT WE EDIT        *
    \***********************************/

    function findDestination() {
        var player = getPlayer()[0]; // has important properties X, Y, size
        var interNodes = getMemoryCells();

        if ( /*!toggle*/ 1) {
            var useMouseX = (getMouseX() - getWidth() / 2 + getX() * getRatio()) / getRatio();
            var useMouseY = (getMouseY() - getHeight() / 2 + getY() * getRatio()) / getRatio();
            tempPoint = [useMouseX, useMouseY, 1];

            var tempMoveX = getPointX();
            var tempMoveY = getPointY();

            // yay logic here

            var buffer = 300;
            var foodScope = 500;

            var enemies = [];

            var enemies = getAllThreats(player);

            for (enemyNumber = 0; enemyNumber < enemies.length; enemyNumber++) {
                if (enemies[enemyNumber].size * 1.1 > player.size * 2) {
                    drawCircle(enemies[enemyNumber].x, enemies[enemyNumber].y, enemies[enemyNumber].size + buffer * 2, '#F2FF00');
                } else {
                    drawCircle(enemies[enemyNumber].x, enemies[enemyNumber].y, enemies[enemyNumber].size + buffer, '#F2FF00');
                }
            }

            enemies = enemies.filter(function(enemy) {
                if (enemy.size * 1.1 > player.size * 2) { // Work extra hard to avoid enemies that are big enough to split at you (with space)
                    return computeDistance(player.x, player.y, enemy.x, enemy.y) <= player.size + enemy.size + buffer * 2;
                } else {
                    return computeDistance(player.x, player.y, enemy.x, enemy.y) <= player.size + enemy.size + buffer;
                }
            });

            var viruses = [];

            if (player.size >= 133) {
                viruses = getAllViruses(player).filter(function(enemy) {
                    return computeDistance(player.x, player.y, enemy.x, enemy.y) <=  player.size + enemy.size + buffer;
                });
            }

            var enemyAngles = [];
            var clusterAngles = [];

            var food = getAllFood(player);
            var allClustersAndFood = clusterFood(food, player.size);

            //get individual food items
            var closestFoodItem;
            var foodDist = Infinity;
            var obtainableFood = food
                .filter(function(foodItem) { // [index][0] is x and [index][1] is y
                    var safe = true;
                    for (var i = 0; i < enemies.length; i++) {
                        var enemy = enemies[i];
                        if (enemy.size * 1.1 > player.size * 2) {
                            if (computeDistance(foodItem[0], foodItem[1], enemy.x, enemy.y) <= enemy.size + buffer * 2) {
                                safe = false;
                                break;
                            }
                        } else {
                            if (computeDistance(foodItem[0], foodItem[1], enemy.x, enemy.y) <= enemy.size + buffer) {
                                safe = false;
                                break;
                            }
                        }
                    }
                    if (safe) {
                        return computeDistance(player.x, player.y, foodItem[0], foodItem[1]) <= player.size + foodScope;
                    }
                    return false;
                })
                .map(function(foodItem) {
                    var newItem = foodItem;
                    newItem.dist = computeDistance(player.x, player.y, foodItem[0], foodItem[1]);
                    return newItem;
                });
            
            for (var i = 0; i < obtainableFood.length; i++) {
                var food = obtainableFood[i];
                var curDist = computeDistance(player.x, player.y, food[0], food[1]);
                if (curDist < foodDist) {
                    foodDist = curDist;
                    closestFoodItem = food;
                }
                drawCircle(food[0], food[1], 25, '#F2FF00');
            }


            //get minor clusters
            var closestFoodCluster;
            var clusterDist = Infinity;

            var foodClusters = getMinorClusters(allClustersAndFood)
                .filter(function(cluster) {
                    var safe = true;
                    for (var i = 0; i < enemies.length; i++) {
                        var enemy = enemies[i];
                        if (enemy.size * 1.1 > player.size * 2) {
                            if (computeDistance(cluster[0], cluster[1], enemy.x, enemy.y) <= enemy.size + buffer * 2) {
                                safe = false;
                                break;
                            }
                        } else {
                            if (computeDistance(cluster[0], cluster[1], enemy.x, enemy.y) <= enemy.size + buffer) {
                                safe = false;
                                break;
                            }
                        }
                    }
                    if (safe) {
                        return computeDistance(player.x, player.y, cluster[0], cluster[1]) <= player.size + foodScope;
                    }
                    return false;
                })
                .map(function(cluster) {
                    var newCluster = cluster;
                    newCluster.dist = computeDistance(player.x, player.y, cluster[0], cluster[1]);
                    return newCluster;
                });

            for (var i = 0; i < foodClusters.length; i++) {
                var cluster = foodClusters[i];
                var curDist = computeDistance(player.x, player.y, cluster[0], cluster[1]);
                if (curDist < clusterDist) {
                    clusterDist = curDist;
                    closestFoodCluster = cluster;
                }
                drawCircle(cluster[0], cluster[1], 25, '#F2FF00');
            }

            if (enemies.length > 0) { // get away from enemies
                for (var i = 0; i < enemies.length; i++) {
                    var enemy = enemies[i];
                    enemies[i].dist = computeDistance(player.x, player.y, enemy.x, enemy.y);
                    enemies[i].angle = getAngle(player.x, player.y, enemy.x, enemy.y);
                    enemies[i].vector = getVector(player.x, player.y, enemy.x, enemy.y);
                    var moveAwayVector = multiplyVector(enemy.vector, -1);
                    tempMoveX += moveAwayVector[0];
                    tempMoveY += moveAwayVector[1];
                }
                var amountMoved = computeDistance(getPointX(), getPointY(), tempMoveX, tempMoveY);
                if (amountMoved <= 10) { // not moving could be sign of being surrounded, try different approach
                    tempMoveX = getPointX();
                    tempMoveY = getPointY();
                    var enemyAverageX = 0;
                    var enemyAverageY = 0;
                    
                    for (var i = 0; i < enemies.length; i++) {
                        var enemy = enemies[i];
                        enemyAverageX += enemy.x;
                        enemyAverageY += enemy.y;
                    }
                    
                    enemyAverageX /= enemies.length;
                    enemyAverageY /= enemies.length;
                    var moveAwayVector = multiplyVector([enemyAverageX, enemyAverageY], -1);
                    tempMoveX += moveAwayVector[0];
                    tempMoveY += moveAwayVector[1];
                }
            }

            if (enemies.length == 0) {
                if (foodClusters.length > 0) {
                    closestFoodCluster.vector = getVector(player.x, player.y, closestFoodCluster[0], closestFoodCluster[1]);
                    var foodVector = closestFoodCluster.vector;
                    tempMoveX = closestFoodCluster[0];
                    tempMoveY = closestFoodCluster[1];
                    drawCircle(closestFoodCluster[0], closestFoodCluster[1], 25, '#F2FF00');
                } else if (obtainableFood.length > 0) {
                    closestFoodItem.vedtor = getVector(player.x, player.y, closestFoodItem[0], closestFoodItem[1]);
                    var foodVector = closestFoodItem.vector;
                    tempMoveX = closestFoodItem[0];
                    tempMoveY = closestFoodItem[1];
                    drawCircle(closestFoodItem[0], closestFoodItem[1], 25, '#F2FF00');
                    console.log(foodClusters);
                } else {
                    /* Move in a seemingly random direction if there's nothing better to do */
                    var pseudoRandDir = getCurrentScore() / 25; /* "Random" direction is based on the current score because the score won't change until something interesting happens, at which point this won't be running any more */
                    tempMoveX = Math.sin(pseudoRandDir) * 500;
                    tempMoveY = Math.cos(pseudoRandDir) * 500;
                }
            }

            tempMoveX = Math.min(tempMoveX, 7043);
            tempMoveY = Math.min(tempMoveY, 7043);
            tempMoveX = Math.max(tempMoveX, -7043);
            tempMoveY = Math.max(tempMoveY, -7043);

            drawLine(player.x, player.y, tempMoveX, tempMoveY);

            return [tempMoveX, tempMoveY];  // X and Y coordinates to move to
        }
    }

    function screenToGameX(x) {
        return (x - getWidth() / 2) / getRatio() + getX();
    }

    function screenToGameY(y) {
        return (y - getHeight() / 2) / getRatio() + getY();;
    }

    function drawPoint(x_1, y_1, drawColor, text) {
        f.drawPoint(x_1, y_1, drawColor, text);
    }

    function drawArc(x_1, y_1, x_2, y_2, x_3, y_3, drawColor) {
        f.drawArc(x_1, y_1, x_2, y_2, x_3, y_3, drawColor);
    }

    function drawLine(x_1, y_1, x_2, y_2, drawColor) {
        f.drawLine(x_1, y_1, x_2, y_2, drawColor);
    }

    function drawCircle(x_1, y_1, radius, drawColor) {
        f.drawCircle(x_1, y_1, radius, drawColor);
    }

    function screenDistance() {
        var temp = f.getScreenDistance();
        return temp;
    }

    function getDarkBool() {
        return f.getDarkBool();
    }

    function getMassBool() {
        return f.getMassBool();
    }

    function getMemoryCells() {
        return f.getMemoryCells();
    }

    function getCellsArray() {
        return f.getCellsArray();
    }

    function getCells() {
        return f.getCells();
    }

    function getPlayer() {
        return f.getPlayer();
    }

    function getWidth() {
        return f.getWidth();
    }

    function getHeight() {
        return f.getHeight();
    }

    function getRatio() {
        return f.getRatio();
    }

    function getOffsetX() {
        return f.getOffsetX();
    }

    function getOffsetY() {
        return f.getOffsetY();
    }

    function getX() {
        return f.getX();
    }

    function getY() {
        return f.getY();
    }

    function getPointX() {
        return f.getPointX();
    }

    function getPointY() {
        return f.getPointY();
    }

    function getMouseX() {
        return f.getMouseX();
    }

    function getMouseY() {
        return f.getMouseY();
    }

    function getUpdate() {
        return f.getLastUpdate();
    }
})(window, jQuery);
