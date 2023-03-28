#!/usr/bin/env node

import * as fs from 'fs'
import * as parser from 'xml2js'

import { Writer } from './definitions'
import { CommandTypeDef, EnumDef, MessageDef, XmlDataSource } from './datasource'
import {
  generateEnums,
  generateMessages,
  generateCommands,
  generateMessageRegistry,
  generateCommandRegistry,
  generateMagicNumbers,
} from './generators'

import { mappings } from './package.json'
import { matchTextToWidth } from './code-utils'
import { Pipeable } from './pipeable'

function processEnums(output: Writer, enumDefs: EnumDef[] & Pipeable<EnumDef[]>) {
  const enums = enumDefs
    // update descriptions to be multiline strings with a maximum width
    .pipe(enums => enums.map(entry => ({
      ...entry,
      description: matchTextToWidth(entry.description),
      values: entry.values.map(value => ({
        ...value,
        description: matchTextToWidth(value.description),
      })),
    })))

  generateEnums(output, enums)

  return enums
}

function processMessages(output: Writer, messageDefs: MessageDef[] & Pipeable<MessageDef[]>) {
  const FIXED_MESSAGE_NAMES = {
    '111': 'TimeSync',
    '138': 'MotionCaptureAttPos',
    '152': 'MemInfo',
    '164': 'SimState',
    '165': 'HwStatus',
    '173': 'RangeFinder',
    '177': 'CompassMotStatus',
    '253': 'StatusText',
  }

  const messages = messageDefs
    // update descriptions to be multiline strings with a maximum width
    // fix some messages because they lack underscore in the original name
    .pipe(messages => messages.map(message => ({
      ...message,
      name: FIXED_MESSAGE_NAMES[message.id] || message.name,
      description: matchTextToWidth(message.description),
      fields: message.fields.map(field => ({
        ...field,
        description: matchTextToWidth(field.description),
      })),
    })))

  generateMessages(output, messages)

  return messages
}

function processCommands(output: Writer, moduleName, commandTypeDefs: CommandTypeDef[] & Pipeable<CommandTypeDef[]>) {
  const commands = commandTypeDefs
    .pipe(commands => commands.map(command => ({
      ...command,
      description: matchTextToWidth(command.description),
      params: command.params
        .map(param => ({
          ...param,
          description: matchTextToWidth(param.description),
        }))
        .filter(param => param.name)
    })))

  generateCommands(output, moduleName, commands)

  return commands
}

function processRegistries(output: Writer,
  messages: { id: string, name: string }[],
  commands: { name: string, field: string }[],
) {
  generateMessageRegistry(output, messages)
  generateCommandRegistry(output, commands)
}

function generate(obj: any, output: Writer, moduleName: string = '') {
  const { enumDefs, messageDefs, commandTypeDefs } = new XmlDataSource().read(obj.mavlink)

  const enums = processEnums(output, enumDefs)
  const messages = processMessages(output, messageDefs)
  const commands = processCommands(output, moduleName, commandTypeDefs)
  processRegistries(output, messages, commands)

  return { enums, messages, commands }
}

class InMemoryWriter implements Writer {
  readonly lines = [] as string[]

  write(line = '') {
    this.lines.push(line)
  }
}

async function main() {
  const parts = mappings.map(mapping => mapping.name)
  const magicNumbers = {}

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    process.stdout.write(`Generating code for ${part}...`)
    const imports = fs.readFileSync(`lib/${part}.imports.ts`)
    const xml = fs.readFileSync(`${part}.xml`)
    const data = await parser.parseStringPromise(xml.toString(), { explicitChildren: true, preserveChildrenOrder: true })
    const output = new InMemoryWriter()
    output.write(imports.toString())
    const { messages } = generate(data, output, part)
    messages.forEach(message => { magicNumbers[message.id] = message.magic })
    fs.writeFileSync(`./lib/${part}.ts`, output.lines.join('\n'))
    process.stdout.write('done\n')
  }

  const magic = generateMagicNumbers(magicNumbers)
  fs.writeFileSync('./lib/magic-numbers.ts', magic)
}

main()
