import express = require("express");
import http = require("http");
import path = require("path");
import fs = require("fs");
require("better-logging")(console);

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "client")))

let clicks = 0;
let color = randomColor();

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
        clicks++;
        color = randomColor();
        io.emit("click", clicks, color);
        saveData(clicks,color);
    });

});

server.listen(8000, () => {
    console.info('Server listening on port 80');
});

