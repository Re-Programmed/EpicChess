var tiles = []
var current_board;

window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const board = urlParams.get('board');

    GenerateDefaultPieces("../../");

    api.getChessBoard("t_board_" + board)
    .then(board => {
        current_board = board;
        document.getElementById("title").textContent = "Preview Of " + current_board.name;

        LoadCustomPieces()
        .then(() => {    
            tile_dark_color = current_board.bd;
            tile_light_color = current_board.bl;
    
            GenerateBoard();
        })

    })

}

async function LoadCustomPieces()
{
    for(var p_id of current_board.c)
    {
        var p = await api.getChessBoard("piece_" + p_id);

        LoadCustomPieceFromData(p, p);

    }

    return;
}

function GenerateBoard()
{
    var dark = false;
    for(var y = 0; y < 8; y++)
    {
        tiles.push([]);
        for(var x = 0; x < 8; x++)
        {
            var tile = GenerateTile(dark, y, x, current_board.b[((y * 8) + x)].t);
            tiles[tiles.length - 1].push(tile);

            if(current_board.b[((y * 8) + x)].p != undefined)
            {
                tile.UpdatePiece(GetPiece(current_board.b[((y * 8) + x)].p));
            }

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

function CreateGame()
{
    var new_game = {board: [], player: 'W', 'en_passant_allowed': undefined, c_p: [], b_load: current_board.id, c_prot: {b_c: false, w_c: false, w_id: Math.floor(Math.random() * 10000), b_id: Math.floor(Math.random() * 10000)}}

    current_board.c.forEach(cp => {
        new_game.c_p.push({id: cp})
    })

    current_board.b.forEach(tile => {
        if(tile.p != undefined)
        {
            new_game.board.push({t: tile.p, f: true})
        }else{
            new_game.board.push({})
        }
    })

    const id = Date.now();
    api.setChessBoard(new_game, id)
    .then(() => {
        var col = (Math.random() < 0.5 ? "B" : "W")

        if(col == "W"){localStorage.setItem("client_epic_chess_" + id, new_game.c_prot.w_id);new_game.c_prot.w_c = true;}
        else{localStorage.setItem("client_epic_chess_" + id, new_game.c_prot.b_id);new_game.c_prot.b_c = true;}

        console.log(new_game);
        window.open("../../index.html?game=" + id + "&color=" + col, "_self");
    })
}