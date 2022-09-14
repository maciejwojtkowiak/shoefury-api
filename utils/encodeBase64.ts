const fs = require('fs')

const encodeBase64 = (path: string) => {
    return fs.readFileSync(path, "base64")
}