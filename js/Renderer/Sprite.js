class Sprite {
    constructor({
        sprSrc,
        position = {
            x: 0,
            y: 0
        },
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 }
    }) {
        this.position = position
        this.spr = sprSrc.sprfile
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 1
        this.offset = offset
    }

    draw(ctx, index, direct) {
        let img = direct === 1 ? this.spr._images[index].image.left : this.spr._images[index].image.right
        let x = (((this.position.x) - img.width / 2) + (direct === 1 ? -(this.offset.x) : this.offset.x))
        let y = (((this.position.y) - img.height / 2) + (this.offset.y))
        ctx.drawImage(
            img,
            x,
            y,
            img.width,
            img.height
        )
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    update(ctx, index = 0, direct = 0) {
        this.draw(ctx, index, direct)
        this.animateFrames()
    }
}