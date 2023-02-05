var tiles = []

var current_board;

function UpdateSelectorColor(color)
{
   
        Array.from(document.getElementById("piece_selector").children).forEach(child => {
            var data = JSON.parse(child.getAttribute("data"));
    
            if(data.id <= 12)
            {
                if(color == "W")
                {
                    switch(data.id)
                    {
                        case piece_type.B_bishop:
                            data.id = piece_type.W_bishop;
                            data.icon = GetPiece(piece_type.W_bishop).icon;
                            break;
                        case piece_type.B_king:
                            data.id = piece_type.W_king;
                            data.icon = GetPiece(piece_type.W_king).icon;
                            break;
                        case piece_type.B_knight:
                            data.id = piece_type.W_knight;
                            data.icon = GetPiece(piece_type.W_knight).icon;
                            break;
                        case piece_type.B_pawn:
                            data.id = piece_type.W_pawn;
                            data.icon = GetPiece(piece_type.W_pawn).icon;
                            break;
                        case piece_type.B_queen:
                            data.id = piece_type.W_queen;
                            data.icon = GetPiece(piece_type.W_queen).icon;
                            break;
                        case piece_type.B_rook:
                            data.id = piece_type.W_rook;
                            data.icon = GetPiece(piece_type.W_rook).icon;
                            break;
                    }
                }else{
                    switch(data.id)
                    {
                        case piece_type.W_bishop:
                            data.id = piece_type.B_bishop;
                            data.icon = GetPiece(piece_type.B_bishop).icon;
                            break;
                        case piece_type.W_king:
                            data.id = piece_type.B_king;
                            data.icon = GetPiece(piece_type.B_king).icon;
                            break;
                        case piece_type.W_knight:
                            data.id = piece_type.B_knight;
                            data.icon = GetPiece(piece_type.B_knight).icon;
                            break;
                        case piece_type.W_pawn:
                            data.id = piece_type.B_pawn;
                            data.icon = GetPiece(piece_type.B_pawn).icon;
                            break;
                        case piece_type.W_queen:
                            data.id = piece_type.B_queen;
                            data.icon = GetPiece(piece_type.B_queen).icon;
                            break;
                        case piece_type.W_rook:
                            data.id = piece_type.B_rook;
                            data.icon = GetPiece(piece_type.B_rook).icon;
                            break;
                    }
                }
    
                child.setAttribute("data", JSON.stringify(data));
                child.children[0].children[0].src = GetPiece(data.id).icon;
            }else{
                if(color == 'W')
                {
                    child.children[0].children[0].src = B64ToImage(data.img_w);
                }else{
                    child.children[0].children[0].src = B64ToImage(data.img);
                }
            }
        })
}

window.addEventListener('load', function () {
    elements.board = "mini_board";

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    api.gameID = "t_board_" + id;
    GenerateDefaultPieces("../../");

    pieces.forEach(piece => {
        if(piece.piece_type > 0)
        {
            if(piece.color != 'B')
            {
                CreatePieceOption(piece, true);
            }
        }
    })

    LoadPieceSelector().then(() => {
        api.getChessBoard()
        .then(result => {
            current_board = result;

            document.getElementById("piece_name").value = result.name;
            document.getElementById("board_dark").value = result.bd;
            document.getElementById("board_light").value = result.bl;

            tile_dark_color = result.bd;
            tile_light_color = result.bl;

            GenerateMiniBoard();

            document.getElementById("piece_name").addEventListener('input', function () {
                if(this.value.length > 1)
                {
                    current_board.name = this.value;
                }
            })

            document.getElementById("board_dark").addEventListener('input', function () {
                var u = false;
                if((this.value.length == 7 && this.value.startsWith("#")) || (this.value.length == 4 && this.value.startsWith("#")))
                {
                    current_board.bd = this.value; 
                    tile_dark_color = this.value; 
                    u = true;
                }

                if(this.value.length == 6 || this.value.length == 3)
                {
                    current_board.bd = "#" + this.value;  
                    tile_dark_color = "#" + this.value;
                    u = true;
                }

                if(u)
                {
                    tiles.forEach(row => {
                        row.forEach(tile => {
                            tile.UpdateColor();
                        })
                    })
                }
            })
        });
    })
})

async function LoadPieceSelector()
{
    var pieces = await api.getValidPieces();
    for(const piece_ID of pieces)
    {
        var piece = await api.getChessBoard("piece_" + piece_ID);

        CreatePieceOption(piece);

        LoadCustomPieceFromData(piece, piece);
    }

    return;
          
}

