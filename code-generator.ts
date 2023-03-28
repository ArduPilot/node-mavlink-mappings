#!/usr/bin/env node

import * as fs from 'fs'
import * as parser from 'xml2js'
import { matchTextToWidth, nameToClassName, labelToIdentifier, calculateCommonPrefix } from './code-utils'
import { Writer, XmlSourceReader } from './generators'
import { x25crc } from './lib/utils'

// compute max length of value name for later padding values
function calculateMaxEnumValueNameLength(enums: { values: { name: string }[] }[]) {
  return enums.reduce((acc, entry) => {
    const maxLength = entry.values.reduce((acc, value) => Math.max(acc, value.name.length), 0)
    return Math.max(acc, maxLength)
  }, 0)
}

class InMemoryWriter implements Writer {
  readonly lines = [] as string[]

  write(line = '') {
    this.lines.push(line)
  }
}

function generateEnum(output: Writer, maxEnumValueNameLength: number, entry: {
  name: string
  description: string[]
  source: {
    name: string
  },
  values: {
    name: string
    value: string
    hasLocation: boolean
    isDestination: boolean
    description: string[]
    params: {
      name: string
      label: string
      description: string
      index: string
      units: string
      minValue: string
      maxValue: string
      increment: string
    }[]
  }[]
}) {
  output.write('')
  // generate enum description
  output.write('/**')
  if (entry.description.length > 0) {
    output.write(` * ${entry.description.join('\n * ')}`)
  } else {
    output.write(` * ${entry.source.name}`)
  }
  output.write(' */')

  // generate enum declaration
  output.write(`export enum ${entry.name} {`)

  // generate enum values
  entry.values.forEach((value, index) => {
    const props = [
      value.hasLocation ? `has location` : '',
      value.isDestination ? 'is destination' : '',
    ].filter(s => s)

    if (value.description.length > 0 || value.params.length > 0 || props.length || value.hasLocation || value.isDestination) {
      if (index > 0) {
        output.write('')
      }
      output.write('  /**')
      if (value.description.length > 0) {
        output.write(`   * ${value.description.join('\n   * ')}`)
      }
      if (props.length > 0) {
        if (value.description.length > 0) {
          output.write(`   *`)
        }
        output.write(`   * @note ${props.join(' and ')}`)
      }

      if (value.params) {
        const params = value.params
        if (value.description.length > 0 && props.length > 0) {
          output.write(`   *`)
        }
        params.forEach(param => {
          const units = param.units ? `[${param.units}]` : ''
          const label = param.label ? ` ${param.label}` : ''
          const parts = [
            param.minValue ? `min: ${param.minValue}` : '',
            param.maxValue ? `max: ${param.maxValue}` : '',
            param.increment ? `increment: ${param.increment}` : '',
          ].filter(s => s).join(', ')
          const meta = parts ? ` (${parts})` : ''
          const description = param.description ? ` ${param.description}` : ''
          const content = `${label}${units}${meta}${description}`
          if (content) {
            output.write(`   * @param${param.index}${content}`)
          }
        })
      }
      output.write('   */')
    }
    const padding = ''.padEnd(maxEnumValueNameLength - value.name.length, ' ')
    output.write(`  '${value.name}'${padding} = ${value.value},`)
  })
  output.write(`}`)
}

function generateEnums(output: Writer, enums: {
  name: string
  description: string[]
  values: {
    name: string
    value: string
    description: string[]
    hasLocation: boolean
    isDestination: boolean
    params: {
      name: string
      label: string
      description: string
      index: string
      units: string
      minValue: string
      maxValue: string
      increment: string
    }[]
  }[]
  source: {
    name: string
  }
}[]) {
  enums.forEach(entry => {
    generateEnum(output, calculateMaxEnumValueNameLength(enums), entry)
  })
}

function generateMessageDoc(output: Writer, message: {
  description: string[]
  deprecated?: {
    description: string
    since: string
    replacedBy: string
  },
  source: {
    name: string
  },
}) {
  output.write('/**')
  if (message.description.length > 0) {
    output.write(` * ${message.description.join('\n * ')}`)
  } else {
    output.write(` * ${message.source.name}`)
  }

  // generate deprecation information
  if (message.deprecated) {
    const description = message.deprecated.description ? `; ${message.deprecated.description}` : ''
    const since = message.deprecated.since || 'unknown'
    const replacedBy = message.deprecated.replacedBy || 'unknown'
    output.write(` *`)
    output.write(` * @deprecated since ${since}, replaced by ${replacedBy}${description}`)
  }

  output.write(' */')
}

function generateMessageClassHeader(output: Writer, message: {
  name: string
}) {
  output.write(`export class ${message.name} extends MavLinkData {`)
}

