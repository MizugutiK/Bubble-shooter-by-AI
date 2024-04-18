const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width = 800;
const canvasHeight = canvas.height = 600;
const bubbleRadius = 20;
const bubbleColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
let bubbles = [];
const bubbleColorIndexes = {}; // 各色に対応する番号を格納するオブジェクト

// 各色に対応する番号を付与する
bubbleColors.forEach((color, index) => {
    bubbleColorIndexes[color] = index;
});

// 各色に対応する番号を取得する関数
function getBubbleColorIndex(color) {
    return bubbleColorIndexes[color];
}

const player = {
    x: canvasWidth / 2,
    y: canvasHeight - bubbleRadius * 2,
    radius: bubbleRadius,
    color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)] // プレイヤーの色をランダムに選択
};

const playerColorIndex = getBubbleColorIndex(player.color);

function gameLoop() {
    clearCanvas();
    drawPlayer();
    drawBubbles();
    requestAnimationFrame(gameLoop);
}

function handleKeyPress(event) {
    if (event.key === 'ArrowLeft' && player.x > bubbleRadius) {
        player.x -= 5;
    } else if (event.key === 'ArrowRight' && player.x < canvasWidth - bubbleRadius) {
        player.x += 5;
    }

}

document.addEventListener('keydown', handleKeyPress);

function createBubble() {
    const randomColor = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
    const randomColorIndex = getBubbleColorIndex(randomColor); // バブルの色のIDを取得
    console.log("Player Color ID:", playerColorIndex);
    console.log("Random Bubble Color ID:", randomColorIndex);

    const bubble = {
        x: Math.random() * canvasWidth,
        y: 0,
        radius: bubbleRadius,
        color: randomColor
    };
    bubbles.push(bubble);
}

function handleBubbleCollision(playerBubble, randomBubble) {
    if (playerColorIndex === randomColorIndex) {
        // 同じ色のバブルにぶつかった場合、バブルをプレイヤーにくっつける
        randomBubble.x = playerBubble.x;
        randomBubble.y = playerBubble.y - playerBubble.radius * 2;
    } else {
        // 異なる色のバブルにぶつかった場合、ゲームオーバー
        gameOver();
    }
}


function drawBubbles() {
    bubbles.forEach((bubble, index) => {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();
        ctx.closePath();

        bubble.y += 1; // バブルを上に移動
      

        if (isColliding(bubble, player)) {
             gameOver();
        }

        if (bubble.y + bubble.radius < 0) {
            bubbles.splice(index, 1); // 画面上部から出たバブルを配列から削除
        }
    });
}

function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
}

function isColliding(circle1, circle2) {
    const dx = circle1.x - circle2.x;
    const dy = circle1.y - circle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < circle1.radius + circle2.radius;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function gameOver() {
    alert("Game Over!");
    // ゲームオーバー時の処理を追加する場合はここに記述
}

setInterval(createBubble, 1000);
gameLoop();
