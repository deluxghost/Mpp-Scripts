/*
 * SNAKE - The version of MapPainting
 *
 * Snake is a game where the player maneuvers a line which grows in
 * length, with the line itself being a primary obstacle.
 * The player controls a dot on a bordered plane. As it moves forward,
 * it leaves a trail behind, resembling a moving snake. The snake has
 * a specific length, so there is a moving tail a fixed number of units
 * away from the head. The player loses when the snake runs into the
 * screen border, a trail, or another obstacle.
 *
 * # Install: 
 * 1. Put snake.js into your MapPainting folder.
 * 2. type "/mpp create script <map name> snake.js" in game.
 * 3. HAVE FUN!
 * 
 * # Controls
 * Left-Tap the screen to turn the snake, Right-Tap to pause.
 */

var COLOR_WHITE = new java.awt.Color(1.0, 1.0, 1.0);
var COLOR_GRAY = new java.awt.Color(0.8, 0.8, 0.8);
var COLOR_BLACK = new java.awt.Color(0.0, 0.0, 0.0);
var COLOR_GREEN = new java.awt.Color(0.25, 1.0, 0.0);

function paintPoint(pos_x, pos_y, size, color) {
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            g.set(pos_x + i, pos_y + j, color);
        }
    }
}

function paintFood() {
    g.color(COLOR_WHITE);
    paintPoint(c.food[0], c.food[1], 2, COLOR_GRAY);
}

function paintSnake() {
    for (var i in c.snake) {
        paintPoint(c.snake[i][0], c.snake[i][1], 2, COLOR_GRAY);
    }
}

function eraseTail() {
    paintPoint(c.snake[0][0], c.snake[0][1], 2, COLOR_BLACK);
}

function paintHead() {
    var l = c.snake.length - 1;
    paintPoint(c.snake[l][0], c.snake[l][1], 2, COLOR_GRAY);
}

function paintScore() {
    g.color(COLOR_BLACK);
    for (var i = 121; i < 128; i++) {
        a.line.line(g, 0, i, 127, i);
    }
    g.color(COLOR_WHITE);
    a.string.left.string(g, 1, 120, 1, "SCORE " + c.score);
    a.line.line(g, 0, 120, 127, 120);
}

function paintTitle() {
    g.clear(COLOR_BLACK);
    g.color(COLOR_GREEN);
    a.string.center.string(g, 63, 80, 3, "SNAKE");
    g.color(COLOR_WHITE);
    a.string.center.string(g, 63, 60, 1, "DELUXGHOST");
    a.string.center.string(g, 63, 52, 1, "PRESENT");
    g.color(COLOR_GREEN);
    a.string.center.string(g, 63, 32, 1, "TAP TO START");
}

function paintPause() {
    g.clear(COLOR_BLACK);
    g.color(COLOR_WHITE);
    a.string.center.string(g, 63, 80, 3, "PAUSED");
    a.string.center.string(g, 63, 32, 1, "TAP TO RESUME");
}

function paintEnd() {
    g.clear(COLOR_BLACK);
    g.color(COLOR_WHITE);
    a.string.center.string(g, 63, 85, 3, "G A M E");
    a.string.center.string(g, 63, 62, 3, "O V E R");
    a.string.center.string(g, 63, 40, 1, "SCORE: " + c.score);
    a.string.center.string(g, 63, 32, 1, "TAP TO REPLAY");
}

function setFood() {
    var x = Math.floor(Math.random() * 64) * 2;
    var y = Math.floor(Math.random() * 60) * 2;
    var snake_str = new Array();
    while (snake_str.indexOf("" + x + "," + y) != -1) {
        x = Math.floor(Math.random() * 64) * 2;
        y = Math.floor(Math.random() * 60) * 2;
    }
    c.food = [x, y];
    paintFood();
    g.repaint();
}

function setNewSnake() {
    c.snake = [[68, 60], [66, 60], [64, 60], [62, 60]];
    setFood();
    c.score = 0;
    c.direc = "l";
    c.stat = "wait";
    c.wait = 0;
}

function onPlayerTap(x, y, player, right) {
    if (c.stat == "start") {
        setNewSnake();
        g.clear(COLOR_BLACK);
        paintScore();
        paintSnake();
        paintFood();
    } else if (c.stat == "game" && !right) {
        var l = c.snake.length - 1;
        if (c.direc == 'l' || c.direc == 'r') {
            if (y > c.snake[l][1] + 1) c.direc = 'u';
            if (y < c.snake[l][1]) c.direc = 'd';
        } else if (c.direc == 'u' || c.direc == 'd') {
            if (x > c.snake[l][0] + 1) c.direc = 'r';
            if (x < c.snake[l][0]) c.direc = 'l';
        }
    } else if (c.stat == "game" && right) {
        c.stat = "pause";
        paintPause();
    } else if (c.stat == "wait" && right) {
        c.stat = "pause";
        paintPause();
    } else if (c.stat == "pause") {
        c.stat = "game";
        g.clear(COLOR_BLACK);
        paintScore();
        paintSnake();
        paintFood();
    } else if (c.stat == "end") {
        c.stat = "start";
        paintEnd();
        paintTitle();
    }
    g.repaint();
}

function onTick() {
    if (c.stat == "game" && c.tick == 0) {
        var next = new Array();
        var snake_str = new Array();
        for (var i in c.snake) {
            snake_str.push(c.snake[i].join(","));
        }
        var l = c.snake.length - 1;
        if (c.direc == 'l') {
            next = [c.snake[l][0] - 2, c.snake[l][1]];
        } else if (c.direc == 'r') {
            next = [c.snake[l][0] + 2, c.snake[l][1]];
        } else if (c.direc == 'u') {
            next = [c.snake[l][0], c.snake[l][1] + 2];
        } else if (c.direc == 'd') {
            next = [c.snake[l][0], c.snake[l][1] - 2];
        }
        if (c.food[0] != next[0] || c.food[1] != next[1]) {
            eraseTail();
            c.snake.shift();
        } else {
            c.score++;
            paintScore();
            setFood();
        }
        if (snake_str.indexOf("" + next[0] + "," + next[1]) != -1 || next[0] < 0 || next[0] > 126 || next[1] < 0 || next [1] > 118) {
            c.stat = "end";
            paintEnd();
            g.repaint();
            return;
        }
        c.snake.push(next);
        paintHead();
    } else if (c.stat == "wait") {
        c.wait++;
    }
    if (c.wait > 20) {
        c.wait = 0;
        c.stat = "game";
    }
    c.tick++;
    if (c.tick > 1) c.tick = 0;
    g.repaint();
}

function main() {
    g.clear(COLOR_BLACK);
    i.hotspot(null, "onPlayerTap", 0, 0, 127, 127);
    i.tick(null, "onTick");
    c.stat = "start";
    c.tick = 0;
    paintTitle();
    g.repaint();
}
