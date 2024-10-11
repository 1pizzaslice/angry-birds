const canvas = document.getElementById('gamecanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const birdimg = new Image();
birdimg.src = 'images/bird.png'; 
const slingimg = new Image();
slingimg.src = 'images/slingst.png'; 

let bird = {
    x: 440,
    y: 600, 
    radius: 30,
    isFly: false,
};

let isDrag = false;
let startX, startY;

function drawBird(){
    ctx.drawImage(birdimg, bird.x - bird.radius, bird.y - bird.radius, bird.radius * 2, bird.radius * 2);
}

function drawsling(){
    ctx.drawImage(slingimg, 260, 500, 300, 400); 
    if (bird.isFly) return; //(to disappear stroke)

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(380, 560); 
    ctx.lineTo(bird.x, bird.y);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(490,550); 
    ctx.lineTo(bird.x, bird.y);
    ctx.stroke();
}

function newani() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawsling();
    drawBird();

    requestAnimationFrame(newani);
}

canvas.addEventListener('mousedown',(para) => {
    if (!bird.isFly) {
        isDrag = true;
        startX = para.clientX;
        startY = para.clientY;
    }
});

canvas.addEventListener('mousemove',(para) =>{
    if (isDrag) {
        bird.x = para.clientX;
        bird.y = para.clientY; 
    }
});

canvas.addEventListener('mouseup',() =>{
    if (isDrag) {
        bird.dx = startX - bird.x;
        bird.dy = startY - bird.y;
        bird.isFly = true;
        isDrag = false;
    }
});

let imgs = 0;
const total = 2; 

birdimg.onload = slingimg.onload = () => {
    imgs++;
    if (imgs === total) {
        newani(); 
    }
};
