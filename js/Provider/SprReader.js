class SprReader {
    constructor(path, fileType) {
        this._path = path
        this._type = fileType
    }

    async SprFileLoader() {
        // read spr file
        let files = new Promise((resolve, reject) => {
            try {
                fetch(this._path + ( this._type === 0 ? '.spr' : '.csp')).then(async (res) => {
                    let files = []
                    let sprBuff = new ArrayBufferRead(Array.from(new Uint8Array(await res.arrayBuffer())))
                    let sprSize = 1
                    if (this._type === 1) {
                        sprSize = sprBuff.readInt()
                        for (let i = 0; i < sprSize; i++) {
                            sprBuff.readLong()
                        }
                    }
                    for (let i = 0; i < sprSize; i++) {
                        files[i] = {
                            Path: sprBuff.readUnicodeString(0x100),
                            Descrption: sprBuff.readUnicodeString(0x100)
                        }
                        let sprImageCount = sprBuff.readInt()

                        let x = 1
                        let y = 1
                        files[i].Json = []
                        for (let j = 0; j < sprImageCount; j++) {
                            let data = {}
                            data.var1 = sprBuff.readInt()
                            data.loopCount1 = sprBuff.readInt()
                            data.loopVars1 = []
                            for (let k = 0; k < data.loopCount1; k++) {
                                data.loopVars1.push(sprBuff.readInt())
                                data.loopVars1.push(sprBuff.readInt())
                                data.loopVars1.push(sprBuff.readInt())
                                data.loopVars1.push(sprBuff.readInt())
                            }
                            data.loopCount2 = sprBuff.readInt()
                            data.loopVars2 = []
                            for (let l = 0; l < data.loopCount2; l++) {
                                data.loopVars2.push(sprBuff.readInt())
                                data.loopVars2.push(sprBuff.readInt())
                                data.loopVars2.push(sprBuff.readInt())
                                data.loopVars2.push(sprBuff.readInt())
                            }
                            data.var2 = sprBuff.readByte()
                            data.colorType = sprBuff.readInt()
                            data.texBlendType = sprBuff.readInt()
                            data.fileType = sprBuff.readInt()
                            data.searchColor = sprBuff.readBytes(3)
                            data.width = sprBuff.readUShort()
                            data.height = sprBuff.readUShort()
                            data.var3 = sprBuff.readUShort()
                            data.var4 = sprBuff.readUShort()
                            data.numPixel = sprBuff.readInt()
                            let num = 0
                            switch (data.colorType) {
                                case 3:
                                    num = data.numPixel << 1
                                    break
                                case 4:
                                    num = data.numPixel << 2
                                    break
                            }
                            data.imageData = new ImageData(new Uint8ClampedArray(Convert(sprBuff.readBytes(num))), data.width, data.height)

                            let newImg = document.createElement('canvas')
                            let w = data.width
                            let h = data.height
                            if (files[i].Image === undefined) {
                                newImg.width = w + 2
                                newImg.height = h + 2
                                let ctx = newImg.getContext('2d')
                                ctx.fillStyle = '#00000000'
                                ctx.fillRect(0, 0, newImg.width, newImg.height)
                                ctx.putImageData(data.imageData, 1, 1)
                                files[i].Image = newImg
                            } else {
                                let src = files[i].Image
                                newImg.width = src.width + w + 2
                                newImg.height = (src.height < (h + 2)) ? (h + 2) : src.height
                                let ctxNewImg = newImg.getContext('2d')
                                ctxNewImg.fillStyle = '#00000000'
                                ctxNewImg.fillRect(0, 0, newImg.width, newImg.height)
                                ctxNewImg.putImageData(src.getContext('2d').getImageData(0, 0, src.width, src.height), 0, 0)
                                ctxNewImg.putImageData(data.imageData, src.width + 1, 1)
                                files[i].Image = newImg
                            }
                            files[i].Json[j] = this.ToJson(data, x, y)
                            x += w + 2
                            if (y < h) {
                                y = h
                            }
                        }

                        let meta = {
                            "app": "http://www.codeandweb.com/texturepacker",
                            "version": "1.0",
                            "image": "spritesheet.png",
                            "format": "RGBA8888",
                            "size": {
                                "w": (x - 1),
                                "h": (y + 2)
                            },
                            "scale": "1"
                        }
                        let animations = {
                            stan: ['0', '1', '2', '1']
                        }
                        files[i].Json = { frames: files[i].Json, meta: meta, animations: animations }
                        resolve(files)
                    }
                })
            } catch (e) {
                console.error('error:' + e)
                reject()
            }
        })
        return { files: await files}
    }

    ToJson(data, x, y) {
        let w = data.width
        let h = data.height
        let obj = {
            frame: {
                x: x,
                y: 1,
                w: w,
                h: h
            },
            rotated: false,
            trimmed: false,
            spriteSourceSize: {
                x: 0,
                y: 0,
                w: w,
                h: h
            },
            sourceSize: {
                w: w,
                h: h
            },
            anchor: {
                x:0.222222,
                y:1
            }
        }
        return obj
    }

    getAnimations(files, mot, fidx) {
        let jsonData = files[fidx].Json;
        jsonData.animations = mot.animations;
        for (let ani of Object.values(mot.actions[0].Action)) {
            for (let idx of ani.offset) {
                // (1 / w) * (w / 2 - x)
                // (1 / h) * (h / 2 - y)
                let w = jsonData.frames[idx.sprIndex].sourceSize.w;
                let h = jsonData.frames[idx.sprIndex].sourceSize.h;
                let offsetX = parseFloat(((1 / w) * ((w / 2) - idx.x)).toFixed(2));
                let offsetY = parseFloat(((1 / h) * ((h / 2) - idx.y)).toFixed(2));
                jsonData.frames[idx.sprIndex].anchor.x = offsetX > 1 ? 1 : (offsetX < 0 ? 0 : offsetX);
                jsonData.frames[idx.sprIndex].anchor.y = offsetY > 1 ? 1 : (offsetY < 0 ? 0 : offsetY);
            }
        }
        return jsonData;
    }

    loadObjURL(files, fidx) {
        return new Promise((resolve, reject) => {
            files[fidx].Image.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                let reader = new Image()
                reader.onload = async () => {
                    try {
                        resolve(reader)
                    } catch (err) {
                        reject(err)
                    }
                }
                reader.src = url
            })
        })
    }

    loadToDataURL(files, fidx) {
        return files[fidx].Image.toDataURL('image/png');
    }
}