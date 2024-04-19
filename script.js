const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width = 800;
const canvasHeight = canvas.height = 600;
const bubbleRadius = 20;
const bubbleColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
let bubbles = [];
const bubbleColorIndexes = {}; // 各色に対応する番号を格納するオブジェクト
// プレイヤーの下に追加されたバブルを管理する配列
let playerBubbles = [];
let gameRunning = false; // ゲームが実行中かどうかを示すフラグ
let animationId; // requestAnimationFrame の ID を格納する変数
let bubbleIntervalId; // setInterval の ID を格納する変数
startGame();

// 各色に対応する番号を付与する
bubbleColors.forEach((color, index) => {
    bubbleColorIndexes[color] = index;
});

// 各色に対応する番号を取得する関数
function getBubbleColorIndex(color) {
    return bubbleColorIndexes[color];
}

function startGame() {
    const gameMessage = document.getElementById('gameMessage');
    gameMessage.textContent = 'クリックしてスタート';
    gameMessage.style.display = "block"; // メッセージを表示


    canvas.addEventListener('click', function () {
        // ゲームが実行中でない場合のみゲームを開始する
        if (!gameRunning) {
            gameRunning = true;
            gameLoop();
            bubbleIntervalId = setInterval(createBubble, 1000);
            gameMessage.style.display = "none"; 
        }
    });
}

const player = {
    x: canvasWidth / 2,
    y: canvasHeight - bubbleRadius * 2,
    radius: bubbleRadius,
    color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)] // プレイヤーの色をランダムに選択
};

const playerColorIndex = getBubbleColorIndex(player.color);

function gameLoop() {
   
    if (gameRunning) {
    clearCanvas(); 
    drawPlayer();
    drawPlayerBubbles();
    drawBubbles();
    animationId = requestAnimationFrame(gameLoop);
    }
}   

function handleKeyPress(event) {
    if (event.key === 'ArrowLeft' && player.x > bubbleRadius) {
        player.x -= 5;
        // プレイヤーが移動したときに、newBubble もプレイヤーに追随するように位置を更新する
        playerBubbles.forEach(bubble => {
            bubble.x -= 5;
        });
    } else if (event.key === 'ArrowRight' && player.x < canvasWidth - bubbleRadius) {
        player.x += 5;
        // プレイヤーが移動したときに、newBubble もプレイヤーに追随するように位置を更新する
        playerBubbles.forEach(bubble => {
            bubble.x += 5;
        });
    }
}


document.addEventListener('keydown', handleKeyPress);

function createBubble() {
    const randomColor = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];

    const bubble = {
        x: Math.random() * canvasWidth,
        y: 0,
        radius: bubbleRadius,
        color: randomColor
    };
    bubbles.push(bubble);
}

function handleBubbleCollision(playerBubble, randomBubble) {
    // バブルの色のIDを取得
    const randomColorIndex = getBubbleColorIndex(randomBubble.color); 
    if (playerColorIndex === randomColorIndex) {
        // 同じ色のバブルにぶつかった場合、新しいバブルを追加する
        const newBubble = {
            x: playerBubble.x,
            y: playerBubble.y , // プレイヤーの下に追加
            radius: bubbleRadius,
            color: randomBubble.color
        };
      
        player.y -= bubbleRadius * 2; 
        playerBubbles.push(newBubble);
        // 衝突したバブルを配列から削除する
        bubbles.splice(bubbles.indexOf(randomBubble), 1);
    }  
    else {
        // 異なる色のバブルにぶつかった場合、ゲームオーバー
        gameOver();
    }
}

function drawPlayerBubbles() {
    playerBubbles.forEach((bubble, index) => {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();
        ctx.closePath();
    });
}


function drawBubbles() {
    bubbles.forEach((bubble, index) => {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();
        ctx.closePath();

        bubble.y += 1; 

        if (isColliding(bubble, player)) {
            handleBubbleCollision(player, bubble);
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
    
    cancelAnimationFrame(animationId); // アニメーションを停止する
    clearInterval(bubbleIntervalId); // setInterval の実行を停止する
    const gameMessage = document.getElementById('gameMessage');
    gameMessage.textContent = 'ゲームオーバー';
    gameMessage.style.display = "block"; // メッセージを表示
    gameRunning = false;
      // クリックしたらゲーム再開
    canvas.addEventListener('click', startGameOnce);
    bubbles = [];
      // プレイヤーが保持しているバブルの配列を空にする
      playerBubbles = [];
      // ゲームを再開する前にプレイヤーのY座標を初期位置に戻す
      player.y = canvasHeight - bubbleRadius * 2;
}

function startGameOnce() {
    // イベントリスナーを一度だけ実行するため、一度呼び出したらリスナーを削除する
    canvas.removeEventListener('click', startGameOnce);
    gameRunning = false;
  
    // ゲームを再開する
    startGame();
}


