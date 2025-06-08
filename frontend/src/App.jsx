import { useState } from 'react'
import ChessBoard from './components/ChessBoard'
import MoveList from './components/MoveList'
import FileUpload from './components/FileUpload'
import DiagramView from './components/DiagramView'

function App() {
  const [game, setGame] = useState(null)
  const [currentMove, setCurrentMove] = useState(0)
  const [currentPosition, setCurrentPosition] = useState('start')
  const [view, setView] = useState('upload')
  const [isLoading, setIsLoading] = useState(false)

  const handleSetGame = (gameData) => {
    setGame(gameData)
    setCurrentMove(0)
    setCurrentPosition('start')
    setView('playback')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="py-4 px-4 flex justify-end items-center">
        <button
          onClick={() => setView('upload')}
          className={`mr-4 px-4 py-2 rounded-md font-medium ${view === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Home
        </button>
        <button
          onClick={() => setView('diagram')}
          className={`mr-4 px-4 py-2 rounded-md font-medium ${view === 'diagram' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Diagram
        </button>
        <a
          href="https://github.com/DataTalesByAgos"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-700 hover:text-blue-600 font-medium"
        >
          <img src="/github-mark.svg" alt="GitHub" className="w-6 h-6" />
        </a>
      </nav>

      <div className="flex-grow flex items-center justify-center px-4 py-8">
        {view === 'upload' && (
          <div className="bg-white rounded-lg shadow-lg p-8 mx-auto max-w-4xl w-full min-h-[70vh] flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4 text-center text-slate-700">Chess Game Viewer</h2>
            <p className="text-slate-600 mb-8 mx-auto text-center text-lg leading-relaxed">
              Upload PGN games for detailed analysis of moves, captures, and gameplay.
            </p>
            <FileUpload setGame={handleSetGame} onLoadingChange={setIsLoading} />
          </div>
        )}

        {isLoading && (
          <div className="bg-white rounded-lg shadow-lg p-8 mx-auto max-w-4xl w-full min-h-[70vh] flex items-center justify-center">
            <h2 className="text-2xl font-bold text-slate-700">Loading game...</h2>
          </div>
        )}

        {view === 'playback' && game && !isLoading && (
          <div className="container mx-auto mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 h-[70vh] w-full">
            <div className="lg:col-span-2">
              <ChessBoard 
                position={currentPosition}
                currentMove={currentMove} 
              />
            </div>
            <div className="lg:col-span-1">
              <MoveList 
                moves={game?.moves} 
                currentMove={currentMove}
                setCurrentMove={setCurrentMove}
                setPosition={setCurrentPosition}
              />
            </div>
          </div>
        )}

        {view === 'diagram' && (
          <DiagramView onBack={() => setView('upload')} />
        )}
      </div>
    </div>
  )
}

export default App
