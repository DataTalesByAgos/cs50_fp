# Chess Viewer

#### Video Demo: <URL HERE>

#### Description:

Chess Viewer is a CS50 project that lets you analyze chess games in PGN format. The application parses PGN files and provides detailed information about each move, including material balance, captures, checks, and game headers. Built with Flask for the backend and React for the frontend, it offers a clean interface to visualize and understand chess games.

## Technologies Used

### Backend
- Python 3.12
- Flask
- Flask-CORS
- python-chess
- pytest

### Frontend
- React
- Vite
- React Router
- Tailwind CSS

## How to Run

### Requirements
- Python 3.12 or higher
- pip

### Backend (Flask)
```bash
# Install backend dependencies
pip install -r requirements.txt

# Run the Flask server
python project.py
# Server runs at http://127.0.0.1:5000
```

### Frontend (React)
```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start the development server
npm run dev
# App runs at http://localhost:5173
```

## Features
- Parse and validate PGN files
- Calculate material balance for each side after every move
- Detect and display:
  - Captures (with piece type)
  - Checks and checkmates
  - Castling moves (kingside and queenside)
- Show move list with standard algebraic notation (SAN)
- Display game headers (event, players, date)
- Interactive chessboard visualization
- Material balance chart
- Drag and drop PGN file upload

## Testing
```bash
# Run backend tests
pytest test_project.py -v
```

## Usage
1. Open http://localhost:5173 in your browser
2. Upload a PGN file or paste PGN text
3. View the analyzed game with move details and material balance
