var piece_type =
{
    null_piece: -2,
    passant_square: -1,
    move_square: 0,

    B_pawn: 1,
    B_rook: 2,
    B_knight: 3,
    B_bishop: 4,
    B_queen: 5,
    B_king: 6,
    W_pawn: 7,
    W_rook: 8,
    W_knight: 9,
    W_bishop: 10,
    W_queen: 11,
    W_king: 12
}

var piece_motion_rows = {
    down: [{x: 0, y: -1}, {x: 0, y: -2}, {x: 0, y: -3}, {x: 0, y: -4}, {x: 0, y: -5}, {x: 0, y: -6}, {x: 0, y: -7}],
    up: [{x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3}, {x: 0, y: 4}, {x: 0, y: 5}, {x: 0, y: 6}, {x: 0, y: 7}],
    left: [{x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}, {x: 7, y: 0}],
    right: [{x: -1, y: 0}, {x: -2, y: 0}, {x: -3, y: 0}, {x: -4, y: 0}, {x: -5, y: 0}, {x: -6, y: 0}, {x: -7, y: 0}],

    down_right: [{x: -1, y: -1}, {x: -2, y: -2}, {x: -3, y: -3}, {x: -4, y: -4}, {x: -5, y: -5}, {x: -6, y: -6}, {x: -7, y: -7}],
    down_left: [{x: 1, y: -1}, {x: 2, y: -2}, {x: 3, y: -3}, {x: 4, y: -4}, {x: 5, y: -5}, {x: 6, y: -6}, {x: 7, y: -7}],
    up_right: [{x: -1, y: 1}, {x: -2, y: 2}, {x: -3, y: 3}, {x: -4, y: 4}, {x: -5, y: 5}, {x: -6, y: 6}, {x: -7, y: 7}],
    up_left: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}, {x: 4, y: 4}, {x: 5, y: 5}, {x: 6, y: 6}, {x: 7, y: 7}]
}

var pieces = [];

class Piece
{
    piece_type;
    icon;
    motions;
    color;

    constructor(piece_type, icon, motions, color)
    {
        this.piece_type = piece_type;
        this.icon = icon;
        this.motions = motions;
        this.color = color;
    }

    GetElement(first_turn = false)
    {
        return GetDefaultPieceElement(this.icon, first_turn);
    }
}

function LoadCustomPieceFromData(piece, piece_data, gen_locations = false)
{
    console.log("ADDED NEW PIECE")
        const pt_w = parseInt(piece_data.id + "1");
        const pt_b = parseInt(piece_data.id + "2");

        piece_type[piece_data.id + "W"] = pt_w;
        piece_type[piece_data.id + "B"] = pt_b;

        const point_motions = []
        const point_takes = []
        const inv_point_motions = []
        const inv_point_takes = []

        piece_data.tile_motion_spots.forEach(motion_spot => {
            point_motions.push(CreatePieceMotionSquare(motion_spot.x, motion_spot.y));
        })

        piece_data.tile_motion_spots.forEach(motion_spot => {
            inv_point_motions.push(CreatePieceMotionSquare(-motion_spot.x, -motion_spot.y));
        })

        piece_data.tile_capture_spots.forEach(motion_spot => {
            point_takes.push(CreatePieceMotionSquare(motion_spot.x, motion_spot.y));
        })

        piece_data.tile_capture_spots.forEach(motion_spot => {
            inv_point_takes.push(CreatePieceMotionSquare(-motion_spot.x, -motion_spot.y));
        })

        const motions = new PieceMotions(point_motions, point_takes);
        const inv_motions = new PieceMotions(inv_point_motions, inv_point_takes);

        pieces.push(new Piece(pt_b, B64ToImage(piece_data.img), inv_motions, 'B'));
        pieces.push(new Piece(pt_w, B64ToImage(piece_data.img_w), motions, 'W'));

        if(gen_locations)
        {
            piece.pos.forEach(pos => {
                GetTileByXY(pos.x, pos.y).UpdatePiece(pos.c == 'W' ? GetPiece(pt_w) : GetPiece(pt_b));
            });
        }
}

function FetchCustomPiece(piece, gen_locations = false)
{
    api.getChessBoard("piece_" + piece.id)
    .then(piece_data => {
        LoadCustomPieceFromData(piece, piece_data, gen_locations);
    })
}

