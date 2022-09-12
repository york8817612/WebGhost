class Renderer {
    constructor({ width, height, color = 'black' }) {
        this._canvas = document.querySelector('canvas')
        this._ctx = this._canvas.getContext('2d')
        this._width = width
        this._height = height
        this._color = color

        this._canvas.width = this._width
        this._canvas.height = this._height

        this._ctx.fillStyle = color

        this._ctx.fillRect(0, 0, this._width, this._height)
    }

    clear(color = 'black') {
        this._ctx.fillStyle = color
        this._ctx.fillRect(0, 0, this._width, this._height)
    }
}