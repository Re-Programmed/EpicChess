const tile_type = {
    dark_square: 0,
    light_square: 1,
    wall_square: 2,
    length: 3
}

var tile_dark_color = "#4b9e4b";
var tile_light_color = "#ccffcc";

class Tile
{
    ref_el;
    dark;
    piece;
    y;
    x;
    has_circle;

    type;

    constructor(dark, ref_el, y, x, type = 0)
    {
        this.dark = dark;
        this.ref_el = ref_el;

        this.y = y;
        this.x = x;
        
        ref_el.setAttribute(elements.a_tile_x, this.x);
        ref_el.setAttribute(elements.a_tile_y, this.y);
        
        this.has_circle = false;

        this.SetType(type);

        if(type == 1)
        {
            if(!dark)
            {
                this.SetType(1);
            }
        }
    }

    AddCaptureCircle(dest_prefix = "")
    {
        var el = document.createElement("div");
        el.setAttribute("style", "background-image: url('" + dest_prefix + "../capture_x.png')");

        el.className = "capture_cirle piece";

        this.ref_el.appendChild(el);

        this.has_circle = true;
    }

    UpdatePiece(piece)
    {
        if(this.type == tile_type.wall_square){this.ref_el.appendChild(GetPiece(piece_type.null_piece).GetElement(true));}
        else{
            this.piece = piece;

            this.ref_el.children[0]?.remove();
            this.ref_el.appendChild(piece.GetElement());
        }
                
    }

    SetStartPiece(piece)
    {
        if(this.type == tile_type.wall_square){this.ref_el.appendChild(GetPiece(piece_type.null_piece).GetElement(true));}
        else{
            this.piece = piece;

            this.ref_el.children[0]?.remove();
            this.ref_el.appendChild(piece.GetElement(true));
        }
    }

    RemovePieceImmediate()
    {
        if(this.has_circle)
        {
            this.has_circle = false;
        }else{
            this.piece = undefined;
        }

        if(this.ref_el.children.length < 1){return;}

        var child = this.ref_el.children[this.ref_el.children.length - 1];

        child.remove();
    }

    RemovePiece()
    {
        if(this.has_circle)
        {
            this.has_circle = false;
        }else{
            this.piece = undefined;
        }

        if(this.ref_el.children.length < 1){return;}

        var child = this.ref_el.children[this.ref_el.children.length - 1];

        child.classList.add(elements.removed_piece);
        setTimeout(function () {child.remove();}, 1000);
    }

    SetType(type)
    {
        this.type = type;

        switch(type)
        {
            case tile_type.dark_square:
                this.dark = true;
                this.ref_el.className = "dark_square tile";
                this.SetColor(tile_dark_color);
                break;
            case tile_type.light_square:
                this.dark = false;
                this.ref_el.className = "light_square tile";
                this.SetColor(tile_light_color);
                break;
            case tile_type.wall_square:
                this.dark = true;
                this.ref_el.className = "wall_square tile";
                this.SetColor("var(--bg-dark);");
        }
    }

    SetColor(col)
    {
        this.ref_el.setAttribute("style", "background-color: " + col + ";");
    }

    UpdateColor()
    {
        if(this.type == tile_type.dark_square)
        {
            this.SetColor(tile_dark_color);
        }else if(this.type == tile_type.light_square)
        {
            this.SetColor(tile_light_color);
        }
    }
}