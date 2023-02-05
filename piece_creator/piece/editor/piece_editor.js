const tiles = [];
var current_board;

var editing_pattern = false;

window.addEventListener('load', function () {
    elements.board = "mini_board";
    GenerateDefaultPieces("../../");
    GenerateDisplayBoard();
    //GenerateMiniBoard();

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    api.gameID = "piece_" + id;

    api.getChessBoard()
    .then(result => {
        current_board = result;
        console.log(result);

        const pt_w = parseInt(result.id + "1");
        const pt_b = parseInt(result.id + "2");
        piece_type[result.id + "W"] = pt_w;
        piece_type[result.id + "B"] = pt_b;

        pieces.push(new Piece(pt_b, B64ToImage(result.img), null, 'B'));
        pieces.push(new Piece(pt_w, B64ToImage(result.img), null, 'W'));

        UpdatePieceWithScale(GetUnsafeTileByXY(1, 1), GetPiece(pt_w));

        const ch1 = GetUnsafeTileByXY(1, 1).ref_el.children[0];

        document.getElementById("piece_name").value = result.name;
        document.getElementById("piece_name").addEventListener('input', function () {
            if(this.value.length > 1)
            {
                current_board.name = this.value;
            }
        })

        ch1.setAttribute("style", ch1.getAttribute("style") + " width: calc(var(--tile-size) * 2); height: calc(var(--tile-size) * 2); background-size: contain; background-repeat: none;")
    })
})

function UpdatePieceWithScale(tile, piece)
{
    tile.UpdatePiece(piece);

    const ch1 = tile.ref_el.children[0];

    ch1.setAttribute("style", ch1.getAttribute("style") + " width: calc(var(--tile-size) * 2); height: calc(var(--tile-size) * 2); background-size: contain; background-repeat: none;")
}

function GenerateDisplayBoard()
{
    var dark = false;
    for(var y = 0; y < 3; y++)
    {
        tiles.push([]);
        for(var x = 0; x < 3; x++)
        {
            var tile = GenerateTile(dark, y, x, true);
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
    }
}

function GenerateMiniBoard()
{
    var dark = false;
    for(var y = 0; y < 15; y++)
    {
        tiles.push([]);
        for(var x = 0; x < 15; x++)
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
    
    return new Tile(dark, tile, y, x);
}

function EditMovementPattern()
{
    Array.from(document.getElementById(elements.board).children).forEach(el => el.remove());
    tiles.splice(0, tiles.length);
    GenerateMiniBoard();

    GetUnsafeTileByXY(7, 7).UpdatePiece(GetPiece(piece_type[current_board.id + "W"]));
    document.getElementsByClassName("piece")[0].setAttribute("style", document.getElementsByClassName("piece")[0].getAttribute("style") + "background-image: url(\"data:image/png;base64," + current_board.img + "\");");

    current_board.tile_motion_spots.forEach(spot => {
        GetUnsafeTileByXY(7 + spot.x, 7 + spot.y).UpdatePiece(GetPiece(piece_type.move_square));
    })

    current_board.tile_capture_spots.forEach(spot => {
        GetUnsafeTileByXY(7 + spot.x, 7 + spot.y).UpdatePiece(GetPiece(piece_type.move_square));
        GetUnsafeTileByXY(7 + spot.x, 7 + spot.y).AddCaptureCircle("../../");
    })
}

function EndMovementPatternEdit()
{
    Array.from(document.getElementById(elements.board).children).forEach(el => el.remove());
    tiles.splice(0, tiles.length);
    GenerateDisplayBoard();
    UpdatePieceWithScale(GetUnsafeTileByXY(1, 1), GetPiece(piece_type[current_board.id + 'W']));
    editing_pattern = false;
}

function GetTileByElement(element)
{
    return tiles[parseInt(element.getAttribute(elements.a_tile_y))][parseInt(element.getAttribute(elements.a_tile_x))]
}

function GetUnsafeTileByXY(x, y)
{
    return tiles[y][x];
}

function SelectTile(tile_el)
{
    if(!editing_pattern){editing_pattern = true;EditMovementPattern();return;}

    const tile = GetTileByElement(tile_el);

    if(tile.piece == undefined)
    {
        tile.UpdatePiece(GetPiece(piece_type.move_square));
        current_board.tile_motion_spots.push({x: tile.x - 7, y: tile.y - 7})
        return;
    }

    if(tile.piece.piece_type == GetPiece(piece_type[current_board.id + 'W']).piece_type)
    {
        EndMovementPatternEdit();
        return;
    }

    if(tile.piece.piece_type == piece_type.move_square && !tile.has_circle)
    {
        RemoveSpot(tile, current_board.tile_motion_spots);
        current_board.tile_capture_spots.push({x: tile.x - 7, y: tile.y - 7})

        tile.AddCaptureCircle("../../");
        return;
    }

    if(tile.has_circle)
    {
        RemoveSpot(tile, current_board.tile_capture_spots);

        tile.ref_el.children[1].remove();
        tile.has_circle = false;
        tile.RemovePiece();
    }
}

function ChangeTexture(element)
{
    EncodeImageFileAsURLElement(element, function (result) {
        current_board.img = result.replace("data:image/png;base64,", "");

        document.getElementsByClassName("piece")[0].setAttribute("style", "background-image: url(\"" + result + "\"); width: calc(var(--tile-size) * 2); height: calc(var(--tile-size) * 2); background-size: contain; background-repeat: none; width: calc(var(--tile-size) * 2); height: calc(var(--tile-size) * 2); background-size: contain; background-repeat: none;");
    })
}

function Save()
{
    var pieces = JSON.parse(atob(localStorage.getItem(local_storage_prefix + "pieces")));
    var p_n = [];
    var i = 0;
    pieces.forEach(piece => {
        console.log(piece.id + "==" + current_board.id);
        if(piece.id.toString() != current_board.id.toString())
        {
            p_n.push(piece);
        }
        i++;
    })

    p_n.push({id: current_board.id, img: current_board.img, name: current_board.name})

    console.log(p_n)

    localStorage.setItem(local_storage_prefix + "pieces", btoa(JSON.stringify(p_n)));

    api.setChessBoard(current_board).then(() => {
        window.open("../index.html", "_self");
    })
}



function RemoveSpot(tile, arr)
{
    var i = 0;
    arr.forEach(el => {
        if(el.x + 7 == tile.x && el.y + 7 == tile.y)
        {
            arr.splice(i, 1);
        }
        i++;
    })
}

