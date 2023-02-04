
var boards = []

window.addEventListener('load', function () {
    const ls_boards = this.localStorage.getItem(local_storage_prefix + "boards");
    if(ls_boards != undefined){boards = JSON.parse(atob(ls_boards));}

    GenerateBoardOptions();
})

var default_board = {id: "", name: "New Board"}

function AddBoard()
{
    const d_now = Date.now();
    api.gameID = "t_board_" + d_now;

    default_board.id = d_now;

    boards.push({id: d_now, name: "New Board"})

    localStorage.setItem(local_storage_prefix + "boards", btoa(JSON.stringify(boards)));

    api.setChessBoard(default_board).then(() => {window.location.reload()})
}

function GenerateBoardOptions()
{
    boards.forEach(board => {
        const p = document.createElement("div");
        p.className = "menu_option"
        p.innerHTML = "<center></center>"
        p.setAttribute("p_id", board.id);

        const p_name = document.createElement("h1");
        p_name.textContent = board.name;

        const sq_1 = document.createElement("div");
        const sq_2 = document.createElement("div");
        const sq_3 = document.createElement("div");

        sq_1.setAttribute("style", "background-color: " + board.bl + ";width: 48px;height: 48px;display: inline-block;");
        sq_2.setAttribute("style", "background-color: " + board.bd + ";width: 48px;height: 48px;display: inline-block;");
        sq_3.setAttribute("style", "background-color: " + board.bl + ";width: 48px;height: 48px;display: inline-block;");

        const sq_1_1 = document.createElement("div");
        const sq_2_2 = document.createElement("div");
        const sq_3_3 = document.createElement("div");

        sq_1_1.setAttribute("style", "background-color: " + board.bd + ";width: 48px;height: 48px;display: inline-block;transform: translate(0, -4.5px);");
        sq_2_2.setAttribute("style", "background-color: " + board.bl + ";width: 48px;height: 48px;display: inline-block;transform: translate(0, -4.5px);");
        sq_3_3.setAttribute("style", "background-color: " + board.bd + ";width: 48px;height: 48px;display: inline-block;transform: translate(0, -4.5px);");

        p.children[0].appendChild(p_name);
        p.children[0].appendChild(sq_1);
        p.children[0].appendChild(sq_2);
        p.children[0].appendChild(sq_3);

        p.children[0].appendChild(sq_1_1);
        p.children[0].appendChild(sq_2_2);
        p.children[0].appendChild(sq_3_3);

        document.getElementById("board_listing").appendChild(p);

        p.onclick = function () {
            window.open("./editor/index.html?id=" + this.getAttribute("p_id"), "_self");
        }
    })
}