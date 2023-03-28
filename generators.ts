import {
  extractArrayItemType,
  extractArraySize,
  extractArrayType,
  getTypeSize,
  labelToIdentifier,
  snakeToCamel,
  makeClassName,
  calculateCommonPrefix,
  nameToClassName,
  makeEnumFieldType
} from './code-utils'

declare global {
  interface String {
    replaceAll(s: string, r: string): string
  }
}

export interface EnumParamValueDef {
  name: string
  label: string
  description: string
  index: string
  units: string
  minValue: string
  maxValue: string
  increment: string
}

export interface EnumValueDef {
  source: {
    name: string
    value: string
    commonPrefix: string
  }
  name: string
  value: string
  description: string
  params: EnumParamValueDef[]
  hasLocation: boolean
  isDestination: boolean
  workInProgress: boolean
}

export interface EnumDef {
  name: string
  source: {
    name: string
    commonPrefix: string
  }
  description: string
  values: EnumValueDef[]
}

export interface CommandTypeDef extends EnumValueDef {
}

export interface MessageFieldDef {
  source: {
    name: string
    type: string
    enum: string
  },
  name: string
  extension: boolean
  description: string
  type: string
  arrayLength: number
  size: number
  fieldType: string
  fieldSize: number
  itemType: string
  units: string
}

export interface MessageDef {
  source: {
    xml: any
    name: string
  }
  deprecated?: {
    since: string,
    replacedBy: string,
    description: string,
  }
  id: string
  name: string
  description: string
  workInProgress: boolean
  fields: MessageFieldDef[]
  wip: boolean
}

export interface Input {
  readonly enumDefs: EnumDef[]
  readonly messageDefs: MessageDef[]
  readonly commandTypeDefs: CommandTypeDef[]
}

export function clone<T>(input: T): T {
  return JSON.parse(JSON.stringify(input))
}

export interface Pipeable<I> {
  pipe<O>(transform: (input: I) => O): O & Pipeable<O>
}

export function pipeable<I>(input: I) {
  const result = clone(input)
  if ((result as any).pipe) {
    throw new Error('Error: the given object is already pipeable')
  }

  const pipeableResult = result as Pipeable<I>
  pipeableResult.pipe = <O>(transform: (input: I) => O) => pipeable<O>(transform(result))

  return result as I & Pipeable<I>
}

export class XmlSourceReader {
  read(mavlink: any) {
    const enumDefs = this.readEnumDefs(mavlink)
    const messageDefs = this.readMessageDefs(mavlink)
    const commandTypeDefs = this.readCommandDefs(enumDefs)

    return { enumDefs, messageDefs, commandTypeDefs }
  }

  private readEnumDefs(mavlink: any): EnumDef[] & Pipeable<EnumDef[]> {
    // read raw values from the source XML definition
    const result = mavlink.enums[0].enum.map(xml => ({
      name: makeClassName(xml.$.name),
      source: {
        name: xml.$.name,
      },
      description: xml.description?.join(' ') || '',
      values: xml.entry.map(xml => ({
        source: {
          name: xml.$.name,
          value: xml.$.value,
        },
        name: xml.$.name,
        value: xml.$.value,
        description: xml.description?.map(s => String(s))
          .filter(s => s.trim() !== '[object Object]')
          .join(' ') || '',
        params: (xml.param || []).map(xml => ({
          units: xml.$.units,
          label: xml.$.label,
          description: xml.$.description,
          increment: xml.$.increment,
          index: xml.$.index,
          name: xml.$.name,
          minValue: xml.$.minValue,
          maxValue: xml.$.maxValue,
        } as EnumParamValueDef)),
        hasLocation: xml.$.hasLocation === 'true',
        isDestination: xml.$.isDestination === 'true',
      } as EnumValueDef))
    } as EnumDef)) as EnumDef[]

    return pipeable(result)
      // calculate common prefix for all enums to later on cut it off from the values
      .pipe(enums => enums.map(entry => ({
        ...entry,
        source: {
          ...entry.source,
          commonPrefix: calculateCommonPrefix(entry)
        },
      })))
      // cut off common prefix from value names so that for the enum MavTest values are
      // 'FIRST' and 'SECOND' instead of 'MAV_TEST_FIRST' and 'MAV_TEST_SECOND'
      .pipe(enums => enums.map(entry => ({
        ...entry,
        values: entry.values.map(value => ({
          ...value,
          name: value.name?.startsWith(entry.source.commonPrefix || '')
            ? value.name.substr(entry.source.commonPrefix?.length || 255, 255)
            : value.name
        })),
      })))
      // check values that start with a digit in which case use the original source instead
      .pipe(enums => enums.map(entry => ({
        ...entry,
        values: entry.values.map(value => ({
          ...value,
          name: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(value.name[0])
            ? value.source.name
            : value.name
        })),
      })))
  }

  private readMessageDefs(mavlink: any): Pipeable<MessageDef[]> {
    const result = mavlink.messages[0].message.map(message => ({
      source: {
        xml: message,
        name: message.$.name,
      },
      id: message.$.id,
      name: makeClassName(message.$.name),
      description: message.description?.join(' ') || '',
      deprecated: (!message.deprecated) ? undefined : {
        since: message.deprecated[0].$.since,
        replacedBy: message.deprecated[0].$.replaced_by,
        description: message.deprecated[0]._,
      },
      workInProgress: false,
      fields: [],
      wip: Boolean(message.wip)
    } as MessageDef)).filter(x => !x.wip)

    result.forEach(message => { this.readMessageFieldDefs(message) })

    return pipeable(result)
  }

  private readMessageFieldDefs(message: MessageDef) {
    // gather message fields
    //
    // The order does matter and there are things like <wip> and <extensions> that also need
    // to be understood to properly collect fields
    let isExtensionField = false

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
          type: field.$.enum ? makeEnumFieldType(field.$.type, makeClassName(field.$.enum)) : extractArrayType(field.$.type),
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
  }

  private readCommandDefs(enums: EnumDef[]) {
    const result = (enums.find(e => e.name === 'MavCmd')?.values || [])
      .map(command => ({
        ...command,
        params: command.params
          .filter(label => label.name)
          .map(label => ({ ...label, name: labelToIdentifier(label.name), orgName: label.name }))
      } as CommandTypeDef))
      .filter(command => !command.workInProgress)

    return pipeable(result)
      .pipe(commands => commands.map(command => ({
        ...command,
        field: nameToClassName(command.name),
      })))
  }
}

export interface Writer {
  write(line?: string)
}

export interface Generator {
  generate(input: Input, output: Writer)
}
