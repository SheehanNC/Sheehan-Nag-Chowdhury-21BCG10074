// script.js

const ws = new WebSocket('ws://localhost:8080');
let player = null;
let currentGameState = null;
let moveHistory = [];

// Initialize the board and move buttons
const boardElement = document.getElementById('board');
const moveButtons = document.getElementById('move-buttons');
const turnIndicator = document.getElementById('turn-indicator');

ws.onopen = () => {
  player = prompt('Enter your player side (A or B):').toUpperCase();
  ws.send(JSON.stringify({ type: 'initialize', player }));
  console.log(player)
  document.getElementById("player_id").textContent=`Player ${player}`;
};

ws.onmessage = (message) => {
  const data = JSON.parse(message.data);
  console.log('Received message:', data.winner);

  switch (data.type) {
      case 'gameState':
          currentGameState = data.data;
          renderBoard();
          updateTurnIndicator();
          break;


      case 'moveHistory':  // <-- Handle move history updates
          moveHistory = data.data;
          renderMoveHistory();
          break;

      case 'invalidMove':
          alert(data.message);
          
          break;

    case 'gameOver': // <-- Handle game over
          alert(`Game over! Player ${data.winner} wins!`);
           // Close the WebSocket connection
          break;

      default:
          console.log('Unknown message type:', data.type);
  }
};


function renderBoard() {
  boardElement.innerHTML = ''; // Clear previous board

  for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
          const cell = document.createElement('div');
          const piece = currentGameState.board[row][col];

          if (piece) {
            cell.textContent = `${piece.player}-${piece.character}`;
            
            // Apply different styles based on the player
            if (piece.player === 'A') {
                cell.classList.add('player-a'); // Apply red background
            } else if (piece.player === 'B') {
                cell.classList.add('player-b'); // Apply blue background
            }

            cell.classList.add(piece.player === player ? 'my-piece' : 'opponent-piece');

            // Allow clicking on your pieces to move them
            if (piece.player === player && currentGameState.currentTurn === player) {
                cell.addEventListener('click', () => showMoveOptions(piece.character, row, col));
            }
        }

        boardElement.appendChild(cell);
      }
  }
}

function updateTurnIndicator() {
  turnIndicator.textContent = `Player ${currentGameState.currentTurn}'s turn`;
  if (currentGameState.currentTurn !== player) {
      moveButtons.innerHTML = ''; // Clear move buttons when it's not your turn
  }
}


function showMoveOptions(character, row, col) {
    moveButtons.innerHTML = ''; // Clear previous buttons

    const validMoves = getValidMoves(character);
    validMoves.forEach(move => {
        const button = document.createElement('button');
        button.textContent = move;
        button.addEventListener('click', () => makeMove(character, move));
        moveButtons.appendChild(button);
    });
}

function getValidMoves(character) {
  switch (character) {
      case 'P1': case 'P2': case 'P3':
          return ['L', 'R', 'F', 'B']; // Left, Right, Forward, Backward
      case 'H1':
          return ['L', 'R', 'F', 'B']; // Same as Pawn for straight moves
      case 'H2':
          return ['FL', 'FR', 'BL', 'BR']; // Diagonal moves
      default:
          return [];
  }
}


function makeMove(character, move) {
  console.log(`Attempting to move ${character} with move ${move}`);
    ws.send(JSON.stringify({
        type: 'move',
        player,
        character,
        move
    }));

    // moveHistory.push(`Player ${player}: ${character} moved ${move}`);
    renderMoveHistory();
}

function renderMoveHistory() {
  const historyList = document.getElementById('history-list');
  historyList.innerHTML = ''; // Clear previous history

  moveHistory.forEach(move => {
      const listItem = document.createElement('li');
      listItem.textContent = move;
      historyList.appendChild(listItem);
  });
}
