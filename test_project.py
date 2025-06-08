import pytest
import chess
from project import parse_pgn_string, calculate_material_value, get_move_info

def test_parse_pgn_string():
    # Test valid PGN
    valid_pgn = "1. e4 e5 2. Nf3 Nc6"
    game = parse_pgn_string(valid_pgn)
    assert game is not None
    assert len(list(game.mainline_moves())) == 4

    # Test invalid PGN with illegal move
    invalid_pgn = "1. e4 e5 2. Nf3 Nc6 3. e4"  # e4 is illegal because the square is already occupied
    game = parse_pgn_string(invalid_pgn)
    assert game is None

    # Test completely invalid PGN
    invalid_pgn = "This is not a PGN at all"
    game = parse_pgn_string(invalid_pgn)
    assert game is None

def test_calculate_material_value():
    board = chess.Board()
    
    # Test initial position
    assert calculate_material_value(board, chess.WHITE) == 39  # 8 pawns + 2 knights + 2 bishops + 2 rooks + 1 queen
    assert calculate_material_value(board, chess.BLACK) == 39

    # Test after some captures
    board.push_san("e4")  # White pawn moves
    board.push_san("d5")  # Black pawn moves
    board.push_san("exd5")  # White captures black pawn
    
    assert calculate_material_value(board, chess.WHITE) == 39  # White material unchanged
    assert calculate_material_value(board, chess.BLACK) == 38  # Black lost a pawn

def test_get_move_info():
    board = chess.Board()
    move = chess.Move.from_uci("e2e4")  # White pawn to e4
    
    info = get_move_info(board, move)
    
    # Test move information
    assert info['san'] == 'e4'
    assert info['is_capture'] == False
    assert info['captured_piece'] is None
    assert info['is_check'] == False
    assert info['is_checkmate'] == False
    assert info['is_kingside_castling'] == False
    assert info['is_queenside_castling'] == False
    
    # Test material values
    assert info['material_white'] == 39  # Full material for white
    assert info['material_black'] == 39  # Full material for black
    
    # Test capture move
    board = chess.Board()
    board.push_san("e4")
    board.push_san("d5")
    capture_move = chess.Move.from_uci("e4d5")
    
    info = get_move_info(board, capture_move)
    assert info['is_capture'] == True
    assert info['captured_piece'] == 'p'  # Captured a pawn
    assert info['material_black'] == 38  # Black lost a pawn 