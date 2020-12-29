import React, { useState } from "react";
import "./App.css";
import Chessboard from "chessboardjsx";
import { ChessInstance, ShortMove } from "chess.js";
const Chess = require("chess.js");

const startFenPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const App: React.FC = () => {

  const [chess] = useState<ChessInstance>(
    new Chess(startFenPosition)
  );

  const [hist, setHist] = useState<any[]>([]);

  const [fen, setFen] = useState(chess.fen());

  const runCPUMove = (moves: string[]) => {
    const computerMove = moves[Math.floor(Math.random() * moves.length)];
    chess.move(computerMove);
    setFen(chess.fen());
    setHist(chess.history({ verbose: true }));
  }

  const restartGame = () => {
    chess.reset();
    setHist([]);
    setFen(startFenPosition);
  }

  const undoLastMove = () => {
    chess.undo()
    chess.undo()
    setFen(chess.fen())
    setHist(chess.history({ verbose: true }));
    return;
  }

  const handleMove = (move: ShortMove) => {
    if (!chess.move(move))
      return;

    setFen(chess.fen());
    setHist(chess.history({ verbose: true }));

    if (chess.in_checkmate()) alert('Cheque-Mate');
    else if (chess.in_check()) alert('Cheque');
    else if (chess.in_draw()) alert('Empate');
    else if (chess.in_stalemate()) alert('Empate por jogo travado');
    else if (chess.in_threefold_repetition()) alert('Empate por repetição')

    setTimeout(() => {
      const moves = chess.moves();
      if (moves.length > 0)
        runCPUMove(moves);
    }, 1);
  };

  const renderHist = () => {
    return (
      <div>
        <span>Hist. Jogadas</span>
        {
          hist.map((item, index) => <li key={index}>{index} - {item.color == 'w' ? "PL1" : "CPU"}  -{item.piece}{item.to}</li>)
        }
      </div>
    )
  }

  return (
    <div className="flex-center">
      <h1>Rodrigo Chess</h1>
      <Chessboard
        draggable={true}
        dropOffBoard={'trash'}
        width={400}
        position={fen}
        onDrop={(move) =>
          handleMove({
            from: move.sourceSquare,
            to: move.targetSquare,
            promotion: "q"
          })
        }
      />
      <button onClick={() => restartGame()} >Reset</button>
      <button onClick={() => undoLastMove()} >Undo</button>
      {renderHist()}
    </div>
  );
};

export default App;