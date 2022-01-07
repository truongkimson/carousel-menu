const R = 400;
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const drawCircle = (x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.stroke();
}

const center = {x: 500, y: 500, z: 0};

const isoAngle = Math.PI / 6;
const project = (x, y, z) => {
    const delX = Math.cos(isoAngle);
    const delY = Math.sin(isoAngle);
    const delZ = 0.5;
    return [x * delX + y * delY, x * delX + z * delZ]; 
}

// draw 10 circle shapes in a circular pattern
// mu is starting angle
const render = (mu) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 10; i++) {
        const angle = mu + i * (Math.PI / 5);
        const x = center.x + R * Math.sin(angle);
        const y = center.y - R * Math.cos(angle);
        drawCircle(...project(x, y, 0));
        ctx.font = "20px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(i + 1, ...project(x, y, 0));
        ctx.fillText("x", ...project(center.x, center.y, center.z));
     }
}

render(0);


const dotProd = (a, b) => a.map((_, i) => a[i] * b[i]).reduce((m, n) => m + n);

const getDeltaPhi = (x1, y1, x2, y2) => {
    const [xCenter, yCenter] = project(center.x, center.y, center.z);
    const lastVector = [x1 - xCenter, y1 - yCenter];
    const currVector = [x2 - xCenter, y2 - yCenter];
    const dot = dotProd(lastVector, currVector);
    const det = lastVector[0] * currVector[1] - lastVector[1] * currVector[0];
    return Math.atan2(det, dot);
}

let isScanning = false;
let lastX, lastY;
let currOrientation = 0;

window.addEventListener("mousedown", (e) => {
    isScanning = true;
    lastX = e.clientX;
    lastY = e.clientY;
})

window.addEventListener("mouseup", (e) => {
    isScanning = false;
})

window.addEventListener("mousemove", (e) => {
    if (isScanning) {
        const deltaPhi = getDeltaPhi(lastX, lastY, e.clientX, e.clientY);
        currOrientation -= deltaPhi * 0.5;
        lastX = e.clientX;
        lastY = e.clientY;
        render(currOrientation);
    }
})
