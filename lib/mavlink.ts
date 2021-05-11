import { uint8_t, uint16_t } from './types'
import { x25crc, dump } from './utils'
import { MSG_ID_MAGIC_NUMBER } from './magic-numbers'

/**
 * Field definition
 */
export class MavLinkPacketField {
  readonly name: string
  readonly type: string
  readonly length: number
  readonly offset: number
  readonly extension: boolean
  readonly size: number

  /**
   * @param name name of the field
   * @param offset field offset in the payload
   * @param extension true if it is an extension field, false otherwise
   * @param size size of either the field or the size of an element in the array if it is an array field
   * @param type type of the field (ends with [] if it is an array field)
   * @param length for array fields this is the length of the array
   */
  constructor(name, offset, extension, size, type, length = 0) {
    this.name = name
    this.offset = offset
    this.type = type
    this.length = length
    this.extension = extension
    this.size = size
  }
}

/**
 * Base class for all data classes
 */
export abstract class MavLinkData {
  // static fields overriden by descendants of MavLinkData
  static MSG_ID: number = -1
  static MSG_NAME: string = ''
  static PAYLOAD_LENGTH: number = 0
  static MAGIC_NUMBER: number = 0
  static FIELDS: MavLinkPacketField[] = []
}

/**
 * Interface describing static fields of a data classes
 */
interface MavLinkDataConstructor<T extends MavLinkData> {
  // static fields overriden by descendants of MavLinkData
  MSG_ID: number
  MSG_NAME: string
  PAYLOAD_LENGTH: number
  MAGIC_NUMBER: number
  FIELDS: MavLinkPacketField[]

  new (): T
}