function generateMessageStaticDeclarations(output: Writer, message: {
  id: string
  source: {
    name: string
  }
  payloadLength: number
  magic: number
}) {
  // generate static fields
  output.write(`  static MSG_ID = ${message.id}`)
  output.write(`  static MSG_NAME = '${message.source.name}'`)
  output.write(`  static PAYLOAD_LENGTH = ${message.payloadLength}`)
  output.write(`  static MAGIC_NUMBER = ${message.magic}`)
  output.write(``)
}

function generateMessageDefinitionFields(output: Writer, fields: {
  name: string
  description: string[]
  fieldSize: number
  extension: boolean
  arrayLength: number
  fieldType: string
  size: number
  units: string
  type: string
  source: {
    name: string
  }
}[]) {
  output.write('  static FIELDS = [')

  // base fields go first; they are sorted from the largest fields to the smallest
  // if the size is the same then the order from xml is preserved
  const sortedFields = [...fields]
  sortedFields.sort((f1, f2) => f2.fieldSize - f1.fieldSize)

  let offset = 0

  sortedFields
    .filter(field => !field.extension)
    .forEach(field => {
      if (field.arrayLength) {
        output.write(`    new MavLinkPacketField('${field.source.name}', '${field.name}', ${offset}, false, ${field.fieldSize}, '${field.fieldType}', '${field.units}', ${field.arrayLength}),`)
      } else {
        output.write(`    new MavLinkPacketField('${field.source.name}', '${field.name}', ${offset}, false, ${field.fieldSize}, '${field.fieldType}', '${field.units}'),`)
      }
      offset += field.size
    })

  // extension fields retain their original definition order and are but after base fields
  fields
    .filter(field => field.extension)
    .forEach(field => {
      if (field.arrayLength) {
        output.write(`    new MavLinkPacketField('${field.source.name}', '${field.name}', ${offset}, true, ${field.fieldSize}, '${field.fieldType}', '${field.units}', ${field.arrayLength}),`)
      } else {
        output.write(`    new MavLinkPacketField('${field.source.name}', '${field.name}', ${offset}, true, ${field.fieldSize}, '${field.fieldType}', '${field.units}'),`)
      }
      offset += field.size
    })

  output.write('  ]')
  output.write('')
}

function generateMessageConstructor(output: Writer, fields: {
  name: string
  description: string[]
  fieldSize: number
  extension: boolean
  arrayLength: number
  fieldType: string
  size: number
  units: string
  type: string
  source: {
    name: string
  }
}[]) {
  output.write(`  constructor() {`)
  output.write(`    super()`)
  fields.forEach(field => {
    const initValue = field.type.startsWith('char') || field.type === 'string'
      ? '\'\''
      : field.type.includes('64')
        ? 'BigInt(0)'
        : 0
    const init = field.arrayLength && field.type !== 'string' ? `[]` : initValue

    output.write(`    this.${field.name} = ${init}`)
  })
  output.write(`  }`)

  if (fields.length > 0) output.write('')
}

function generateMessageFields(output, fields: {
  name: string
  type: string
  description: string[]
  units: string
}[]) {
  // generate fields
  fields.forEach((field, index, fields) => {
    if (field.description.length > 0 || field.units) {
      output.write('  /**')
      output.write(`   * ${field.description.join('\n   * ')}`)
      if (field.units) {
        output.write(`   * Units: ${field.units}`)
      }
      output.write('   */')
    }
    output.write(`  ${field.name}: ${field.type}`)
    if (fields.length - 1 > index) {
      output.write('')
    }
  })
  output.write(`}`)
}

function generateMessageClass(output: Writer, message: {
  id: string
  name: string
  source: {
    name: string
  }
  payloadLength: number
  magic: number,
  fields: {
    name: string
    description: string[]
    fieldSize: number
    extension: boolean
    arrayLength: number
    fieldType: string
    size: number
    units: string
    type: string
    source: {
      name: string
    }
  }[]
}) {
  generateMessageClassHeader(output, message)
  generateMessageStaticDeclarations(output, message)
  generateMessageDefinitionFields(output, message.fields)
  generateMessageConstructor(output, message.fields)
  generateMessageFields(output, message.fields)
}

function generateMessage(output: Writer, message: {
  id: string
  name: string
  description: string[]
  magic: number
  payloadLength: number
  source: {
    name: string
  }
  deprecated?: {
    description: string
    since: string
    replacedBy: string
  }
  fields: {
    name: string
    description: string[]
    fieldSize: number
    extension: boolean
    arrayLength: number
    fieldType: string
    size: number
    units: string
    type: string
    source: {
      name: string
    }
  }[]
}) {
  generateMessageDoc(output, message)
  generateMessageClass(output, message)
}

