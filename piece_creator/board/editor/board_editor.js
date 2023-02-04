var tiles = []

var current_board;

window.addEventListener('load', function () {
    elements.board = "mini_board";

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    api.gameID = "t_board_" + id;

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

    return tile_data;
}

function Save()
{
    var save_board = []
    tiles.forEach(row => {
        row.forEach(tile => {
            save_board.push({t: tile.type})
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

    api.setChessBoard({id: current_board.id, name: current_board.name, b: save_board, bd: current_board.bd, bl: current_board.bl})
    .then(() => {
        window.open("../index.html", "_self");
    })
}

function SelectTile(tile)
{
    UpdateTileType(tile);
}

function UpdateTileType(tile)
{
    const tile_data = GetTileByElement(tile);
    tile_data.SetType(tile_data.type + 1);

    if(tile_data.type >= tile_type.length)
    {
        tile_data.SetType(0);
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
