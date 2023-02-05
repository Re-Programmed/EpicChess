const local_storage_prefix = "epic_chess_18209481290_";

const elements = 
{
    board: "board",
    dark_square: "dark_square",
    light_square: "light_square",
    tile: "tile",
    a_tile_x: "tile_x",
    a_tile_y: "tile_y",
    removed_piece: "fade_piece",
    a_first_turn: "first_turn"
}

class API
{
    url;
    gameID;
    postUrl;

    constructor(url, gameID, postUrl)
    {
        this.url = url;
        this.gameID = gameID;
        this.postUrl = postUrl;
    }

    async getChessBoard(id = null)
    {
        var result = await fetch(encodeURI(this.url + (id == null ? this.gameID : id)))
        var data = await result.json()

       return JSON.parse(atob(data.data));
    }

    async setChessBoard(chess_board_data)
    {
        var res = await fetch(encodeURI(this.postUrl + this.gameID + "&data=" + btoa(JSON.stringify(chess_board_data))))

        return res;
    }

    async getValidPieces()
    {
        var res = await fetch(this.url + "validity_pieces")
        
        var data = await res.json();
        
        return JSON.parse(atob(data.data));
    }
}

function B64ToImage(b64)
{
    return "data:image/png;base64," + b64;
}

function EncodeImageFileAsURLElement(element, done) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
        done(this.result);
    }
    reader.readAsDataURL(file);
}

function EncodeImageFileAsURL(file, done) {
    var reader = new FileReader();
    reader.onloadend = function() {
        done(this.result);
    }
    reader.readAsDataURL(file);
}