import fs from "node:fs/promises";
import path from 'node:path'
import {getPlaiceholder} from "plaiceholder"

export const toBase64Blur = async (src: string) => {
  const filePath =  path.resolve(process.cwd(), path.join('./public/', src))
  const file = await fs.readFile(filePath);
  const {base64} = await getPlaiceholder(file)

  return base64
}
