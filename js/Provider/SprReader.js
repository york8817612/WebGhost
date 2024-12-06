class SprReader {
    constructor(path, fileType) {
        this._path = path;
        this._type = fileType;
    }

    async SprFileLoader() {
        try {
            const res = await fetch(this._path + (this._type === 0 ? '.spr' : '.csp'));
            const sprBuff = new ArrayBufferRead(Array.from(new Uint8Array(await res.arrayBuffer())));
            let sprSize = this._type === 1 ? sprBuff.readInt() : 1;
            if (this._type === 1) {
                for (let i = 0; i < sprSize; i++) sprBuff.readLong();
            }

            const files = await Promise.all([...Array(sprSize)].map(async (_, i) => {
                const file = await this.readFileData(sprBuff, i);
                return file;
            }));

            return { files };

        } catch (e) {
            console.error('error:', e);
            return { files: [] };
        }
    }

    async readFileData(sprBuff, index) {
        const file = {
            Path: sprBuff.readUnicodeString(0x100),
            Descrption: sprBuff.readUnicodeString(0x100),
            Json: [],
            Image: null
        };

        const sprImageCount = sprBuff.readInt();
        let x = 1, y = 1;

        for (let j = 0; j < sprImageCount; j++) {
            const data = this.readImageData(sprBuff);
            const newImg = this.createImageCanvas(data.imageData, data.width, data.height, file.Image);
            file.Image = newImg;
            file.Json[j] = this.ToJson(data, x, y);
            x += data.width + 2;
            y = Math.max(y, data.height);
        }

        const meta = this.createMeta(x, y);
        const animations = { stan: ['0', '1', '2', '1'] };
        file.Json = { frames: file.Json, meta, animations };

        return file;
    }

    readImageData(sprBuff) {
        const data = {
            var1: sprBuff.readInt(),
            loopVars1: this.readLoopVars(sprBuff),
            loopVars2: this.readLoopVars(sprBuff),
            var2: sprBuff.readByte(),
            colorType: sprBuff.readInt(),
            texBlendType: sprBuff.readInt(),
            fileType: sprBuff.readInt(),
            searchColor: sprBuff.readBytes(3),
            width: sprBuff.readUShort(),
            height: sprBuff.readUShort(),
            var3: sprBuff.readUShort(),
            var4: sprBuff.readUShort(),
            numPixel: sprBuff.readInt()
        };

        const num = this.calculateNumPixels(data);
        data.imageData = new ImageData(new Uint8ClampedArray(Convert(sprBuff.readBytes(num))), data.width, data.height);
        return data;
    }

    readLoopVars(sprBuff) {
        const loopCount = sprBuff.readInt();
        const loopVars = [];
        for (let i = 0; i < loopCount; i++) {
            loopVars.push(sprBuff.readInt(), sprBuff.readInt(), sprBuff.readInt(), sprBuff.readInt());
        }
        return loopVars;
    }

    calculateNumPixels(data) {
        switch (data.colorType) {
            case 3: return data.numPixel << 1;
            case 4: return data.numPixel << 2;
            default: return 0;
        }
    }

    createImageCanvas(imageData, width, height, existingImage) {
        const newImg = document.createElement('canvas');
        newImg.width = (existingImage ? existingImage.width : 0) + width + 2;
        newImg.height = Math.max(existingImage ? existingImage.height : 0, height + 2);

        const ctx = newImg.getContext('2d');
        ctx.fillStyle = '#00000000';
        ctx.fillRect(0, 0, newImg.width, newImg.height);

        if (existingImage) {
            ctx.putImageData(existingImage.getContext('2d').getImageData(0, 0, existingImage.width, existingImage.height), 0, 0);
        }
        ctx.putImageData(imageData, existingImage ? existingImage.width + 1 : 1, 1);

        return newImg;
    }

    createMeta(width, height) {
        return {
            app: "http://www.codeandweb.com/texturepacker",
            version: "1.0",
            image: "spritesheet.png",
            format: "RGBA8888",
            size: { w: width - 1, h: height + 2 },
            scale: "1"
        };
    }

    ToJson(data, x, y) {
        const { width: w, height: h } = data;
        return {
            frame: { x, y: 1, w, h },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { x: 0, y: 0, w, h },
            sourceSize: { w, h },
            anchor: { x: 0.222222, y: 1 }
        };
    }

    getAnimations(files, mot, fidx) {
        const jsonData = files[fidx].Json;
        jsonData.animations = mot.animations;

        for (const ani of Object.values(mot.actions[0].Action)) {
            for (const idx of ani.offset) {
                const w = jsonData.frames[idx.sprIndex].sourceSize.w;
                const h = jsonData.frames[idx.sprIndex].sourceSize.h;

                const offsetX = parseFloat(((1 / w) * ((w / 2) - idx.x)).toFixed(2));
                const offsetY = parseFloat(((1 / h) * ((h / 2) - idx.y)).toFixed(2));

                jsonData.frames[idx.sprIndex].anchor.x = Math.max(0, Math.min(1, offsetX));
                jsonData.frames[idx.sprIndex].anchor.y = Math.max(0, Math.min(1, offsetY));
            }
        }
        return jsonData;
    }

    loadObjURL(files, fidx) {
        return new Promise((resolve, reject) => {
            files[fidx].Image.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const reader = new Image();
                reader.onload = () => resolve(reader);
                reader.onerror = reject;
                reader.src = url;
            });
        });
    }

    loadToDataURL(files, fidx) {
        return files[fidx].Image.toDataURL('image/png');
    }
}