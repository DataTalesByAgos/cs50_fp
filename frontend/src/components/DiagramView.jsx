import React, { useState } from 'react';

function DiagramView({
  onBack
}) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-3xl font-bold mb-4 text-center text-slate-700">Chess Viewer Diagram</h2>

      <div className="relative w-full max-w-full flex items-center justify-center min-h-[70vh]"> {/* Container to define space */} 
        {isImageLoading && !imageError && (
          <div className="absolute inset-0 bg-gray-100 rounded-lg shadow-lg p-8 mx-auto w-full flex items-center justify-center text-xl font-medium text-slate-500 animate-pulse">
            Loading diagram...
          </div>
        )}

        {imageError && (
          <div className="absolute inset-0 bg-red-100 text-red-700 rounded-lg shadow-lg p-8 mx-auto w-full flex items-center justify-center text-xl font-medium">
            Error loading diagram. Please try again or check the file.
          </div>
        )}

        <img 
          src="/chessViewer.png" 
          alt="Chess Viewer Flow Diagram" 
          className={`max-w-full h-auto rounded-lg shadow-lg transition-opacity duration-500 ${isImageLoading || imageError ? 'opacity-0' : 'opacity-100'}`} 
          onLoad={() => setIsImageLoading(false)}
          onError={() => { setIsImageLoading(false); setImageError(true); }}
        />
      </div>

      <button
        onClick={onBack}
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Back
      </button>
    </div>
  );
}

export default DiagramView; 