function generateMessages(output: Writer, messages: {
  source: {
    name: string
  }
  id: string
  name: string
  description: string[]
  magic: number
  payloadLength: number
  deprecated?: {
    description: string
    since: string
    replacedBy: string
  },
  fields: {
    name: string
    description: string[]
    fieldSize: number
    extension: boolean
    arrayLength: number
    fieldType: string
    size: number
    units: string
    type: string
    source: {
      name: string
    }
  }[]
}[]) {
  messages.forEach(message => {
    output.write()
    generateMessage(output, message)
  })
}

function generateMessageRegistry(output: Writer, messages: { id: string, name: string }[]) {
  output.write()
  output.write(`export const REGISTRY: MavLinkPacketRegistry = {`)
  messages.forEach(message => {
    output.write(`  ${message.id}: ${message.name},`)
  })
  output.write('}')
  output.write()
}

function generateCommandDoc(output: Writer, command: {
  description: string[],
  hasLocation: boolean,
  isDestination: boolean,
}) {
  if (command.description || command.hasLocation || command.isDestination) {
    output.write('/**')
    if (command.description.length > 0) {
      output.write(` * ${command.description.join('\n * ')}`)
    }
    if (command.hasLocation || command.isDestination) {
      if (command.description.length > 0) {
        output.write(' *')
      }
      if (command.hasLocation) {
        output.write(` * This command has location.`)
      }
      if (command.isDestination) {
        output.write(` * This command is destination.`)
      }
    }
    output.write(' */')
  }
}

function generateCommandConstructor(output: Writer, command: { name: string }) {
  output.write(`  constructor(targetSystem = 1, targetComponent = 1) {`)
  output.write(`    super()`)
  output.write(`    this.command = MavCmd.${command.name} as number`)
  output.write(`    this.targetSystem = targetSystem`)
  output.write(`    this.targetComponent = targetComponent`)
  output.write(`  }`)
}

function generateCommandParams(output: Writer, params: {
  name: string,
  index: string,
  description: string[]
  label: string
  units: string
  minValue: string
  maxValue: string
  increment: string
}[]) {
  params.forEach((param, index) => {
    if (index > 0) output.write()
    generateCommandParamDoc(output, param)
    generateCommandParamGetterAndSetter(output, param)
  })
}


function generateCommandClass(output: Writer, command: {
  description: string[],
  hasLocation: boolean,
  isDestination: boolean,
  field: string,
  name: string,
  source: {
    commonPrefix?: string,
  },
  params: {
    name: string,
    index: string,
    description: string[],
    label: string
    units: string
    minValue: string
    maxValue: string
    increment: string
  }[]
}) {
  output.write(`export class ${command.field} extends CommandLong {`)
  generateCommandConstructor(output, command)
  if (command.params.length > 0) {
    output.write(``)
  }
  generateCommandParams(output, command.params)
  output.write(`}`)
}

function generateCommandParamDoc(output: Writer, param: {
  description: string[]
  index: string
  label: string
  units: string
  minValue: string
  maxValue: string
  increment: string
}) {
  if (param.description) {
    output.write(`  /**`)
    const label = param.label ? ` ${param.label}` : ''
    if (label) {
      output.write(`   *${label}`)
      output.write('   *')
    }

    const units = param.units ? `${param.units}` : ''
    if (units) {
      output.write(`   * @units ${units}`)
    }
    const parts = [
      param.minValue ? `   * @min: ${param.minValue}` : '',
      param.maxValue ? `   * @max: ${param.maxValue}` : '',
      param.increment ? `   * @increment: ${param.increment}` : '',
    ].filter(s => s).join('\n')
    if (parts) {
      output.write(parts)
      output.write('   *')
    }
    if (param.description) {
      output.write(`   * ${param.description}`)
    }

    output.write(`   */`)
  }
}

function generateCommandParamGetterAndSetter(output: Writer, param: {
  name: string,
  index: string,
}) {
  output.write(`  get ${param.name}() {`)
  output.write(`    return this._param${param.index}`)
  output.write(`  }`)
  output.write(`  set ${param.name}(value: number) {`)
  output.write(`    this._param${param.index} = value`)
  output.write(`  }`)
}

function generateCommand(output: Writer, command: {
  description: string[],
  hasLocation: boolean,
  isDestination: boolean,
  field: string,
  name: string,
  params: {
    name: string,
    index: string,
    description: string[]
    label: string
    units: string
    minValue: string
    maxValue: string
    increment: string
  }[]
  source: {
    commonPrefix?: string
  }
}) {
  generateCommandDoc(output, command)
  generateCommandClass(output, command)
}

