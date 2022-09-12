class SprFile {
    constructor({
        fileBuffer
    }) {
        this._buffer = new ArrayBufferRead(fileBuffer)
        this._header = {}
        this._images = []
    }

    async Decode(fileType) {
        // Decode Spr file
        let size = 1
        if (fileType === 1) {
            size = this._buffer.readInt()
            for (let i = 0; i < size; i++) {
                this._buffer.readLong()
            }
        }
        for (let i = 0; i < size; i++) {
            this._header = {
                sprFileName: this._buffer.readUnicodeString(0x100),
                sprDescrption: this._buffer.readUnicodeString(0x100),
                sprImageCount: this._buffer.readInt()
            }
            for (let j = 0; j < this._header.sprImageCount; j++) {
                let data = {}
                data.var1 = this._buffer.readInt()
                data.loopCount1 = this._buffer.readInt()
                data.loopVars1 = []
                for (let k = 0; k < data.loopCount1; k++) {
                    data.loopVars1.push(this._buffer.readInt())
                    data.loopVars1.push(this._buffer.readInt())
                    data.loopVars1.push(this._buffer.readInt())
                    data.loopVars1.push(this._buffer.readInt())
                }
                data.loopCount2 = this._buffer.readInt()
                data.loopVars2 = []
                for (let l = 0; l < data.loopCount2; l++) {
                    data.loopVars2.push(this._buffer.readInt())
                    data.loopVars2.push(this._buffer.readInt())
                    data.loopVars2.push(this._buffer.readInt())
                    data.loopVars2.push(this._buffer.readInt())
                }
                data.var2 = this._buffer.readByte()
                data.colorType = this._buffer.readInt()
                data.texBlendType = this._buffer.readInt()
                data.fileType = this._buffer.readInt()
                data.searchColor = this._buffer.readBytes(3)
                data.width = this._buffer.readUShort()
                data.height = this._buffer.readUShort()
                data.var3 = this._buffer.readUShort()
                data.var4 = this._buffer.readUShort()
                data.numPixel1 = this._buffer.readInt()
                let num = 0
                switch (data.colorType) {
                    case 3:
                        num = data.numPixel1 << 1
                        break
                    case 4:
                        num = data.numPixel1 << 2
                        break
                }
                data.dataOffset = this._buffer.offset
                data.imageData = this._buffer.readBytes(num)

                let imgData = new ImageData(new Uint8ClampedArray(this.Convert(data.imageData)), data.width, data.height)
                
                // Right 這裡可能會浪費記憶體
                let canvasRight = document.createElement('canvas')
                canvasRight.width = data.width
                canvasRight.height = data.height
                let ctxRight = canvasRight.getContext('2d')
                ctxRight.fillStyle = '#00000000'
                ctxRight.fillRect(0, 0, canvasRight.width, canvasRight.height)
                ctxRight.putImageData(imgData, 0, 0)

                // Left 這裡可能會浪費記憶體
                let canvasLeft = document.createElement('canvas')
                canvasLeft.width = data.width
                canvasLeft.height = data.height
                let ctxLeft = canvasLeft.getContext('2d')
                ctxLeft.fillStyle = '#00000000'
                ctxLeft.fillRect(0, 0, canvasLeft.width, canvasLeft.height)
                ctxLeft.putImageData(this.Flip(imgData), 0, 0)

                // 這裡會預先下載圖片，導致啟動變慢
                let left = await this.ImageLoaded(canvasLeft.toDataURL('image/png'), canvasLeft.width, canvasLeft.height)
                let right = await this.ImageLoaded(canvasRight.toDataURL('image/png'), canvasRight.width, canvasRight.height)
                data.image = {
                    left: left,
                    right: right
                }

                this._images.push(data)
            }
        }
    }
 
    Flip(imageData) {
        for (let i = 0; i < imageData.height; i++) {
            for (let j = 0; j < imageData.width / 2; j++) {
                let index = (i * 4) * imageData.width + (j * 4);
                let mirrorIndex = ((i + 1) * 4) * imageData.width - ((j + 1) * 4);
                for (let p = 0; p < 4; p++) {
                    let temp = imageData.data[index + p];
                    imageData.data[index + p] = imageData.data[mirrorIndex + p];
                    imageData.data[mirrorIndex + p] = temp;
                }
            }
        }
        return imageData
    }

    async ImageLoaded(uri, width, height) {
        return new Promise((resolve, reject) => {
            let newimg = new Image(width, height)
            newimg.onload = () => resolve(newimg)
            newimg.onerror = reject
            newimg.src = uri
        })
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