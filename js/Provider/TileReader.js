class TileReader {
    constructor(path) {
        this._path = path
    }

    TileFileLoader = () => {
        let action = new Promise((resolve, reject) => {
            try {
                fetch(this._path + '.til').then(async (res) => {
                    let slea = new ArrayBufferRead(Array.from(new Uint8Array(await res.arrayBuffer())))
                    let unk1 = slea.readInt()
                    let unk2 = slea.readByte()

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
                    resolve({unk1, unk2, ColorType, TexBlendType, FileType, SearchColor, Width, Height, NumPixels, newImg})
                })
            } catch (e) {
                reject(e)
            }
        })
        return action;
    }
}