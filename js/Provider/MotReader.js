class MotReader {
    constructor(path, fileType) {
        this._path = path
        this._type = fileType
    }

    MotFileLoader = () => {
        // read mot file
        let action = new Promise((resolve, reject) => {
            try {
                fetch(this._path + '.mot').then(async (res) => {
                    let motBuff = new ArrayBufferRead(Array.from(new Uint8Array(await res.arrayBuffer())))
                    let size = 1
                    if (this._type === 1) {
                        size = motBuff.readInt()
                    }
                    let actions = []
                    let ani = new Map()
                    for (let i = 0; i < size; i++) {
                        let name = motBuff.readUnicodeString(0x100)
                        let descrption = motBuff.readUnicodeString(0x100)
                        let imageCount = motBuff.readInt()
                        let act = []
                        let act2 = []
                        for (let j = 0; j < imageCount; j++) {
                            let var1 = motBuff.readInt()
                            let actionName = motBuff.readUnicodeString(0x28)
                            let loopSize = motBuff.readInt()
                            let offset = []
                            let idxs = []
                            for (let k = 0; k < loopSize; k++) {
                                let idx = 0
                                idx = motBuff.readUShort()
                                offset.push({
                                    sprIndex: idx,
                                    subvar1: motBuff.readUShort(),
                                    x: motBuff.readShort(),
                                    y: motBuff.readShort(),
                                    sprIndex2: motBuff.readUShort(),
                                    subvar2: motBuff.readUShort(),
                                    rgba2: motBuff.readBytes(4),
                                    sprIndex3: motBuff.readUShort(),
                                    subvar3: motBuff.readUShort(),
                                    rgba3: motBuff.readBytes(4),
                                    subvar4: motBuff.readBytes(6)
                                })
                                idxs.push(idx)
                            }
                            let actDat = {
                                id: var1,
                                offset: offset
                            }
                            act[actionName] = actDat
                            ani.set(actionName, idxs)
                        }
                        let objDat = {
                            Path: name,
                            Descrption: descrption,
                            Action: act
                        }
                        actions[i] = objDat
                    }
                    let aa = Object.fromEntries(ani)
                    resolve({ actions, aa })
                })
            } catch (e) {
                console.error('error:' + e)
                reject()
            }
        })
        return action
    }
}