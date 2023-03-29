export const snakeToCamel = s => s.replace(/([-_]\w)/g, g => g[1].toUpperCase())

export const snakeToPascal = s => {
  const camelCase = snakeToCamel(s)
  return camelCase[0].toUpperCase() + camelCase.substr(1)
}

/**
 * Given the message convert it to a valid class name
 *
 * @param message message to convert to class name
 * @returns class name of the given message
 */
export function makeClassName(message: string) {
  return snakeToPascal(message.toLowerCase())
}

/**
 * Extracts type of the array
 *
 * @param type type to extract the size
 * @returns type of the array
 */
export function extractArrayType(type: string) {
  if (type.indexOf('[') > -1) {
    return type.replace(/(.*)\[(\d+)\]/, (x, t, size) => `${t}[]`)
  } else {
    return type
  }
}

/**
 * Extracts the type of item of an array type
 *
 * @param type type to extract the size
 * @returns type of the array element
 */
export function extractArrayItemType(type: string) {
  if (type.indexOf('[') > -1) {
    return type.replace(/(.*)\[(\d+)\]/, (x, t, size) => `${t}`)
  } else {
    return type
  }
}

/**
 * Extracts the size of array type
 *
 * @param type type to extract the size
 * @returns size of the array
 */
export function extractArraySize(type: string) {
  if (type.indexOf('[') > -1) {
    return parseInt(type.replace(/(.*)\[(\d+)\]/, (x, t, size) => size))
  } else {
    return undefined
  }
}

/**
 * Returns size in bytes of the given type
 *
 * @param type type to get the size
 * @returns number of bytes occupied by the given type
 */
export function getTypeSize(type: string) {
  const name = (type.indexOf('[') > -1)
    ? type.replace(/(.*)\[(\d+)\]/, (x, t, size) => t)
    : type

  switch (name) {
    case 'char':
    case 'int8_t':
    case 'uint8_t':
    case 'uint8_t_mavlink_version':
      return 1
    case 'int16_t':
    case 'uint16_t':
      return 2
    case 'int32_t':
    case 'uint32_t':
    case 'float':
      return 4
    case 'int64_t':
    case 'uint64_t':
    case 'double':
      return 8
    default:
      throw new Error(`Unknown type ${name}`)
  }
}

/**
 * Match text to the given width cutting it into multiple
 * lines if the original text's length exceeds the given
 * width
 *
 * @param s string to match
 * @param width width to match
 */
export function matchTextToWidth(s: string, width = 100) {
  if (s === null || s === undefined) {
    return []
  }
  // replace all new-line characters with spaces
  while (s.indexOf('\n') !== -1) {
    s = s.replace('\n', ' ')
  }
  // replace all double-spaces with single spaces
  while (s.indexOf('  ') !== -1) {
    s = s.replace(/  /g, ' ')
  }

  // cut text into max 100 character lines and remove any persisting whitespace
  const result = s
    .replace(/\s*(?:(\S{100})|([\s\S]{1,100})(?!\S))/g, ($0, $1, $2) => $1 ? $1 + '-\n' : $2 + '\n')
    .split('\n')
    .map(line => line.trim())

  // if the resulting array of lines contains empty string at the end it usually means
  // that the original text was empty. We'll remove that which will leave the result
  // as an empty array
  if (result[result.length - 1] === '') {
    result.pop()
  }

  return result
}

export function nameToClassName(input: string = '') {
  return input
    .replaceAll('_', ' ')
    .replace(/\w\S*/g, m => m.charAt(0).toUpperCase() + m.substr(1).toLowerCase())
    .replaceAll(' ', '') + 'Command'
}

export function labelToIdentifier(input: string) {
  return input
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
}

export function calculateCommonPrefix(entry: {
  values: {
    source: {
      name: string
    }
  }[]
  source: {
    name: string
  }
}) {
  let commonPrefix = entry.values
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
  while (!commonPrefix.endsWith('_') && commonPrefix.length > 0) {
    commonPrefix = commonPrefix.substr(0, commonPrefix.length - 1)
  }

  // if the common prefix is contains parts of the value revert to source enum name
  if (commonPrefix.startsWith(entry.source.name) && commonPrefix.length > entry.source.name.length + 1) {
    commonPrefix = entry.source.name + '_'
  }

  // if the common prefix is empty revert to source enum name
  if (commonPrefix === '') {
    commonPrefix = entry.source.name + '_'
  }

  return commonPrefix
}

export function makeEnumFieldType(fieldType: string, enumName: string) {
  if (fieldType.includes('[')) {
    return `${enumName}[]`
  } else {
    return enumName
  }
}

/**
 * Compute max length of value name for later padding values
 */
export function calculateMaxEnumValueNameLength(enums: { values: { name: string }[] }[]) {
  return enums.reduce((acc, entry) => {
    const maxLength = entry.values.reduce((acc, value) => Math.max(acc, value.name.length), 0)
    return Math.max(acc, maxLength)
  }, 0)
}
