var snakeArr = [{ x: 6, y: 6 }];
var food = { x: 5, y: 5 };
let score;
let speed = 4; //default speed
let start = 0;//has values 0, 1, 2 for start, pause, end the game
let lastPainttime = 0;
let inputDirection;
let snakeEle;
let foodEle;


const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');


//handle the speed level
function speedL() {
    if (start == 0)
        speed = speedLevel.value;
}

//handle the start the game, pause the game
function startGame() {

    //started
    if (start == 0) {
        inputDirection = { x: 0, y: 0 }
        snakeArr = [{ x: 6, y: 6 }];
        food = { x: 5, y: 5 };
        play.innerHTML = "Pause";
        score = 0;
        start = 1;
        scoreBox.innerHTML = "Score: " + score;
        musicSound.play();
    }//paused
    else if (start == 1) {
        play.innerHTML = "Start";
        start = 2;
        musicSound.pause();
    } else {//unpaused
        play.innerHTML = "Pause";
        start = 1;
        musicSound.play();
    }
}

function isCollide(snake) {
    //if snake bump into itself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y)
            return true;
    }

    if (snake[0].x < 0 || snake[0].x >= 27 || snake[0].y < 0 || snake[0].y >= 27)
        return true;

    return false;
}



/**This is the main part of the code**/
function gameEngine() {

    //When snake is collide
    if (isCollide(snakeArr)) {
        musicSound.pause();
        gameOverSound.play();
        alert("Game over! You have scored '" + score + "'");
        inputDirection = {}
        snakeArr = [{}];
        food = {x: -1, y:-1};
        score = 0;
        start = 0;
        board.innerHTML = "";
        play.innerHTML = "Start";

    }


    //When Snake takes the food, increse score, size of snake and regenerate the food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {

        foodSound.play();
        score += 1;

        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "High Score: " + hiscoreval;
        }

        scoreBox.innerHTML = "Score: " + score;

        snakeArr.unshift({ x: snakeArr[0].x + inputDirection.x, y: snakeArr[0].y + inputDirection.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };

    }


    //moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--)
        snakeArr[i + 1] = { ...snakeArr[i] };

    snakeArr[0].x += inputDirection.x;
    snakeArr[0].y += inputDirection.y;



    //Display the snake and food
    board.innerHTML = "";
    snakeArr.forEach((value, index) => {

        snakeEle = document.createElement('div');
        snakeEle.style.gridRowStart = value.y;
        snakeEle.style.gridColumnStart = value.x;

        if (index === 0)
            snakeEle.classList.add('head');
        else
            snakeEle.classList.add('snake');

        board.appendChild(snakeEle);

    });

    foodEle = document.createElement('div');
    foodEle.style.gridRowStart = food.y;
    foodEle.style.gridColumnStart = food.x;


    foodEle.classList.add('food');
    board.appendChild(foodEle);

}

//updown-leftright move
window.addEventListener('keydown', (e) => {
    inputDirection = { x: 0, y: 1 };

    if (start == 2)
        return;
    
    switch (e.key) {
        case 'ArrowUp':
            moveSound.play();
            inputDirection.x = 0;
            inputDirection.y = -1;
            break;
        case 'ArrowDown':
            moveSound.play();
            inputDirection.x = 0;
            inputDirection.y = 1;
            break;
        case 'ArrowLeft':
            moveSound.play();
            inputDirection.x = -1;
            inputDirection.y = 0;
            break;
        case 'ArrowRight':
            moveSound.play();
            inputDirection.x = 1;
            inputDirection.y = 0;
            break;
        default:
            break;
    }

});



//Code-game-execution will start from here
let hScore = localStorage.getItem('hScore');
let hiscore = localStorage.getItem("hiscore");

if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "High Score: " + hiscore;
}

function main(curTime) {

    window.requestAnimationFrame(main);
    if ((curTime - lastPainttime) / 1000 < 1 / speed) {
        return;
    }

    lastPainttime = curTime;

    if (start == 1)
        gameEngine();
}

window.requestAnimationFrame(main);