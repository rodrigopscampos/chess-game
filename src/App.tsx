import React, { useState } from "react";
import "./App.css";
import Chessboard from "chessboardjsx";
import { ChessInstance, ShortMove } from "chess.js";
const Chess = require("chess.js");

class HistItem {
  fen: string = "";
  move: string = "";
  player: string = "";

  constructor(fen: string, move: string, player: string) {
    this.fen = fen;
    this.move = move;
    this.player = player;
  }
};

const startFenPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const App: React.FC = () => {

  const [chess] = useState<ChessInstance>(
    new Chess(startFenPosition)
  );

  const [hist, setHist] = useState<HistItem[]>([]);

  const [fen, setFen] = useState(chess.fen());

  const runCPUMove = (moves: string[]) => {
    const computerMove = moves[Math.floor(Math.random() * moves.length)];
    chess.move(computerMove);
    hist.push(new HistItem(chess.fen(), computerMove, "CPU"));
    setFen(chess.fen());
    setHist(hist);
  }

  const restartGame = () => {
    chess.reset();
    setHist([]);
    setFen(startFenPosition);
  }

  const undoLastMove = () => {
    let position = hist.length - 3;
    if (position < 0) {
      restartGame();
    }
    else {
      let last = hist[position].fen;
      if (last !== undefined) {
        if (chess.load(last)) {
          let newHist = hist.slice(0, position + 1);
          setHist(newHist);
          setFen(last);
        }
      }
    }
  }

  const handleMove = (move: ShortMove) => {
    if (chess.move(move)) {
      setTimeout(() => {
        const moves = chess.moves();

        if (moves.length > 0)
          runCPUMove(moves);

      }, 1);

      setFen(chess.fen());
      hist.push(new HistItem(chess.fen(), move.to, "PL1"));
      setHist(hist);
    }
  };

  const renderHist = () => {
    return (
      <div>
        <span>Hist. Jogadas</span>
        {
          hist.map((item, index) => <li key={index}>{index} - {item.player} - {item.move}</li>)
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