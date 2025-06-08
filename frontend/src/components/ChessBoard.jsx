import React from 'react'
import { Chessboard } from 'react-chessboard'

function ChessBoard({ position }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="aspect-square max-w-[800px] mx-auto">
        <Chessboard 
          position={position}
          boardWidth={800}
          customBoardStyle={{
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
          }}
          customDarkSquareStyle={{ backgroundColor: '#769656' }}
          customLightSquareStyle={{ backgroundColor: '#eeeed2' }}
        />
      </div>
    </div>
  )
}

export default ChessBoard 