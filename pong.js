/*
 * PONG - Play the earliest arcade video games in Minecraft!
 *
 * Pong is a 2D sports game that simulates table tennis.
 * Player controls a paddle on the right side of the screen, and hit a ball back and forth.
 * The aim is to reach eleven points before the opponent. Points are earned when one fails
 * to return the ball to the other.
 *
 * # Install: 
 * 1. Put pong.js into your MapPainting folder.
 * 2. type "/mpp create script <map name> pong.js" in game.
 * 3. HAVE FUN!
 * 
 * # Controls
 * Left-Tap the screen to move your paddle, Right-Tap to pause.
 */


var COLOR_WHITE = new java.awt.Color(1.0, 1.0, 1.0);
var COLOR_BLACK = new java.awt.Color(0.0, 0.0, 0.0);

function paintPoint(pos_x, pos_y, size) {
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            g.set(pos_x + i, pos_y + j, COLOR_WHITE);
        }
    }
}

function paintPong() {
    paintPoint(Math.round(c.pong_pos_x - 1.0), Math.round(c.pong_pos_y - 1.0), 3)
}

function paintPad() {
    g.color(COLOR_WHITE);
    for (var i = 1; i < 3; i++) {
        a.line.line(g, i, c.enemy_pos - 12, i, c.enemy_pos + 12);
    }
    for (var i = 126; i > 124; i--) {
        a.line.line(g, i, c.player_pos - 12, i, c.player_pos + 12);
    }
}

function paintScore() {
    g.color(COLOR_WHITE);
    a.string.center.string(g, 31, 106, 2, "" + c.failed);
    a.string.center.string(g, 95, 106, 2, "" + c.score);
}

function paintSplit() {
    for (var i = 0; i < 128; i += 2) {
        g.set(63, i, COLOR_WHITE);
    }
}

function updatePlayer() {
    if (c.player_dest - c.player_pos >= 80) {
        c.player_pos += 7;
    } else if (c.player_dest - c.player_pos <= -80) {
        c.player_pos -= 7;
    } else if (c.player_dest - c.player_pos >= 50) {
        c.player_pos += 6;
    } else if (c.player_dest - c.player_pos <= -50) {
        c.player_pos -= 6;
    } else if (c.player_dest - c.player_pos >= 30) {
        c.player_pos += 5;
    } else if (c.player_dest - c.player_pos <= -30) {
        c.player_pos -= 5;
    } else if (c.player_dest - c.player_pos >= 4) {
        c.player_pos += 4;
    } else if (c.player_dest - c.player_pos <= -4) {
        c.player_pos -= 4;
    } else {
        c.player_pos = c.player_dest;
    }
}

function updateEnemy() {
    var enemy_dest = c.pong_pos_y + c.enemy_dest_offset;
    if (enemy_dest - c.enemy_pos >= 100) {
        c.enemy_pos += 5;
    } else if (enemy_dest - c.enemy_pos <= -100) {
        c.enemy_pos -= 5;
    } else if (enemy_dest - c.enemy_pos >= 50) {
        c.enemy_pos += 3;
    } else if (enemy_dest - c.enemy_pos <= -50) {
        c.enemy_pos -= 3;
    } else if (enemy_dest - c.enemy_pos >= 10) {
        c.enemy_pos += 2;
    } else if (enemy_dest - c.enemy_pos <= -10) {
        c.enemy_pos -= 2;
    } else if (enemy_dest > c.enemy_pos >= 1) {
        c.enemy_pos++;
    } else if (enemy_dest - c.enemy_pos <= -1) {
        c.enemy_pos--;
    }
}

