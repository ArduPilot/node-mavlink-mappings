export const snakeToCamel = s => s.replace(/([-_]\w)/g, g => g[1].toUpperCase())

export const snakeToPascal = s => {
  const camelCase = snakeToCamel(s)
  return camelCase[0].toUpperCase() + camelCase.substr(1)
}

export function makeClassName(message: string) {
  return snakeToPascal(message.toLowerCase())
}

export function extractArrayType(type: string) {
  if (type.indexOf('[') > -1) {
    return type.replace(/(.*)\[(\d+)\]/, (x, t, size) => `${t}[]`)
  } else {
    return type
  }
}

export function extractArrayItemType(type: string) {
  if (type.indexOf('[') > -1) {
    return type.replace(/(.*)\[(\d+)\]/, (x, t, size) => `${t}`)
  } else {
    return type
  }
}

export function extractArraySize(type: string) {
  if (type.indexOf('[') > -1) {
    return parseInt(type.replace(/(.*)\[(\d+)\]/, (x, t, size) => size))
  } else {
    return undefined
  }
}

export function getTypeSize(type) {
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