function GenerateDefaultPieces(path_prefix = "")
{
    const knight_motions_arr = [CreatePieceMotionSquare(2, 1), CreatePieceMotionSquare(1, 2), CreatePieceMotionSquare(-2, 1), CreatePieceMotionSquare(-1, 2), CreatePieceMotionSquare(2, -1), CreatePieceMotionSquare(1, -2), CreatePieceMotionSquare(-2, -1), CreatePieceMotionSquare(-1, -2)];
    const all_rows_arr = [piece_motion_rows.down, piece_motion_rows.down_left, piece_motion_rows.down_right, piece_motion_rows.left, piece_motion_rows.right, piece_motion_rows.up, piece_motion_rows.up_left, piece_motion_rows.up_right];

    var B_pawn_motions = new PieceMotions([CreatePieceMotionSquare(0, 1)], [CreatePieceMotionSquare(1, 1), CreatePieceMotionSquare(-1, 1)], [], [], [], [[CreatePieceMotionSquare(0, 1), CreatePieceMotionSquare(0, 2)]])
    var W_pawn_motions = new PieceMotions([CreatePieceMotionSquare(0, -1)], [CreatePieceMotionSquare(1, -1), CreatePieceMotionSquare(-1, -1)], [], [], [], [[CreatePieceMotionSquare(0, -1), CreatePieceMotionSquare(0, -2)]])

    var rook_motions = new PieceMotions([], [], [piece_motion_rows.up, piece_motion_rows.down, piece_motion_rows.right, piece_motion_rows.left], [piece_motion_rows.up, piece_motion_rows.down, piece_motion_rows.right, piece_motion_rows.left]);

    var knight_motions = new PieceMotions(knight_motions_arr, knight_motions_arr);

    var bishop_motions = new PieceMotions([], [], [piece_motion_rows.down_left, piece_motion_rows.down_right, piece_motion_rows.up_left, piece_motion_rows.up_right], [piece_motion_rows.down_left, piece_motion_rows.down_right, piece_motion_rows.up_left, piece_motion_rows.up_right]);

    var queen_motions = new PieceMotions([], [], all_rows_arr, all_rows_arr);

    var king_motions = new PieceMotions([CreatePieceMotionSquare(1, 0), CreatePieceMotionSquare(-1, 0), CreatePieceMotionSquare(0, 1), CreatePieceMotionSquare(0, -1), CreatePieceMotionSquare(1, 1), CreatePieceMotionSquare(1, -1), CreatePieceMotionSquare(-1, 1), CreatePieceMotionSquare(-1, -1)], [])

    pieces.push(new Piece(piece_type.B_rook, path_prefix + "../pieces/black_rook.png", rook_motions, 'B'));
    pieces.push(new Piece(piece_type.W_rook, path_prefix +"../pieces/white_rook.png", rook_motions, 'W'));

    pieces.push(new Piece(piece_type.B_pawn, path_prefix +"../pieces/black_pawn.png", B_pawn_motions, 'B'));
    pieces.push(new Piece(piece_type.W_pawn, path_prefix +"../pieces/white_pawn.png", W_pawn_motions, 'W'));

    pieces.push(new Piece(piece_type.B_knight, path_prefix +"../pieces/black_knight.png", knight_motions, 'B'));
    pieces.push(new Piece(piece_type.W_knight, path_prefix +"../pieces/white_knight.png", knight_motions, 'W'));

    pieces.push(new Piece(piece_type.B_bishop, path_prefix +"../pieces/black_bishop.png", bishop_motions, 'B'));
    pieces.push(new Piece(piece_type.W_bishop, path_prefix +"../pieces/white_bishop.png", bishop_motions, 'W'));

    pieces.push(new Piece(piece_type.B_queen, path_prefix +"../pieces/black_queen.png", queen_motions, 'B'));
    pieces.push(new Piece(piece_type.W_queen, path_prefix +"../pieces/white_queen.png", queen_motions, 'W'));

    pieces.push(new Piece(piece_type.move_square, path_prefix +"../pieces/move_square.png", null, 'N'));
    pieces.push(new Piece(piece_type.passant_square, path_prefix +"../pieces/move_square.png", null, 'N'));
    pieces.push(new Piece(piece_type.null_piece, "", null, 'N'));

    pieces.push(new Piece(piece_type.B_king, path_prefix +"../pieces/black_king.png", king_motions, 'B'));
    pieces.push(new Piece(piece_type.W_king, path_prefix +"../pieces/white_king.png", king_motions, 'W'));

}

function GetDefaultPieceElement(icon, first_turn = false)
{
    var p = document.createElement("div");
    p.className = "piece";
    p.setAttribute("style", "background-image: url(\"" + icon + "\");");

    if(first_turn){p.setAttribute(elements.a_first_turn, "true");}
    return p;
}

function GetPiece(type)
{
    return pieces.filter(p => p.piece_type === type)[0];    
}






class PieceMotions
{
    moveable_squares;
    takeable_squares;
    first_turn_squares;
    first_turn_rows;
    piece_motion_rows;
    piece_motion_takes;

    constructor(moveable_squares, takeable_squares, piece_motion_rows = [], piece_motion_takes = [], first_turn_squares = [], first_turn_rows = [])
    {
        this.moveable_squares = moveable_squares;
        this.takeable_squares = takeable_squares;
        this.first_turn_squares = first_turn_squares;
        this.piece_motion_rows = piece_motion_rows;
        this.piece_motion_takes = piece_motion_takes;
        this.first_turn_rows = first_turn_rows;
    }
}

function CreatePieceMotionSquare(d_x, d_y)
{
    return {x: d_x, y: d_y};
}