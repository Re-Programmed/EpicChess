const default_piece_img = "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABYZJREFUeF7tmutPGlkYxh804AVRK0gRBm9FGNZ62d3shzb92mT//y8qbbdJdwWE4TLcLwOzeQ6OUURLljlDWDhJYyxm5ry/877Pezm4MOfLNef2YwFg4QFzTmARAnPuAAsRXITAIgTmnMAiBObcARZZYKohEI/HTXpgKpWa2j4cfzGNdrlc8G1swOPxoNvtotlqodPpiGh0GoZjACzD9xUF0WgUPcNAo1FHr9dDv99Hp2tA0zSUKxVHQTgCgMaveDw4f/8ewWAQmpZHu91+pr+maaJQKiGTycLo9fDlyxfp+5P+Alp5cX5uJlUVb++Np9u/tOgRd/k8tEIR19fX0vcn/QXJRMI8ODhAIh5HpaKjXq+/mnnpBY1mE5nsHWr1unRNkA7g8vLS/PXiAiseN8rlsoj3ny16SKFYRL5QxNXVldQ9Sn04Y9+/s4M/fv9NGN9qtX5mu/jcMAxx+ulMFu1OR6oWSAcQVSJIJlQhfOOcvgWg0Wginc2i1W5LDQPpAJj2jg4PoOv6WKc/DIA1gsxsIB1AwO9H7PgYrVZzbABMkfSAbC4nPGCmAaytrSJ2dITl5eWxADBMaDwzQV7T0Ol2ZxcALU4mk2YoGETAvwOWwK8tpkAKJf/plSr0ahU3NzdSvVTqw2nsycmJybpfCe9hdXX1Rft58q1WW/QEBFAsl6VnAG5GOgC+RFUT5tbmFsKht3C73c8gMO/TaMPoid6gpOuoNxpS1d/ahCMAEomEaHs3fT7sKxGhB3R3Gkvj+ZOr1+8jc5dDs9mUGvePT0A6ABZDPPXtrS3shUJYEjogeIxshoqlEvJaQYgfIc20BtB4r9eLaCQCJRIRfUCz2XhVCOkNZV0XIshMwN9lQpDmATQ+GAiI3p+1AF1d18sP7v4SBYohQ4CCyDK4Wqui1e5IgyAVgHoSg8/nE7bSMCvWX3MBqw6wWmYWQmyPZU2KpAJQImEEdnbGKoCsP2IaZCHE+OcqVwbhMHMAmP89bjfebG8/AbC5uXkvhM+5dA0DxVIR/UcaWavVBIyZA0DzrKnvQ851uRDZ28Py0tJIr2CI/JPJPPtMlvGOFUIWjJUVD5RwWAxE7z38ibEEkL67E1ohswFytA6wXkZv2PL5wPkABx6s/IYhUABzmia9A5wagHAohN2AX7yfLe8wBMY6x+KVqjzRG44vaVlg+EVnZ2fmQVTB+tqa+IjGjoLA/8sVCo5MhB3TALo/Y58t8eNltb/tduch7fE+gM1Q4//SDLER8q6vQ43HsbTkergCs0CMgsAxGNthFkOyxVB6CJyenprxWAzB3V1xLzCqGiSEwRygLSrGvmkKHajWatJDQSoAVVXNw/19cSlSr9dQub/3e6k0HGjCAII1F2BfcC1xKiQFAKtAjr+ODw/BKzFx51fQRt4HDmsCUySN7vUGEHhXyJDgM2SEg+0ArFtgNRGHGk+IjXMkXioVx+4JrI6w0xncITI16pJujW0FwAEoa30KHi9CLYHL53NjX4o8pkQRpDawR2CDRAgclNg5H7ANAI3nxIfGswXm5qsUsmrlPxn/GAQ9gumRhRNvje0slGwBQLfnifP+nxMg5nAazli2exHCbSYrMoQdTdLEAETb6/Hg04cP4uSp9LVaVdT7shYnxl//+i7uGSb9DsHEAHj6sXfv8IuqCqGz+ndZxltl9G06Da1YmtgLbAHw5+fPIuaZ6pxaHJimvn6bLgCevm/Di08fPyKXy40187MT0FUqBfYRk2jBRB5AAJFwGNFIeOwvP9gJ4PuPH9D1ynQBRBUF/jdP5352Gvnas/6+TYuv0kzVA7zedayvDnp8pxe/RsMyeWoArJrfacOH+4dJeoSJNGCahtv17gUAu0jO6nMWHjCrJ2fXvufeA/4F51yXbhI1MyoAAAAASUVORK5CYIIA";
const default_piece_img_w = "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"

var pieces = []

window.addEventListener('load', function () {
    const ls_pieces = this.localStorage.getItem(local_storage_prefix + "pieces");
    if(ls_pieces != undefined){pieces = JSON.parse(atob(ls_pieces));}

    GeneratePieceOptions();
})

var default_piece = {id: "", name: "New Piece", img: default_piece_img, img_w: default_piece_img_w, tile_motion_spots: [], tile_capture_spots: []}

function AddPiece()
{
    const d_now = Date.now();
    api.gameID = "piece_" + d_now;

    default_piece.id = d_now;

    pieces.push({id: d_now, img: default_piece_img, name: "New Piece"})
    localStorage.setItem(local_storage_prefix + "pieces", btoa(JSON.stringify(pieces)));

    api.setChessBoard(default_piece).then(() => {window.location.reload()})
}

function GeneratePieceOptions()
{
    pieces.forEach(piece => {
        const p = document.createElement("div");
        p.className = "menu_option"
        p.innerHTML = "<center></center>"
        p.setAttribute("p_id", piece.id);

        const p_img = document.createElement("div");
        p_img.className = "piece_listing_img"
        p_img.setAttribute("style", "background-image: url(\"data:image/png;base64," + piece.img + "\"); margin: 0;");

        const p_name = document.createElement("h1");
        p_name.textContent = piece.name;

        p.children[0].appendChild(p_img);
        p.children[0].appendChild(p_name);
        document.getElementById("piece_listing").appendChild(p);

        p.onclick = function () {
            window.open("./editor/index.html?id=" + this.getAttribute("p_id"), "_self");
        }
    })
}