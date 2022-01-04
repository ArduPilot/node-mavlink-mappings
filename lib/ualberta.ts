import {
  uint8_t,
  uint16_t,
  uint64_t,
  float,
} from './types'

import {
  MavLinkPacketField,
  MavLinkData
} from './mavlink'

/**
 * Available autopilot modes for ualberta uav
 */
export enum UalbertaAutopilotMode {
  'MANUAL_DIRECT' = 1,
  'MANUAL_SCALED' = 2,
  'AUTO_PID_ATT'  = 3,
  'AUTO_PID_VEL'  = 4,
  'AUTO_PID_POS'  = 5,
}

/**
 * Navigation filter mode
 */
export enum UalbertaNavMode {
  'AHRS_INIT'     = 1,
  'AHRS'          = 2,
  'INS_GPS_INIT'  = 3,
  'INS_GPS'       = 4,
}

/**
 * Mode currently commanded by pilot
 */
export enum UalbertaPilotMode {
  'MANUAL'        = 1,
  'AUTO'          = 2,
  'ROTO'          = 3,
}

/**
 * Accelerometer and Gyro biases from the navigation filter
 */
export class NavFilterBias extends MavLinkData {
  static MSG_ID = 220
  static MSG_NAME = 'NAV_FILTER_BIAS'
  static PAYLOAD_LENGTH = 32
  static MAGIC_NUMBER = 34

  static FIELDS = [
    new MavLinkPacketField('usec', 0, false, 8, 'uint64_t', ''),
    new MavLinkPacketField('accel0', 8, false, 4, 'float', ''),
    new MavLinkPacketField('accel1', 12, false, 4, 'float', ''),
    new MavLinkPacketField('accel2', 16, false, 4, 'float', ''),
    new MavLinkPacketField('gyro0', 20, false, 4, 'float', ''),
    new MavLinkPacketField('gyro1', 24, false, 4, 'float', ''),
    new MavLinkPacketField('gyro2', 28, false, 4, 'float', ''),
  ]

  /**
   * Timestamp (microseconds)
   */
  usec: uint64_t
  /**
   * b_f[0]
   */
  accel0: float
  /**
   * b_f[1]
   */
  accel1: float
  /**
   * b_f[2]
   */
  accel2: float
  /**
   * b_f[0]
   */
  gyro0: float
  /**
   * b_f[1]
   */
  gyro1: float
  /**
   * b_f[2]
   */
  gyro2: float
}

/**
 * Complete set of calibration parameters for the radio
 */
export class RadioCalibration extends MavLinkData {
  static MSG_ID = 221
  static MSG_NAME = 'RADIO_CALIBRATION'
  static PAYLOAD_LENGTH = 42
  static MAGIC_NUMBER = 71

  static FIELDS = [
    new MavLinkPacketField('aileron', 0, false, 2, 'uint16_t[]', '', 3),
    new MavLinkPacketField('elevator', 6, false, 2, 'uint16_t[]', '', 3),
    new MavLinkPacketField('rudder', 12, false, 2, 'uint16_t[]', '', 3),
    new MavLinkPacketField('gyro', 18, false, 2, 'uint16_t[]', '', 2),
    new MavLinkPacketField('pitch', 22, false, 2, 'uint16_t[]', '', 5),
    new MavLinkPacketField('throttle', 32, false, 2, 'uint16_t[]', '', 5),
  ]

  /**
   * Aileron setpoints: left, center, right
   */
  aileron: uint16_t[]
  /**
   * Elevator setpoints: nose down, center, nose up
   */
  elevator: uint16_t[]
  /**
   * Rudder setpoints: nose left, center, nose right
   */
  rudder: uint16_t[]
  /**
   * Tail gyro mode/gain setpoints: heading hold, rate mode
   */
  gyro: uint16_t[]
  /**
   * Pitch curve setpoints (every 25%)
   */
  pitch: uint16_t[]
  /**
   * Throttle curve setpoints (every 25%)
   */
  throttle: uint16_t[]
}

/**
 * System status specific to ualberta uav
 */
export class UalbertaSysStatus extends MavLinkData {
  static MSG_ID = 222
  static MSG_NAME = 'UALBERTA_SYS_STATUS'
  static PAYLOAD_LENGTH = 3
  static MAGIC_NUMBER = 15

  static FIELDS = [
    new MavLinkPacketField('mode', 0, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('navMode', 1, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('pilot', 2, false, 1, 'uint8_t', ''),
  ]

  /**
   * System mode, see UALBERTA_AUTOPILOT_MODE ENUM
   */
  mode: uint8_t
  /**
   * Navigation mode, see UALBERTA_NAV_MODE ENUM
   */
  navMode: uint8_t
  /**
   * Pilot mode, see UALBERTA_PILOT_MODE
   */
  pilot: uint8_t
}

export const REGISTRY = {
  220: NavFilterBias,
  221: RadioCalibration,
  222: UalbertaSysStatus,
}
