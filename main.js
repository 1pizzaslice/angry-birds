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
const woodimg = new Image();
woodimg.src = 'images/wood2.png';
const pigimg = new Image();
pigimg.src = 'images/pigsp2.png';

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
let shotsRemaining = 4;
let gameIsOver = false;

let isDrag = false;
let startX, startY;
const groundHeight = 850;

function resetBird(){
    bird.x= 440;
    bird.y=660;
    bird.velocityX=0;
    bird.velocityY=0;
    bird.isFly=false;
    bird.isOnSling = true;
}
function checkGameOver(){
    if(shotsRemaining === 0 && bird.isFly === false){
        gameIsOver = true;
        alert("Game Over! Refresh to try again.");
    }
    else if(pigs.length === 0){
        gameIsOver = true;
        alert("You won! Refresh to play again");
    }
    return gameIsOver;
}
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

function isCollidingCircleRect(circle, rect) {
    const distX = Math.abs(circle.x - rect.x - rect.width / 2);
    const distY = Math.abs(circle.y - rect.y - rect.height / 2);

    if (distX > (rect.width / 2 + circle.radius)) { return false; }
    if (distY > (rect.height / 2 + circle.radius)) { return false; }

    if (distX <= (rect.width / 2)) { return true; }
    if (distY <= (rect.height / 2)) { return true; }

    const dx = distX - rect.width / 2;
    const dy = distY - rect.height / 2;
    return (dx * dx + dy * dy <= (circle.radius * circle.radius));
}

function checkCollisions() {
    if(!bird.isFly) return;
    let birdStopped = false;
    // collision with woods
    woods.forEach(wood => {
        if (isCollidingCircleRect(bird, wood)) {
           birdStopped = true;
          
        }
    });

    // collision with pigs
    pigs.forEach(pig => {
        if (isCollidingCircleRect(bird, pig)) {
           birdStopped = true;
            // Remove the pig
            pigs = pigs.filter(p => p !== pig);
            let audio = new Audio("audios/pig dead.mp3");
            audio.play();
        }
    });
}
if(birdStopped){
    bird.velocityX=0;
    bird.velocityY=0;
    bird.isFly = false;
    bird.isOnSling = false;

    if(!checkGameOver()){
        if(shotsRemaining >0){
            shotsRemaining--;
            resetBird();
        }
    }
}
const pigFrames = [
    { sx: 0, sy: 0, width: 170, height: 170 },
    { sx: 170, sy: 0, width: 170, height: 170 },
    { sx: 340, sy: 0, width: 170, height: 170 }, 
    { sx: 510, sy: 0, width: 170, height: 170 } ,
    { sx: 680, sy: 0, width: 170, height: 170 } ,
];
let woods = [
    { x: 1000, y: groundHeight - 100, width: 200, height: 35 },
    { x: 1360, y: groundHeight - 100, width: 200, height: 35 },
    { x: 1200, y: groundHeight - 500, width: 200, height: 35 }, 
];

let pigs = [
    { x: 1070, y: groundHeight - 180, width: 80, height: 80, frameindex:0},
    { x: 1430, y: groundHeight - 180, width: 80, height: 80, frameindex:0 },
    { x: 1270, y: groundHeight - 580, width: 80, height: 80, frameindex:0 },
];

function drawWoods() {
    woods.forEach(wood => {
        ctx.drawImage(woodimg, wood.x, wood.y, wood.width, wood.height);
    });
}

function drawPigs() {
    pigs.forEach(pig => {
        if(!pig.isFall){
            const frame = pigFrames[pig.frameindex];
            ctx.drawImage(pigimg, frame.sx, frame.sy, frame.width, frame.height, pig.x, pig.y, pig.width, pig.height);
          } } 
    );
}
let it=0;
function resetPigs() {
    pigs.forEach(pig => {
       if(it%16== 0)
        pig.frameindex = (pig.frameindex +1)%5;
       it++;
    }
);
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

            if(!checkGameOver()){
                if(shotsRemaining >0){
                    shotsRemaining--;
                    resetBird();
                }
            }
        }
    }
}

function newani() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawsling();
    drawBird();
    drawGround();
    drawWoods();
    drawPigs();
    applyGravity();
    checkCollisions();
   
   resetPigs();
   
    requestAnimationFrame(newani);
}

canvas.addEventListener('mousedown', (para) => {
    if (!bird.isFly && bird.isOnSling) {
        isDrag = true;
        startX = para.clientX;
        startY = para.clientY;
    
    let audio = new Audio("audios/sling shot.mp3");
    audio.play(); }
});

canvas.addEventListener('mousemove',(para) =>{
    if (isDrag) {
        bird.x = para.clientX;
        bird.y = para.clientY; 
    }
   
});
const smokeimg= new Image();
smokeimg.src= 'images/smoke.png';
let smokeform=[];

canvas.addEventListener('mouseup', () => {
    if (isDrag) {
        
        bird.velocityX = (startX - bird.x) * 0.2;
        bird.velocityY = (startY - bird.y) * 0.2;
        bird.isFly = true;
        bird.isOnSling = false;  
        isDrag = false;
        smokeform.push({x: bird.velocityX, y:bird.velocityY});
    let audio = new Audio("audios/shoot-audio.mp3");
    audio.play(); }
});
function drawsmoke(){
    ctx.con =0.5;
    for(let i=0; i< smokeform.length; i++){
        ctx.drawimage(smokeimg, bird.x, bird.y, smokeform[i].x, smokeform[i].y);
    }
   
}
let imgs = 0;
const total = 4; 

birdimg.onload = slingimg.onload = ground.onload = woodimg.onload = pigimg.onload = () => {
    imgs++;
    if (imgs === total) {
        newani(); 
    }
};
