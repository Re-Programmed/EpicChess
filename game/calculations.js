function IsSquareAttacked(t_tile, color)
{
    var attacked_positions = []
    tiles.forEach(row => {
        row.forEach(tile => {
            if(tile.piece != undefined)
            {
                if(tile.piece.color != color && tile.piece.piece_type > 0)
                {
                    //takeable_squares

                    tile.piece.motions.takeable_squares.forEach(square => {
                        if(!attacked_positions.includes(square)){attacked_positions.push({x: tile.x + square.x, y: tile.y + square.y})}
                    })

                    //piece_motion_takes
                    
                    tile.piece.motions.piece_motion_takes.forEach(pmt => {
                        var stop = false;
                        pmt.forEach(position => {
                            if(!stop)
                            {
                                var t = GetTileByXY(position.x + tile.x, position.y + tile.y);
                                if(t != undefined)
                                {
                                    if(t.piece != undefined)
                                    {
                                        stop = true;
                                    }

                                    attacked_positions.push({x: t.x, y: t.y});
                                }
                            }
                        })
                    })
                }
            }
        })
    })

    console.log("RESULT")
    console.log(attacked_positions)

    for(const v of attacked_positions)
    {
        if(v.x == t_tile.x && v.y == t_tile.y)
        {
            return true;
        }
    }

    return false;
}

function GetPiecesAttacking(t_tile, color)
{
    var attacking_pieces = []
    tiles.forEach(row => {
        row.forEach(tile => {
            if(tile.piece != undefined)
            {
                if(tile.piece.color != color && tile.piece.piece_type > 0)
                {
                    //takeable_squares

                    tile.piece.motions.takeable_squares.forEach(square => {
                        if(square.x + tile.x == t_tile.x && square.y + tile.y == t_tile.y)
                        {
                            attacking_pieces.push({x: tile.x, y: tile.y});
                        }
                    })

                    //piece_motion_takes
                    
                    tile.piece.motions.piece_motion_takes.forEach(pmt => {
                        var stop = false;
                        pmt.forEach(position => {
                            if(!stop)
                            {
                                var t = GetTileByXY(position.x + tile.x, position.y + tile.y);
                                if(t != undefined)
                                {
                                    if(t.piece != undefined)
                                    {
                                        stop = true;
                                    }

                                    if(t.x == t_tile.x && t.y == t_tile.y)
                                    {
                                        attacking_pieces.push({x: t.x, y: t.y});
                                    }
                                }
                            }
                        })
                    })
                }
            }
        })
    })

    return attacking_pieces;
}