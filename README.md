# Node.js MavLink mappings library

This package is the implementation of serialization and parsing of MavLink messages.

Please see [node-mavlink](https://github.com/ArduPilot/node-mavlink) for full documentation.

## Generating custom definitions

Sometimes the vast number of messages just isn't enough and a new message could make all the difference.

You may consider writing the a class definition by hand, which is definitely possible but it may be a tedious and error-prone process. To ease the pain the entire generator is exposed for anyone to use:

### Generating based on XML source

One thing that will allow you to basically generate all definitions in one go is to base them on a mavlink xml definition file. For a list of supported features look at the original XML definitions. At the moment minimal, common, development, ardupilotmega, asluav, icarus, storm32, ualberta and uavionix definitions are recognized by the generator.

```typescript
async function generateAll(input: string, output: Writer, moduleName: string = '')
```

Please note, that for this to work the generator needs an XML parser. The one that it uses to do the job is [xml2js](https://npmjs.com/package/xml2js). You can install it as follows:

```
$ npm install --save xml2js
```

### Generating based on data

This is a much more tedious process but it allows you to use something completely different to read the definitions from. There are a few interfaces that you'll have to get familiar with (like EnumDef, MessageDef and CommandTypeDef) but after you'll get them the generator should produce valid definitions.

This is how the `generateAll()` function does it:

```typescript
const { enumDefs, messageDefs, commandTypeDefs } = await new XmlDataSource().parse(input)

const enums = processEnums(output, enumDefs)
const messages = processMessages(output, messageDefs)
const commands = processCommands(output, moduleName, commandTypeDefs)
processRegistries(output, messages, commands)

return { enums, messages, commands }
```

### Debugging issues

Disclaimer:

The generator is basically available as-is. There is, and never will be, any support for anything else that doesn't work at the moment. If you want to have a problem fixed that impacts you - create a PR, I promise I'll look at it. If you have a feature request - create a PR that implements that feature.

With that out of the way let's see what can we do to understand the problems we might encounter.

#### Going single

If only part of the generation fails the entire generated content is lost. But there is hope! You can process each enum, message and command separately:

#### Generating a single enum

```typescript
function generateEnum(output: Writer, enum: {
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
})
```

#### Generating a single message

```typescript
function generateMessage(output: Writer, message: {
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
})
```

#### Generating a single command

```typescript
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
})
```

### Generating other elements separately

Pretty much every single part of the code can be generated in separation to everything else. Use that to understand better the inputs and the generated output. Functions like `generateEnumValueParams(...)` or `generateMessageDefinitionFields()` are there for you to use in those cases where you just don't get what's going on.

### Generating magic number (aka `crc_extra`) value

Writing a definition of a message manually is an intense task at best. The one thing that is the least straightforward is the generation of a proper `crc_extra` (referred by `node-mavlink` as _magic value_) value:

```typescript
function calculateCrcExtra(messageSourceName: string, fields: {
  extension: boolean
  itemType: string
  fieldSize: number
  arrayLength?: number
  source: { type: string, name: string }
}[])
```

### Generating registry for magic numbers

A registry of _magic numbers_ (aka `crc_extra`) can also be generated:

```javascript
  fs.writeFileSync('magic-numbers.ts', generateMagicNumbers(magicNumbers))
```
