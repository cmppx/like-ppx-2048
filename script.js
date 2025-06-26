// script.js
const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('best-score');
const newGameButton = document.getElementById('new-game');
const undoButton = document.getElementById('undo');
const changeSkinButton = document.getElementById('change-skin');
const toggleSoundButton = document.getElementById('toggle-sound');

let tiles = Array.from({ length: 4 }, () => Array(4).fill(0));
let score = 0;
let bestScore = localStorage.getItem('bestScore') || 0;
let history = [];
let soundEnabled = true;
let currentSkin = 'default';

const SKINS = ["default", "dark", "colorful", "pastel", "ocean", "forest", "neon", "retro"];

function getNextSkin() {
    const currentIndex = SKINS.indexOf(currentSkin);
    return SKINS[(currentIndex + 1) % SKINS.length];
}

function getBackgroundColor(value, skin) {
    switch (skin) {
        case "dark": return getDarkSkinColor(value);
        case "colorful": return getColorfulSkinColor(value);
        case "pastel": return getPastelSkinColor(value);
        case "ocean": return getOceanSkinColor(value);
        case "forest": return getForestSkinColor(value);
        case "neon": return getNeonSkinColor(value);
        case "retro": return getRetroSkinColor(value);
        default: return getDefaultSkinColor(value);
    }
}

function getTextColor(value, skin) {
    if (skin === "dark") {
        return value > 4 ? "white" : "lightgray";
    }
    return value > 4 ? "white" : "#776e65";
}

function getDefaultSkinColor(value) {
    switch (value) {
        case 2: return "#eee4da";
        case 4: return "#ede0c8";
        case 8: return "#f2b179";
        case 16: return "#f59563";
        case 32: return "#f67c5f";
        case 64: return "#f65e3b";
        case 128: return "#edcf72";
        case 256: return "#edcc61";
        case 512: return "#edc850";
        case 1024: return "#edc53f";
        case 2048: return "#edc22e";
        default: return "#cdc1b4";
    }
}

function getDarkSkinColor(value) {
    switch (value) {
        case 2: return "#2d3436";
        case 4: return "#34495e";
        case 8: return "#2c3e50";
        case 16: return "#1e3799";
        case 32: return "#0c2461";
        case 64: return "#0a3d62";
        case 128: return "#079992";
        case 256: return "#078e76";
        case 512: return "#056676";
        case 1024: return "#4a235a";
        case 2048: return "#6c3483";
        default: return "#2c3e50";
    }
}

function getColorfulSkinColor(value) {
    switch (value) {
        case 2: return "#FF9AA2";
        case 4: return "#FFB7B2";
        case 8: return "#FFDAC1";
        case 16: return "#E2F0CB";
        case 32: return "#B5EAD7";
        case 64: return "#C7CEEA";
        case 128: return "#8BD3E6";
        case 256: return "#9BE8D8";
        case 512: return "#F9F871";
        case 1024: return "#FF9671";
        case 2048: return "#FF6F91";
        default: return "#D8E1E9";
    }
}

function getPastelSkinColor(value) {
    switch (value) {
        case 2: return "#FADBD8";
        case 4: return "#E8DAEF";
        case 8: return "#D6EAF8";
        case 16: return "#D1F2EB";
        case 32: return "#D5F5E3";
        case 64: return "#FCF3CF";
        case 128: return "#FAE5D3";
        case 256: return "#EDBB99";
        case 512: return "#E6B0AA";
        case 1024: return "#D7BDE2";
        case 2048: return "#A9CCE3";
        default: return "#E5E7E9";
    }
}

function getOceanSkinColor(value) {
    switch (value) {
        case 2: return "#B3E5FC";
        case 4: return "#81D4FA";
        case 8: return "#4FC3F7";
        case 16: return "#29B6F6";
        case 32: return "#039BE5";
        case 64: return "#0288D1";
        case 128: return "#0277BD";
        case 256: return "#01579B";
        case 512: return "#00B8D4";
        case 1024: return "#00ACC1";
        case 2048: return "#00838F";
        default: return "#E1F5FE";
    }
}

