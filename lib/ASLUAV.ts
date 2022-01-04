import {
  uint8_t,
  int16_t,
  uint16_t,
  int32_t,
  uint32_t,
  uint64_t,
  float,
} from './types'

import {
  MavLinkPacketField,
  MavLinkData
} from './mavlink'

import {
  MavFrame,
} from './common'


/**
 * MAV_CMD
 */
export enum MavCmd {
  'RESET_MPPT'       = 40001,
  'PAYLOAD_CONTROL'  = 40002,
}

/**
 * GSM_LINK_TYPE
 */
export enum GsmLinkType {
  'NONE'             = 0,
  'UNKNOWN'          = 1,
  'GSM_LINK_TYPE_2G' = 2,
  'GSM_LINK_TYPE_3G' = 3,
  'GSM_LINK_TYPE_4G' = 4,
}

/**
 * GSM_MODEM_TYPE
 */
export enum GsmModemType {
  'UNKNOWN'          = 0,
  'HUAWEI_E3372'     = 1,
}

/**
 * Message encoding a command with parameters as scaled integers and additional metadata. Scaling
 * depends on the actual command value.
 */
export class CommandIntStamped extends MavLinkData {
  static MSG_ID = 223
  static MSG_NAME = 'COMMAND_INT_STAMPED'
  static PAYLOAD_LENGTH = 47
  static MAGIC_NUMBER = 119

