import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { useGame } from '../context/GameContext';
import GameLayout from './GameLayout';

const PokemonChess = () => {
  const { handleCorrectAnswer, handleWrongAnswer, score } = useGame();
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [gameStatus, setGameStatus] = useState('');
  const [moveHistory, setMoveHistory] = useState([]);
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });
  const [aiThinking, setAiThinking] = useState(false);
  const [playerColor, setPlayerColor] = useState(null); // null = not selected yet
  const [gameStarted, setGameStarted] = useState(false);

  // Pokemon sprite mapping for chess pieces
  const pokemonPieces = {
    white: {
      k: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png', // Charizard (King)
      q: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png', // Gyarados (Queen)
      r: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/76.png', // Golem (Rook)
      b: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png', // Alakazam (Bishop)
      n: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/78.png', // Rapidash (Knight)
      p: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', // Pikachu (Pawn)
    },
    black: {
      k: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png', // Mewtwo (King)
      q: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png', // Gengar (Queen)
      r: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/68.png', // Machamp (Rook)
      b: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png', // Arcanine (Bishop)
      n: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/142.png', // Aerodactyl (Knight)
      p: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png', // Rattata (Pawn)
    }
  };

  // Check game status
  useEffect(() => {
    if (game.isCheckmate()) {
      setGameStatus('Checkmate! ' + (game.turn() === 'w' ? 'Black' : 'White') + ' wins!');
      if (game.turn() === 'b') {
        // Player won!
        handleCorrectAnswer(20); // Big reward for winning
      }
    } else if (game.isDraw()) {
      setGameStatus('Draw!');
    } else if (game.isCheck()) {
      setGameStatus('Check!');
    } else {
      setGameStatus('');
    }
  }, [game, handleCorrectAnswer]);

  // Evaluate board position (simple piece value evaluation)
  const evaluateBoard = (chess) => {
    const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
    let score = 0;

    const board = chess.board();
    board.forEach(row => {
      row.forEach(square => {
        if (square) {
          const value = pieceValues[square.type];
          score += square.color === 'w' ? -value : value;
        }
      });
    });
    return score;
  };

  // AI opponent move with improved logic
  const makeAIMove = (currentGame) => {
    setAiThinking(true);
    setTimeout(() => {
      const moves = currentGame.moves({ verbose: true });
      if (moves.length === 0) {
        setAiThinking(false);
        return;
      }

      // Smarter AI: evaluate each move
      let bestMove = null;
      let bestScore = -Infinity;

      moves.forEach(move => {
        const tempGame = new Chess(currentGame.fen());
        tempGame.move(move);

        // Score based on: captures, checks, position evaluation
        let score = 0;

        // Heavily prioritize captures
        if (move.captured) {
          const pieceValues = { p: 10, n: 30, b: 30, r: 50, q: 90, k: 0 };
          score += pieceValues[move.captured];
        }

        // Bonus for checks
        if (tempGame.isCheck()) score += 50;

        // Bonus for checkmate
        if (tempGame.isCheckmate()) score += 10000;

        // Position evaluation
        score += evaluateBoard(tempGame);

        // Add some randomness to make it less predictable
        score += Math.random() * 5;

        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      });

      const move = bestMove || moves[0];
      const newGame = new Chess(currentGame.fen());
      newGame.move(move);

      setGame(newGame);
      setLastMove({ from: move.from, to: move.to });
      setMoveHistory(prev => [...prev, move.san]);

      if (move.captured) {
        const aiColor = playerColor === 'w' ? 'black' : 'white';
        setCapturedPieces(prev => ({
          ...prev,
          [aiColor]: [...prev[aiColor], move.captured]
        }));
      }

      setAiThinking(false);
    }, 500);
  };

  // Handle square click
  const handleSquareClick = (square) => {
    if (aiThinking || !gameStarted) return;

    // Check if it's player's turn
    const currentTurn = game.turn(); // 'w' or 'b'
    if (currentTurn !== playerColor) return; // Not player's turn

    const piece = game.get(square);

    // If a square is already selected
    if (selectedSquare) {
      // Try to make a move
      const move = {
        from: selectedSquare,
        to: square,
        promotion: 'q' // Always promote to queen for simplicity
      };

      try {
        const newGame = new Chess(game.fen());
        const result = newGame.move(move);

        if (result) {
          setGame(newGame);
          setLastMove({ from: selectedSquare, to: square });
          setMoveHistory(prev => [...prev, result.san]);
          setSelectedSquare(null);
          setValidMoves([]);

          // Reward only for captures
          if (result.captured) {
            handleCorrectAnswer(5); // HP gain only on capture
            const playerCaptureKey = playerColor === 'w' ? 'white' : 'black';
            setCapturedPieces(prev => ({
              ...prev,
              [playerCaptureKey]: [...prev[playerCaptureKey], result.captured]
            }));
          }

          // AI makes a move after player - pass the updated game state
          if (!newGame.isGameOver()) {
            makeAIMove(newGame);
          }
        } else {
          // Invalid move
          setSelectedSquare(null);
          setValidMoves([]);
        }
      } catch (e) {
        // Invalid move
        setSelectedSquare(null);
        setValidMoves([]);
      }
    } else if (piece && piece.color === playerColor && game.turn() === playerColor) {
      // Select a piece of player's color
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setValidMoves(moves.map(m => m.to));
    }
  };

  // Start game with selected color
  const startGame = (color) => {
    setPlayerColor(color);
    setGameStarted(true);
    setGame(new Chess());
    setSelectedSquare(null);
    setValidMoves([]);
    setLastMove(null);
    setGameStatus('');
    setMoveHistory([]);
    setCapturedPieces({ white: [], black: [] });
    setAiThinking(false);

    // If player chose black, AI (white) moves first
    if (color === 'b') {
      setTimeout(() => makeAIMove(new Chess()), 500);
    }
  };

  // Reset game
  const resetGame = () => {
    setGame(new Chess());
    setSelectedSquare(null);
    setValidMoves([]);
    setLastMove(null);
    setGameStatus('');
    setMoveHistory([]);
    setCapturedPieces({ white: [], black: [] });
    setPlayerColor(null);
    setGameStarted(false);
    setAiThinking(false);
  };

  // Render a single square
  const renderSquare = (square, squareIndex) => {
    const piece = game.get(square);
    const isLight = (Math.floor(squareIndex / 8) + squareIndex) % 2 === 0;
    const isSelected = selectedSquare === square;
    const isValidMove = validMoves.includes(square);
    const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);

    let squareClass = 'chess-square';
    if (isLight) squareClass += ' light';
    else squareClass += ' dark';
    if (isSelected) squareClass += ' selected';
    if (isValidMove) squareClass += ' valid-move';
    if (isLastMove) squareClass += ' last-move';

    // Add team-based class for sprite tinting
    let pieceClass = 'chess-piece';
    if (piece) {
      pieceClass += piece.color === 'w' ? ' white-piece' : ' black-piece';
    }

    return (
      <div
        key={square}
        className={squareClass}
        onClick={() => handleSquareClick(square)}
      >
        {piece && (
          <img
            src={pokemonPieces[piece.color === 'w' ? 'white' : 'black'][piece.type]}
            alt={piece.type}
            className={pieceClass}
          />
        )}
        {isValidMove && <div className="move-indicator"></div>}
        <span className="square-label">{square}</span>
      </div>
    );
  };

  // Render the chess board
  const renderBoard = () => {
    const squares = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    for (let rank of ranks) {
      for (let file of files) {
        const square = file + rank;
        const squareIndex = (8 - parseInt(rank)) * 8 + files.indexOf(file);
        squares.push(renderSquare(square, squareIndex));
      }
    }

    return squares;
  };

  // Color selection screen
  if (!gameStarted) {
    return (
      <GameLayout>
        <div className="chess-game">
          <div className="chess-header">
            <h1>Pokemon Chess Battle</h1>
            <p className="chess-instructions">Choose your team!</p>
          </div>

          <div className="color-selection">
            <div className="color-option" onClick={() => startGame('w')}>
              <div className="color-preview white-team">
                <img src={pokemonPieces.white.k} alt="White King" className="preview-piece white-piece" />
                <img src={pokemonPieces.white.q} alt="White Queen" className="preview-piece white-piece" />
                <img src={pokemonPieces.white.n} alt="White Knight" className="preview-piece white-piece" />
              </div>
              <h2>Play as White</h2>
              <p>You move first!</p>
            </div>

            <div className="color-option" onClick={() => startGame('b')}>
              <div className="color-preview black-team">
                <img src={pokemonPieces.black.k} alt="Black King" className="preview-piece black-piece" />
                <img src={pokemonPieces.black.q} alt="Black Queen" className="preview-piece black-piece" />
                <img src={pokemonPieces.black.n} alt="Black Knight" className="preview-piece black-piece" />
              </div>
              <h2>Play as Black</h2>
              <p>AI moves first!</p>
            </div>
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <div className="chess-game">
        <div className="chess-header">
          <h1>Pokemon Chess Battle</h1>
          <p className="chess-instructions">
            {playerColor === 'w' ? 'You are White' : 'You are Black'} - Capture opponent Pokemon to gain +5 HP! Win to evolve!
          </p>
          {game.turn() === playerColor ? (
            <p className="turn-indicator your-turn">Your Turn!</p>
          ) : (
            <p className="turn-indicator opponent-turn">Opponent's Turn</p>
          )}
        </div>

        {gameStatus && (
          <div className="chess-status">
            {gameStatus}
            {game.isGameOver() && (
              <button className="reset-button" onClick={resetGame}>
                New Game
              </button>
            )}
          </div>
        )}

        <div className="chess-container">
          <div className="chess-sidebar">
            <div className="captured-section">
              <h3>Captured by You</h3>
              <div className="captured-pieces">
                {capturedPieces.white.map((piece, idx) => (
                  <img
                    key={idx}
                    src={pokemonPieces.black[piece]}
                    alt={piece}
                    className="captured-piece"
                  />
                ))}
              </div>
            </div>

            <div className="move-history">
              <h3>Moves</h3>
              <div className="moves-list">
                {moveHistory.map((move, idx) => (
                  <div key={idx} className="move-item">
                    {Math.floor(idx / 2) + 1}. {move}
                  </div>
                ))}
              </div>
            </div>

            <div className="captured-section">
              <h3>Captured by AI</h3>
              <div className="captured-pieces">
                {capturedPieces.black.map((piece, idx) => (
                  <img
                    key={idx}
                    src={pokemonPieces.white[piece]}
                    alt={piece}
                    className="captured-piece"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="chess-board-container">
            <div className="chess-board">
              {renderBoard()}
            </div>
            {aiThinking && (
              <div className="ai-thinking">
                AI is thinking...
              </div>
            )}
          </div>
        </div>

        <div className="chess-controls">
          <button className="game-button" onClick={resetGame}>
            Reset Game
          </button>
          <button
            className="game-button"
            onClick={() => {
              const moves = game.moves({ verbose: true });
              if (moves.length > 0) {
                handleCorrectAnswer(1);
              }
            }}
          >
            Show Hint (+1 HP)
          </button>
        </div>
      </div>
    </GameLayout>
  );
};

export default PokemonChess;
