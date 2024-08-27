const WebSocket = require('ws');
const Game = require('./gameLogic');

const wss = new WebSocket.Server({ port: 8080 });
const game = new Game();
let moveHistory = [];

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        switch (data.type) {
            case 'initialize':
                ws.player = data.player;
                if (ws.player === 'A') {
                    ws.send(JSON.stringify({
                        type: 'gameState',
                        data: game.getGameState()
                    }));
                }
                break;

            case 'move':
                console.log(`Processing move for ${data.character}`);

                const { player, character, move } = data;
                if (player !== game.currentTurn) {
                    ws.send(JSON.stringify({
                        type: 'invalidMove',
                        message: 'It is not your turn!'
                    }));
                    break;
                }

                const moveSuccess = game.moveCharacter(player, character, move);
                if (!moveSuccess) {
                    ws.send(JSON.stringify({
                        type: 'invalidMove',
                        message: 'Invalid move!'
                    }));
                } else {
                    moveHistory.push(`Player ${player}: ${character} moved ${move}`);

                    // NEW: Broadcast game state and move history
                    broadcastGameState();
                    if (game.isGameOver()) {
                        const winner = game.players['A'].length === 0 ? 'B' : 'A';
                        broadcastGameOver(winner);
                    }
                    broadcastMoveHistory();

                    
                    
                }
                break;

            default:
                console.log('Unknown message type:', data.type);
        }
    });

    // Send the initial game state to the client
    ws.send(JSON.stringify({
        type: 'gameState',
        data: game.getGameState()
    }));
});


function broadcastGameState() {
    const gameState = game.getGameState();
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'gameState',
                data: gameState
            }));
        }
    });
}

function broadcastMoveHistory() {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'moveHistory',
                data: moveHistory
            }));
        }
    });
}


function broadcastGameOver(winner) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'gameOver',
                winner
            }));
        }
    });
}


console.log('WebSocket server is running on ws://localhost:8080');