  static FIELDS = [
    new MavLinkPacketField('vehicleTimestamp', 0, false, 8, 'uint64_t', ''),
    new MavLinkPacketField('utcTime', 8, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('param1', 12, false, 4, 'float', ''),
    new MavLinkPacketField('param2', 16, false, 4, 'float', ''),
    new MavLinkPacketField('param3', 20, false, 4, 'float', ''),
    new MavLinkPacketField('param4', 24, false, 4, 'float', ''),
    new MavLinkPacketField('x', 28, false, 4, 'int32_t', ''),
    new MavLinkPacketField('y', 32, false, 4, 'int32_t', ''),
    new MavLinkPacketField('z', 36, false, 4, 'float', ''),
    new MavLinkPacketField('command', 40, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('targetSystem', 42, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('targetComponent', 43, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('frame', 44, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('current', 45, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('autocontinue', 46, false, 1, 'uint8_t', ''),
  ]

  /**
   * UTC time, seconds elapsed since 01.01.1970
   */
  utcTime: uint32_t
  /**
   * Microseconds elapsed since vehicle boot
   */
  vehicleTimestamp: uint64_t
  /**
   * System ID
   */
  targetSystem: uint8_t
  /**
   * Component ID
   */
  targetComponent: uint8_t
  /**
   * The coordinate system of the COMMAND, as defined by MAV_FRAME enum
   */
  frame: MavFrame
  /**
   * The scheduled action for the mission item, as defined by MAV_CMD enum
   */
  command: MavCmd
  /**
   * false:0, true:1
   */
  current: uint8_t
  /**
   * autocontinue to next wp
   */
  autocontinue: uint8_t
  /**
   * PARAM1, see MAV_CMD enum
   */
  param1: float
  /**
   * PARAM2, see MAV_CMD enum
   */
  param2: float
  /**
   * PARAM3, see MAV_CMD enum
   */
  param3: float
  /**
   * PARAM4, see MAV_CMD enum
   */
  param4: float
  /**
   * PARAM5 / local: x position in meters * 1e4, global: latitude in degrees * 10^7
   */
  x: int32_t
  /**
   * PARAM6 / local: y position in meters * 1e4, global: longitude in degrees * 10^7
   */
  y: int32_t
  /**
   * PARAM7 / z position: global: altitude in meters (MSL, WGS84, AGL or relative to home - depending on
   * frame).
   */
  z: float
}

/**
 * Send a command with up to seven parameters to the MAV and additional metadata
 */
export class CommandLongStamped extends MavLinkData {
  static MSG_ID = 224
  static MSG_NAME = 'COMMAND_LONG_STAMPED'
  static PAYLOAD_LENGTH = 45
  static MAGIC_NUMBER = 102

  static FIELDS = [
    new MavLinkPacketField('vehicleTimestamp', 0, false, 8, 'uint64_t', ''),
    new MavLinkPacketField('utcTime', 8, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('param1', 12, false, 4, 'float', ''),
    new MavLinkPacketField('param2', 16, false, 4, 'float', ''),
    new MavLinkPacketField('param3', 20, false, 4, 'float', ''),
    new MavLinkPacketField('param4', 24, false, 4, 'float', ''),
    new MavLinkPacketField('param5', 28, false, 4, 'float', ''),
    new MavLinkPacketField('param6', 32, false, 4, 'float', ''),
    new MavLinkPacketField('param7', 36, false, 4, 'float', ''),
    new MavLinkPacketField('command', 40, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('targetSystem', 42, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('targetComponent', 43, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('confirmation', 44, false, 1, 'uint8_t', ''),
  ]

  /**
   * UTC time, seconds elapsed since 01.01.1970
   */
  utcTime: uint32_t
  /**
   * Microseconds elapsed since vehicle boot
   */
  vehicleTimestamp: uint64_t
  /**
   * System which should execute the command
   */
  targetSystem: uint8_t
  /**
   * Component which should execute the command, 0 for all components
   */
  targetComponent: uint8_t
  /**
   * Command ID, as defined by MAV_CMD enum.
   */
  command: MavCmd
  /**
   * 0: First transmission of this command. 1-255: Confirmation transmissions (e.g. for kill command)
   */
  confirmation: uint8_t
  /**
   * Parameter 1, as defined by MAV_CMD enum.
   */
  param1: float
  /**
   * Parameter 2, as defined by MAV_CMD enum.
   */
  param2: float
  /**
   * Parameter 3, as defined by MAV_CMD enum.
   */
  param3: float
  /**
   * Parameter 4, as defined by MAV_CMD enum.
   */
  param4: float
  /**
   * Parameter 5, as defined by MAV_CMD enum.
   */
  param5: float
  /**
   * Parameter 6, as defined by MAV_CMD enum.
   */
  param6: float
  /**
   * Parameter 7, as defined by MAV_CMD enum.
   */
  param7: float
}

/**
 * Voltage and current sensor data
 */
export class SensPower extends MavLinkData {
  static MSG_ID = 8002
  static MSG_NAME = 'SENS_POWER'
  static PAYLOAD_LENGTH = 16
  static MAGIC_NUMBER = 218

  static FIELDS = [
    new MavLinkPacketField('adc121VspbVolt', 0, false, 4, 'float', 'V'),
    new MavLinkPacketField('adc121CspbAmp', 4, false, 4, 'float', 'A'),
    new MavLinkPacketField('adc121Cs1Amp', 8, false, 4, 'float', 'A'),
    new MavLinkPacketField('adc121Cs2Amp', 12, false, 4, 'float', 'A'),
  ]

  /**
   * Power board voltage sensor reading
   */
  adc121VspbVolt: float
  /**
   * Power board current sensor reading
   */
  adc121CspbAmp: float
  /**
   * Board current sensor 1 reading
   */
  adc121Cs1Amp: float
  /**
   * Board current sensor 2 reading
   */
  adc121Cs2Amp: float
}

/**
 * Maximum Power Point Tracker (MPPT) sensor data for solar module power performance tracking
 */
export class SensMppt extends MavLinkData {
  static MSG_ID = 8003
  static MSG_NAME = 'SENS_MPPT'
  static PAYLOAD_LENGTH = 41
  static MAGIC_NUMBER = 231

  static FIELDS = [
    new MavLinkPacketField('mpptTimestamp', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('mppt1Volt', 8, false, 4, 'float', 'V'),
    new MavLinkPacketField('mppt1Amp', 12, false, 4, 'float', 'A'),
    new MavLinkPacketField('mppt2Volt', 16, false, 4, 'float', 'V'),
    new MavLinkPacketField('mppt2Amp', 20, false, 4, 'float', 'A'),
    new MavLinkPacketField('mppt3Volt', 24, false, 4, 'float', 'V'),
    new MavLinkPacketField('mppt3Amp', 28, false, 4, 'float', 'A'),
    new MavLinkPacketField('mppt1Pwm', 32, false, 2, 'uint16_t', 'us'),
    new MavLinkPacketField('mppt2Pwm', 34, false, 2, 'uint16_t', 'us'),
    new MavLinkPacketField('mppt3Pwm', 36, false, 2, 'uint16_t', 'us'),
    new MavLinkPacketField('mppt1Status', 38, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('mppt2Status', 39, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('mppt3Status', 40, false, 1, 'uint8_t', ''),
  ]

  /**
   * MPPT last timestamp
   */
  mpptTimestamp: uint64_t
  /**
   * MPPT1 voltage
   */
  mppt1Volt: float
  /**
   * MPPT1 current
   */
  mppt1Amp: float
  /**
   * MPPT1 pwm
   */
  mppt1Pwm: uint16_t
  /**
   * MPPT1 status
   */
  mppt1Status: uint8_t
  /**
   * MPPT2 voltage
   */
  mppt2Volt: float
  /**
   * MPPT2 current
   */
  mppt2Amp: float
  /**
   * MPPT2 pwm
   */
  mppt2Pwm: uint16_t
  /**
   * MPPT2 status
   */
  mppt2Status: uint8_t
  /**
   * MPPT3 voltage
   */
  mppt3Volt: float
  /**
   * MPPT3 current
   */
  mppt3Amp: float
  /**
   * MPPT3 pwm
   */
  mppt3Pwm: uint16_t
  /**
   * MPPT3 status
   */
  mppt3Status: uint8_t
}

/**
 * ASL-fixed-wing controller data
 */
export class AslctrlData extends MavLinkData {
  static MSG_ID = 8004
  static MSG_NAME = 'ASLCTRL_DATA'
  static PAYLOAD_LENGTH = 98
  static MAGIC_NUMBER = 172

  static FIELDS = [
    new MavLinkPacketField('timestamp', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('h', 8, false, 4, 'float', ''),
    new MavLinkPacketField('hRef', 12, false, 4, 'float', ''),
    new MavLinkPacketField('hRefT', 16, false, 4, 'float', ''),
    new MavLinkPacketField('PitchAngle', 20, false, 4, 'float', 'deg'),
    new MavLinkPacketField('PitchAngleRef', 24, false, 4, 'float', 'deg'),
    new MavLinkPacketField('q', 28, false, 4, 'float', ''),
    new MavLinkPacketField('qRef', 32, false, 4, 'float', ''),
    new MavLinkPacketField('uElev', 36, false, 4, 'float', ''),
    new MavLinkPacketField('uThrot', 40, false, 4, 'float', ''),
    new MavLinkPacketField('uThrot2', 44, false, 4, 'float', ''),
    new MavLinkPacketField('nZ', 48, false, 4, 'float', ''),
    new MavLinkPacketField('AirspeedRef', 52, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('YawAngle', 56, false, 4, 'float', 'deg'),
    new MavLinkPacketField('YawAngleRef', 60, false, 4, 'float', 'deg'),
    new MavLinkPacketField('RollAngle', 64, false, 4, 'float', 'deg'),
    new MavLinkPacketField('RollAngleRef', 68, false, 4, 'float', 'deg'),
    new MavLinkPacketField('p', 72, false, 4, 'float', ''),
    new MavLinkPacketField('pRef', 76, false, 4, 'float', ''),
    new MavLinkPacketField('r', 80, false, 4, 'float', ''),
    new MavLinkPacketField('rRef', 84, false, 4, 'float', ''),
    new MavLinkPacketField('uAil', 88, false, 4, 'float', ''),
    new MavLinkPacketField('uRud', 92, false, 4, 'float', ''),
    new MavLinkPacketField('aslctrlMode', 96, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('SpoilersEngaged', 97, false, 1, 'uint8_t', ''),
  ]

  /**
   * Timestamp
   */
  timestamp: uint64_t
  /**
   * ASLCTRL control-mode (manual, stabilized, auto, etc...)
   */
  aslctrlMode: uint8_t
  /**
   * See sourcecode for a description of these values...
   */
  h: float
  hRef: float
  hRefT: float
  /**
   * Pitch angle
   */
  PitchAngle: float
  /**
   * Pitch angle reference
   */
  PitchAngleRef: float
  q: float
  qRef: float
  uElev: float
  uThrot: float
  uThrot2: float
  nZ: float
  /**
   * Airspeed reference
   */
  AirspeedRef: float
  SpoilersEngaged: uint8_t
  /**
   * Yaw angle
   */
  YawAngle: float
  /**
   * Yaw angle reference
   */
  YawAngleRef: float
  /**
   * Roll angle
   */
  RollAngle: float
  /**
   * Roll angle reference
   */
  RollAngleRef: float
  p: float
  pRef: float
  r: float
  rRef: float
  uAil: float
  uRud: float
}

/**
 * ASL-fixed-wing controller debug data
 */
export class AslctrlDebug extends MavLinkData {
  static MSG_ID = 8005
  static MSG_NAME = 'ASLCTRL_DEBUG'
  static PAYLOAD_LENGTH = 38
  static MAGIC_NUMBER = 251

  static FIELDS = [
    new MavLinkPacketField('i321', 0, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('f1', 4, false, 4, 'float', ''),
    new MavLinkPacketField('f2', 8, false, 4, 'float', ''),
    new MavLinkPacketField('f3', 12, false, 4, 'float', ''),
    new MavLinkPacketField('f4', 16, false, 4, 'float', ''),
    new MavLinkPacketField('f5', 20, false, 4, 'float', ''),
    new MavLinkPacketField('f6', 24, false, 4, 'float', ''),
    new MavLinkPacketField('f7', 28, false, 4, 'float', ''),
    new MavLinkPacketField('f8', 32, false, 4, 'float', ''),
    new MavLinkPacketField('i81', 36, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('i82', 37, false, 1, 'uint8_t', ''),
  ]

  /**
   * Debug data
   */
  i321: uint32_t
  /**
   * Debug data
   */
  i81: uint8_t
  /**
   * Debug data
   */
  i82: uint8_t
  /**
   * Debug data
   */
  f1: float
  /**
   * Debug data
   */
  f2: float
  /**
   * Debug data
   */
  f3: float
  /**
   * Debug data
   */
  f4: float
  /**
   * Debug data
   */
  f5: float
  /**
   * Debug data
   */
  f6: float
  /**
   * Debug data
   */
  f7: float
  /**
   * Debug data
   */
  f8: float
}

/**
 * Extended state information for ASLUAVs
 */
export class AsluavStatus extends MavLinkData {
  static MSG_ID = 8006
  static MSG_NAME = 'ASLUAV_STATUS'
  static PAYLOAD_LENGTH = 14
  static MAGIC_NUMBER = 97

  static FIELDS = [
    new MavLinkPacketField('MotorRpm', 0, false, 4, 'float', ''),
    new MavLinkPacketField('LEDStatus', 4, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('SATCOMStatus', 5, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('ServoStatus', 6, false, 1, 'uint8_t[]', '', 8),
  ]

  /**
   * Status of the position-indicator LEDs
   */
  LEDStatus: uint8_t
  /**
   * Status of the IRIDIUM satellite communication system
   */
  SATCOMStatus: uint8_t
  /**
   * Status vector for up to 8 servos
   */
  ServoStatus: uint8_t[]
  /**
   * Motor RPM
   */
  MotorRpm: float
}

/**
 * Extended EKF state estimates for ASLUAVs
 */
export class EkfExt extends MavLinkData {
  static MSG_ID = 8007
  static MSG_NAME = 'EKF_EXT'
  static PAYLOAD_LENGTH = 32
  static MAGIC_NUMBER = 64

  static FIELDS = [
    new MavLinkPacketField('timestamp', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('Windspeed', 8, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('WindDir', 12, false, 4, 'float', 'rad'),
    new MavLinkPacketField('WindZ', 16, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('Airspeed', 20, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('beta', 24, false, 4, 'float', 'rad'),
    new MavLinkPacketField('alpha', 28, false, 4, 'float', 'rad'),
  ]

  /**
   * Time since system start
   */
  timestamp: uint64_t
  /**
   * Magnitude of wind velocity (in lateral inertial plane)
   */
  Windspeed: float
  /**
   * Wind heading angle from North
   */
  WindDir: float
  /**
   * Z (Down) component of inertial wind velocity
   */
  WindZ: float
  /**
   * Magnitude of air velocity
   */
  Airspeed: float
  /**
   * Sideslip angle
   */
  beta: float
  /**
   * Angle of attack
   */
  alpha: float
}

/**
 * Off-board controls/commands for ASLUAVs
 */
export class AslObctrl extends MavLinkData {
  static MSG_ID = 8008
  static MSG_NAME = 'ASL_OBCTRL'
  static PAYLOAD_LENGTH = 33
  static MAGIC_NUMBER = 234

  static FIELDS = [
    new MavLinkPacketField('timestamp', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('uElev', 8, false, 4, 'float', ''),
    new MavLinkPacketField('uThrot', 12, false, 4, 'float', ''),
    new MavLinkPacketField('uThrot2', 16, false, 4, 'float', ''),
    new MavLinkPacketField('uAilL', 20, false, 4, 'float', ''),
    new MavLinkPacketField('uAilR', 24, false, 4, 'float', ''),
    new MavLinkPacketField('uRud', 28, false, 4, 'float', ''),
    new MavLinkPacketField('obctrlStatus', 32, false, 1, 'uint8_t', ''),
  ]

  /**
   * Time since system start
   */
  timestamp: uint64_t
  /**
   * Elevator command [~]
   */
  uElev: float
  /**
   * Throttle command [~]
   */
  uThrot: float
  /**
   * Throttle 2 command [~]
   */
  uThrot2: float
  /**
   * Left aileron command [~]
   */
  uAilL: float
  /**
   * Right aileron command [~]
   */
  uAilR: float
  /**
   * Rudder command [~]
   */
  uRud: float
  /**
   * Off-board computer status
   */
  obctrlStatus: uint8_t
}

/**
 * Atmospheric sensors (temperature, humidity, ...)
 */
export class SensAtmos extends MavLinkData {
  static MSG_ID = 8009
  static MSG_NAME = 'SENS_ATMOS'
  static PAYLOAD_LENGTH = 16
  static MAGIC_NUMBER = 144

  static FIELDS = [
    new MavLinkPacketField('timestamp', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('TempAmbient', 8, false, 4, 'float', 'degC'),
    new MavLinkPacketField('Humidity', 12, false, 4, 'float', '%'),
  ]

  /**
   * Time since system boot
   */
  timestamp: uint64_t
  /**
   * Ambient temperature
   */
  TempAmbient: float
  /**
   * Relative humidity
   */
  Humidity: float
}

/**
 * Battery pack monitoring data for Li-Ion batteries
 */
export class SensBatmon extends MavLinkData {
  static MSG_ID = 8010
  static MSG_NAME = 'SENS_BATMON'
  static PAYLOAD_LENGTH = 41
  static MAGIC_NUMBER = 155

  static FIELDS = [
    new MavLinkPacketField('batmonTimestamp', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('temperature', 8, false, 4, 'float', 'degC'),
    new MavLinkPacketField('safetystatus', 12, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('operationstatus', 16, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('voltage', 20, false, 2, 'uint16_t', 'mV'),
    new MavLinkPacketField('current', 22, false, 2, 'int16_t', 'mA'),
    new MavLinkPacketField('batterystatus', 24, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('serialnumber', 26, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('cellvoltage1', 28, false, 2, 'uint16_t', 'mV'),
    new MavLinkPacketField('cellvoltage2', 30, false, 2, 'uint16_t', 'mV'),
    new MavLinkPacketField('cellvoltage3', 32, false, 2, 'uint16_t', 'mV'),
    new MavLinkPacketField('cellvoltage4', 34, false, 2, 'uint16_t', 'mV'),
    new MavLinkPacketField('cellvoltage5', 36, false, 2, 'uint16_t', 'mV'),
    new MavLinkPacketField('cellvoltage6', 38, false, 2, 'uint16_t', 'mV'),
    new MavLinkPacketField('SoC', 40, false, 1, 'uint8_t', ''),
  ]

  /**
   * Time since system start
   */
  batmonTimestamp: uint64_t
  /**
   * Battery pack temperature
   */
  temperature: float
  /**
   * Battery pack voltage
   */
  voltage: uint16_t
  /**
   * Battery pack current
   */
  current: int16_t
  /**
   * Battery pack state-of-charge
   */
  SoC: uint8_t
  /**
   * Battery monitor status report bits in Hex
   */
  batterystatus: uint16_t
  /**
   * Battery monitor serial number in Hex
   */
  serialnumber: uint16_t
  /**
   * Battery monitor safetystatus report bits in Hex
   */
  safetystatus: uint32_t
  /**
   * Battery monitor operation status report bits in Hex
   */
  operationstatus: uint32_t
  /**
   * Battery pack cell 1 voltage
   */
  cellvoltage1: uint16_t
  /**
   * Battery pack cell 2 voltage
   */
  cellvoltage2: uint16_t
  /**
   * Battery pack cell 3 voltage
   */
  cellvoltage3: uint16_t
  /**
   * Battery pack cell 4 voltage
   */
  cellvoltage4: uint16_t
  /**
   * Battery pack cell 5 voltage
   */
  cellvoltage5: uint16_t
  /**
   * Battery pack cell 6 voltage
   */
  cellvoltage6: uint16_t
}

/**
 * Fixed-wing soaring (i.e. thermal seeking) data
 */
export class FwSoaringData extends MavLinkData {
  static MSG_ID = 8011
  static MSG_NAME = 'FW_SOARING_DATA'
  static PAYLOAD_LENGTH = 102
  static MAGIC_NUMBER = 20

  static FIELDS = [
    new MavLinkPacketField('timestamp', 0, false, 8, 'uint64_t', 'ms'),
    new MavLinkPacketField('timestampModeChanged', 8, false, 8, 'uint64_t', 'ms'),
    new MavLinkPacketField('xW', 16, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('xR', 20, false, 4, 'float', 'm'),
    new MavLinkPacketField('xLat', 24, false, 4, 'float', 'deg'),
    new MavLinkPacketField('xLon', 28, false, 4, 'float', 'deg'),
    new MavLinkPacketField('VarW', 32, false, 4, 'float', ''),
    new MavLinkPacketField('VarR', 36, false, 4, 'float', ''),
    new MavLinkPacketField('VarLat', 40, false, 4, 'float', ''),
    new MavLinkPacketField('VarLon', 44, false, 4, 'float', ''),
    new MavLinkPacketField('LoiterRadius', 48, false, 4, 'float', 'm'),
    new MavLinkPacketField('LoiterDirection', 52, false, 4, 'float', ''),
    new MavLinkPacketField('DistToSoarPoint', 56, false, 4, 'float', 'm'),
    new MavLinkPacketField('vSinkExp', 60, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('z1LocalUpdraftSpeed', 64, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('z2DeltaRoll', 68, false, 4, 'float', 'deg'),
    new MavLinkPacketField('z1Exp', 72, false, 4, 'float', ''),
    new MavLinkPacketField('z2Exp', 76, false, 4, 'float', ''),
    new MavLinkPacketField('ThermalGSNorth', 80, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('ThermalGSEast', 84, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('TSEDot', 88, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('DebugVar1', 92, false, 4, 'float', ''),
    new MavLinkPacketField('DebugVar2', 96, false, 4, 'float', ''),
    new MavLinkPacketField('ControlMode', 100, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('valid', 101, false, 1, 'uint8_t', ''),
  ]

  /**
   * Timestamp
   */
  timestamp: uint64_t
  /**
   * Timestamp since last mode change
   */
  timestampModeChanged: uint64_t
  /**
   * Thermal core updraft strength
   */
  xW: float
  /**
   * Thermal radius
   */
  xR: float
  /**
   * Thermal center latitude
   */
  xLat: float
  /**
   * Thermal center longitude
   */
  xLon: float
  /**
   * Variance W
   */
  VarW: float
  /**
   * Variance R
   */
  VarR: float
  /**
   * Variance Lat
   */
  VarLat: float
  /**
   * Variance Lon
   */
  VarLon: float
  /**
   * Suggested loiter radius
   */
  LoiterRadius: float
  /**
   * Suggested loiter direction
   */
  LoiterDirection: float
  /**
   * Distance to soar point
   */
  DistToSoarPoint: float
  /**
   * Expected sink rate at current airspeed, roll and throttle
   */
  vSinkExp: float
  /**
   * Measurement / updraft speed at current/local airplane position
   */
  z1LocalUpdraftSpeed: float
  /**
   * Measurement / roll angle tracking error
   */
  z2DeltaRoll: float
  /**
   * Expected measurement 1
   */
  z1Exp: float
  /**
   * Expected measurement 2
   */
  z2Exp: float
  /**
   * Thermal drift (from estimator prediction step only)
   */
  ThermalGSNorth: float
  /**
   * Thermal drift (from estimator prediction step only)
   */
  ThermalGSEast: float
  /**
   * Total specific energy change (filtered)
   */
  TSEDot: float
  /**
   * Debug variable 1
   */
  DebugVar1: float
  /**
   * Debug variable 2
   */
  DebugVar2: float
  /**
   * Control Mode [-]
   */
  ControlMode: uint8_t
  /**
   * Data valid [-]
   */
  valid: uint8_t
}

/**
 * Monitoring of sensorpod status
 */
export class SensorpodStatus extends MavLinkData {
  static MSG_ID = 8012
  static MSG_NAME = 'SENSORPOD_STATUS'
  static PAYLOAD_LENGTH = 16
  static MAGIC_NUMBER = 54

  static FIELDS = [
    new MavLinkPacketField('timestamp', 0, false, 8, 'uint64_t', 'ms'),
    new MavLinkPacketField('freeSpace', 8, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('visensorRate1', 10, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('visensorRate2', 11, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('visensorRate3', 12, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('visensorRate4', 13, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('recordingNodesCount', 14, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('cpuTemp', 15, false, 1, 'uint8_t', 'degC'),
  ]

  /**
   * Timestamp in linuxtime (since 1.1.1970)
   */
  timestamp: uint64_t
  /**
   * Rate of ROS topic 1
   */
  visensorRate1: uint8_t
  /**
   * Rate of ROS topic 2
   */
  visensorRate2: uint8_t
  /**
   * Rate of ROS topic 3
   */
  visensorRate3: uint8_t
  /**
   * Rate of ROS topic 4
   */
  visensorRate4: uint8_t
  /**
   * Number of recording nodes
   */
  recordingNodesCount: uint8_t
  /**
   * Temperature of sensorpod CPU in
   */
  cpuTemp: uint8_t
  /**
   * Free space available in recordings directory in [Gb] * 1e2
   */
  freeSpace: uint16_t
}

/**
 * Monitoring of power board status
 */
export class SensPowerBoard extends MavLinkData {
  static MSG_ID = 8013
  static MSG_NAME = 'SENS_POWER_BOARD'
  static PAYLOAD_LENGTH = 46
  static MAGIC_NUMBER = 222

  static FIELDS = [
    new MavLinkPacketField('timestamp', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('pwrBrdSystemVolt', 8, false, 4, 'float', 'V'),
    new MavLinkPacketField('pwrBrdServoVolt', 12, false, 4, 'float', 'V'),
    new MavLinkPacketField('pwrBrdDigitalVolt', 16, false, 4, 'float', 'V'),
    new MavLinkPacketField('pwrBrdMotLAmp', 20, false, 4, 'float', 'A'),
    new MavLinkPacketField('pwrBrdMotRAmp', 24, false, 4, 'float', 'A'),
    new MavLinkPacketField('pwrBrdAnalogAmp', 28, false, 4, 'float', 'A'),
    new MavLinkPacketField('pwrBrdDigitalAmp', 32, false, 4, 'float', 'A'),
    new MavLinkPacketField('pwrBrdExtAmp', 36, false, 4, 'float', 'A'),
    new MavLinkPacketField('pwrBrdAuxAmp', 40, false, 4, 'float', 'A'),
    new MavLinkPacketField('pwrBrdStatus', 44, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('pwrBrdLedStatus', 45, false, 1, 'uint8_t', ''),
  ]

  /**
   * Timestamp
   */
  timestamp: uint64_t
  /**
   * Power board status register
   */
  pwrBrdStatus: uint8_t
  /**
   * Power board leds status
   */
  pwrBrdLedStatus: uint8_t
  /**
   * Power board system voltage
   */
  pwrBrdSystemVolt: float
  /**
   * Power board servo voltage
   */
  pwrBrdServoVolt: float
  /**
   * Power board digital voltage
   */
  pwrBrdDigitalVolt: float
  /**
   * Power board left motor current sensor
   */
  pwrBrdMotLAmp: float
  /**
   * Power board right motor current sensor
   */
  pwrBrdMotRAmp: float
  /**
   * Power board analog current sensor
   */
  pwrBrdAnalogAmp: float
  /**
   * Power board digital current sensor
   */
  pwrBrdDigitalAmp: float
  /**
   * Power board extension current sensor
   */
  pwrBrdExtAmp: float
  /**
   * Power board aux current sensor
   */
  pwrBrdAuxAmp: float
}

/**
 * Status of GSM modem (connected to onboard computer)
 */
export class GsmLinkStatus extends MavLinkData {
  static MSG_ID = 8014
  static MSG_NAME = 'GSM_LINK_STATUS'
  static PAYLOAD_LENGTH = 14
  static MAGIC_NUMBER = 200

  static FIELDS = [
    new MavLinkPacketField('timestamp', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('gsmModemType', 8, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('gsmLinkType', 9, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('rssi', 10, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('rsrpRscp', 11, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sinrEcio', 12, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('rsrq', 13, false, 1, 'uint8_t', ''),
  ]

  /**
   * Timestamp (of OBC)
   */
  timestamp: uint64_t
  /**
   * GSM modem used
   */
  gsmModemType: GsmModemType
  /**
   * GSM link type
   */
  gsmLinkType: GsmLinkType
  /**
   * RSSI as reported by modem (unconverted)
   */
  rssi: uint8_t
  /**
   * RSRP (LTE) or RSCP (WCDMA) as reported by modem (unconverted)
   */
  rsrpRscp: uint8_t
  /**
   * SINR (LTE) or ECIO (WCDMA) as reported by modem (unconverted)
   */
  sinrEcio: uint8_t
  /**
   * RSRQ (LTE only) as reported by modem (unconverted)
   */
  rsrq: uint8_t
}

/**
 * Status of the SatCom link
 */
export class SatcomLinkStatus extends MavLinkData {
  static MSG_ID = 8015
  static MSG_NAME = 'SATCOM_LINK_STATUS'
  static PAYLOAD_LENGTH = 24
  static MAGIC_NUMBER = 23

  static FIELDS = [
    new MavLinkPacketField('timestamp', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('lastHeartbeat', 8, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('failedSessions', 16, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('successfulSessions', 18, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('signalQuality', 20, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('ringPending', 21, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('txSessionPending', 22, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('rxSessionPending', 23, false, 1, 'uint8_t', ''),
  ]

  /**
   * Timestamp
   */
  timestamp: uint64_t
  /**
   * Timestamp of the last successful sbd session
   */
  lastHeartbeat: uint64_t
  /**
   * Number of failed sessions
   */
  failedSessions: uint16_t
  /**
   * Number of successful sessions
   */
  successfulSessions: uint16_t
  /**
   * Signal quality
   */
  signalQuality: uint8_t
  /**
   * Ring call pending
   */
  ringPending: uint8_t
  /**
   * Transmission session pending
   */
  txSessionPending: uint8_t
  /**
   * Receiving session pending
   */
  rxSessionPending: uint8_t
}

/**
 * Calibrated airflow angle measurements
 */
export class SensorAirflowAngles extends MavLinkData {
  static MSG_ID = 8016
  static MSG_NAME = 'SENSOR_AIRFLOW_ANGLES'
  static PAYLOAD_LENGTH = 18
  static MAGIC_NUMBER = 149

  static FIELDS = [
    new MavLinkPacketField('timestamp', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('angleofattack', 8, false, 4, 'float', 'deg'),
    new MavLinkPacketField('sideslip', 12, false, 4, 'float', 'deg'),
    new MavLinkPacketField('angleofattackValid', 16, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sideslipValid', 17, false, 1, 'uint8_t', ''),
  ]

  /**
   * Timestamp
   */
  timestamp: uint64_t
  /**
   * Angle of attack
   */
  angleofattack: float
  /**
   * Angle of attack measurement valid
   */
  angleofattackValid: uint8_t
  /**
   * Sideslip angle
   */
  sideslip: float
  /**
   * Sideslip angle measurement valid
   */
  sideslipValid: uint8_t
}

export const REGISTRY = {
  223: CommandIntStamped,
  224: CommandLongStamped,
  8002: SensPower,
  8003: SensMppt,
  8004: AslctrlData,
  8005: AslctrlDebug,
  8006: AsluavStatus,
  8007: EkfExt,
  8008: AslObctrl,
  8009: SensAtmos,
  8010: SensBatmon,
  8011: FwSoaringData,
  8012: SensorpodStatus,
  8013: SensPowerBoard,
  8014: GsmLinkStatus,
  8015: SatcomLinkStatus,
  8016: SensorAirflowAngles,
}
