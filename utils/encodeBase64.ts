import fs from "fs";

export const encodeBase64 = (path: string): string => {
  return fs.readFileSync(path, "base64");
};
