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
                    let imageData = new ImageData(new Uint8ClampedArray(this.Convert(slea.readBytes(num))), Width, Height)
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

    Convert(imageData) {
        let imgdata = []
        for (let i = 0; i < imageData.length; i += 2) {
            let byte1 = imageData[i]
            let byte2 = imageData[i + 1]
            let ARGB1555 = (byte2 << 8) + byte1
            let a = ARGB1555 & 0x8000
            let r = ARGB1555 & 0x7C00
            let g = ARGB1555 & 0x03E0
            let b = ARGB1555 & 0x1F
            let rgb = (r << 9) | (g << 6) | (b << 3)
            let ARGB8888 = (a * 0x1FE00) + rgb + ((rgb >> 5) & 0x070707)

            // ARGB8888 to BGRA8888
            imgdata.push(((ARGB8888 >> 16) & 0xFF))
            imgdata.push(((ARGB8888 >> 8) & 0xFF))
            imgdata.push((ARGB8888 & 0xFF))
            imgdata.push(((ARGB8888 >> 24) & 0xFF))
        }
        return imgdata
    }
}