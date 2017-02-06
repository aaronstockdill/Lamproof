"use strict"

class Layout
{
    constructor (resizer, top_piece, bottom_piece, theorem) {
        this.resizer = resizer
        this.top_piece = top_piece
        this.bottom_piece = bottom_piece
        this.theorem = theorem

        this.top_piece_height_init = 120
        this.titlebar_height = 28
        this.divider_height = 50
        this.top_min_height = 70
        this.btm_min_height = 80

        this.top_piece.style.height = this.top_piece_height_init + 'px'
        this.bottom_piece.style.height = window.innerHeight - this.top_piece_height_init - this.titlebar_height - this.divider_height + 'px'

        this.resizer.addEventListener("mousedown", (e) => this._startResize(e), true)
        document.addEventListener("mouseup", (e) => this._stopResize(e), true)
        document.addEventListener("mousemove", (e) => this._resizing(e), true)

        window.addEventListener("resize", (e) => this._windowResize(e), true)

        this.dragging = false
        this.drag_prev = 0
    }


    _startResize (event) {
        this.dragging = true
        this.drag_prev = event.clientY
        this.theorem.disable()
    }

    _stopResize (event) {
        this.dragging = false
        this.theorem.enable()
    }

    _resizing (event) {
        if (this.dragging) {
            var delta = event.clientY - this.drag_prev
            const top_height = Number(this.top_piece.style.height.replace('px', ''))
            const btm_height = Number(this.bottom_piece.style.height.replace('px', ''))
            if ((delta < 0 && top_height < this.top_min_height)
             || (delta > 0 && btm_height < this.btm_min_height)) {
                return;
             }
            this.drag_prev = event.clientY
            this.top_piece.style.height = top_height + delta + 'px'
            this.bottom_piece.style.height = btm_height - delta + 'px'
            this.resizer.focus()
        }
    }

    _windowResize (event) {
        const top_height = Number(this.top_piece.style.height.replace('px', ''))
        const btm_height = Number(this.bottom_piece.style.height.replace('px', ''))
        const window_height = window.innerHeight
        const difference = window_height - (top_height + btm_height + this.titlebar_height + this.divider_height)
        if (difference > 0) {
            // Window has grown
            this.bottom_piece.style.height = btm_height + difference + 'px'
        } else {
            // Window has shrunk
            if (btm_height >= this.btm_min_height) {
                // Try reduce proof first
                this.bottom_piece.style.height = btm_height + difference + 'px'
            } else {
                // Now we have to shrink the theorem
                this.top_piece.style.height = top_height + difference + 'px'
            }
        }
    }
}
