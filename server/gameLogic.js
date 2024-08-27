// gameLogic.js

class Game {
    constructor() {
        this.board = this.createEmptyBoard();
        this.players = { 'A': [], 'B': [] }; // Initialize players' characters
        this.currentTurn = 'A'; 
        this.moveHistory = [];
        this.initializeCharacters(); // Initialize characters on the board
    }

    createEmptyBoard() {
        return Array.from({ length: 5 }, () => Array(5).fill(null));
    }

    initializeCharacters() {
        console.log('Initializing characters for both players');
        // Place Player A's characters on the first row (Row 0)
        const playerACharacters = ['H1', 'H2', 'P1', 'P2', 'P3'];
        playerACharacters.forEach((char, idx) => {
            this.placeCharacter('A', char, 0, idx);
        });
    
        // Place Player B's characters on the last row (Row 4)
        const playerBCharacters = ['H1', 'H2', 'P1', 'P2', 'P3'];
        playerBCharacters.forEach((char, idx) => {
            this.placeCharacter('B', char, 4, idx);
        });
    }
    
    placeCharacter(player, character, row, col) {
        if (this.board[row][col] || !this.players[player]) return false; // Cell occupied or invalid player
        this.board[row][col] = { player, character };
        this.players[player].push({ character, row, col });
        return true;
    }

    moveCharacter(player, character, move) {
        const charInfo = this.players[player].find(c => c.character === character);
        if (!charInfo) return false; // Character not found for player
    
        const { row, col } = charInfo;
        const newPosition = this.calculateNewPosition(row, col, move, character);
        
        if (!this.isValidMove(player, character, newPosition)) return false; // Invalid move
    
        // Handle combat and capturing
        const capturedPieces = this.capturePiecesInPath(charInfo, newPosition,player);
        console.log(`Captured pieces: ${JSON.stringify(capturedPieces)}`);

    
        // Log captured pieces
        if (capturedPieces.length > 0) {
            this.moveHistory.push({
                player,
                character,
                captured: capturedPieces
            });
        }
    
        // Move character to the new position
        this.board[row][col] = null;
        this.board[newPosition.row][newPosition.col] = { player, character };
        charInfo.row = newPosition.row;
        charInfo.col = newPosition.col;
    
        this.moveHistory.push({
            player,
            character,
            move,
            from: { row, col },
            to: { row: newPosition.row, col: newPosition.col }
        });

        if (this.isGameOver()) {
            const winner = this.getWinner();
            console.log(`Game over! Winner is Player ${winner}`);
            // Game over; return true to signal the end of the game
            return { gameOver: true, winner };
        }
      
        this.switchTurn();

        return true;
    }
    
    
    capturePiecesInPath({ row, col }, { row: targetRow, col: targetCol }, player) {

        
        const dr = Math.sign(targetRow - row);
        const dc = Math.sign(targetCol - col);
    
        let r = row + dr;
        let c = col + dc;
        const captured = [];

        console.log(`Starting capture from (${row}, ${col}) to (${targetRow}, ${targetCol})`);
    
        while (r !== targetRow || c !== targetCol) {
            const cell = this.board[r][c];
            console.log(`Checking cell (${r}, ${c}): ${cell ? JSON.stringify(cell) : 'Empty'}`);

            if (cell) {
                if (cell.player === player) {
                    // Friendly piece in the path
                    return [];
                } else {
                    console.log(`Capturing opponent's piece: ${JSON.stringify(cell)}`);
                    // Capture the opponent's piece
                    captured.push({ player: cell.player, character: cell.character });
    
                    // Remove the piece from the player's array
                    this.players[cell.player] = this.players[cell.player].filter(
                        c => c.character !== cell.character
                    );
    
                  
                    // Remove the piece from the board
                    this.board[r][c] = null;
                }
            }
            r += dr;
            c += dc;
        }
    
        const targetCell = (this.board[targetRow] && this.board[targetRow][targetCol]) || null;
        console.log(`Checking target cell (${targetRow}, ${targetCol}): ${targetCell ? JSON.stringify(targetCell) : 'Empty'}`);
    
        if (targetCell && targetCell.player !== player) {
            // Capture if the target cell is occupied by an opponent's piece
            console.log(`Capturing opponent's piece at target cell: ${JSON.stringify(targetCell)}`);
            captured.push({ player: targetCell.player, character: targetCell.character });
    
            // Remove the captured piece from the player's array
            this.players[targetCell.player] = this.players[targetCell.player].filter(
                c => c.character !== targetCell.character
            );
            console.log(`Updated players['${targetCell.player}']: ${JSON.stringify(this.players[targetCell.player])}`);
    
            // Remove the captured piece from the board
            this.board[targetRow][targetCol] = null;
            console.log(`Board cell (${targetRow}, ${targetCol}) set to null.`);
        }
    
        console.log(`Captured pieces: ${JSON.stringify(captured)}`);
        return captured;


    }
    
    

