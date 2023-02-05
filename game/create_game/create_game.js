window.addEventListener('load', function () {
    LoadSelection();
})

function LoadSelection()
{
    api.getValidBoards()
    .then(boards => {
        boards.forEach(board_ID => {

            api.getChessBoard("t_board_" + board_ID)
            .then(board => {
                var board_selection = document.createElement("div")
                board_selection.className = "menu_option"
                board_selection.innerHTML = "<center></center>"

                var name = document.createElement("h1");
                name.textContent = board.name;

                board_selection.children[0].appendChild(name);

                document.getElementById("board_listing").appendChild(board_selection);

                CreateColorTiles(board.bl, board.bd, board_selection);

                board_selection.setAttribute("bid", board.id);
                board_selection.onclick = LoadBoardPreview;
            })
        });
    })
}

function LoadBoardPreview()
{
    window.open("./board_preview/index.html?board=" + this.getAttribute("bid"), '_self');
}

function CreateColorTiles(bl, bd, p)
{
    const sq_1 = document.createElement("div");
    const sq_2 = document.createElement("div");
    const sq_3 = document.createElement("div");

    sq_1.setAttribute("style", "background-color: " + bl + ";width: 48px;height: 48px;display: inline-block;");
    sq_2.setAttribute("style", "background-color: " + bd + ";width: 48px;height: 48px;display: inline-block;");
    sq_3.setAttribute("style", "background-color: " + bl + ";width: 48px;height: 48px;display: inline-block;");

    const sq_1_1 = document.createElement("div");
    const sq_2_2 = document.createElement("div");
    const sq_3_3 = document.createElement("div");

    sq_1_1.setAttribute("style", "background-color: " + bd + ";width: 48px;height: 48px;display: inline-block;transform: translate(0, -4.5px);");
    sq_2_2.setAttribute("style", "background-color: " + bl + ";width: 48px;height: 48px;display: inline-block;transform: translate(0, -4.5px);");
    sq_3_3.setAttribute("style", "background-color: " + bd + ";width: 48px;height: 48px;display: inline-block;transform: translate(0, -4.5px);");

    p.children[0].appendChild(sq_1);
    p.children[0].appendChild(sq_2);
    p.children[0].appendChild(sq_3);

    p.children[0].appendChild(sq_1_1);
    p.children[0].appendChild(sq_2_2);
    p.children[0].appendChild(sq_3_3);
}