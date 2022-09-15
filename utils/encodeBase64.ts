const fs = require('fs')

export const encodeBase64 = (path: string) => {
    return fs.readFileSync(path, "base64")
}