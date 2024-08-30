
const COLORS = {
    WHITE: 'white',
    BLACK: 'black',
    TAN: 'tan',
    BROWN: '#905c3c',
    HIGHLIGHT: 'yellow'
};

function main() {
    console.log('Hello World');
    let table = new Board(0, 0, 400, 400, 8, 8);

    document.getElementById('Start').addEventListener('click', () => {
        table.draw();
        console.log('Start button clicked');
    });

    document.getElementById('Reset').addEventListener('click', () => {
        table = new Board(0, 0, 400, 400, 8, 8);
        table.draw();
        console.log('Reset button clicked');
    });

    const canvas = document.getElementById('board');
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        table.handleClick(x, y);
    });
}

class Board {
    constructor(x, y, width, height, rows, cols) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rows = rows;
        this.cols = cols;
        this.pieces = [];
        this.selectedPiece = null;
        this.playerTurn = COLORS.WHITE;
        this.cellWidth = this.width / this.cols;
        this.cellHeight = this.height / this.rows;
        this.turn = document.getElementById('turn');
        this.initPieces();
    }

    initPieces() {
        const addPiece = (x, y, color) => this.pieces.push(new Piece(x, y, color));
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < this.cols; j++) {
                if ((i + j) % 2 === 1) addPiece(j, i, COLORS.WHITE);
            }
        }
        for (let i = this.rows - 1; i >= this.rows - 3; i--) {
            for (let j = 0; j < this.cols; j++) {
                if ((i + j) % 2 === 1) addPiece(j, i, COLORS.BLACK);
            }
        }
    }

    draw() {
        const canvas = document.getElementById("board");
        const ctx = canvas.getContext("2d");

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                ctx.fillStyle = (i + j) % 2 === 0 ? COLORS.TAN : COLORS.BROWN;
                ctx.fillRect(i * this.cellWidth, j * this.cellHeight, this.cellWidth, this.cellHeight);
            }
        }

        this.pieces.forEach(piece => piece.draw(ctx, this.cellWidth, this.cellHeight));
        if (this.selectedPiece) this.selectedPiece.drawHighlight(ctx, this.cellWidth, this.cellHeight);
        this.turn.innerHTML = `${this.playerTurn}'s Turn`;
    }
    


    handleClick(x, y) {
        const col = Math.floor(x / this.cellWidth);
        const row = Math.floor(y / this.cellHeight);

        if (this.selectedPiece) {
            if (this.selectedPiece.x === col && this.selectedPiece.y === row) {
                this.selectedPiece = null;
                this.draw();
                return;
            }

            if (this.isValidMove(col, row)) {
                this.movePiece(col, row);
            }
        } else {
            this.selectPiece(col, row);
        }
    }

    isValidMove(col, row) {
        const isWithinBounds = (col, row) => col >= 0 && col < this.cols && row >= 0 && row < this.rows;
        const isDiagonalMove = Math.abs(this.selectedPiece.x - col) === 1 && Math.abs(this.selectedPiece.y - row) === 1;
        const isForwardMove = this.selectedPiece.color === COLORS.WHITE ? row > this.selectedPiece.y : row < this.selectedPiece.y;

        if (!isWithinBounds(col, row) || !isDiagonalMove || !isForwardMove) return false;

        const targetPiece = this.pieces.find(piece => piece.x === col && piece.y === row);
        if (targetPiece) return false;

        return true;
    }

    movePiece(col, row) {
        const frame = () => {
            if (this.selectedPiece.x === col && this.selectedPiece.y === row) {
                this.selectedPiece = null;
                this.playerTurn = this.playerTurn === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
                clearInterval(id);
                this.draw();
            } else {
                this.selectedPiece.x += Math.sign(col - this.selectedPiece.x) * 0.25;
                this.selectedPiece.y += Math.sign(row - this.selectedPiece.y) * 0.25;
                this.draw();
            }
        };
        let id = setInterval(frame, 10);
    }

    selectPiece(col, row) {
        this.selectedPiece = this.pieces.find(piece => piece.x === col && piece.y === row && piece.color === this.playerTurn);
        this.draw();
    }

    update() {
        // Update the board
    }
}

function init() {

   

}

class Piece {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.isKing = false;
    }

    draw(ctx, cellWidth, cellHeight) {
        ctx.beginPath();
        ctx.arc(this.x * cellWidth + cellWidth / 2, this.y * cellHeight + cellHeight / 2, Math.min(cellWidth, cellHeight) / 2 - 5, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    
    drawHighlight(ctx, cellWidth, cellHeight) {
        ctx.beginPath();
        ctx.arc(this.x * cellWidth + cellWidth / 2, this.y * cellHeight + cellHeight / 2, Math.min(cellWidth, cellHeight) / 2 - 5, 0, 2 * Math.PI);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "yellow";
        ctx.stroke();
        ctx.closePath();
    }
}

main();