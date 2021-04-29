import {Aoba} from './Aoba.js';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth * 2;
canvas.height = innerHeight * 2;

const move = 3;
var aobas = [];

function drawAoba() {
    for(let i = 0; i < aobas.length; i++) {
        ctx.beginPath();
        ctx.drawImage(aobas[i].img, aobas[i].x, aobas[i].y);
        ctx.fill();
        ctx.closePath();
    }
}

function drawText() {
    ctx.beginPath();
    ctx.font = '128px Arial';
    ctx.fillText('青葉', canvas.width / 2 - 100, 200);
    ctx.fill();
    ctx.closePath();
}

function draw() {
    window.addEventListener('resize', resize);
    ctx.clearRect(0,0,canvas.width, canvas.height);
    drawText();
    if(aobas.length > 0) { 
        drawAoba();
        aobaMove();
    }
    requestAnimationFrame(draw);
    window.removeEventListener('resize', resize);
}

function resize() {
    canvas.width = innerWidth * 2;
    canvas.height = innerHeight * 2;
    drawAoba();
}

setInterval(aobaGenerate, 2000);

function aobaMove() {
    for(let i = 0; i < aobas.length; i++) {
        if(aobas[i].status) {
            aobas[i].x -= move;
        }
        if(aobas[i].x + 200 < 0) {
            aobas.splice(i, 1);
        }
    }
}

function aobaGenerate () {
    let random = {
        x: canvas.width + 200,
        y: Math.ceil(Math.random() * canvas.height)
    }
    aobas.push(new Aoba(random));
    console.log(aobas);
}

function downHandle (e) {
    let x = e.clientX * 2;
    let y = e.clientY * 2;
    for(let i = 0; i < aobas.length; i++) {
        if(x > aobas[i].x && x < aobas[i].x + 200 && y > aobas[i].y && y < aobas[i].y + 150) {
            aobas[i].status = false;
            document.addEventListener('mousemove', moveHandle);
        }
    }
}

function upHandle () {
    document.removeEventListener('mousemove', moveHandle);
    aobas.map(ab => ab.status = true);
}

function moveHandle (e) {
    let x = e.clientX * 2;
    let y = e.clientY * 2;
    aobas.map(ab => {
        if(!ab.status) {
            ab.x = x - 100;
            ab.y = y - 75;
            return {...ab, x: x - 100, y: y - 75}
        } 
    })
}

document.addEventListener('mousedown', downHandle);
document.addEventListener('mouseup', upHandle);

draw();