    calculateNewPosition(row, col, move,characterType) {
        let moves;
            
        console.log(`Character Type: ${characterType}`);
        console.log(`Current Position: (${row}, ${col})`);
        console.log(`Move Requested: ${move}`);
        // Determine moves based on character type
        if (characterType.startsWith('P')) {
            // Pawns move 1 block
            moves = {
                'L': [0, -1],
                'R': [0, 1],
                'F': [-1, 0],
                'B': [1, 0],
          
            };
        } else if (characterType === 'H1') {
            // Hero1 moves 2 blocks in straight directions
            moves = {
                'L': [0, -2],
                'R': [0, 2],
                'F': [-2, 0],
                'B': [2, 0]
            };
        } else if (characterType === 'H2') {
            // Hero2 moves 2 blocks diagonally
            moves = {
                'FL': [-2, -2],
                'FR': [-2, 2],
                'BL': [2, -2],
                'BR': [2, 2]
            };
        }
    
        
        const [dr, dc] = moves[move] || [0, 0];
        return {
            row: row + dr,
            col: col + dc
        };
    }

    isValidMove(player, character, { row, col }) {
        console.log(`Checking if move to (${row}, ${col}) is valid`);
        // Check if the position is within bounds
        if (row < 0 || row >= 5 || col < 0 || col >= 5) return false;

        // Check if the target cell is occupied by a friendly character
        const targetCell = this.board[row][col];
        if (targetCell && targetCell.player === player) return false;

        // Additional validation based on character type
        const charInfo = this.players[player].find(c => c.character === character);
        if (!charInfo) {
            return false;
         } // Character must exist for the player

         //console.log(`Character ${character} found for player ${player} at (${charInfo.row}, ${charInfo.col})`);
         const isPathClear = this.isPathClear(charInfo.row, charInfo.col, row, col, player);
         if (!isPathClear) return false;

        switch (charInfo.character[0]) { // character[0] = 'P' for Pawn, 'H' for Hero
            case 'P':
                return this.isValidPawnMove(charInfo.row, charInfo.col, { row, col });
            case 'H1':
                console.log('Calling isValidHero1Move');
                return this.isValidHero1Move(charInfo.row, charInfo.col, { row, col });
                
            case 'H2':
                return this.isValidHero2Move(charInfo.row, charInfo.col, { row, col });
                // return true;
            default:
                return true;
        }
    }

    isPathClear(startRow, startCol, endRow, endCol, player) {
        const dr = Math.sign(endRow - startRow);
        const dc = Math.sign(endCol - startCol);
        let r = startRow + dr;
        let c = startCol + dc;

        while (r !== endRow || c !== endCol) {
            const cell = this.board[r][c];
            if (cell && cell.player === player) {
                // Friendly piece in the path
                return false;
            }
            r += dr;
            c += dc;
        }

        return true;
    }

    isValidPawnMove(startRow, startCol, { row, col }) {
        console.log(`pawn Moving from (${startRow}, ${startCol}) to (${row}, ${col})`);
        const validMoves = [
            [startRow - 1, startCol], // Forward
            [startRow + 1, startCol], // Backward
            [startRow, startCol - 1], // Left
            [startRow, startCol + 1]  // Right
        ];
    
        return validMoves.some(([r, c]) => r === row && c === col);
    }
    

    isValidHero1Move(startRow, startCol, { row, col }) {
        console.log(`H1 Moving from (${startRow}, ${startCol}) to (${row}, ${col})`);

        // Hero1 moves two blocks straight in any direction
        const validMoves = [
            [startRow - 2, startCol], // Forward
            [startRow + 2, startCol], // Backward
            [startRow, startCol - 2], // Left
            [startRow, startCol + 2]  // Right
        ];

        const isValid = validMoves.some(([r, c]) => r === row && c === col);
        console.log(`Is move valid? ${isValid}`);
        return isValid;
    }

    isValidHero2Move(startRow, startCol, { row, col }) {
        // Hero2 moves two blocks diagonally
        const validMoves = [
            [startRow - 2, startCol - 2], // Forward-Left
            [startRow - 2, startCol + 2], // Forward-Right
            [startRow + 2, startCol - 2], // Backward-Left
            [startRow + 2, startCol + 2]  // Backward-Right
        ];

        return validMoves.some(([r, c]) => r === row && c === col);
    }

    isGameOver() {
        console.log(`After capture: Player A pieces: ${this.players['A'].length}, Player B pieces: ${this.players['B'].length}`);
        // Check if either player has no pieces left
        const gameOver = this.players['A'].length === 0 || this.players['B'].length===0;
        console.log(`Is game over? ${gameOver}`);
        return gameOver;
    }

    getWinner() {
        if (this.players['A'].length === 0) return 'B'; // Player B wins
        if (this.players['B'].length === 0) return 'A'; // Player A wins
        return null; // No winner yet
    }

    switchTurn() {
        this.currentTurn = this.currentTurn === 'A' ? 'B' : 'A';
    }


    getGameState() {
        return {
            board: this.board,
            currentTurn: this.currentTurn
        };
    }



}

module.exports = Game;
