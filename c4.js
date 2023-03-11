class Player {
    constructor(game, form) {
      this.game = game;
      this.form = form;
      this.name = "";
      this.color = "";
      this.form.addEventListener("submit", (event) => {
        event.preventDefault();
        this.name = event.target.querySelector("input[type=text]").value;
        this.color = event.target.querySelector("input[type=color]").value;
        this.form.style.display = "none";
        if (
          this.game.player1.form.style.display === "none" &&
          this.game.player2.form.style.display === "none"
        ) {
          this.game.startGame();
        }
      });
    }
  
    play(column) { 
      const y = this.game.findSpotForCol(column);
      if (y === null) {
        return;
      }
  
      this.game.board[y][column] = this.color;
      this.game.placeInTable(y, column, this.color);
  
      if (this.game.checkForWin()) {
        return this.game.endGame(`Player ${this.name} won!`);
      }
  
      if (this.game.board.every((row) => row.every((cell) => cell))) {
        return this.game.endGame("Tie!");
      }
  
      this.game.currPlayer =
        this.game.currPlayer === this.game.player1
          ? this.game.player2
          : this.game.player1;
    }
  }
  
  // Define the Game class
  class Game {
    constructor(height, width) {
      this.height = height;
      this.width = width;
    
      this.startBtn = document.getElementById('start-btn');
      this.gameDiv = document.getElementById('game');
    
      this.startBtn.addEventListener("click", () => {
        this.player1 = new Player(this, document.getElementById("player-form"));
        this.player2 = new Player(this, document.getElementById("player-form")); 
        document.getElementById("player-form").style.display = "block"; 
        this.gameDiv.style.display = "none";
        this.startBtn.style.display = "none";
      });
    }   

    startGame() {
        this.resetGame();
        this.currPlayer = this.player1;
        // Create player instances with name and color 
        this.player1.color = document.getElementById("player1-color").value;
        this.player1.name = document.getElementById("player1-name").value;
        this.player2.color = document.getElementById("player2-color").value;
        this.player2.name = document.getElementById("player2-name").value;
    
        // Hide player forms and show game board
        document.getElementById("player-form").style.display = "none"; 
        this.gameDiv.style.display = "block";
        // Initialize the board
        this.makeBoard();
        // Create the HTML board
        this.makeHtmlBoard();
        
        // Clear the board by setting each cell to null
        for (let row = 0; row < this.height; row++) {
          for (let col = 0; col < this.width; col++) {
            this.board[row][col] = null;
          }
        } 
      }
  
    makeBoard() {
      this.board = new Array(this.height);
      for (let i = 0; i < this.height; i++) {
        this.board[i] = new Array(this.width).fill(null);
      }
    }
  
    makeHtmlBoard() {
        const htmlBoard = document.getElementById('board');
        
        let top = document.createElement('tr');
        top.setAttribute('id', 'column-top');
        top.addEventListener('click', this.handleClick.bind(this));
        
        for (let y = 0; y < this.width; y++) {
          let headCell = document.createElement('td');
          headCell.setAttribute('id', y);
          top.append(headCell);
        }
        htmlBoard.append(top);
             
        for (let y = 0; y < this.height; y++) {
          const row = document.createElement('tr');
          for (let x = 0; x < this.width; x++) {
            const cell = document.createElement('td');
            cell.setAttribute('id', `${y}-${x}`);
            const circle = document.createElement('div');
            circle.classList.add('circle');
            cell.append(circle);
            row.append(cell);
          }
          htmlBoard.append(row);
        }
        
        const pieces = document.querySelectorAll('.piece');
        pieces.forEach(piece => {
          const [y, x] = piece.parentNode.id.split('-').map(str => Number(str));
          const color = this.board[y][x];
          piece.setAttribute('data-color', color);
          piece.style.backgroundColor = color;
        });
      }
  
    findSpotForCol(x) {
      for (let y = this.height - 1; y >= 0; y--) {
        if (this.board[y][x] === null) {
            console.log(y);
          return y;
        }
      }
      return null;
    }
  
    placeInTable(y, x, color) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.classList.add(color);
        piece.style.backgroundColor = color; 
        const cell = document.getElementById(`${y}-${x}`);
        cell.append(piece);
    
        const topRow = document.getElementById('column-top');
        const style = getComputedStyle(topRow);
        const cellWidth = parseInt(style.width);
        const cellHeight = parseInt(style.height);
        const xCoord = cellWidth * x + cellWidth / 2;
        const yCoord = -cellHeight * (y + 1) - cellHeight / 2;
        piece.style.setProperty('--y-offset', `${yCoord}px`);
      }
    
      endGame(msg) {
        setTimeout(() => {
          alert(msg);
          this.gameDiv.style.display = 'none';
          this.startBtn.style.display = 'inline-block';
        }, 600);
      }
    
      handleClick(evt) {
        const column = +evt.target.id; 
        this.currPlayer.play(column); 
      }
    
      checkForWin() {
        const _win = cells => {
          return cells.every(
            ([y, x]) =>
              y >= 0 &&
              y < this.height &&
              x >= 0 &&
              x < this.width &&
              this.board[y][x] === this.currPlayer.color
          );
        };
    
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
            let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
            let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
            let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
    
            if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
              return true;
            }
          }
        }
      }
    
      resetGame() {
        this.board = [];
        this.currPlayer = this.player1;
        const htmlBoard = document.getElementById('board');
        htmlBoard.innerHTML = '';
      }
    }
    
    const newGame = new Game(6, 7); 