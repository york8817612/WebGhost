class MotReader {
    constructor(path, fileType) {
        this._path = path;
        this._type = fileType;
    }

    async MotFileLoader() {
        try {
            const res = await fetch(this._path + (this._type === 0 ? '.mot' : '.cmo'));
            const motBuff = new ArrayBufferRead(Array.from(new Uint8Array(await res.arrayBuffer())));
            const size = this._type === 1 ? motBuff.readInt() : 1;
            const actions = [];
            const ani = new Map();

            for (let i = 0; i < size; i++) {
                const name = motBuff.readUnicodeString(0x100);
                const description = motBuff.readUnicodeString(0x100);
                const imageCount = motBuff.readInt();
                const act = {};

                for (let j = 0; j < imageCount; j++) {
                    let var1 = motBuff.readInt();
                    let actionName = motBuff.readUnicodeString(0x28);
                    let loopSize = motBuff.readInt();
                    let offset = [];
                    const idxs = [];
                    for (let k = 0; k < loopSize; k++) {
                        const idx = motBuff.readUShort();
                        offset.push(this.readOffsetData(motBuff, idx));
                        idxs.push(idx);
                    }
                    act[actionName] = { id: var1, offset };
                    ani.set(actionName, idxs);
                }
                actions.push({
                    Path: name,
                    Description: description,
                    Action: act
                });
            }
            const animations = Object.fromEntries(ani);
            return { actions, animations };
        } catch (e) {
            console.error('Error:', e);
            return { actions: [], animations: {} };
        }
    }

    // 重構讀取 offset 的部分，簡化多次重複的讀取操作
    readOffsetData(motBuff, idx) {
        return {
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
        };
    }

}
