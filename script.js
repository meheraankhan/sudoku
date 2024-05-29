var numSelected = null;
var tileSelected = null;
var eraseSelected = null;
var errors = 0;
var count = 0;
var currentBoardIndex = 0;
var currentDifficulty = "";
var board = [];
var easy = [];
var medium = [];
var hard = [];


for (let i = 0; i < 9; i++) {
    board[i] = [];
    for (let j = 0; j < 9; j++) {
        board[i][j] = "0";
    }
}

window.onload = function() {
    setup();
}

function setup() {
    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }
        let erase = document.createElement("div");
        erase.id = 10;
        erase.innerText = "Erase";
        erase.addEventListener("click", selectErase);
        erase.classList.add("erase");
        document.getElementById("digits").appendChild(erase);

    //generateBoard(Math.floor(Math.random() * 3) + 24, board);
    selectDifficulty("easy");

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let tile = document.createElement("div");
            tile.id = i.toString() + "-" + j.toString();
            tile.innerText = board[i][j];
            if (board[i][j] === "0") {
                tile.innerText = "";
            }
            else {
                tile.classList.add("given-tile");
            }
            if (i == 2 || i  == 5) {
                tile.classList.add("horizontal-line");
            }
            if (j == 2 || j == 5) {
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
}

function generateBoard(numToFill, board, difficulty) {
    count = numToFill;
    errors = 0;
    document.getElementById("errors").innerText = errors;
    if (difficulty === "easy" && easy.length >= 5) {
        let index = Math.floor(Math.random() * 5);
        board = easy[index];
        currentBoardIndex = index;
        currentDifficulty = difficulty;
    }
    else if (difficulty === "medium" && medium.length >= 5) {
        let index = Math.floor(Math.random() * 5);
        board = medium[index];
        currentBoardIndex = index;
        currentDifficulty = difficulty;
    }
    else if (difficulty === "hard" && hard.length >= 5) {
        let index = Math.floor(Math.random() * 5);
        board = hard[index];
        currentBoardIndex = index;
        currentDifficulty = difficulty;
    }
    else {
        let i = 0;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                board[i][j] = "0";
            }
        }
        while (i < numToFill) {
            var r = Math.floor(Math.random() * 9);
            var c = Math.floor(Math.random() * 9);
            var random = Math.floor(Math.random() * 9);
            if (board[r][c] == "0") {
                board[r][c] = random;
                if (isValid(board, r, c) && isSolvable(board)) {
                    i++;
                }
                else {
                    board[r][c] = "0";
                }
            }
        }

        if (difficulty === "easy") {
            easy.push(deepCopy(board.slice()));
            currentBoardIndex = easy.length - 1;
            currentDifficulty = difficulty;
        }
        else if (difficulty === "medium") {
            medium.push(deepCopy(board.slice()));
            currentBoardIndex = medium.length - 1;
            currentDifficulty = difficulty;
        }
        else {
            hard.push(deepCopy(board.slice()));
            currentBoardIndex = hard.length - 1;
            currentDifficulty = difficulty;
        }
    }

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const elementId = i.toString() + "-" + j.toString();
            const element = document.getElementById(elementId);
            if (element) {
                element.innerText = board[i][j];
                if (board[i][j] === "0") {
                    element.innerText = "";
                    if (element.classList.contains("given-tile")) {
                        element.classList.remove("given-tile");
                    }
                }
                else {
                    element.classList.add("given-tile");
                }
            }
        }
    }
}

function selectDifficulty(difficulty) {
    document.getElementById("easy").classList.remove("selected");
    document.getElementById("medium").classList.remove("selected");
    document.getElementById("hard").classList.remove("selected");

    document.getElementById(difficulty).classList.add("selected");

    if (difficulty === "easy") {
        generateBoard(Math.floor(Math.random() * 3) + 24, board, difficulty);
    }
    else if (difficulty === "medium") {
        generateBoard(Math.floor(Math.random() * 4) + 20, board, difficulty);
    }
    else {
        generateBoard(Math.floor(Math.random() * 3) + 17, board, difficulty);
    }
}

function selectNumber() {
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
    if (eraseSelected != null) {
        eraseSelected.classList.remove("erase-selected");
        eraseSelected = null;
    }
}

function selectErase() {
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
        numSelected = null;
    }
    eraseSelected = this;
    eraseSelected.classList.add("erase-selected");
}

function selectTile() {
    if (numSelected) {
        if (this.innerText != "") {
            return;
        }

        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);
        board[r][c] = numSelected.id;
        if (isValid(board, r, c) && isSolvable(board)) {
            this.innerText = numSelected.id;
            count++;
            checkWin();
        }
        else {
            board[r][c] = "0";
            errors++;
            document.getElementById("errors").innerText = errors;
            return;
        }
    }
    else if (eraseSelected) {
        if (this.innerText === "" || this.classList.contains("given-tile")) {
            return;
        }

        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);
        board[r][c] = "0";
        this.innerText = "";
        count--;
        return;
    }
}

function isValid(board, i, j) {
    for (let x = 0; x < 9; x++) {
        if (board[i][j] == board[x][j] && x != i) {
            return false;
        }
        if (board[i][j] == board[i][x] && x != j) {
            return false;
        }
    }
    var startRow = i - i%3;
    var startCol = j - j%3;

    for (let a = startRow; a < startRow + 3; a++) {
        for (let b = startCol; b < startCol + 3; b++) {
            if (board[a][b] == board[i][j] && (a!=i && b!=j)) {
                return false;
            }
        }
    }
    return true;
}

function solver(boardCopy) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (boardCopy[i][j] === "0") {
                for (let num = 1; num <= 9; num++) {
                    boardCopy[i][j] = num;
                    if (isValid(boardCopy, i, j)) {
                        if (solver(boardCopy)) {
                            return true;
                        }
                    }
                    boardCopy[i][j] = "0";
                }
                return false;
            }
        }
    }
    return true;
}

function isSolvable() {
    const boardCopy = board.map(row => row.slice());
    return solver(boardCopy)
}

function checkWin() {
    if (count === 81) {
        openPopup();
    }
}

function openPopup() {
    document.getElementById("popup").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function resetBoard() {
    if (currentDifficulty === "easy") {
        board = easy[currentBoardIndex];
    }
    else if (currentDifficulty === "medium") {
        board = medium[currentBoardIndex];
    }
    else {
        board = hard[currentBoardIndex];
    }

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const elementId = i.toString() + "-" + j.toString();
            const element = document.getElementById(elementId);
            if (element) {
                element.innerText = board[i][j];
                if (board[i][j] === "0") {
                    element.innerText = "";
                    if (element.classList.contains("given-tile")) {
                        element.classList.remove("given-tile");
                    }
                }
                else {
                    element.classList.add("given-tile");
                }
            }
        }
    }    
}

function deepCopy(arr) {
    let copy = [];
    for (let i = 0; i < arr.length; i++) {
        copy.push(arr[i].slice());
    }
    return copy;
}