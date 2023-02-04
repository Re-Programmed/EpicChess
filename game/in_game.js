var current_turn_data = 
{
    player: 'W',

    switchTurn: function (sbd = true) {
        en_passant_allowed = undefined;
        if(this.player == 'W'){this.player = 'B'} else {this.player = 'W'}

        if(sbd){ SendBoardData(); }
    }
}

var current_board;

var selected_tiles = []
var move_pieces = [];

var en_passant_allowed = undefined

window.addEventListener("load", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const color = urlParams.get('color');

    client_player = color;

    api.getChessBoard("t_board_1675540090792")
    .then(res => {
        current_board = res;

        tile_dark_color = res.bd;
        tile_light_color = res.bl;

        GenerateDefaultPieces();

        GenerateBoard();
    
        //PlaceDefaultPieces();
        GenerateBoardFromData();
    })

   


})

var tiles = [];

function GenerateBoard()
{
    var dark = false;
    for(var y = 0; y < 8; y++)
    {
        tiles.push([]);
        for(var x = 0; x < 8; x++)
        {
            console.log(current_board.b[((y * 8) + x)].t)
            var tile = GenerateTile(dark, y, x, current_board.b[((y * 8) + x)].t);
            tiles[tiles.length - 1].push(tile);

            tile.ref_el.addEventListener("click", function () {
                SelectTile(this);
            })

            dark = !dark;
        }

        if(client_player == 'W')
        {
            document.getElementById(elements.board).appendChild(document.createElement("br"));
        }else{
            document.getElementById(elements.board).prepend(document.createElement("br"));
        }
        dark = !dark;
    }
}

function GenerateTile(dark, y, x, type)
{
    var tile = document.createElement("div");
    tile.className = dark ? elements.dark_square : elements.light_square;
    tile.classList.add(elements.tile);

    if(client_player == 'W')
    {
        document.getElementById(elements.board).appendChild(tile);
    }else{
        document.getElementById(elements.board).prepend(tile);
    }
    
    return new Tile(dark, tile, y, x, type);
}

function SelectTile(tile)
{
    if(client_player != current_turn_data.player){return;}

    var tile_data = GetTileByElement(tile);

    if(tile_data.piece != undefined)
    {
        if(tile_data.piece.piece_type == piece_type.passant_square)
        {
            if(selected_tiles.length > 0)
            {
                var t = GetTileByElement(selected_tiles[0]);
                tile_data.UpdatePiece(GetPiece(t.piece.piece_type));

                GetTileByXY(tile_data.x, tile_data.y + (t.piece.piece_type == piece_type.W_pawn ? 1 : -1)).RemovePiece();

                t.RemovePiece();

                RemoveSelections();

                current_turn_data.switchTurn();
            }

            return;
        }

        if(tile_data.piece.piece_type == piece_type.move_square)
        {
            if(selected_tiles.length > 0)
            {
                var t = GetTileByElement(selected_tiles[0]);
                tile_data.UpdatePiece(GetPiece(t.piece.piece_type));

                t.RemovePiece();

                RemoveSelections();

                current_turn_data.switchTurn(false);

                if(t.y - 2 == tile_data.y || t.y + 2 == tile_data.y)
                {
                    if(tile_data.piece.piece_type == piece_type.B_pawn || tile_data.piece.piece_type == piece_type.W_pawn)
                    {
                        en_passant_allowed = tile_data;
                    }
                }

                SendBoardData();
            }

            return;
        }

        if(tile_data.has_circle)
        {
            if(selected_tiles.length > 0)
            {
                var t = GetTileByElement(selected_tiles[0]);

                tile_data.RemovePieceImmediate();

                tile_data.UpdatePiece(GetPiece(t.piece.piece_type));


                t.RemovePiece();

                RemoveSelections();

                current_turn_data.switchTurn();
            }
        }

        if(tile_data.piece.motions != undefined)
        {
            if(tile_data.piece.color != current_turn_data.player){return;}
            RemoveSelections();
            tile.setAttribute("style", "background-color: var(--selected_square_color);");
            selected_tiles.push(tile);

            if(en_passant_allowed != undefined)
            {
                if(tile_data.piece.piece_type == piece_type.B_pawn || tile_data.piece.piece_type == piece_type.W_pawn)
                {
                    if((tile_data.x - 1 == en_passant_allowed.x || tile_data.x + 1 == en_passant_allowed.x) && tile_data.y == en_passant_allowed.y)
                    {
                        AllowEnPassantCapture(GetTileByXY(en_passant_allowed.x, en_passant_allowed.y + (tile_data.piece.piece_type == piece_type.W_pawn ? -1 : 1)));
                    }
                }
            }

            tile_data.piece.motions.moveable_squares.forEach(move => {
                AllowTileMove(GetTileByXY(tile_data.x + move.x, tile_data.y + move.y));
            })

            tile_data.piece.motions.piece_motion_rows?.forEach(row => {
                var finish_row = false;
                row.forEach(move => {
                    if(!finish_row)
                    {
                        var t = GetTileByXY(tile_data.x + move.x, tile_data.y + move.y);
                        if(t == undefined){finish_row = true;}
                        else
                        {
                            if(t.piece != undefined){finish_row = true;}
                            else
                            {
                                AllowTileMove(t);
                            }
                        }
                    }
                })
            })
            
            tile_data.piece.motions.piece_motion_takes?.forEach(row => {
                var finish_row = false;
                row.forEach(move => {
                    if(!finish_row)
                    {
                        var t = GetTileByXY(tile_data.x + move.x, tile_data.y + move.y);
                        if(t != undefined)
                        {
                            if(t.piece != undefined)
                            {
                                if(t.piece.color != 'N')
                                {
                                    if(tile_data.piece.color != t.piece.color)
                                    {
                                        AllowTileCapture(t);
                                    }
    
                                    finish_row = true;
                                }
                            }
                        }
                    }
                    
                })
            })

            if(tile.children[0].getAttribute(elements.a_first_turn) != undefined)
            {
                tile_data.piece.motions.first_turn_squares.forEach(move => {
                    AllowTileMove(GetTileByXY(tile_data.x + move.x, tile_data.y + move.y));
                })

                tile_data.piece.motions.first_turn_rows?.forEach(row => {
                    var finish_row = false;
                    row.forEach(move => {
                        if(!finish_row)
                        {
                            var t = GetTileByXY(tile_data.x + move.x, tile_data.y + move.y);
                            if(t == undefined){finish_row = true;}
                            else
                            {
                                if(t.piece != undefined && t.piece.piece_type != piece_type.move_square){finish_row = true;}
                                else
                                {
                                    AllowTileMove(t);
                                }
                            }
                        }
                    })
                })
            }

            tile_data.piece.motions.takeable_squares.forEach(move => {
                var t = GetTileByXY(tile_data.x + move.x, tile_data.y + move.y);

                if(t != undefined)
                {
                    if(t.piece != null)
                    {
                        if(t.piece.color != 'N')
                        {
                            if(tile_data.piece.color != t.piece.color)
                            {
                                AllowTileCapture(t);
                            }
                        }
                    }
                }
            })
        }
    }
}

