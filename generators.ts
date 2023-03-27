declare global {
  interface String {
    replaceAll(s: string, r: string): string
  }
}

const snakeToCamel = s => s.replace(/([-_]\w)/g, g => g[1].toUpperCase())

const snakeToPascal = s => {
  const camelCase = snakeToCamel(s)
  return camelCase[0].toUpperCase() + camelCase.substr(1)
}

function makeClassName(message: string) {
  return snakeToPascal(message.toLowerCase())
}

export interface EnumValueDef {
  name?: string
  source: {
    name: string
    value: string
  }
  description: string
  params: any[]
  hasLocation: boolean
  isDestination: boolean
  workInProgress: boolean
}

export interface EnumDef {
  name: string
  source: {
    name: string
  }
  description: string
  values: EnumValueDef[]
}

export interface MessageDef {
  source: {
    xml: string,
    name: string,
  },
  id: string,
  name: string,
  description: string,
  deprecated?: {
    since: string,
    replacedBy: string,
    description: string,
  },
  workInProgress: false,
  fields: {
    source: {
      name: string,
      type: string,
      enum: string,
    },
    name: string,
    extension: boolean,
    description: string,
    type: string,
    arrayLength: string,
    size: string,
    fieldType: string,
    fieldSize: string,
    itemType: string,
    units: string,
  }[],
  wip: boolean
}

export interface CommandTypeDef extends EnumValueDef {
  field: string
  params: {
    $: any,
    index: string,
    name: string,
    description: string,
  }[],
}

export interface Input {
  readonly enumDefs: EnumDef[]
  readonly messageDefs: MessageDef[]
  readonly commandTypeDefs: CommandTypeDef[]
}

export type Pipeable<I, O = I> = I & {
  pipe(transformer: (input: I) => O): Pipeable<O>
}

const x111: Pipeable<Input> = {} as any
x111.pipe(i => i).pipe(i => i)

export class XmlSourceReader {
  read(mavlink: any): Pipeable<Input> {
    const enumDefs = this.readEnumDefs(mavlink)
    const messageDefs: MessageDef[] = this.readMessageDefs(mavlink)
    const commandTypeDefs: CommandTypeDef[] = this.readCommandDefs(enumDefs)

    const result = {
      enumDefs,
      messageDefs,
      commandTypeDefs,

      pipe(transform: (input: Input) => Pipeable<Input>) {
        return transform(this)
      }
    }

    return result
  }

  private readEnumDefs(mavlink: any): EnumDef[] {
    return mavlink.enums[0].enum.map(xml => ({
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
        description: xml.description?.map(s => String(s))
          .filter(s => s.trim() !== '[object Object]')
          .join(' ') || '',
        params: xml.param || [],
        hasLocation: xml.$.hasLocation === 'true',
        isDestination: xml.$.isDestination === 'true',
      }))
    }))
  }

  private readMessageDefs(mavlink: any): MessageDef[] {
    return mavlink.messages[0].message.map(message => ({
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
    })).filter(x => !x.wip)
  }

  private readCommandDefs(enums: EnumDef[]): CommandTypeDef[] {
    const labelToIdentifier = (input: string) => input
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

    const nameToClassName = (input: string = '') => input
      .replaceAll('_', ' ')
      .replace(/\w\S*/g, m => m.charAt(0).toUpperCase() + m.substr(1).toLowerCase())
      .replaceAll(' ', '') + 'Command'

    return (enums.find(e => e.name === 'MavCmd')?.values || [])
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
  }
}

export interface Transformer extends Pipeable<Input> {
}

export interface Writer {
  write(line?: string)
}

export interface Generator {
  generate(input: Input, output: Writer)
}
