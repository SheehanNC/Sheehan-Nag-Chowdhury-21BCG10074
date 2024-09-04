# Turn-Based Chess-Like Game

## Overview

This project is a turn-based, chess-inspired game implemented using Node.js and WebSockets. It allows two players to connect to a game server, take turns moving their pieces on a 5x5 grid, and compete until one player wins. The game is designed to demonstrate real-time communication and multiplayer game logic in a web-based environment.

## Features

- **Real-time Multiplayer:** Two players can connect and play in real-time.
- **Turn-Based Mechanics:** Players take turns moving their pieces.
- **WebSocket Communication:** The game uses WebSocket for fast, bidirectional communication between the server and clients.
- **Custom Game Logic:** Implements a unique set of rules and character movements inspired by chess.
- **Player Identification:** Each player is identified as either Player A or Player B, with their name displayed on their respective pages.
- **Visual Feedback:** The game board updates in real-time, with pieces color-coded by player (Red for Player A and Blue for Player B).
- **Move History:** A history of all moves is displayed on the player’s screen.
- **Game Over Detection:** The game detects and announces when one player wins.

## Technologies Used

- **Node.js:** Backend runtime for executing JavaScript code on the server side.
- **WebSocket:** Protocol for real-time communication between the server and clients.
- **HTML/CSS/JavaScript:** Front-end technologies for building the game interface.
- **Custom Game Logic:** Implemented in JavaScript to handle the unique rules and mechanics of the game.

## Getting Started

### Prerequisites

- **Node.js** (version 14 or higher)
- **npm** (Node Package Manager)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SheehanNC/Sheehan-Nag-Chowdhury-21BCG10074.git

2. **Navigate into the Project Directory:**

   ```bash
   cd chess-like-game


3. **Install the dependencies:**

    ```bash
    npm install express ws

4. **Start the server:**

    ```bash
    node websocketServer.js

The server will start and listen on ws://localhost:8080.

4. **Open the game in your browser:**

Open index.html in two different browser windows or tabs to simulate two players. You can also connect from different devices on the same network by navigating to http://<your-ip>:8080.

## How to Play
### Player Selection:

- Each player will be prompted to choose their side (A or B).
- The chosen side will be displayed at the top of the page.
### Turn-Based Gameplay:

- Player A moves first, followed by Player B.
- Players can move their pieces based on the allowed moves for each character.
### Move History:

- A list of all moves made during the game is displayed in real-time.
### Winning the Game:

- The game ends when a player successfully meets the win condition, which is determined by the custom game logic.
## Customization
- Game Logic: The game rules and logic are implemented in gameLogic.js. You can customize the characters, moves, and win conditions by modifying this file.
- Styling: The game's appearance is controlled by styles.css. Feel free to modify the styles to suit your preferences.
- WebSocket Server: The WebSocket server is implemented in server.js. You can adjust the server settings, such as port number and message handling, in this file.
## Contributing
Contributions are welcome! Please fork the repository, create a new branch, and submit a pull request with your changes. Make sure to update the README.md if your changes affect the instructions or functionality.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
- Thanks to the open-source community for providing valuable resources and tools that made this project possible.
- Inspired by classic turn-based strategy games like chess.
### Contact
For questions or support, please contact [enceesheehan@gmail.com].

## ScreenShots
![Screenshot 2024-09-04 190613](https://github.com/user-attachments/assets/fd530ed1-c8d1-4dd8-854a-a21f3e79593a)
![Screenshot 2024-09-04 191926](https://github.com/user-attachments/assets/b4fefe42-748f-4a5d-b48d-11521b4dec48)

## Demo Video
- move to 0:09 to see how controls work
- move to 0:29 to see how "capture moves" work
- move to 1:42 to understand "Game Over" functionality [Player B wins]

Link to Video : https://drive.google.com/file/d/1dCEFho7O9FFj9gFcnYryhcHmnSqsPxUG/view?usp=sharing
