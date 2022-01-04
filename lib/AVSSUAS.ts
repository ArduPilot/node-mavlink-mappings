import {
  uint8_t,
  uint16_t,
  uint32_t,
} from './types'

import {
  MavLinkPacketField,
  MavLinkData
} from './mavlink'

/**
 * MAV_CMD
 */
export enum MavCmd {
  'PRS_SET_ARM'         = 60050,
  'PRS_GET_ARM'         = 60051,
  'PRS_GET_BATTERY'     = 60052,
  'PRS_GET_ERR'         = 60053,
  'PRS_SET_ARM_ALTI'    = 60070,
  'PRS_GET_ARM_ALTI'    = 60071,
  'PRS_SHUTDOWN'        = 60072,
  'PRS_SET_CHARGE_MV'   = 60073,
  'PRS_GET_CHARGE_MV'   = 60074,
  'PRS_SET_TIMEOUT'     = 60075,
  'PRS_GET_TIMEOUT'     = 60076,
  'PRS_SET_FTS_CONNECT' = 60077,
  'PRS_GET_FTS_CONNECT' = 60078,
}

/**
 * MAV_AVSS_COMMAND_FAILURE_REASON
 */
export enum MavAvssCommandFailureReason {
  'NOT_STEADY'          = 1,
  'DTM_NOT_ARMED'       = 2,
  'OTM_NOT_ARMED'       = 3,
}

/**
 * AVSS PRS system status.
 */
export class AvssPrsSysStatus extends MavLinkData {
  static MSG_ID = 60050
  static MSG_NAME = 'AVSS_PRS_SYS_STATUS'
  static PAYLOAD_LENGTH = 12
  static MAGIC_NUMBER = 153

  static FIELDS = [
    new MavLinkPacketField('errorStatus', 0, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('timeBootMs', 4, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('batteryStatus', 8, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('armStatus', 10, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('changeStatus', 11, false, 1, 'uint8_t', ''),
  ]

  /**
   * PRS arm statuses
   */
  armStatus: uint8_t
  /**
   * Estimated battery run-time without a remote connection and PRS battery voltage
   */
  batteryStatus: uint16_t
  /**
   * PRS error statuses
   */
  errorStatus: uint32_t
  /**
   * PRS battery change statuses
   */
  changeStatus: uint8_t
  /**
   * Time since PRS system boot
   */
  timeBootMs: uint32_t
}

export const REGISTRY = {
  60050: AvssPrsSysStatus,
}
