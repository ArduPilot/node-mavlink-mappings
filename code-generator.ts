#!/usr/bin/env node

import * as fs from 'fs'
import * as parser from 'xml2js'
import { x25crc } from './lib/utils'
import { MessageFieldDef, pipeable, Writer, XmlSourceReader } from './generators'
import {
  extractArrayItemType,
  extractArraySize,
  extractArrayType,
  getTypeSize,
  makeClassName,
  matchTextToWidth,
  snakeToCamel
} from './code-utils'

class InMemoryWriter implements Writer {
  readonly lines = [] as string[]

  write(line = '') {
    this.lines.push(line)
  }
}

function generate(name: string, obj: any, output: Writer, moduleName: string = '') {
  // ------------------------------------------------------------------------
  // ENUMS
  // ------------------------------------------------------------------------

  const { enumDefs, messageDefs: messages } = pipeable(new XmlSourceReader().read(obj.mavlink))

  if (enumDefs.length > 0) {
    // preprocess description of enum to match 100 characters per line
    enumDefs.forEach((entry) => {
      entry.description = matchTextToWidth(entry.description[0])
    })

    // preprocess description of values to match 100 characters per line
    enumDefs.forEach(entry => {
      entry.values.forEach(value => {
        value.description = matchTextToWidth(value.description[0])
      })
    })

    // calculate common prefix for enum values (needed later to trim the common part and make the enum values shorter)
    enumDefs.forEach(entry => {
      entry.source.commonPrefix = entry.values
        .map(entry => entry.source.name)
        .reduce((acc, name) => {
          if (acc === '') {
            return name
          } else {
            for (let i = 0; i < Math.min(acc.length, name.length); i++) {
              if (acc[i] !== name[i]) return acc.substr(0, i)
            }
          }
          return acc
        }, '')

      // trim the common prefix so that it ends with an underscore
      while (!entry.source.commonPrefix.endsWith('_') && entry.source.commonPrefix.length > 0) {
        entry.source.commonPrefix = entry.source.commonPrefix.substr(0, entry.source.commonPrefix.length - 1)
      }

      // if the common prefix is contains parts of the value revert to source enum name
      if (entry.source.commonPrefix.startsWith(entry.source.name) && entry.source.commonPrefix.length > entry.source.name.length + 1) {
        entry.source.commonPrefix = entry.source.name + '_'
      }

      // if the common prefix is empty revert to source enum name
      if (entry.source.commonPrefix === '') {
        entry.source.commonPrefix = entry.source.name + '_'
      }
    })

    // compute value name based on the source name and common prefix
    enumDefs.forEach(entry => {
      // initialize the name from xml source
      entry.values.forEach(value => {
        value.name = value.source.name
      })

      // trim the common prefix
      for (let i = 0; i < 2; i++) {
        entry.values.forEach(value => {
          if (value.name?.startsWith(entry.source.commonPrefix || '')) {
            value.name = value.name.substr(entry.source.commonPrefix?.length || 255, 255)
          }
        })
      }

      // if the trimmed value starts with a digit revert to xml source
      entry.values.forEach(value => {
        if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(value.name[0])) {
          value.name = value.source.name
        }
      })
    })

    // compute enum value
    enumDefs.forEach(entry => {
      entry.values.forEach(value => {
        value.value = value.source.value
      })
    })

    // compute max length of value name for later padding values
    const maxValueNameLength = enumDefs.reduce((acc, entry) => {
      const maxLength = entry.values.reduce((acc, value) => Math.max(acc, value.name.length), 0)
      return Math.max(acc, maxLength)
    }, 0)

    // generate enums
    enumDefs.forEach(entry => {
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
            const params = value.params as any[]
            if (value.description.length > 0 && props.length > 0) {
              output.write(`   *`)
            }
            params.forEach(param => {
              const units = param.$.units ? `[${param.$.units}]` : ''
              const label = param.$.label ? ` ${param.$.label}` : ''
              const parts = [
                param.$.minValue ? `min: ${param.$.minValue}` : '',
                param.$.maxValue ? `max: ${param.$.maxValue}` : '',
                param.$.increment ? `increment: ${param.$.increment}` : '',
              ].filter(s => s).join(', ')
              const meta = parts ? ` (${parts})` : ''
              const description = param._ ? ` ${param._}` : ''
              const content = `${label}${units}${meta}${description}`
              if (content) {
                output.write(`   * @param${param.$.index}${content}`)
              }
            })
          }
          output.write('   */')
        }
        const padding = ''.padEnd(maxValueNameLength - value.name.length, ' ')
        output.write(`  '${value.name}'${padding} = ${value.value},`)
      })
      output.write(`}`)
    })
  }
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

  messages.forEach(message => {
    if (FIXED_MESSAGE_NAMES[message.id]) {
      message.name = FIXED_MESSAGE_NAMES[message.id]
    }
  })

  // gather message fields
  //
  // The order does matter and there are things like <wip> and <extensions> that also need
  // to be understood to properly collect fields
  messages.forEach(message => {
    let isExtensionField = false

    const makeEnumField = (fieldType: string, enumName: string) => {
      if (fieldType.includes('[')) {
        return `${enumName}[]`
      } else {
        return enumName
      }
    }

    message.source.xml.$$.forEach(item => {
      if (item['#name'] === 'wip') {
        message.workInProgress = true
      }
      if (item['#name'] === 'extensions') {
        isExtensionField = true
      }
      if (item['#name'] === 'field') {
        const field = item
        const entry = {
          source: {
            name: field.$.name,
            type: field.$.type,
            enum: field.$.enum,
          },
          name: snakeToCamel(field.$.name),
          extension: isExtensionField,
          description: field._ || '',
          type: field.$.enum ? makeEnumField(field.$.type, makeClassName(field.$.enum)) : extractArrayType(field.$.type),
          arrayLength: extractArraySize(field.$.type) || null,
          size: getTypeSize(field.$.type) * (extractArraySize(field.$.type) || 1),
          fieldType: extractArrayType(field.$.type),
          fieldSize: getTypeSize(field.$.type),
          itemType: extractArrayItemType(field.$.type),
          units: field.$.units || '',
        } as MessageFieldDef
        if (entry.type === 'char[]') {
          entry.type = 'string'
        }
        message.fields.push(entry)
      }
    })
  })

  // preprocess description of messages to match 100 characters per line
  messages.forEach((message) => {
    message.description = matchTextToWidth(message.description[0])
  })

  // preprocess description of fields to match 100 characters per line
  messages.forEach((message) => {
    message.fields.forEach(field => {
      field.description = matchTextToWidth(field.description[0])
    })
  })

  // calculate total payload length
  messages.forEach(message => {
    message.payloadLength = message.fields.reduce((acc, field) => acc + field.size, 0)
  })

  // calculate CRC_EXTRA
  messages.forEach((message) => {
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
    message.magic = (crc & 0xff) ^ (crc >> 8)
  })

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

  // for CommandLong override the fields
  const commandLong = messages.find(message => message.name === 'CommandLong')
  if (commandLong) {
    // rename fields
    commandLong.fields
      .filter(field => field.name.startsWith('param'))
      .forEach(field => field.name = '_' + field.name)
  }

  // generate message classes
  messages.forEach(message => {
    output.write()

    // generate message description
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

    // generate class header
    output.write(`export class ${message.name} extends MavLinkData {`)

    // generate static fields
    output.write(`  static MSG_ID = ${message.id}`)
    output.write(`  static MSG_NAME = '${message.source.name}'`)
    output.write(`  static PAYLOAD_LENGTH = ${message.payloadLength}`)
    output.write(`  static MAGIC_NUMBER = ${message.magic}`)
    output.write(``)

    // generate fields collection
    output.write('  static FIELDS = [')

    // base fields go first; they are sorted from the largest fields to the smallest
    // if the size is the same then the order from xml is preserved
    const fields = [...message.fields]
    fields.sort((f1, f2) => f2.fieldSize - f1.fieldSize)

    let offset = 0

    fields
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
    message.fields
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

    // generate constructor
    output.write(`  constructor() {`)
    output.write(`    super()`)
    message.fields.forEach(field => {
      const initValue = field.type.startsWith('char') || field.type === 'string'
        ? '\'\''
        : field.type.includes('64')
          ? 'BigInt(0)'
          : 0
      const init = field.arrayLength && field.type !== 'string' ? `[]` : initValue

      output.write(`    this.${field.name} = ${init}`)
    })
    output.write(`  }`)
    output.write('')

    // generate fields
    message.fields.forEach((field, index, fields) => {
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
  })

  // locate MavCmd enum to generate command classes
  const commandTypes = enumDefs.find(e => e.name === 'MavCmd')

  // Generate classes for specific commands
  if (commandTypes) {
    if (moduleName !== 'common') {
      output.write('')
      output.write('import { CommandLong } from \'./common\'')
      output.write('')
    }

    const labelToIdentifier = input => input
      .toLowerCase()
      .replace(/\s+(\w)?/gi, (match, letter) => letter.toUpperCase())
      .split('/')[0]
      .replace(/\-\S+/g, m => m.charAt(1).toUpperCase() + m.substr(2))
      .replace(/\-\S+/g, m => m.charAt(1).toUpperCase() + m.substr(2))
      .replace(/\.\S+/g, m => m.charAt(1).toUpperCase() + m.substr(2))
      .replace('4thDimension', 'fourthDimension')
      .replace('5thDimension', 'fifthDimension')
      .replace('6thDimension', 'sixthDimension')
      .replace('command', 'cmd')

    const nameToClassName = input => input
      .replaceAll('_', ' ')
      .replace(/\w\S*/g, m => m.charAt(0).toUpperCase() + m.substr(1).toLowerCase())
      .replaceAll(' ', '') + 'Command'

    commandTypes.values
      .map(command => ({
        ...command,
        field: nameToClassName(command.name),
        params: command.params
          .map(p => ({
            $: p.$,
            index: p.$.index,
            name: p.$.label,
            description: p._,
          }))
          .filter(label => label.name)
          .map(label => ({ ...label, name: labelToIdentifier(label.name), orgName: label.name }))
      }))
      .filter(command => !command.workInProgress)
      .forEach((command, index) => {
        if (index > 0) output.write('')

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

        output.write(`export class ${command.field} extends CommandLong {`)
        output.write(`  constructor(targetSystem = 1, targetComponent = 1) {`)
        output.write(`    super()`)
        output.write(`    this.command = MavCmd.${command.name} as number`)
        output.write(`    this.targetSystem = targetSystem`)
        output.write(`    this.targetComponent = targetComponent`)
        output.write(`  }`)
        output.write(``)

        command.params.forEach((param, index) => {
          if (index > 0) output.write()
          if (param.description) {
            output.write(`  /**`)
            const label = param.$.label ? ` ${param.$.label}` : ''
            if (label) {
              output.write(`   *${label}`)
              output.write('   *')
            }

            const units = param.$.units ? `${param.$.units}` : ''
            if (units) {
              output.write(`   * @units ${units}`)
            }
            const parts = [
              param.$.minValue ? `   * @min: ${param.$.minValue}` : '',
              param.$.maxValue ? `   * @max: ${param.$.maxValue}` : '',
              param.$.increment ? `   * @increment: ${param.$.increment}` : '',
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
          output.write(`  get ${param.name}() {`)
          output.write(`    return this._param${param.index}`)
          output.write(`  }`)
          output.write(`  set ${param.name}(value: number) {`)
          output.write(`    this._param${param.index} = value`)
          output.write(`  }`)
        })
        output.write(`}`)
      })
  }

  // generate message registry
  output.write()
  output.write(`export const REGISTRY: MavLinkPacketRegistry = {`)
  messages.forEach(message => {
    output.write(`  ${message.id}: ${message.name},`)
  })
  output.write('}')
  output.write()

  // generate command registry
  if (commandTypes) {
    const nameToClassName = input => input
      .replaceAll('_', ' ')
      .replace(/\w\S*/g, m => m.charAt(0).toUpperCase() + m.substr(1).toLowerCase())
      .replaceAll(' ', '') + 'Command'

    output.write(`export const COMMANDS: MavLinkCommandRegistry = {`)
    commandTypes.values
      .filter(command => !command.workInProgress)
      .forEach(command => {
        output.write(`  [MavCmd.${command.name}]: ${nameToClassName(command.name)},`)
      })
    output.write(`}`)
    output.write()
  }

  return { enums: enumDefs, messages, commands: commandTypes }
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
    const { messages } = generate(part, data, output, part)
    messages.forEach(message => { magicNumbers[message.id] = message.magic })
    fs.writeFileSync(`./lib/${part}.ts`, output.lines.join('\n'))
    process.stdout.write('done\n')
  }

  // generate magic-numbers.ts
  const magic = [
    `export const MSG_ID_MAGIC_NUMBER = {`,
    ...Object.entries(magicNumbers).map(([msgid, magic]) => `  '${msgid}': ${magic},`, ''),
    `}`
  ].join('\n') + '\n'

  fs.writeFileSync('./lib/magic-numbers.ts', magic)
}

main()