function AllowEnPassantCapture(tile)
{
    tile.UpdatePiece(GetPiece(piece_type.passant_square));
    move_pieces.push(tile);

}

function RemoveSelections()
{
    selected_tiles.forEach(t => {
        DeselectTile(t);
    })

    move_pieces.forEach(mp => {
        if(mp.piece != null)
        {
            if(mp.piece.piece_type == piece_type.move_square || mp.has_circle || mp.piece.piece_type == piece_type.passant_square)
            {
                mp.RemovePiece();
            }
        }
    })

    move_pieces = []
    selected_tiles = []
}

function AllowTileCapture(tile)
{
    if(tile == undefined){return;}
    if(tile.piece != undefined)
    {
        tile.AddCaptureCircle();

        move_pieces.push(tile);
    }
}

function AllowTileMove(tile)
{
    if(tile == undefined){return;}
    if(tile.piece == undefined)
    {
        tile.UpdatePiece(GetPiece(piece_type.move_square));

        move_pieces.push(tile);
    }
}

function DeselectTile(tile)
{
    GetTileByElement(tile).UpdateColor()
}

function GetTileByElement(element)
{
    return tiles[parseInt(element.getAttribute(elements.a_tile_y))][parseInt(element.getAttribute(elements.a_tile_x))]
}

function GetTileByXY(x, y)
{
    if(x < 8 && y < 8 && x >= 0 && y >= 0)
    {
        return tiles[y][x];
    }else{
        return undefined;
    }
}


function PlaceDefaultPieces(reset = false)
{
    current_turn_data.player = "W";

    tiles.forEach(t => {
        t.forEach(tile => {
            if(tile.piece != undefined){tile.RemovePiece();}
        })
    })

    defaultPieces.forEach(piece => {
        var t = tiles[piece.y][piece.x];
        t.SetStartPiece(GetPiece(piece.type));
    })

        RetrieveBoardData(reset);
}

const defaultPieces = 
[
    {type: piece_type.B_rook, x: 0, y: 0},
    {type: piece_type.B_rook, x: 7, y: 0},
    {type: piece_type.B_knight, x: 1, y: 0},
    {type: piece_type.B_knight, x: 6, y: 0},
    {type: piece_type.B_bishop, x: 5, y: 0},
    {type: piece_type.B_bishop, x: 2, y: 0},

    {type: piece_type.B_queen, x: 3, y: 0},
    {type: piece_type.B_king, x: 4, y: 0},

    {type: piece_type.B_pawn, x: 0, y: 1},
    {type: piece_type.B_pawn, x: 1, y: 1},
    {type: piece_type.B_pawn, x: 2, y: 1},
    {type: piece_type.B_pawn, x: 3, y: 1},
    {type: piece_type.B_pawn, x: 4, y: 1},
    {type: piece_type.B_pawn, x: 5, y: 1},
    {type: piece_type.B_pawn, x: 6, y: 1},
    {type: piece_type.B_pawn, x: 7, y: 1},  
    
    {type: piece_type.W_rook, x: 0, y: 7},
    {type: piece_type.W_rook, x: 7, y: 7},
    {type: piece_type.W_knight, x: 1, y: 7},
    {type: piece_type.W_knight, x: 6, y: 7},
    {type: piece_type.W_bishop, x: 5, y: 7},
    {type: piece_type.W_bishop, x: 2, y: 7},

    {type: piece_type.W_queen, x: 3, y: 7},
    {type: piece_type.W_king, x: 4, y: 7},

    {type: piece_type.W_pawn, x: 0, y: 6},
    {type: piece_type.W_pawn, x: 1, y: 6},
    {type: piece_type.W_pawn, x: 2, y: 6},
    {type: piece_type.W_pawn, x: 3, y: 6},
    {type: piece_type.W_pawn, x: 4, y: 6},
    {type: piece_type.W_pawn, x: 5, y: 6},
    {type: piece_type.W_pawn, x: 6, y: 6},
    {type: piece_type.W_pawn, x: 7, y: 6}    
]