function getForestSkinColor(value) {
    switch (value) {
        case 2: return "#E8F5E9";
        case 4: return "#C8E6C9";
        case 8: return "#A5D6A7";
        case 16: return "#81C784";
        case 32: return "#66BB6A";
        case 64: return "#4CAF50";
        case 128: return "#388E3C";
        case 256: return "#2E7D32";
        case 512: return "#1B5E20";
        case 1024: return "#43A047";
        case 2048: return "#558B2F";
        default: return "#F1F8E9";
    }
}

function getNeonSkinColor(value) {
    switch (value) {
        case 2: return "#39FF14";
        case 4: return "#F3F315";
        case 8: return "#FF073A";
        case 16: return "#00F0FF";
        case 32: return "#FF61F6";
        case 64: return "#FFFB00";
        case 128: return "#FF00DE";
        case 256: return "#00FFB0";
        case 512: return "#FF00A0";
        case 1024: return "#00FFFA";
        case 2048: return "#FF00C8";
        default: return "#222222";
    }
}

function getRetroSkinColor(value) {
    switch (value) {
        case 2: return "#FFF8DC";
        case 4: return "#FFE4B5";
        case 8: return "#FFDAB9";
        case 16: return "#FFDEAD";
        case 32: return "#DEB887";
        case 64: return "#D2B48C";
        case 128: return "#BC8F8F";
        case 256: return "#F4A460";
        case 512: return "#A0522D";
        case 1024: return "#8B4513";
        case 2048: return "#A0522D";
        default: return "#FAEBD7";
    }
}

function updateScore() {
    scoreElement.textContent = score;
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
        bestScoreElement.textContent = bestScore;
    }
}

function addRandomTile() {
    const emptyCells = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (tiles[r][c] === 0) {
                emptyCells.push({ r, c });
            }
        }
    }

    if (emptyCells.length > 0) {
        const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        tiles[cell.r][cell.c] = Math.random() < 0.9 ? 2 : 4;
    }
}

function drawBoard() {
    gameBoard.innerHTML = '';
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            if (tiles[r][c] !== 0) {
                tile.innerHTML = `<span class="tile-number">${tiles[r][c]}</span>`;
                tile.style.backgroundColor = getBackgroundColor(tiles[r][c], currentSkin);
                tile.style.color = getTextColor(tiles[r][c], currentSkin);
            }
            gameBoard.appendChild(tile);
        }
    }
}

function mergeRow(row) {
    let moved = false;
    let merged = false;

    // 合并
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] !== 0 && row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
            moved = true;
            merged = true;
        }
    }

    // 移动
    const newRow = row.filter(val => val !== 0);
    while (newRow.length < 4) {
        newRow.push(0);
    }
    if (JSON.stringify(newRow) !== JSON.stringify(row)) {
        moved = true;
    }
    for (let i = 0; i < 4; i++) {
        row[i] = newRow[i];
    }

    if (merged) {
        playSound('merge');
    }
    return moved;
}

function reverseRow(row) {
    return row.slice().reverse();
}

function moveLeft() {
    let moved = false;
    for (let r = 0; r < 4; r++) {
        moved |= mergeRow(tiles[r]);
    }
    return moved;
}

function moveRight() {
    let moved = false;
    for (let r = 0; r < 4; r++) {
        const row = reverseRow(tiles[r]);
        moved |= mergeRow(row);
        tiles[r] = reverseRow(row);
    }
    return moved;
}

function moveUp() {
    let moved = false;
    for (let c = 0; c < 4; c++) {
        const col = [];
        for (let r = 0; r < 4; r++) {
            col.push(tiles[r][c]);
        }
        const newCol = mergeRow(col);
        for (let r = 0; r < 4; r++) {
            tiles[r][c] = col[r];
        }
        moved |= newCol;
    }
    return moved;
}

function moveDown() {
    let moved = false;
    for (let c = 0; c < 4; c++) {
        const col = [];
        for (let r = 0; r < 4; r++) {
            col.push(tiles[r][c]);
        }
        const reversedCol = reverseRow(col);
        const newCol = mergeRow(reversedCol);
        const finalCol = reverseRow(reversedCol);
        for (let r = 0; r < 4; r++) {
            tiles[r][c] = finalCol[r];
        }
        moved |= newCol;
    }
    return moved;
}

function canMove() {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (tiles[r][c] === 0) {
                return true;
            }
        }
    }

    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const value = tiles[r][c];
            if ((c < 3 && value === tiles[r][c + 1]) ||
                (r < 3 && value === tiles[r + 1][c])) {
                return true;
            }
        }
    }

    return false;
}

