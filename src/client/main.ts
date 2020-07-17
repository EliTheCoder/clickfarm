const socket = io();

let clicks: number = 0;
let color: number[] = [255, 255, 255];

socket.on("click", (cli: number, col: number[]) => {
    clicks = cli;
    color = col;
    updateDisplays();
})

socket.on("clicks", (c: number) => {
    clicks = c;
    updateDisplays();
});

socket.on("color", (c: number[]) => {
    color = c;
    updateDisplays();
});

$('html').click(() => {
    socket.emit("click")
}); 

function updateDisplays() {
    document.getElementById("clicks").innerHTML = clicks.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("body").style.backgroundColor = `rgb(${color[0]},${color[1]},${color[2]})`
}