function generateCommands(output: Writer, moduleName: string, commands: {
  name: string,
  description: string[],
  hasLocation: boolean,
  isDestination: boolean,
  params: {
    name: string,
    index: string,
    description: string[]
    label: string
    units: string
    minValue: string
    maxValue: string
    increment: string
  }[],
  field: string
  source: {
    commonPrefix?: string
  }
}[]) {
  if (commands.length > 0) {
    if (moduleName !== 'common') {
      output.write('')
      output.write('import { CommandLong } from \'./common\'')
      output.write('')
    }

    commands.forEach((command, index) => {
      if (index > 0) output.write('')
      generateCommand(output, command)
    })
  }
}

function generateCommandRegistry(output: Writer, commands: { name: string, field: string }[]) {
  if (commands.length > 0) {
    output.write(`export const COMMANDS: MavLinkCommandRegistry = {`)
    commands.forEach(command => {
      output.write(`  [MavCmd.${command.name}]: ${command.field},`)
    })
    output.write(`}`)
    output.write()
  }
}

function generate(obj: any, output: Writer, moduleName: string = '') {
  const { enumDefs, messageDefs, commandTypeDefs } = new XmlSourceReader().read(obj.mavlink)

  // ------------------------------------------------------------------------
  // ENUMS
  // ------------------------------------------------------------------------

  const enums = enumDefs
    .pipe(enums => enums.map(entry => ({
      ...entry,
      description: matchTextToWidth(entry.description),
      values: entry.values.map(value => ({
        ...value,
        description: matchTextToWidth(value.description[0]),
      })),
    })))

  generateEnums(output, enums)

  // ------------------------------------------------------------------------
  // MESSAGES
  // ------------------------------------------------------------------------

  // fix some messages because they lack underscore in the original name
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
    .pipe(messages => messages.map(message => ({
      ...message,
      name: FIXED_MESSAGE_NAMES[message.id] || message.name,
      description: matchTextToWidth(message.description),
      fields: message.fields.map(field => ({
        ...field,
        description: matchTextToWidth(field.description),
      })),
      payloadLength: message.fields.reduce((acc, field) => acc + field.size, 0),
    })))
    .pipe(messages => messages.map(message => {
      // CRC is generated from the definition of base fields in network order (big fields first, then the small ones)
      const fields = [...message.fields]
        .filter(field => !field.extension)
        .sort((f1, f2) => f2.fieldSize - f1.fieldSize)

      // See https://mavlink.io/en/guide/serialization.html#crc_extra for more information
      let buffer = Buffer.from(message.source.name + ' ')
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        // the uint8_t_mavlink_version typ is actually uint8_t but spelled like that
        // to denote that it is read-only (crazy stuff)
        const fieldType = field.source.type === 'uint8_t_mavlink_version' ? 'uint8_t' : field.itemType
        const fieldName = field.source.name
        buffer = Buffer.concat([buffer, Buffer.from(`${fieldType} ${fieldName} `)])
        if (field.arrayLength) {
          buffer = Buffer.concat([buffer, Buffer.from([field.arrayLength])])
        }
      }
      const crc = x25crc(buffer)

      return {
        ...message,
        magic: (crc & 0xff) ^ (crc >> 8),
      }
    }))
    .pipe(messages => {
      // for CommandInt override the fields
      const commandInt = messages.find(message => message.name === 'CommandInt')
      if (commandInt) {
        // rename fields
        const FIELDS = ['param1', 'param2', 'param3', 'param4', 'x', 'y', 'z']
        commandInt.fields
          .filter(field => FIELDS.includes(field.name))
          .forEach(field => {
            const MAPPINGS = {
              'x': 'param5',
              'y': 'param6',
              'z': 'param7',
            }
            field.name = '_' + (MAPPINGS[field.name] || field.name)
          })
      }

      return messages
    })
    .pipe(messages => {
      // for CommandLong override the fields
      const commandLong = messages.find(message => message.name === 'CommandLong')
      if (commandLong) {
        // rename fields
        commandLong.fields
          .filter(field => field.name.startsWith('param'))
          .forEach(field => field.name = '_' + field.name)
      }

      return messages
    })

  generateMessages(output, messages)

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
        .map(param => ({ ...param, name: labelToIdentifier(param.name), orgName: param.name }))
    })))

  generateCommands(output, moduleName, commands)
  generateMessageRegistry(output, messages)
  generateCommandRegistry(output, commands)

  return { enums: enums, messages, commands }
}

function generateMagicNumbers(magicNumbers: Record<string, string>) {
  return [
    `export const MSG_ID_MAGIC_NUMBER = {`,
    ...Object.entries(magicNumbers).map(([msgid, magic]) => `  '${msgid}': ${magic},`, ''),
    `}`
  ].join('\n') + '\n'
}

import { mappings } from './package.json'

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
