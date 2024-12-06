class ArrayBufferRead {
    constructor(buffer) {
        this.buffer = buffer
        this.offset = 0
    }

    readByte() {
        let byte = this.buffer[this.offset]
        this.offset += 1
        return byte
    }

    readUShort() {
        let byte1 = this.buffer[this.offset]
        let byte2 = this.buffer[this.offset + 1]
        this.offset += 2
        return (byte2 << 8) + byte1
    }

    readShort() {
        let byte1 = this.buffer[this.offset]
        let byte2 = this.buffer[this.offset + 1]
        this.offset += 2
        return twoIsComplement([byte2, byte1])
    }

    readInt() {
        let byte1 = this.buffer[this.offset]
        let byte2 = this.buffer[this.offset + 1]
        let byte3 = this.buffer[this.offset + 2]
        let byte4 = this.buffer[this.offset + 3]
        this.offset += 4
        return (byte4 << 24) + (byte3 << 16) + (byte2 << 8) + byte1
    }

    readLong() {
        let byte1 = this.buffer[this.offset]
        let byte2 = this.buffer[this.offset + 1]
        let byte3 = this.buffer[this.offset + 2]
        let byte4 = this.buffer[this.offset + 3]
        let byte5 = this.buffer[this.offset + 4]
        let byte6 = this.buffer[this.offset + 5]
        let byte7 = this.buffer[this.offset + 6]
        let byte8 = this.buffer[this.offset + 7]
        this.offset += 8
        return (byte7 << 56) + (byte7 << 48) + (byte6 << 40) + (byte5 << 32) + (byte4 << 24) + (byte3 << 16) + (byte2 << 8) + byte1
    }

    readBytes(size) {
        let bytes = []
        for (let i = 0; i < size; i++) {
            bytes.push(this.readByte())
        }
        return bytes
    }

    readUnicodeString(size) {
        let tmp = ''
        let skip = false
        for (let i = 0; i < size; i += 2) {
            let u = String.fromCodePoint(this.readUShort())
            if (u === '\u0000' || skip) {
                skip = true
                continue
            }
            else {
                tmp += (u)
            }
        }
        return tmp
    }

    readAsciiString(size) {
        let bytes = []
        let skip = false
        for (let i = 0; i < size; i++) {
            let data = this.readByte()
            if (data === 0 || skip) {
                skip = true
                continue
            }
            else {
                bytes.push(data)
            }
        }
        return String.fromCharCode(...bytes)
    }
}

function twoIsComplement(v) {
    return (((v[0] << 8) | v[1]) << 16) >> 16
}