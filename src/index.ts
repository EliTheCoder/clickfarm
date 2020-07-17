import express = require("express");
import http = require("http");
import path = require("path");
import fs = require("fs");
import _ = require("lodash");
const pm2io = require("@pm2/io")
require("better-logging")(console);

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "client")))

let clicks = 0;
let color = randomColor();

let cooldown = {};

if (fs.existsSync("./data.json")) {
    const data = JSON.parse(fs.readFileSync("./data.json", "utf8"));
    clicks = data.clicks;
    color = data.color;
}

function randomColor() {
    return [
        Math.floor(Math.random() * 150) + 75,
        Math.floor(Math.random() * 150) + 75,
        Math.floor(Math.random() * 150) + 75
    ];
}

function saveData(cli, col) {
    fs.writeFileSync("./data.json", JSON.stringify({ clicks: cli, color: col }));
}

process.on("exit", () => saveData(clicks, color));

io.on("connection", (socket) => {

    socket.emit("color", color);
    socket.emit("clicks", clicks);

    socket.on("click", () => {
        if (cooldown[socket.id] === undefined) cooldown[socket.id] = false;
        if (cooldown[socket.id] === true) return;
        cooldown[socket.id] = true;
        clicks++;
        color = randomColor();
        clicksmetric.set(clicks);
        io.emit("click", clicks, color);
        saveData(clicks, color);
    });

});

setInterval(() => {
    cooldown = _.mapValues(cooldown, () => false);
}, 100)

server.listen(8080, () => {
    console.info("Server listening on port 8080");
});

pm2io.init({
    transactions: true,
    http: true
});

const clicksmetric = pm2io.metric({
    name: "Clicks"
});