function gameOver() {
    playSound('gameover');
    alert(`Game Over! Your score: ${score}`);
}

function resetGame() {
    tiles = Array.from({ length: 4 }, () => Array(4).fill(0));
    score = 0;
    history = [];
    addRandomTile();
    addRandomTile();
    drawBoard();
    updateScore();
    playSound('reset');
}

function undoMove() {
    if (history.length > 0) {
        const state = history.pop();
        tiles = state.tiles;
        score = state.score;
        drawBoard();
        updateScore();
        playSound('undo');
    }
}

function changeSkin() {
    currentSkin = getNextSkin();
    drawBoard();
    playSound('skin');
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    toggleSoundButton.textContent = soundEnabled ? "Sound: ON" : "Sound: OFF";
}

function saveState() {
    const tilesCopy = tiles.map(row => [...row]);
    history.push({ tiles: tilesCopy, score });
    if (history.length > 10) {
        history.shift();
    }
}

// 兼容性增强：优先使用mp3，若不支持则回退到wav
function getSupportedAudioFile(baseName) {
    const audio = document.createElement('audio');
    if (audio.canPlayType('audio/mpeg')) {
        return `src/resources/sounds/${baseName}.mp3`;
    } else {
        return `src/resources/sounds/${baseName}.wav`;
    }
}

const soundFiles = {
    move: getSupportedAudioFile('move'),
    merge: getSupportedAudioFile('merge'),
    gameover: getSupportedAudioFile('gameover'),
    reset: getSupportedAudioFile('reset'),
    skin: getSupportedAudioFile('skin'),
    undo: getSupportedAudioFile('undo')
};

// 只在用户首次交互时预加载并"解锁"音频
let audioUnlocked = false;
function unlockAudio() {
    for (const key in soundFiles) {
        // 新建对象并静音播放一次，解锁后续播放
        const audio = new Audio(soundFiles[key]);
        audio.muted = true;
        audio.play().catch(() => {});
        audio.pause();
        audio.muted = false;
        audio.currentTime = 0;
    }
    audioUnlocked = true;
    window.removeEventListener('touchstart', unlockAudio, true);
    window.removeEventListener('mousedown', unlockAudio, true);
}
window.addEventListener('touchstart', unlockAudio, true);
window.addEventListener('mousedown', unlockAudio, true);

// 每次播放都新建 Audio 对象，兼容性最强
function playSound(type) {
    if (!soundEnabled || !audioUnlocked) return;
    const src = soundFiles[type];
    if (!src) return;
    const audio = new Audio(src);
    audio.play().catch(() => {});
}

function handleKeyPress(e) {
    if (!canMove()) {
        gameOver();
        return;
    }

    saveState();

    let moved = false;
    switch (e.key) {
        case 'ArrowLeft':
            moved = moveLeft();
            break;
        case 'ArrowRight':
            moved = moveRight();
            break;
        case 'ArrowUp':
            moved = moveUp();
            break;
        case 'ArrowDown':
            moved = moveDown();
            break;
    }

    if (moved) {
        addRandomTile();
        drawBoard();
        updateScore();
        playSound('move');
    }
}

// 触摸事件处理
let startX, startY;
function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
}

function handleTouchEnd(e) {
    if (!canMove()) {
        gameOver();
        return;
    }

    saveState();

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const dx = endX - startX;
    const dy = endY - startY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    let moved = false;
    if (absDx > absDy) {
        if (dx > 0) {
            moved = moveRight();
        } else {
            moved = moveLeft();
        }
    } else {
        if (dy > 0) {
            moved = moveDown();
        } else {
            moved = moveUp();
        }
    }

    if (moved) {
        addRandomTile();
        drawBoard();
        updateScore();
        playSound('move');
    }
}

// 阻止触摸滑动导致页面滚动
gameBoard.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

// 初始化
bestScoreElement.textContent = bestScore;
resetGame();

// 事件监听
document.addEventListener('keydown', handleKeyPress);
gameBoard.addEventListener('touchstart', handleTouchStart);
gameBoard.addEventListener('touchend', handleTouchEnd);
newGameButton.addEventListener('click', resetGame);
undoButton.addEventListener('click', undoMove);
changeSkinButton.addEventListener('click', changeSkin);
toggleSoundButton.addEventListener('click', toggleSound);