function CreatePieceOption(piece, use_default_titles = false)
{
    var div = document.createElement("div");
    div.innerHTML = "<center></center>"
    div.className = "piece_div";

    var img = document.createElement("img");
    img.src = B64ToImage(piece.img_w);
    img.style.width = "90px";
    img.style.height = "90px";

    if(use_default_titles)
    {
        img.src = piece.icon;
    }

    div.children[0].appendChild(img);

    var name = document.createElement("h3");
    name.textContent = use_default_titles ? "(default)" : piece.name;

    div.children[0].appendChild(name);
    

    document.getElementById("piece_selector").appendChild(div);

    div.onclick = function () {SelectPiece(this);}

    if(use_default_titles)
    {
        div.setAttribute("data", JSON.stringify({id: piece.piece_type, icon: piece.icon}));
    }else{
        div.setAttribute("data", JSON.stringify(piece));
    }
    div.setAttribute("selected", false);
}

var editor_selected_piece;

function SelectPiece(piece)
{
    const piece_data = JSON.parse(piece.getAttribute("data"));

    if(piece.getAttribute("selected") != "false")
    {
        piece.setAttribute("selected", false);
        piece.className = "piece_div";
        editor_selected_piece = undefined;
    }else {

        if(editor_selected_piece != undefined)
        {
            SelectPiece(editor_selected_piece);
        }

        piece.setAttribute("selected", true);
        piece.className = "selected_piece";
        editor_selected_piece = piece;
    }
}

function GenerateMiniBoard()
{
    var dark = false;
    for(var y = 0; y < 8; y++)
    {
        tiles.push([]);
        for(var x = 0; x < 8; x++)
        {
            var tile = GenerateTile(dark, y, x);
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

function GenerateTile(dark, y, x, display_tile = false)
{
    var tile = document.createElement("div");
    tile.className = dark ? elements.dark_square : elements.light_square;
    tile.classList.add(display_tile ? "display_tile" : elements.tile);

    if(client_player == 'W')
    {
        document.getElementById(elements.board).appendChild(tile);
    }else{
        document.getElementById(elements.board).prepend(tile);
    }
    
    const tile_data = new Tile(dark, tile, y, x);

    tile_data.SetType(current_board.b[(y * 8) + x].t)

    if(current_board.b[(y * 8) + x].p != undefined)
    {
        tile_data.UpdatePiece(GetPiece(current_board.b[(y * 8) + x].p));
    }

    return tile_data;
}

function Save()
{
    var customs = []
    var save_board = []
    tiles.forEach(row => {
        row.forEach(tile => {
            var data = {t: tile.type}

            if(tile.piece != undefined)
            {
                data["p"] = tile.piece.piece_type;

                const p_type = parseInt(tile.piece.piece_type.toString().substring(0, tile.piece.piece_type.toString().length - 1));
                if(p_type > 12 && !customs.includes(p_type))
                {
                    customs.push(p_type);
                }
            }

            save_board.push(data)
        })
    });

    var boards = JSON.parse(atob(localStorage.getItem(local_storage_prefix + "boards")));
    var b_n = [];
    var i = 0;
    boards.forEach(board => {
        if(board.id.toString() != current_board.id.toString())
        {
            b_n.push(board);
        }
        i++;
    })

    b_n.push({id: current_board.id, name: current_board.name, bd: current_board.bd, bl: current_board.bl})

    localStorage.setItem(local_storage_prefix + "boards", btoa(JSON.stringify(b_n)));

    var d = {id: current_board.id, name: current_board.name, b: save_board, bd: current_board.bd, bl: current_board.bl, c: customs}
    console.log(d);
    api.setChessBoard(d)
    .then(() => {
        window.open("../index.html", "_self");
    })
}

function SelectTile(tile)
{
    if(editor_selected_piece != undefined)
    {
        PlacePieceOnTile(tile);
        return;
    }

    UpdateTileType(tile);
}

function PlacePieceOnTile(tile)
{
    const tile_data = GetTileByElement(tile);

    const p_id = JSON.parse(editor_selected_piece.getAttribute("data")).id;

    if(p_id < 13)
    {
        console.log(p_id);
        tile_data.UpdatePiece(GetPiece(p_id));
        return;
    }

    tile_data.UpdatePiece(GetPiece(piece_type[p_id + (document.getElementById("place_black").checked ? "B" : "W")]));
}

function UpdateTileType(tile)
{
    const tile_data = GetTileByElement(tile);
    
    if(tile_data.piece != undefined)
    {
        tile_data.RemovePiece();
    }else{
        tile_data.SetType(tile_data.type + 1);

        if(tile_data.type >= tile_type.length)
        {
            tile_data.SetType(0);
        }
    }
}

function GetTileByElement(element)
{
    return tiles[parseInt(element.getAttribute(elements.a_tile_y))][parseInt(element.getAttribute(elements.a_tile_x))]
}

function GetUnsafeTileByXY(x, y)
{
    return tiles[y][x];
}
