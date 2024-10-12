const canvas = document.getElementById('gamecanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const birdimg = new Image();
birdimg.src = 'images/bird.png'; 
const slingimg = new Image();
slingimg.src = 'images/slingst.png'; 
const ground = new Image();
ground.src = 'images/base.png';

let bird = {
    x: 440,
    y: 600, 
    radius: 30,
    isFly: false,
    velocityX: 0,
    velocityY: 0,
    gravity: 0.5,  
    isOnSling: true,
};

let isDrag = false;
let startX, startY;
const groundHeight = 850;

function drawBird(){
    ctx.drawImage(birdimg, bird.x - bird.radius, bird.y - bird.radius, bird.radius * 2, bird.radius * 2);
}

function drawGround() {
    ctx.drawImage(ground, 0, groundHeight, canvas.width, 200);
}

function drawsling() {
    ctx.drawImage(slingimg, 260, 500, 300, 400); 

    
    if (bird.isOnSling) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;

        // Left sling line
        ctx.beginPath();
        ctx.moveTo(380, 560); 
        ctx.lineTo(bird.x, bird.y);
        ctx.stroke();
        ctx.closePath();

        // Right sling line
        ctx.beginPath();
        ctx.moveTo(490, 550); 
        ctx.lineTo(bird.x, bird.y);
        ctx.stroke();
    }
}

function applyGravity() {
    
    if (bird.isFly) {
        bird.x += bird.velocityX;
        bird.y += bird.velocityY;
        bird.velocityY += bird.gravity;

        
        if (bird.y + bird.radius >= groundHeight) {
            bird.y = groundHeight - bird.radius;
            bird.isFly = false;
            bird.isOnSling = false;  
        }
    }
}

function newani() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawsling();
    drawBird();
    drawGround();
    applyGravity();

    requestAnimationFrame(newani);
}

canvas.addEventListener('mousedown', (para) => {
    if (!bird.isFly && bird.isOnSling) {
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

canvas.addEventListener('mouseup', () => {
    if (isDrag) {
        
        bird.velocityX = (startX - bird.x) * 0.2;
        bird.velocityY = (startY - bird.y) * 0.2;
        bird.isFly = true;
        bird.isOnSling = false;  
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
