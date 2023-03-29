import * as parser from 'xml2js'
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
import { calculateCrcExtra } from '../lib/utils'

import { Pipeable, pipeable } from './pipeable'

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
  field: string
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
  magic?: number
  payloadLength?: number
}

export interface Input {
  readonly enumDefs: EnumDef[] & Pipeable<EnumDef[]>
  readonly messageDefs: MessageDef[] & Pipeable<MessageDef[]>
  readonly commandTypeDefs: CommandTypeDef[] & Pipeable<CommandTypeDef[]>
}

export class XmlDataSource {
  async parse(xml: string): Promise<Input> {
    const data = await parser.parseStringPromise(xml, { explicitChildren: true, preserveChildrenOrder: true })
    return this.read(data.mavlink)
  }

  read(mavlink: any): Input {
    const enumDefs = this.readEnumDefs(mavlink)
    const messageDefs = this.readMessageDefs(mavlink)
    const commandTypeDefs = this.readCommandDefs(enumDefs)

    this.updateCommandMessages(messageDefs)

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
      values: this.readEnumValueDefs(xml)
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
            ? value.name.substring(entry.source.commonPrefix.length)
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

  private readEnumValueDefs(xml: any) {
    return xml.entry.map(xml => ({
      source: {
        name: xml.$.name,
        value: xml.$.value,
      },
      name: xml.$.name,
      value: xml.$.value,
      description: xml.description?.map(s => String(s))
        .filter(s => s.trim() !== '[object Object]')
        .join(' ') || '',
      params: this.readEnumValueParamDefs(xml),
      hasLocation: xml.$.hasLocation === 'true',
      isDestination: xml.$.isDestination === 'true',
    } as EnumValueDef))
  }

  private readEnumValueParamDefs(xml: any) {
    return (xml.param || []).map(xml => ({
      units: xml.$.units,
      label: xml.$.label,
      description: xml._,
      increment: xml.$.increment,
      index: xml.$.index,
      name: xml.$.name,
      minValue: xml.$.minValue,
      maxValue: xml.$.maxValue,
    } as EnumParamValueDef))
  }

  private readMessageDefs(mavlink: any): MessageDef[] & Pipeable<MessageDef[]> {
    const isWorkInProgress = (message: any) => message.$$.some(item => item['#name'] === 'wip')

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
      workInProgress: isWorkInProgress(message),
      fields: this.readMessageFieldDefs(message),
      wip: Boolean(message.wip)
    } as MessageDef)).filter(x => !x.wip)

    return pipeable(result)
      // calculate payload length
      .pipe(messages => messages.map(message => ({
        ...message,
        payloadLength: message.fields.reduce((acc, field) => acc + field.size, 0),
      })))
      // calculate magic numbers
      .pipe(messages => messages.map(message => ({
        ...message,
        magic: calculateCrcExtra(message.source.name, message.fields),
      })))
  }

  private readMessageFieldDefs(xml: any): MessageFieldDef[] {
    // gather message fields
    //
    // The order does matter and there are things like <wip> and <extensions> that also need
    // to be understood to properly collect fields
    let isExtensionField = false

    const result = xml.$$
      .map(item => {
        if (item['#name'] === 'extensions') {
          isExtensionField = true
          return null
        } else if (item['#name'] === 'field') {
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

          // cleanup type names
          if (entry.type === 'char[]') entry.type = 'string'

          return entry
        } else {
          return null
        }
      })
      // filter out empty/unknown items like "wip"
      .filter(entry => entry)

    return result
  }

  private readCommandDefs(enums: EnumDef[]) {
    const result = (enums.find(e => e.name === 'MavCmd')?.values || [])
      .map(command => ({
        ...command,
        field: nameToClassName(command.name),
        params: command.params
          .filter(param => param.label)
          .map(param => ({ ...param, name: labelToIdentifier(param.label), orgName: param.label }))
      } as CommandTypeDef))
      .filter(command => !command.workInProgress)

    return pipeable(result)
  }

  private updateCommandMessages(messageDefs: MessageDef[]) {
    const commandInt = messageDefs.find(message => message.name === 'CommandInt')
    const commandLong = messageDefs.find(message => message.name === 'CommandLong')

    // for CommandInt override the fields
    if (commandInt) {
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
    if (commandLong) {
      commandLong.fields
        .filter(field => field.name.startsWith('param'))
        .forEach(field => field.name = '_' + field.name)
    }
  }
}
