class SprFile {
    constructor({ fileBuffer }) {
        this._buffer = new ArrayBufferRead(fileBuffer);
        this._header = {};
        this._images = [];
    }

    async Decode(fileType) {
        let size = fileType === 1 ? this._buffer.readInt() : 1;

        // 跳過文件解析的初步長度
        if (fileType === 1) {
            for (let i = 0; i < size; i++) {
                this._buffer.readLong();
            }
        }

        // 解析每個圖片
        for (let i = 0; i < size; i++) {
            this._header = {
                sprFileName: this._buffer.readUnicodeString(0x100),
                sprDescrption: this._buffer.readUnicodeString(0x100),
                sprImageCount: this._buffer.readInt()
            };

            // 解析每張圖片
            for (let j = 0; j < this._header.sprImageCount; j++) {
                let data = this._parseImageData();
                
                // 生成左右圖片
                let [left, right] = await Promise.all([
                    this._processImage(new ImageData(new Uint8ClampedArray(this.Convert(data.imageData)), data.width, data.height), true),
                    this._processImage(new ImageData(new Uint8ClampedArray(this.Convert(data.imageData)), data.width, data.height), false)
                ]);

                data.image = { left, right };
                this._images.push(data);
            }
        }
    }

    _parseImageData() {
        let data = {};
        data.var1 = this._buffer.readInt();
        data.loopCount1 = this._buffer.readInt();
        data.loopVars1 = this._readLoopVars(data.loopCount1);
        data.loopCount2 = this._buffer.readInt();
        data.loopVars2 = this._readLoopVars(data.loopCount2);
        data.var2 = this._buffer.readByte();
        data.colorType = this._buffer.readInt();
        data.texBlendType = this._buffer.readInt();
        data.fileType = this._buffer.readInt();
        data.searchColor = this._buffer.readBytes(3);
        data.width = this._buffer.readUShort();
        data.height = this._buffer.readUShort();
        data.var3 = this._buffer.readUShort();
        data.var4 = this._buffer.readUShort();
        data.numPixel1 = this._buffer.readInt();

        let num = this._getImageDataSize(data.colorType, data.numPixel1);
        data.dataOffset = this._buffer.offset;
        data.imageData = this._buffer.readBytes(num);

        return data;
    }

    _readLoopVars(count) {
        let vars = [];
        for (let i = 0; i < count; i++) {
            vars.push(this._buffer.readInt(), this._buffer.readInt(), this._buffer.readInt(), this._buffer.readInt());
        }
        return vars;
    }

    _getImageDataSize(colorType, numPixel1) {
        switch (colorType) {
            case 3: return numPixel1 << 1;
            case 4: return numPixel1 << 2;
            default: return numPixel1;
        }
    }

    async _processImage(imgData, isLeft) {
        let canvas = document.createElement('canvas');
        canvas.width = imgData.width;
        canvas.height = imgData.height;

        let ctx = canvas.getContext('2d');
        ctx.fillStyle = '#00000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (isLeft) {
            ctx.putImageData(this.Flip(imgData), 0, 0);
        } else {
            ctx.putImageData(imgData, 0, 0);
        }

        return await this.ImageLoaded(canvas.toDataURL('image/png'), canvas.width, canvas.height);
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
            let newimg = new Image(width, height);
            newimg.onload = () => resolve(newimg);
            newimg.onerror = reject;
            newimg.src = uri;
        });
    }

    Convert(imageData) {
        let imgdata = [];
        for (let i = 0; i < imageData.length; i += 2) {
            let byte1 = imageData[i], byte2 = imageData[i + 1];
            let ARGB1555 = (byte2 << 8) + byte1;
            let a = ARGB1555 & 0x8000, r = ARGB1555 & 0x7C00, g = ARGB1555 & 0x03E0, b = ARGB1555 & 0x1F;
            let rgb = (r << 9) | (g << 6) | (b << 3);
            let ARGB8888 = (a * 0x1FE00) + rgb + ((rgb >> 5) & 0x070707);

            // ARGB8888 to BGRA8888
            imgdata.push((ARGB8888 >> 16) & 0xFF, (ARGB8888 >> 8) & 0xFF, ARGB8888 & 0xFF, (ARGB8888 >> 24) & 0xFF);
        }
        return imgdata;
    }
}
