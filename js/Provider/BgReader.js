class BgReader {
    constructor(path) {
        this._path = path
    }

    BgFileLoader = () => {
        let action = new Promise((resolve, reject) => {
            try {
                fetch(this._path + '.bg').then(async (res) => {
                    let slea = new ArrayBufferRead(Array.from(new Uint8Array(await res.arrayBuffer())))
                    let ColorType = slea.readInt()
                    let TexBlendType = slea.readInt()
                    let FileType = slea.readInt()
                    let SearchColor = slea.readBytes(3)
                    let Width = slea.readShort()
                    let Height = slea.readShort()
                    let Width2 = slea.readShort()
                    let Height2 = slea.readShort()
                    let NumPixels = slea.readInt()
                    let num = 0
                    switch (ColorType) {
                        case 3:
                            num = NumPixels << 1
                            break
                        case 4:
                            num = NumPixels << 2
                            break
                    }
                    let imageData = new ImageData(new Uint8ClampedArray(Convert(slea.readBytes(num))), Width, Height)
                    let newImg = document.createElement('canvas')
                           
                    newImg.width = Width
                    newImg.height = Height
                    let ctx = newImg.getContext('2d')
                    ctx.fillStyle = '#00000000'
                    ctx.fillRect(0, 0, newImg.width, newImg.height)
                    ctx.putImageData(imageData, 0, 0)
                    console.log('break')

                    resolve({ColorType, TexBlendType, FileType, SearchColor, Width, Height, Width2, Height2, NumPixels, newImg})
                })
            } catch (e) {
                reject(e)
            }
        })
        return action
    }
}