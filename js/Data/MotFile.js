class MotFile {
    constructor({ fileBuffer, fileType }) {
        this._buffer = new ArrayBufferRead(fileBuffer)
        this._header = {}
        this._actions = []
        this._header = []
        let size = 1;
        if (fileType === 1) {
            size = this._buffer.readInt()
        }
        for (let i = 0; i < size; i++) {
            this._header.push({
                fileName: this._buffer.readUnicodeString(0x100),
                descrption: this._buffer.readUnicodeString(0x100),
                imageCount: this._buffer.readInt()
            })
            for (let j = 0; j < this._header[i].imageCount; j++) {
                let data = {}
                data.var1 = this._buffer.readInt()
                data.actionName = this._buffer.readUnicodeString(0x28)
                data.loopSize = this._buffer.readInt()
                data.offset = []
                for (let k = 0; k < data.loopSize; k++) {
                    data.offset.push({
                        sprIndex: this._buffer.readUShort(),
                        subvar1: this._buffer.readUShort(),
                        x: this._buffer.readShort(),
                        y: this._buffer.readShort(),
                        sprIndex2: this._buffer.readUShort(),
                        subvar2: this._buffer.readUShort(),
                        rgba2: this._buffer.readBytes(4),
                        sprIndex3: this._buffer.readUShort(),
                        subvar3: this._buffer.readUShort(),
                        rgba3: this._buffer.readBytes(4),
                        subvar4: this._buffer.readBytes(6)
                    })
                }
                this._actions.push(data)
            }
        }
    }
}