class PrjReader {
    constructor(path) {
        this._path = path
    }

    PrjFileLoader = () => {
        let action = new Promise((resolve, reject) => {
            try {
                fetch(this._path + '.prj').then(async (res) => {
                    let reader = new ArrayBufferRead(Array.from(new Uint8Array(await res.arrayBuffer())))
                    let s1Name = reader.readUnicodeString(0xA0);
                    let val1 = reader.readInt();
                    let val2 = reader.readInt();
                    let val3 = reader.readInt();

                    //=========================================sub_655150
                    let strCount = reader.readInt();

                    if (strCount > 0) {
                        for (let i = 0; i < strCount; i++) {
                            let Name = reader.readUnicodeString(0x100);
                        }
                    }
                    let s2Name = reader.readUnicodeString(0x100);
                    let s3Name = reader.readBytes(0x100);

                    strCount = reader.readInt();
                    if (strCount > 0) {
                        for (let i = 0; i < strCount; i++) {
                            let Name = reader.readUnicodeString(0x100);
                        }
                    }
                    strCount = reader.readInt();
                    if (strCount > 0) {
                        for (let i = 0; i < strCount; i++) {
                            let Name = reader.readUnicodeString(0x100);
                        }
                    }

                    //=========================================sub_6531D0
                    let val5 = reader.readInt();
                    let val6 = reader.readInt();
                    let val7 = reader.readInt();
                    let Name = reader.readUnicodeString(0x100);
                    let Name2 = reader.readUnicodeString(0x100);
                    strCount = reader.readInt();
                    if (strCount > 0) {
                        for (let i = 0; i < strCount; i++) {
                            let Name = reader.readUnicodeString(0x100);
                        }
                    }
                    //=========================================(1)sub_652FA0
                    strCount = reader.readInt();
                    if (strCount > 0) {
                        for (let i = 0; i < strCount; i++) {
                            let Name = reader.readUnicodeString(0x100);
                            reader.readBytes(0x10);
                            reader.readInt();
                            reader.readInt();
                            reader.readInt();
                            reader.readInt();
                        }
                    }
                    //=========================================(2)
                    strCount = reader.readInt();
                    if (strCount > 0) {
                        for (let i = 0; i < strCount; i++) {
                            reader.readInt();
                            reader.readInt();
                            reader.readInt();
                            reader.readInt();
                        }
                    }
                    //=========================================(3)sub_653460
                    //地圖物件
                    strCount = reader.readInt();
                    if (strCount > 0) {
                        for (let i = 0; i < strCount; i++) {
                            let Name = reader.readUnicodeString(0x100);
                            reader.readInt();
                            reader.readInt();
                            let Name2 = reader.readUnicodeString(0x100);
                            let Name3 = reader.readUnicodeString(0x100);
                            reader.readInt();
                            reader.readInt();
                            reader.readInt();
                            reader.readByte();
                            reader.readBytes(0x14);
                        }
                    }
                    //=========================================(4)sub_653750
                    //怪物
                    strCount = reader.readInt();
                    if (strCount > 0) {
                        for (let i = 0; i < strCount; i++) {
                            let Name = reader.readUnicodeString(0x100);
                            let mv1 = reader.readInt();
                            let mv2 = reader.readInt();
                            let Name2 = reader.readUnicodeString(0x100);
                            let Name3 = reader.readUnicodeString(0x100);
                            let mv3 = reader.readInt();
                            let mv4 = reader.readInt();
                            let mv5 = reader.readInt();
                            let mv6 = reader.readInt();
                            let mv7 = reader.readByte();
                            let mv8 = reader.readInt();
                            let mv9 = reader.readInt();
                            reader.readBytes(0x14);
                        }
                    }
                    //=========================================(5)sub_653A20
                    //讀取NPC資訊
                    strCount = reader.readInt();
                    if (strCount > 0) {
                        for (let i = 0; i < strCount; i++) {
                            let Name = reader.readUnicodeString(0x100);
                            reader.readInt();
                            reader.readInt();
                            let Name2 = reader.readUnicodeString(0x100);
                            let Name3 = reader.readUnicodeString(0x100);
                            reader.readInt();
                            reader.readByte();
                            reader.readShort();
                            reader.readShort();
                            reader.readInt();
                            reader.readBytes(0xC);
                        }
                    }
                    //=========================================(6)sub_653CF0
                    strCount = reader.readInt();
                    if (strCount > 0) {
                        for (let i = 0; i < strCount; i++) {
                            let Name = reader.readUnicodeString(0x100);
                            reader.readInt();
                            reader.readInt();
                            let Name2 = reader.readUnicodeString(0x100);
                            let Name3 = reader.readUnicodeString(0x100);
                            reader.readInt();
                            reader.readInt();
                            reader.readInt();
                            reader.readInt();
                            reader.readByte();
                            reader.readBytes(0x14);
                        }
                    }
                    //=========================================(7)sub_653E70
                    strCount = reader.readInt();
                    reader.readInt();
                    reader.readInt();
                    if (strCount > 0) {
                        for (let i = 0; i < strCount; i++) {
                            let Name = reader.readUnicodeString(0x28);
                            reader.readInt();
                            reader.readByte();
                            reader.readInt();
                            reader.readInt();
                            reader.readInt();
                        }
                    }
                    //=========================================(8)sub_653E70
                    strCount = reader.readInt();
                    reader.readInt();
                    reader.readInt();
                    if (strCount > 0) {
                        for (let i = 0; i < strCount; i++) {
                            let Name = reader.readUnicodeString(0x28);
                            reader.readInt();
                            reader.readByte();
                            reader.readInt();
                            reader.readInt();
                            reader.readInt();
                        }
                    }
                    //=========================================(9)sub_653E70
                    strCount = reader.readInt();
                    reader.readInt();
                    reader.readInt();
                    if (strCount > 0) {
                        for (let i = 0; i < strCount; i++) {
                            let Name = reader.readUnicodeString(0x28);
                            reader.readInt();
                            reader.readByte();
                            reader.readInt();
                            reader.readInt();
                            reader.readInt();
                        }
                    }
                    //=========================================(10)sub_653E70
                    strCount = reader.readInt();
                    if (strCount > 0) {
                        for (let i = 0; i < strCount; i++) {
                            let Name = reader.readUnicodeString(0x28);
                            reader.readInt();
                            reader.readByte();
                            reader.readInt();
                            reader.readInt();
                            reader.readInt();
                        }
                    }
                    //=========================================(11)sub_653E70
                    strCount = reader.readInt();
                    if (strCount > 0) {
                        for (let i = 0; i < strCount; i++) {
                            let Name = reader.readUnicodeString(0x28);
                            reader.readInt();
                            reader.readByte();
                            reader.readInt();
                            reader.readInt();
                            reader.readInt();
                        }
                    }
                    //=========================================(12)sub_653E70
                    strCount = reader.readInt();
                    if (strCount > 0) {
                        for (let i = 0; i < strCount; i++) {
                            let Name = reader.readUnicodeString(0x28);
                            reader.readInt();
                            reader.readByte();
                            reader.readInt();
                            reader.readInt();
                            reader.readInt();
                        }
                    }
                    //=========================================(13)sub_67B180
                    //怪物資訊
                    strCount = reader.readInt();
                    if (strCount > 0) {
                        for (let i = 0; i < strCount; i++) {
                            let Name = reader.readUnicodeString(0x28);

                            var mobid = reader.readInt();
                            var vm2 = reader.readByte();
                            var vm3 = reader.readInt();
                            var posX = reader.readInt();
                            var posY = reader.readInt();
                            let ss = reader.readInt();
                            let ss2 = 0;
                            do {
                                var vm4 = reader.readInt();
                                var vm5 = reader.readInt();
                                ++ss2;
                            } while (ss2 < ss);
                        }
                    }
                    //=========================================(14)sub_653F60
                    strCount = reader.readInt();
                    if (strCount > 0) {
                        for (let i = 0; i < strCount; i++) {
                            let Name = reader.readUnicodeString(0x28);
                            reader.readInt();
                            reader.readByte();
                            reader.readInt();
                            reader.readInt();
                            reader.readInt();
                        }
                    }
                    //=========================================(15)sub_654050
                    strCount = reader.readInt();
                    if (strCount > 0) {
                        for (let i = 0; i < strCount; i++) {
                            let Name = reader.readUnicodeString(0x28);
                            reader.readInt();
                            reader.readByte();
                            reader.readInt();
                            reader.readInt();
                            reader.readInt();
                        }
                    }
                    //=========================================(16)sub_653E70
                    strCount = reader.readInt();
                    if (strCount > 0) {
                        for (let i = 0; i < strCount; i++) {
                            let Name = reader.readUnicodeString(0x28);
                            reader.readInt();
                            reader.readByte();
                            reader.readInt();
                            reader.readInt();
                            reader.readInt();
                        }
                    }
                    //=========================================(17)sub_653E70
                    strCount = reader.readInt();
                    reader.readInt();
                    reader.readInt();
                    if (strCount > 0) {
                        for (let i = 0; i < strCount; i++) {
                            let Name = reader.readUnicodeString(0x28);
                            reader.readInt();
                            reader.readByte();
                            reader.readInt();
                            reader.readInt();
                            reader.readInt();
                        }
                    }
                    //=========================================
                    resolve({})

                })
            } catch (ee) {
                reject(ee)
            }
        })
        return action
    }
}