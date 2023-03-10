const api = new API("https://3c60tmkszb.execute-api.us-west-2.amazonaws.com/default/getchat?table=EpicChess&id=", "test_chess", "https://3c60tmkszb.execute-api.us-west-2.amazonaws.com/default/updatechat?table=EpicChess&id=");
var client_player = 'W';

var last_gotten_board;

function GenerateBoardFromData()
{
    RetrieveBoardData(false, true);
    /*
    const arr = []

    for(var x = 0; x < 64; x++)
    {
        arr.push({t: piece_type.W_rook});
    }

    api.setChessBoard({board: arr});
    */

    /*
    api.getChessBoard()
    .then(res => {
        console.log(res);
    })
    */

    //SendBoardData();
    IsInCheck();

    setInterval(function () {
        if(current_turn_data.player != client_player)
        {
            document.getElementsByTagName("title")[0].textContent = "Epic Chess"
            RetrieveBoardData();
            been_our_turn = false;
        }else{
            document.getElementsByTagName("title")[0].textContent = "Your Turn! - Epic Chess"

            if(!been_our_turn)
            {
                IsInCheck();

                been_our_turn = true;
            }
        }
    }, 5000)
}

function IsInCheck()
{
    tiles.forEach(row => {
        row.forEach(tile => {
            if(tile.piece != undefined)
            {   
                if(client_player == "B")
                {
                    if(tile.piece.piece_type == piece_type.B_king)
                    {
                        in_check = IsSquareAttacked(tile, "B");
                    }
                }else if(client_player == "W")
                {
                    if(tile.piece.piece_type == piece_type.W_king)
                    {
                        in_check = IsSquareAttacked(tile, "W");
                    }
                }
            }
        })
    })
}

var been_our_turn = false;

function SendBoardData()
{
    if(last_gotten_board == undefined){return;}
    var arr = []

    tiles.forEach(row => {
        row.forEach(tile => {
            if(tile.piece != undefined)
            {
                if(tile.piece.piece_type != piece_type.move_square && tile.piece.piece_type != piece_type.passant_square)
                {
                    if(tile.ref_el.children[0].getAttribute("first_turn") != undefined)
                    {
                        arr.push({t: tile.piece.piece_type, f: true});
                    }else{
                        arr.push({t: tile.piece.piece_type});
                    }
                }
            }else{
                arr.push({})
            }
        })
    })

    var send = {board: arr, player: current_turn_data.player, en_passant_allowed: en_passant_allowed != undefined, c_p: last_gotten_board.c_p, b_load: current_board.id, c_prot: {b_c: true, w_c: true, b_id: last_gotten_board.c_prot.b_id, w_id: last_gotten_board.c_prot.w_id}}

    last_gotten_board = send;

    api.setChessBoard(send);
}

function RetrieveBoardData(load_custom_pos = false, first_fetch = false)
{
    api.getChessBoard().then(res => {
        const arr = res.board;
    
            console.log(res);
    
            if(first_fetch)
            {
                res.c_p.forEach(cp => {
                    FetchCustomPiece(cp, load_custom_pos);
                })
            }
    
            setTimeout(function () {
                var x = 0;
                var y = 0;
                tiles.forEach(row => {
                    row.forEach(tile => {
    
                        if(tile.piece != undefined)
                        {
                            if(arr[x + y * 8].t != undefined)
                            {
                                if(arr[x + y * 8].t != tile.piece.piece_type)
                                {
                                    const p = arr[x + y * 8];
                                    if(p.f != undefined)
                                    {
                                        tile.SetStartPiece(GetPiece(arr[x + y * 8].t));
                                    }else{
                                        tile.UpdatePiece(GetPiece(arr[x + y * 8].t));
                                    }
                                }
                            }else{
                                tile.RemovePiece();
                            }
                            
                        }else{
                            if(arr[x + y * 8].t != undefined)
                            {
                                const p = arr[x + y * 8];
                                if(p.f != undefined)
                                {
                                    tile.SetStartPiece(GetPiece(arr[x + y * 8].t));
                                }else{
                                    tile.UpdatePiece(GetPiece(arr[x + y * 8].t));
                                }
                                if(res.en_passant_allowed)
                                {
                                    en_passant_allowed = tile;
                                }
                            }
                        }
    
                        x++;
                    })
    
                    y++;
                    x = 0;
                })
            }, first_fetch ? 1500 : 0)
    
            current_turn_data.player = res.player;
    })
    
    
    
}