import { calculateMaxEnumValueNameLength } from './code-utils'
import { Writer } from './definitions'

export function generateEnums(output: Writer, enums: {
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
  const maxEnumValueNameLength = calculateMaxEnumValueNameLength(enums)
  enums.forEach(entry => {
    generateEnum(output, maxEnumValueNameLength, entry)
  })
}

export function generateEnum(output: Writer, maxEnumValueNameLength: number, entry: {
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
  generateEnumValues(output, maxEnumValueNameLength, entry.values)

  output.write(`}`)
}

export function generateEnumValues(output: Writer, maxEnumValueNameLength: number, values: {
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
}[]) {
  values.forEach((value, index) => {
    generateEnumValue(output, maxEnumValueNameLength, index, value)
  })
}

export function generateEnumValue(output: Writer, maxEnumValueNameLength: number, index: number, value: {
  name: string
  value: string
  hasLocation: boolean
  isDestination: boolean
  description: string[]
  params: {
    label: string
    description: string
    index: string
    units: string
    minValue: string
    maxValue: string
    increment: string
  }[]
}) {
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

    generateEnumValueParams(output, props.length > 0, value)

    output.write('   */')
  }

  const padding = ''.padEnd(maxEnumValueNameLength - value.name.length, ' ')
  output.write(`  '${value.name}'${padding} = ${value.value},`)
}

export function generateEnumValueParams(output: Writer, hasProps: boolean, value: {
  description: string[]
  params: {
    label: string
    description: string
    index: string
    units: string
    minValue: string
    maxValue: string
    increment: string
  }[]
}) {
  if (value.params.length > 0) {
    const params = value.params
    if (value.description.length > 0 && hasProps) {
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
}

export function generateMessageDoc(output: Writer, message: {
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

export function generateMessageClassHeader(output: Writer, message: {
  name: string
}) {
  output.write(`export class ${message.name} extends MavLinkData {`)
}

export function generateMessageStaticDeclarations(output: Writer, message: {
  id: string
  source: {
    name: string
  }
  magic?: number
  payloadLength?: number
}) {
  // generate static fields
  output.write(`  static MSG_ID = ${message.id}`)
  output.write(`  static MSG_NAME = '${message.source.name}'`)
  output.write(`  static PAYLOAD_LENGTH = ${message.payloadLength}`)
  output.write(`  static MAGIC_NUMBER = ${message.magic}`)
  output.write(``)
}

export function generateMessageDefinitionFields(output: Writer, fields: {
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

export function generateMessageConstructor(output: Writer, fields: {
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

export function generateMessageFields(output, fields: {
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

export function generateMessageClass(output: Writer, message: {
  id: string
  name: string
  source: {
    name: string
  }
  magic?: number,
  payloadLength?: number
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

export function generateMessage(output: Writer, message: {
  id: string
  name: string
  description: string[]
  magic?: number
  payloadLength?: number
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

export function generateMessages(output: Writer, messages: {
  source: {
    name: string
  }
  id: string
  name: string
  description: string[]
  magic?: number
  payloadLength?: number
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

export function generateMessageRegistry(output: Writer, messages: { id: string, name: string }[]) {
  output.write()
  output.write(`export const REGISTRY: MavLinkPacketRegistry = {`)
  messages.forEach(message => {
    output.write(`  ${message.id}: ${message.name},`)
  })
  output.write('}')
  output.write()
}

export function generateCommandDoc(output: Writer, command: {
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

export function generateCommandConstructor(output: Writer, command: { name: string }) {
  output.write(`  constructor(targetSystem = 1, targetComponent = 1) {`)
  output.write(`    super()`)
  output.write(`    this.command = MavCmd.${command.name} as number`)
  output.write(`    this.targetSystem = targetSystem`)
  output.write(`    this.targetComponent = targetComponent`)
  output.write(`  }`)
}

export function generateCommandParams(output: Writer, params: {
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

export function generateCommandClass(output: Writer, command: {
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

export function generateCommandParamDoc(output: Writer, param: {
  description: string[]
  index: string
  label: string
  units: string
  minValue: string
  maxValue: string
  increment: string
}) {
  if (param.description || param.label) {
    const label = [...param.description || param.label || '']
      .filter(x => x)
      .map(s => `   * ${s}`)

    const parts = [
      param.units ? `   * @units ${param.units}` : '',
      param.minValue ? `   * @min: ${param.minValue}` : '',
      param.maxValue ? `   * @max: ${param.maxValue}` : '',
      param.increment ? `   * @increment: ${param.increment}` : '',
    ].filter(s => s)

    if (parts.length > 0 && label.length > 0) {
      label.push(`   *`)
    }
    label.reverse().forEach(s => parts.unshift(s))

    if (parts.length > 0) {
      parts.unshift(`  /**`)
    }

    if (parts.length > 0) {
      output.write(parts.join('\n'))
    }

    if (parts.length > 0) {
      output.write(`   */`)
    }
  }
}

export function generateCommandParamGetterAndSetter(output: Writer, param: {
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

export function generateCommand(output: Writer, command: {
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

export function generateCommands(output: Writer, moduleName: string, commands: {
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

export function generateCommandRegistry(output: Writer, commands: { name: string, field: string }[]) {
  if (commands.length > 0) {
    output.write(`export const COMMANDS: MavLinkCommandRegistry = {`)
    commands.forEach(command => {
      output.write(`  [MavCmd.${command.name}]: ${command.field},`)
    })
    output.write(`}`)
    output.write()
  }
}

export function generateMagicNumbers(magicNumbers: Record<string, string>) {
  return [
    `export const MSG_ID_MAGIC_NUMBER = {`,
    ...Object.entries(magicNumbers).map(([msgid, magic]) => `  '${msgid}': ${magic},`, ''),
    `}`
  ].join('\n') + '\n'
}
