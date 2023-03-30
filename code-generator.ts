#!/usr/bin/env node

import * as fs from 'fs'

import { type Writer, generateAll, generateMagicNumbers } from 'mavlink-mappings-gen'
import { mappings } from './package.json'

class InMemoryWriter implements Writer {
  readonly lines = [] as string[]

  write(line = '') {
    this.lines.push(line)
  }
}

async function main() {
  const modules = mappings.map(mapping => mapping.name)
  const magicNumbers = {}

  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]
    process.stdout.write(`Generating code for ${module}...`)
    const importsFileName = `lib/${module}.imports.ts`
    const imports = fs.existsSync(importsFileName) ? fs.readFileSync(importsFileName) : Buffer.from('')
    const input = fs.readFileSync(`${module}.xml`).toString()
    const output = new InMemoryWriter()
    if (imports.length > 0) output.write(imports.toString())
    const { messages } = await generateAll(input, output, module)
    messages.forEach(message => { magicNumbers[message.id] = message.magic })
    fs.writeFileSync(`./lib/${module}.ts`, output.lines.join('\n'))
    process.stdout.write('done\n')
  }

  fs.writeFileSync('./lib/magic-numbers.ts', generateMagicNumbers(magicNumbers))
}

main()
