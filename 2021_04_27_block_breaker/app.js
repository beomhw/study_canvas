const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth * 2;
canvas.height = innerHeight * 2;

const lo = {x: canvas.width / 2, y: canvas.height - 50};
const d = {x: 7, y: -7};
const radius = 30;

const paddle = {width: 300, height: 20};
var paddleX = (canvas.width - paddle.width) / 2;

// 처음에 제어 버튼을 누르지 않아서 false
const press = {right: false, left: false}; 

// 벽돌 설정
const brick = {
    rowCount: 4,
    columnCount: 5,
    width: 200,
    height: 30,
    padding: 50,
    offsetTop: 50,
    offsetLeft: canvas.width / 5
}

const bricks = [];
for(let i = 0; i < brick.columnCount; i++) {
    bricks[i] = [];
    for(let j = 0; j < brick.rowCount; j++) {
        bricks[i][j] = {x : 0, y : 0, status: true, color: randomColor()};
    }
}

var score = 0;

var lives = 3;

function drawLives() {
    ctx.font = '24px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText(`Lives : ${lives}`, canvas.width - 100, 20);
}

function drawScore() {
    ctx.font = '24px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText(`Score: ${score}`, 40, 30);
}

function drawBricks() {
    for(let i = 0; i < brick.columnCount; i++) {
        for(let j = 0; j < brick.rowCount; j++) {
            if(bricks[i][j].status) {
                let brickX = (i * (brick.width + brick.padding)) + brick.offsetLeft;
                let brickY = (j * (brick.height + brick.padding)) + brick.offsetTop;
                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brick.width, brick.height);
                ctx.fillStyle = bricks[i][j].color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function paddleDraw() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddle.height - 10, paddle.width, paddle.height);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawBall(color) {
    ctx.beginPath();
    ctx.arc(lo.x, lo.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function randomColor() {
    let hex = '0123456789ABCDEF';
    let color = '#';
    for(let i = 0; i < 6; i++) {
        color += hex.charAt(Math.random() * 16);
    }

    return color;
}

var color = randomColor();

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawLives();
    drawBricks();
    drawBall(color);
    paddleDraw();
    drawScore();

    if(lo.x + d.x > canvas.width - radius || lo.x + d.x < radius){
        color = randomColor();
        d.x = -d.x;
    }
    if(lo.y + d.y < radius) {
        color = randomColor();
        d.y = -d.y;
    } 
    else if(lo.y + d.y > canvas.height - radius) {
        lives--;
        if(!lives) {
            alert('game over');
            document.location.reload();
        } else {
            lo.x = canvas.width / 2;
            lo.y = canvas.height - 50;
            d.x = 7;
            d.y = -7;
            paddleX = (canvas.width - paddle.width) / 2;
        }
    }
    if(lo.x > paddleX && lo.x < paddleX + paddle.width && lo.y >= canvas.height - 50) {
        console.log('공 ',lo.y);
        console.log('패들 ',canvas.height - paddle.height - 10);
        color = randomColor();
        d.y += 1;
        d.x += 1;
        d.y = -d.y;
    }

    collisionDetection();

    if(press.right) {
        paddleX += 5;
        if(paddleX + paddle.width > canvas.width) {
            paddleX = canvas.width - paddle.width;
        }
    } else if(press.left) {
        paddleX -= 5;
        if(paddleX < 0) {
            paddleX = 0;
        }
    }

    lo.x += d.x;
    lo.y += d.y;
    requestAnimationFrame(draw);
}

function keyDownHandler(e) {
    if(e.key == 'Right' || e.key == 'ArrowRight') {
        press.right = true;
    } else if(e.key == 'Left' || e.key == 'ArrowLeft') {
        press.left = true;
    }
    console.log(press);
}

function keyUpHandler(e) {
    if(e.key == 'Right' || e.key == 'ArrowRight') {
        press.right = false;
    } else if(e.key == 'Left' || e.key == 'ArrowLeft') {
        press.left = false;
    }
}

function collisionDetection() {
    for(let i = 0; i < brick.columnCount; i++) {
        for(let j = 0; j < brick.rowCount; j++) {
            var b = bricks[i][j];
            // 공의 x 좌표는 벽돌의 x 좌표보다 커야 함
            // 공의 x 좌표는 벽돌의 x 좌표 + 가로 길이 보다 작아야함
            // 공의 y 좌표는 벽돌의 y 좌표보다 커야 함
            // 공의 y 좌표는 벽돌의 y 좌표 + 높이 보다 작아야 함
            if(b.status) {
                if(lo.x > b.x && lo.x < b.x + brick.width && lo.y > b.y && lo.y < b.y + brick.height) {
                    d.y = -d.y;
                    b.status = false;
                    score += 10;
                    if(score == (brick.rowCount * brick.columnCount) * 10) {
                        alert('WIN !');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX * 2 - paddle.width / 2;
    paddleX = relativeX;
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

window.addEventListener('resize', function() {
    canvas.width = innerWidth * 2;
    canvas.height = innerHeight * 2;
    draw();
})

draw();