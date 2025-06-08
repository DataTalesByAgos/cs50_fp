import React, { useState, useEffect, useMemo } from 'react'

// Component for displaying moves list and captured pieces
function MoveList({ moves, currentMove, setCurrentMove, setPosition }) {
  if (!moves) return null

  // Handle move click and update position
  const handleMoveClick = (index, fen) => {
    setIsPlaying(false);
    setCurrentMove(index)
    setPosition(fen)
  }

  const [isPlaying, setIsPlaying] = useState(false);

  // Calculate captured pieces up to current move
  const capturedPieces = useMemo(() => {
      const whiteCaptured = [];
      const blackCaptured = [];
      
      for (let i = 0; i < currentMove; i++) {
          const move = moves[i];
          if (move.is_capture && move.captured_piece) {
              // Black pieces are lowercase in FEN notation
              if (move.captured_piece === move.captured_piece.toLowerCase()) {
                  whiteCaptured.push(move.captured_piece);
              } else {
                  blackCaptured.push(move.captured_piece);
              }
          }
      }
      
      // Sort pieces by value for consistent display
      const pieceOrder = { 'p': 1, 'n': 2, 'b': 3, 'r': 4, 'q': 5, 'k': 6 };
      whiteCaptured.sort((a, b) => pieceOrder[a.toLowerCase()] - pieceOrder[b.toLowerCase()]);
      blackCaptured.sort((a, b) => pieceOrder[a.toLowerCase()] - pieceOrder[b.toLowerCase()]);

      return { white: whiteCaptured, black: blackCaptured };
  }, [currentMove, moves]);

  // Handle auto-playback
  useEffect(() => {
    let intervalId = null;
    if (isPlaying && currentMove < moves.length - 1) {
      intervalId = setInterval(() => {
        setCurrentMove(prevMove => {
          const nextMove = prevMove + 1;
          if (nextMove < moves.length) {
            setPosition(moves[nextMove].fen);
            return nextMove;
          } else {
            setIsPlaying(false);
            return prevMove;
          }
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, currentMove, moves, setPosition, setCurrentMove]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Get piece icon path from FEN symbol
  const getPieceIconPath = (pieceSymbol) => {
    const color = pieceSymbol === pieceSymbol.toLowerCase() ? 'b' : 'w';
    const piece = pieceSymbol.toLowerCase();
    return `/pieces/${color}${piece}.svg`;
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow-lg p-4 flex flex-col h-full text-gray-800">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Moves</h2>

      {/* Captured pieces section */}
      <div className="flex justify-between items-center mb-4 text-sm text-gray-700">
          {/* Pieces captured by white */}
          <div className="flex items-center">
              <span className="mr-2 font-semibold text-gray-700">White captured:</span>
              <div className="flex flex-row-reverse flex-wrap">
                  {capturedPieces.black.map((piece, index) => (
                      <img 
                          key={index} 
                          src={getPieceIconPath(piece)} 
                          alt={piece} 
                          className="w-5 h-5 object-contain"
                      />
                  ))}
              </div>
          </div>

          {/* Pieces captured by black */}
          <div className="flex items-center">
               <div className="flex flex-row flex-wrap">
                  {capturedPieces.white.map((piece, index) => (
                      <img 
                          key={index} 
                          src={getPieceIconPath(piece)} 
                          alt={piece} 
                          className="w-5 h-5 object-contain"
                      />
                  ))}
              </div>
               <span className="ml-2 font-semibold text-gray-700">Black captured:</span>
          </div>
      </div>

      {/* Moves list with scroll */}
      <div className="flex-1 overflow-y-auto mb-4 pr-2">
        <div className="flex flex-wrap gap-1">
          {moves.map((move, index) => (
            <button
              key={index}
              onClick={() => handleMoveClick(index, move.fen)}
              className={`py-1 px-2 rounded-md text-left text-sm font-medium transition-all duration-200 border border-slate-200 flex-grow-0 flex-shrink-0
                ${currentMove === index
                  ? 'bg-blue-600 text-white shadow-md border-blue-600'
                  : 'text-blue-800 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'
                }`}
            >
              <span className="text-slate-500 mr-2">
                {Math.floor(index / 2 + 1)}.
              </span>
              {move.san}
            </button>
          ))}
        </div>
      </div>

      {/* Playback controls */}
      <div className="mt- auto flex justify-center gap-3">
        <button
          onClick={() => {
            setIsPlaying(false);
            const newMove = Math.max(0, currentMove - 1);
            setCurrentMove(newMove);
            setPosition(moves[newMove]?.fen || 'start');
          }}
          className={`px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm
            ${currentMove === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200'
            }`}
          disabled={currentMove === 0 || isPlaying}
        >
          ←
        </button>
        <button
          onClick={handlePlayPause}
          className={`px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm
            ${isPlaying || currentMove === moves.length - 1
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700'
            }
            ${currentMove === moves.length - 1 && !isPlaying
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : ''
            }`}
          disabled={currentMove === moves.length - 1 && !isPlaying}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>
        <button
          onClick={() => {
            setIsPlaying(false);
            const newMove = Math.min(moves.length - 1, currentMove + 1);
            setCurrentMove(newMove);
            setPosition(moves[newMove].fen);
          }}
          className={`px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm
            ${currentMove === moves.length - 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200'
            }`}
          disabled={currentMove === moves.length - 1 || isPlaying}
        >
          →
        </button>
      </div>
    </div>
  )
}

export default MoveList 