const random_piece_url = [
    "../pieces/black_pawn.png"
]

function GenerateRandomPieces()
{
    Array.from(document.getElementsByClassName("random_piece")).forEach(el => {
        el.setAttribute("style", "background-image: url(\"" + random_piece_url[Math.floor(Math.random() * random_piece_url.length)] + "\");");
    });
}

window.addEventListener('load', function () {
    GenerateRandomPieces();
})