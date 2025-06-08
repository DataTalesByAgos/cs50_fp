from flask import Flask, request, jsonify
from flask_cors import CORS
import chess.pgn
import io
import chess

app = Flask(__name__)
CORS(app)

def parse_pgn_string(pgn_string):
    """
    Parse a PGN string and return a chess game object.
    Returns None if the PGN is invalid or cannot be parsed correctly.
    """
    try:
        # Ensure the input is treated as a file-like object
        pgn_io = io.StringIO(pgn_string)
        game = chess.pgn.read_game(pgn_io)
        
        # Check if game was parsed successfully and has at least one move
        if game is None or not list(game.mainline_moves()):
            return None

        return game
    except Exception as e:
        # Log the exception for debugging
        print(f"Error parsing PGN: {e}")
        return None

def calculate_material_value(board, color):
    """
    Calculate the material value for a given color on the board.
    Returns the total material value as an integer.
    """
    piece_values = {
        chess.PAWN: 1,
        chess.KNIGHT: 3,
        chess.BISHOP: 3,
        chess.ROOK: 5,
        chess.QUEEN: 9,
        chess.KING: 0  # King's value not counted in material
    }
    
    total = 0
    for piece_type in piece_values:
        pieces = board.pieces(piece_type, color)
        total += len(pieces) * piece_values[piece_type]
    return total

def get_move_info(board, move):
    """
    Get detailed information about a chess move.
    Returns a dictionary with move details.
    """
    # Create a copy of the board to avoid modifying the original
    board_copy = board.copy()
    
    # Get info before applying the move
    is_capture = board_copy.is_capture(move)
    captured_piece = board_copy.piece_at(move.to_square) if is_capture else None
    is_kingside_castling = board_copy.is_kingside_castling(move)
    is_queenside_castling = board_copy.is_queenside_castling(move)
    
    # Get the SAN notation before applying the move
    san = board_copy.san(move)
    
    # Apply the move
    board_copy.push(move)
    
    # Get info after move
    is_check = board_copy.is_check()
    is_checkmate = board_copy.is_checkmate()
    
    return {
        'san': san,
        'fen': board_copy.fen(),
        'is_capture': is_capture,
        'captured_piece': captured_piece.symbol() if captured_piece else None,
        'is_check': is_check,
        'is_checkmate': is_checkmate,
        'is_kingside_castling': is_kingside_castling,
        'is_queenside_castling': is_queenside_castling,
        'material_white': calculate_material_value(board_copy, chess.WHITE),
        'material_black': calculate_material_value(board_copy, chess.BLACK)
    }

def main():
    """
    Main function that sets up the Flask application and routes.
    """
    @app.route('/parse-pgn', methods=['POST'])
    def handle_parse_pgn():
        print("Received /parse-pgn request")
        try:
            data = request.get_json()
            print(f"Request data received: {data}")

            if not data or 'pgn' not in data:
                print("Error: Missing PGN in request body")
                return jsonify({'error': 'Missing PGN in request body'}), 400

            pgn_string = data['pgn']
            print("Attempting to parse PGN string...")
            game = parse_pgn_string(pgn_string)
            
            if game is None:
                print("Error: Could not parse PGN or game has no moves.")
                return jsonify({'error': 'Could not parse PGN'}), 400

            print("PGN parsed successfully. Processing moves...")
            moves = []
            board = chess.Board()

            try:
                for move in game.mainline_moves():
                    # Before getting info, the board is in the state *before* this move.
                    # get_move_info will create a copy and push the move internally.
                    move_info = get_move_info(board.copy(), move) # Pass a copy to get_move_info
                    moves.append(move_info)
                    # After getting info, push the move to update the main board for the next iteration
                    board.push(move)

                print(f"Successfully processed {len(moves)} moves.")

            except Exception as move_processing_error:
                print(f"Error processing moves: {move_processing_error}")
                return jsonify({'error': 'Error processing moves', 'details': str(move_processing_error)}), 500

            print("Returning success response.")
            return jsonify({
                'moves': moves,
                'headers': dict(game.headers)
            })

        except Exception as e:
            print(f"An unexpected error occurred in handle_parse_pgn: {e}")
            return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

    app.run(debug=True)

if __name__ == '__main__':
    main() 