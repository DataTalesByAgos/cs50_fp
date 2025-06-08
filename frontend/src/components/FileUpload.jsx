import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

// Component for handling PGN file uploads
function FileUpload({ setGame, onLoadingChange }) {
  const [fileError, setFileError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles, fileRejections) => {
    setFileError(null); // Clear previous errors
    onLoadingChange(true); // Start loading

    if (fileRejections.length > 0) {
      setFileError('Invalid file format. Please upload a .pgn file.');
      onLoadingChange(false); // Stop loading if file rejected
      return;
    }

    const file = acceptedFiles[0]
    const reader = new FileReader()

    reader.onload = async (e) => {
      const text = e.target.result
      console.log('Read PGN text:', text.substring(0, 200) + '...'); // Log beginning of PGN
      try {
        // Send PGN to backend for parsing
        console.log('Sending POST request to /parse-pgn');
        const response = await fetch('http://localhost:5000/parse-pgn', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pgn: text })
        })

        console.log('Received response from /parse-pgn', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend error response:', errorText);
            setFileError(`Error processing file: ${errorText || 'Unknown error'}`);
            return; // Stop processing if response is not ok
        }

        const gameData = await response.json()
        console.log('Received game data:', gameData);

        if (gameData && gameData.moves && gameData.headers) {
            console.log('Valid game data received. Calling setGame...');
            setGame(gameData);
            console.log('setGame called.');
        } else {
            console.error('Received invalid game data structure:', gameData);
            setFileError('Received invalid game data from backend. Please upload a valid PGN file.');
        }

      } catch (error) {
        console.error('Error during fetch or processing:', error)
        setFileError('An error occurred while processing your PGN file. Please try again.');
      } finally {
        onLoadingChange(false); // Stop loading after processing (success or error)
      }
    }
    
    reader.readAsText(file)
  }, [setGame, onLoadingChange])

  // Configure dropzone for PGN files
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/x-chess-pgn': ['.pgn'],
    },
    noClick: false,
    noKeyboard: false
  })

  return (
    <div className="flex flex-col items-center">
      {fileError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-full text-center" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{fileError}</span>
        </div>
      )}
      <div 
        {...getRootProps()} 
        className={`rounded-lg text-center cursor-pointer w-full
          transition-all duration-300 ease-in-out
          ${isDragActive 
            ? 'border-3 border-dashed border-blue-500 bg-blue-50 shadow-lg p-6' 
            : ''
          }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-600 text-lg font-medium">Drop the file here!</p>
        ) : (
          <div>
            <p className="text-slate-700 text-lg font-medium mb-2">
              Drag and drop a PGN file here
            </p>
            <p className="text-slate-500 text-base">
              or click to select
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileUpload 