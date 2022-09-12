class Player extends Sprite {
    constructor({
        sprSrc,
        motSrc,
        position,
        velocity,
        scale = 1,
        //sprites,
        attackBox = { offset: {}, width: undefined, height: undefined }
    }) {
        super({
            sprSrc,
            position,
            scale,
            offset: { x: 0, y: 0 }
        })
        this.motSrc = motSrc.motfile
        this.velocity = velocity
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.isAttacking
        this.isRunning
        this.isHightJump
        this.health = 100
        this.action = 0
        this.direct = 0 // 0 = right, 1 = left
        this.framesMax = 1
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 3
        this.dead = false
        this.gravity = 0.9
        
    }

    update(ctx) {
        let act = this.motSrc._actions[this.action].offset[this.framesCurrent]
        this.framesMax = this.motSrc._actions[this.action].loopSize
        this.offset.x = act.x
        this.offset.y = act.y
        this.draw(ctx, act.sprIndex, this.direct)
        if (!this.dead) this.animateFrames()

        // attack boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        // draw the attack box
        // c.fillRect(
        //   this.attackBox.position.x,
        //   this.attackBox.position.y,
        //   this.attackBox.width,
        //   this.attackBox.height
        // )


        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // gravity function
        if (this.position.y + this.spr._images[act.sprIndex].image.right.height + this.velocity.y >= ctx.canvas.height - 96) {
            this.velocity.y = 0
            this.position.y = 655
            if (this.isHightJump) {
                this.switchSprite('HJUMP_4')
                this.isHightJump = false
            }
        } else this.velocity.y += this.gravity
    }

    attack() {
        this.switchSprite('ATTACK_1')
        this.isAttacking = true
    }

    takeHit() {
        this.health -= 20

        if (this.health <= 0) {
            this.switchSprite('DEAD_1')
        } else this.switchSprite('DAMAGE_1')
    }

    getSpriteId(sprite) {
        return this.motSrc._actions.findIndex(fi => fi.actionName === sprite)
    }

    switchSprite(sprite) {
        let spriteIndex = this.getSpriteId(sprite)

        if (this.action !== spriteIndex) {
            this.action = spriteIndex
            this.framesCurrent = 0
        }
    }
}