const socket = io();

let clicks: number = 0;
let seizure: boolean = false;
let color: number[] = [255, 255, 255];

socket.on("click", (cli: number, col: number[]) => {
    clicks = cli;
    if (seizure = true) {
    if (color[0] < col[0]) {
     color[0] += 25
    } else {
     color[0] -= 25
    }
    if (color[1] < col[1]) {
     color[1] += 25
    } else {
     color[1] -= 25
    }
    if (color[2] < col[2]) {
    color[2] += 25
    } else {
     color[2] -= 25
    }
} else {
    color = col;
}
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

document.onclick = () => {
    clicks++;
    updateDisplays();
    socket.emit("click");
}; 

function updateDisplays() {
    document.getElementById("clicks").innerHTML = clicks.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("body").style.backgroundColor = `rgb(${color[0]},${color[1]},${color[2]})`
}

