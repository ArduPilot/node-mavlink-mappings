import * as https from 'https'
import { createWriteStream } from 'fs'

async function downloadFile(url: string, filename: string) {
  process.stdout.write(`Downloading ${filename}...`)

  return new Promise((resolve, reject) => {
    let buffer = Buffer.from([])

    https.get(url, response => {
      response.on('data', data => {
        buffer = Buffer.concat([ buffer, data ])
        if (buffer.length % 10 === 0) { process.stdout.write('.') }
      })
      response.on('close', () => {
        const file = createWriteStream(filename)
        file.write(buffer)
        file.close()
        process.stdout.write('done.\n')
        resolve(undefined)
      })
      response.on('error', error => {
        process.stderr.write(error.message)
        reject(error)
      })
    })
  })
}

import { mappings } from './package.json'

async function main() {
  for (const { url, name } of mappings) await downloadFile(url, `${name}.xml`)
}

main()
