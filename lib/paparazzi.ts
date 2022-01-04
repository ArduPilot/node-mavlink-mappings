import {
  uint8_t,
  uint16_t
} from './types'

import {
  MavLinkPacketField,
  MavLinkData
} from './mavlink'

/**
 * Message encoding a mission script item. This message is emitted upon a request for the next script
 * item.
 */
export class ScriptItem extends MavLinkData {
  static MSG_ID = 180
  static MSG_NAME = 'SCRIPT_ITEM'
  static PAYLOAD_LENGTH = 54
  static MAGIC_NUMBER = 231

  static FIELDS = [
    new MavLinkPacketField('seq', 0, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('targetSystem', 2, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('targetComponent', 3, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('name', 4, false, 1, 'char[]', '', 50),
  ]

  /**
   * System ID
   */
  targetSystem: uint8_t
  /**
   * Component ID
   */
  targetComponent: uint8_t
  /**
   * Sequence
   */
  seq: uint16_t
  /**
   * The name of the mission script, NULL terminated.
   */
  name: string
}

/**
 * Request script item with the sequence number seq. The response of the system to this message should
 * be a SCRIPT_ITEM message.
 */
export class ScriptRequest extends MavLinkData {
  static MSG_ID = 181
  static MSG_NAME = 'SCRIPT_REQUEST'
  static PAYLOAD_LENGTH = 4
  static MAGIC_NUMBER = 129

  static FIELDS = [
    new MavLinkPacketField('seq', 0, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('targetSystem', 2, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('targetComponent', 3, false, 1, 'uint8_t', ''),
  ]

  /**
   * System ID
   */
  targetSystem: uint8_t
  /**
   * Component ID
   */
  targetComponent: uint8_t
  /**
   * Sequence
   */
  seq: uint16_t
}

/**
 * Request the overall list of mission items from the system/component.
 */
export class ScriptRequestList extends MavLinkData {
  static MSG_ID = 182
  static MSG_NAME = 'SCRIPT_REQUEST_LIST'
  static PAYLOAD_LENGTH = 2
  static MAGIC_NUMBER = 115

  static FIELDS = [
    new MavLinkPacketField('targetSystem', 0, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('targetComponent', 1, false, 1, 'uint8_t', ''),
  ]

  /**
   * System ID
   */
  targetSystem: uint8_t
  /**
   * Component ID
   */
  targetComponent: uint8_t
}

/**
 * This message is emitted as response to SCRIPT_REQUEST_LIST by the MAV to get the number of mission
 * scripts.
 */
export class ScriptCount extends MavLinkData {
  static MSG_ID = 183
  static MSG_NAME = 'SCRIPT_COUNT'
  static PAYLOAD_LENGTH = 4
  static MAGIC_NUMBER = 186

  static FIELDS = [
    new MavLinkPacketField('count', 0, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('targetSystem', 2, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('targetComponent', 3, false, 1, 'uint8_t', ''),
  ]

  /**
   * System ID
   */
  targetSystem: uint8_t
  /**
   * Component ID
   */
  targetComponent: uint8_t
  /**
   * Number of script items in the sequence
   */
  count: uint16_t
}

/**
 * This message informs about the currently active SCRIPT.
 */
export class ScriptCurrent extends MavLinkData {
  static MSG_ID = 184
  static MSG_NAME = 'SCRIPT_CURRENT'
  static PAYLOAD_LENGTH = 2
  static MAGIC_NUMBER = 40

  static FIELDS = [
    new MavLinkPacketField('seq', 0, false, 2, 'uint16_t', ''),
  ]

  /**
   * Active Sequence
   */
  seq: uint16_t
}

export const REGISTRY = {
  180: ScriptItem,
  181: ScriptRequest,
  182: ScriptRequestList,
  183: ScriptCount,
  184: ScriptCurrent,
}
