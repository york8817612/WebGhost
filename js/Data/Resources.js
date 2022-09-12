class Resources {
  constructor(files) {
    this._files = [...files]
  }

  async SprLoad(path, fileType) {
    let file = this._files.filter((f) => f.webkitRelativePath.indexOf(path) >= 0)[0]
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.onload = async () => {
        try {
          let sprfile = new SprFile({ fileBuffer: Array.from(new Uint8Array(reader.result)) })
          await sprfile.Decode(fileType)
          resolve({ name: file.name, path: file.webkitRelativePath, sprfile: sprfile })
        } catch (err) {
          reject(err)
        }
      }
      reader.readAsArrayBuffer(file)
    })
  }

  async MotLoad(path, fileType) {
    let file = this._files.filter((f) => f.webkitRelativePath.indexOf(path) >= 0)[0]
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.onload = async () => {
        try {
          let motfile = new MotFile({ fileBuffer: Array.from(new Uint8Array(reader.result)), fileType: fileType })
          resolve({ name: file.name, path: file.webkitRelativePath, motfile: motfile })
        } catch (err) {
          reject(err)
        }
      }
      reader.readAsArrayBuffer(file)
    })
  }
}