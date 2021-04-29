const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

const mado = {
    x: 10,
    y: 10,
    width: 100,
    height: 100
}

const madoLoca = {
    topRight: {
        x: mado.x + mado.width,
        y: mado.y
    },
    bottomLeft: {
        x: mado.x,
        y: mado.y + mado.height
    }
}

const userRect = {
    x: 500,
    y: 320,
    width: 100,
    height: 100
}

var userLoca = {
    topRight: {
        x: userRect.x + userRect.width,
        y: userRect.y
    },
    bottomLeft: {
        x: userRect.x,
        y: userRect.y + userRect.width
    }
}

console.log(madoLoca, userLoca);

function madoDraw() {
    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.rect(mado.x, mado.y, mado.width, mado.height);
    ctx.fill();
    ctx.closePath();
}

function userDraw() {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.rect(userRect.x, userRect.y, userRect.width, userRect.height);
    ctx.fill();
    ctx.closePath();
}

function hikariDraw() {
    ctx.beginPath();
    var gradation = ctx.createLinearGradient(55, 0, userLoca.topRight.x - 50, userLoca.bottomLeft.y - 50);
    gradation.addColorStop(0, 'rgba(229, 88, 95, 1)');
    gradation.addColorStop(1, 'rgba(229, 88, 95, 0)');
    ctx.fillStyle = gradation;
    ctx.lineTo(madoLoca.topRight.x, madoLoca.topRight.y);
    ctx.lineTo(userLoca.topRight.x, userLoca.topRight.y);
    ctx.lineTo(userLoca.bottomLeft.x, userLoca.bottomLeft.y);
    ctx.lineTo(madoLoca.bottomLeft.x, madoLoca.bottomLeft.y);
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    userDraw();
    hikariDraw();
    madoDraw();
    requestAnimationFrame(draw);
}

function downHandle(e) {
    console.log(e.clientX, e.clientY);
    canvas.addEventListener('mousemove', moveHandle);
}

function upHandle() {
    console.log(userLoca);
    canvas.removeEventListener('mousemove', moveHandle);
}

function moveHandle(e) {
    let x = e.clientX;
    let y = e.clientY;
        userLoca = {
            topRight: {
                x: userRect.x + userRect.width,
                y: userRect.y
            },
            bottomLeft: {
                x: userRect.x,
                y: userRect.y + userRect.width
            }
        }
        userRect.x = e.clientX - userRect.width / 2;
        userRect.y = e.clientY - userRect.height / 2;
}

canvas.addEventListener('mousedown', downHandle);
canvas.addEventListener('mouseup', upHandle);

draw();