function onUpdate() {
    updatePlayer();
    updateEnemy();
    if (c.pong_pos_x <= 4.0) {
        if (c.enemy_pos + 13.0 > c.pong_pos_y && c.enemy_pos - 13.0 < c.pong_pos_y) {
            c.pong_vec_x = -(c.pong_vec_x);
            c.pong_vec_y = (c.pong_pos_y - c.enemy_pos) / 3.0 + Math.random() * 2.0 - 1.0;
        } else {
            c.score++;
            setNewPong();
        }
    } else if (c.pong_pos_x >= 123.0) {
        if (c.player_pos + 13.0 > c.pong_pos_y && c.player_pos - 13.0 < c.pong_pos_y) {
            c.pong_vec_x = -(c.pong_vec_x);
            c.pong_vec_y = (c.pong_pos_y - c.player_pos) / 3.0 + Math.random() * 2.0 - 1.0;
        } else {
            c.failed++;
            setNewPong();
        }
    } else if (c.pong_pos_y < 1.0 || c.pong_pos_y > 126.0) {
        c.pong_vec_y = -(c.pong_vec_y);
    }
    c.pong_pos_x += c.pong_vec_x;
    c.pong_pos_y += c.pong_vec_y;
    if (c.failed >= 11) {
        c.stat = "end";
        onPaintDie();
        return false;
    }
    if (c.score >= 11) {
        c.stat = "end";
        onPaintWin();
        return false;
    }
    return true;
}

function onRepaint(stat) {
    g.clear(COLOR_BLACK);
    paintScore();
    paintSplit();
    paintPad();
    paintPong();
}

function onPaintStart() {
    g.clear(COLOR_BLACK);
    g.color(COLOR_WHITE);
    a.string.center.string(g, 63, 80, 3, "PONG");
    a.string.center.string(g, 63, 60, 1, "DELUXGHOST");
    a.string.center.string(g, 63, 52, 1, "PRESENT");
    a.string.center.string(g, 63, 32, 1, "TAP TO START");
}

function onPaintPause() {
    g.clear(COLOR_BLACK);
    g.color(COLOR_WHITE);
    a.string.center.string(g, 63, 80, 3, "PAUSED");
    a.string.center.string(g, 63, 32, 1, "TAP TO RESUME");
}

function onPaintDie() {
    g.clear(COLOR_BLACK);
    g.color(COLOR_WHITE);
    a.string.center.string(g, 63, 80, 3, "YOU LOSE");
    a.string.center.string(g, 63, 32, 1, "TAP TO REPLAY");
}

function onPaintWin() {
    g.clear(COLOR_BLACK);
    g.color(COLOR_WHITE);
    a.string.center.string(g, 63, 80, 3, "YOU WIN");
    a.string.center.string(g, 63, 32, 1, "TAP TO REPLAY");
}

function clearData() {
    c.player_pos = 63;
    c.enemy_pos = 63;
    c.player_dest = 63;
    c.enemy_dest_offset = 0;
    c.pong_pos_x = 63.0;
    c.pong_pos_y = 63.0;
    c.pong_vec_x = 0.0;
    c.pong_vec_y = 0.0;
    c.failed = 0;
    c.score = 0;
    c.stat = "start";
    c.wait = 0;
}

function setNewPong() {
    c.pong_pos_x = 63.0;
    c.pong_pos_y = 63.0;
    c.enemy_dest_offset = Math.random() * 12 - 6;
    if (Math.random() < 0.5) {
        c.pong_vec_x = 2.5;
    } else {
        c.pong_vec_x = -2.5;
    }
    c.pong_vec_y = (Math.random() - 0.5) * 1.3;
    c.stat = "wait";
}

function onPlayerTap(x, y, player, right) {
    if (c.stat == "start") {
        c.stat = "game";
        setNewPong();
        onRepaint();
    } else if (c.stat == "game" && right) {
        c.stat = "pause";
        onPaintPause();
    } else if (c.stat == "game" && !right) {
        c.player_dest = y;
    } else if (c.stat == "wait" && right) {
        c.stat = "pause";
        onPaintPause();
    } else if (c.stat == "wait" && !right) {
        c.player_dest = y;
    } else if (c.stat == "pause") {
        c.stat = "game";
        onRepaint();
    } else if (c.stat == "end") {
        clearData();
        c.stat = "start";
        onPaintStart();
    }
    g.repaint();
}

function onTick() {
    if (c.stat == "game") {
        if (onUpdate()) {
            onRepaint();
        }
    } else if (c.stat == "wait") {
        updatePlayer()
        onRepaint();
        c.wait++;
    }
    if (c.wait > 20) {
        c.wait = 0;
        c.stat = "game";
    }
    g.repaint();
}

function main() {
    g.clear(COLOR_BLACK);
    i.hotspot(null, "onPlayerTap", 0, 0, 127, 127);
    i.tick(null, "onTick");
    clearData();
    onPaintStart();
    g.repaint();
}
