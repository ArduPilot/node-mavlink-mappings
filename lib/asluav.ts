import {
  float,
  int16_t,
  int32_t,
  uint8_t,
  uint16_t,
  uint32_t,
  uint64_t
} from './types'

import {
  MavLinkPacketRegistry,
  MavLinkPacketField,
  MavLinkData
} from './mavlink'

import {
  MavFrame
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
    new MavLinkPacketField('vehicle_timestamp', 'vehicleTimestamp', 0, false, 8, 'uint64_t', ''),
    new MavLinkPacketField('utc_time', 'utcTime', 8, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('param1', 'param1', 12, false, 4, 'float', ''),
    new MavLinkPacketField('param2', 'param2', 16, false, 4, 'float', ''),
    new MavLinkPacketField('param3', 'param3', 20, false, 4, 'float', ''),
    new MavLinkPacketField('param4', 'param4', 24, false, 4, 'float', ''),
    new MavLinkPacketField('x', 'x', 28, false, 4, 'int32_t', ''),
    new MavLinkPacketField('y', 'y', 32, false, 4, 'int32_t', ''),
    new MavLinkPacketField('z', 'z', 36, false, 4, 'float', ''),
    new MavLinkPacketField('command', 'command', 40, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('target_system', 'targetSystem', 42, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 43, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('frame', 'frame', 44, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('current', 'current', 45, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('autocontinue', 'autocontinue', 46, false, 1, 'uint8_t', ''),
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
    new MavLinkPacketField('vehicle_timestamp', 'vehicleTimestamp', 0, false, 8, 'uint64_t', ''),
    new MavLinkPacketField('utc_time', 'utcTime', 8, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('param1', 'param1', 12, false, 4, 'float', ''),
    new MavLinkPacketField('param2', 'param2', 16, false, 4, 'float', ''),
    new MavLinkPacketField('param3', 'param3', 20, false, 4, 'float', ''),
    new MavLinkPacketField('param4', 'param4', 24, false, 4, 'float', ''),
    new MavLinkPacketField('param5', 'param5', 28, false, 4, 'float', ''),
    new MavLinkPacketField('param6', 'param6', 32, false, 4, 'float', ''),
    new MavLinkPacketField('param7', 'param7', 36, false, 4, 'float', ''),
    new MavLinkPacketField('command', 'command', 40, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('target_system', 'targetSystem', 42, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 43, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('confirmation', 'confirmation', 44, false, 1, 'uint8_t', ''),
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
    new MavLinkPacketField('adc121_vspb_volt', 'adc121VspbVolt', 0, false, 4, 'float', 'V'),
    new MavLinkPacketField('adc121_cspb_amp', 'adc121CspbAmp', 4, false, 4, 'float', 'A'),
    new MavLinkPacketField('adc121_cs1_amp', 'adc121Cs1Amp', 8, false, 4, 'float', 'A'),
    new MavLinkPacketField('adc121_cs2_amp', 'adc121Cs2Amp', 12, false, 4, 'float', 'A'),
  ]

  /**
   * Power board voltage sensor reading
   * Units: V
   */
  adc121VspbVolt: float
  /**
   * Power board current sensor reading
   * Units: A
   */
  adc121CspbAmp: float
  /**
   * Board current sensor 1 reading
   * Units: A
   */
  adc121Cs1Amp: float
  /**
   * Board current sensor 2 reading
   * Units: A
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
    new MavLinkPacketField('mppt_timestamp', 'mpptTimestamp', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('mppt1_volt', 'mppt1Volt', 8, false, 4, 'float', 'V'),
    new MavLinkPacketField('mppt1_amp', 'mppt1Amp', 12, false, 4, 'float', 'A'),
    new MavLinkPacketField('mppt2_volt', 'mppt2Volt', 16, false, 4, 'float', 'V'),
    new MavLinkPacketField('mppt2_amp', 'mppt2Amp', 20, false, 4, 'float', 'A'),
    new MavLinkPacketField('mppt3_volt', 'mppt3Volt', 24, false, 4, 'float', 'V'),
    new MavLinkPacketField('mppt3_amp', 'mppt3Amp', 28, false, 4, 'float', 'A'),
    new MavLinkPacketField('mppt1_pwm', 'mppt1Pwm', 32, false, 2, 'uint16_t', 'us'),
    new MavLinkPacketField('mppt2_pwm', 'mppt2Pwm', 34, false, 2, 'uint16_t', 'us'),
    new MavLinkPacketField('mppt3_pwm', 'mppt3Pwm', 36, false, 2, 'uint16_t', 'us'),
    new MavLinkPacketField('mppt1_status', 'mppt1Status', 38, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('mppt2_status', 'mppt2Status', 39, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('mppt3_status', 'mppt3Status', 40, false, 1, 'uint8_t', ''),
  ]

  /**
   * MPPT last timestamp
   * Units: us
   */
  mpptTimestamp: uint64_t
  /**
   * MPPT1 voltage
   * Units: V
   */
  mppt1Volt: float
  /**
   * MPPT1 current
   * Units: A
   */
  mppt1Amp: float
  /**
   * MPPT1 pwm
   * Units: us
   */
  mppt1Pwm: uint16_t
  /**
   * MPPT1 status
   */
  mppt1Status: uint8_t
  /**
   * MPPT2 voltage
   * Units: V
   */
  mppt2Volt: float
  /**
   * MPPT2 current
   * Units: A
   */
  mppt2Amp: float
  /**
   * MPPT2 pwm
   * Units: us
   */
  mppt2Pwm: uint16_t
  /**
   * MPPT2 status
   */
  mppt2Status: uint8_t
  /**
   * MPPT3 voltage
   * Units: V
   */
  mppt3Volt: float
  /**
   * MPPT3 current
   * Units: A
   */
  mppt3Amp: float
  /**
   * MPPT3 pwm
   * Units: us
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
    new MavLinkPacketField('timestamp', 'timestamp', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('h', 'h', 8, false, 4, 'float', ''),
    new MavLinkPacketField('hRef', 'hRef', 12, false, 4, 'float', ''),
    new MavLinkPacketField('hRef_t', 'hRefT', 16, false, 4, 'float', ''),
    new MavLinkPacketField('PitchAngle', 'PitchAngle', 20, false, 4, 'float', 'deg'),
    new MavLinkPacketField('PitchAngleRef', 'PitchAngleRef', 24, false, 4, 'float', 'deg'),
    new MavLinkPacketField('q', 'q', 28, false, 4, 'float', ''),
    new MavLinkPacketField('qRef', 'qRef', 32, false, 4, 'float', ''),
    new MavLinkPacketField('uElev', 'uElev', 36, false, 4, 'float', ''),
    new MavLinkPacketField('uThrot', 'uThrot', 40, false, 4, 'float', ''),
    new MavLinkPacketField('uThrot2', 'uThrot2', 44, false, 4, 'float', ''),
    new MavLinkPacketField('nZ', 'nZ', 48, false, 4, 'float', ''),
    new MavLinkPacketField('AirspeedRef', 'AirspeedRef', 52, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('YawAngle', 'YawAngle', 56, false, 4, 'float', 'deg'),
    new MavLinkPacketField('YawAngleRef', 'YawAngleRef', 60, false, 4, 'float', 'deg'),
    new MavLinkPacketField('RollAngle', 'RollAngle', 64, false, 4, 'float', 'deg'),
    new MavLinkPacketField('RollAngleRef', 'RollAngleRef', 68, false, 4, 'float', 'deg'),
    new MavLinkPacketField('p', 'p', 72, false, 4, 'float', ''),
    new MavLinkPacketField('pRef', 'pRef', 76, false, 4, 'float', ''),
    new MavLinkPacketField('r', 'r', 80, false, 4, 'float', ''),
    new MavLinkPacketField('rRef', 'rRef', 84, false, 4, 'float', ''),
    new MavLinkPacketField('uAil', 'uAil', 88, false, 4, 'float', ''),
    new MavLinkPacketField('uRud', 'uRud', 92, false, 4, 'float', ''),
    new MavLinkPacketField('aslctrl_mode', 'aslctrlMode', 96, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('SpoilersEngaged', 'SpoilersEngaged', 97, false, 1, 'uint8_t', ''),
  ]

  /**
   * Timestamp
   * Units: us
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
   * Units: deg
   */
  PitchAngle: float
  /**
   * Pitch angle reference
   * Units: deg
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
   * Units: m/s
   */
  AirspeedRef: float
  SpoilersEngaged: uint8_t
  /**
   * Yaw angle
   * Units: deg
   */
  YawAngle: float
  /**
   * Yaw angle reference
   * Units: deg
   */
  YawAngleRef: float
  /**
   * Roll angle
   * Units: deg
   */
  RollAngle: float
  /**
   * Roll angle reference
   * Units: deg
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
    new MavLinkPacketField('i32_1', 'i321', 0, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('f_1', 'f1', 4, false, 4, 'float', ''),
    new MavLinkPacketField('f_2', 'f2', 8, false, 4, 'float', ''),
    new MavLinkPacketField('f_3', 'f3', 12, false, 4, 'float', ''),
    new MavLinkPacketField('f_4', 'f4', 16, false, 4, 'float', ''),
    new MavLinkPacketField('f_5', 'f5', 20, false, 4, 'float', ''),
    new MavLinkPacketField('f_6', 'f6', 24, false, 4, 'float', ''),
    new MavLinkPacketField('f_7', 'f7', 28, false, 4, 'float', ''),
    new MavLinkPacketField('f_8', 'f8', 32, false, 4, 'float', ''),
    new MavLinkPacketField('i8_1', 'i81', 36, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('i8_2', 'i82', 37, false, 1, 'uint8_t', ''),
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
    new MavLinkPacketField('Motor_rpm', 'MotorRpm', 0, false, 4, 'float', ''),
    new MavLinkPacketField('LED_status', 'LEDStatus', 4, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('SATCOM_status', 'SATCOMStatus', 5, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('Servo_status', 'ServoStatus', 6, false, 1, 'uint8_t[]', '', 8),
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
    new MavLinkPacketField('timestamp', 'timestamp', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('Windspeed', 'Windspeed', 8, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('WindDir', 'WindDir', 12, false, 4, 'float', 'rad'),
    new MavLinkPacketField('WindZ', 'WindZ', 16, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('Airspeed', 'Airspeed', 20, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('beta', 'beta', 24, false, 4, 'float', 'rad'),
    new MavLinkPacketField('alpha', 'alpha', 28, false, 4, 'float', 'rad'),
  ]

  /**
   * Time since system start
   * Units: us
   */
  timestamp: uint64_t
  /**
   * Magnitude of wind velocity (in lateral inertial plane)
   * Units: m/s
   */
  Windspeed: float
  /**
   * Wind heading angle from North
   * Units: rad
   */
  WindDir: float
  /**
   * Z (Down) component of inertial wind velocity
   * Units: m/s
   */
  WindZ: float
  /**
   * Magnitude of air velocity
   * Units: m/s
   */
  Airspeed: float
  /**
   * Sideslip angle
   * Units: rad
   */
  beta: float
  /**
   * Angle of attack
   * Units: rad
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
    new MavLinkPacketField('timestamp', 'timestamp', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('uElev', 'uElev', 8, false, 4, 'float', ''),
    new MavLinkPacketField('uThrot', 'uThrot', 12, false, 4, 'float', ''),
    new MavLinkPacketField('uThrot2', 'uThrot2', 16, false, 4, 'float', ''),
    new MavLinkPacketField('uAilL', 'uAilL', 20, false, 4, 'float', ''),
    new MavLinkPacketField('uAilR', 'uAilR', 24, false, 4, 'float', ''),
    new MavLinkPacketField('uRud', 'uRud', 28, false, 4, 'float', ''),
    new MavLinkPacketField('obctrl_status', 'obctrlStatus', 32, false, 1, 'uint8_t', ''),
  ]

  /**
   * Time since system start
   * Units: us
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
    new MavLinkPacketField('timestamp', 'timestamp', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('TempAmbient', 'TempAmbient', 8, false, 4, 'float', 'degC'),
    new MavLinkPacketField('Humidity', 'Humidity', 12, false, 4, 'float', '%'),
  ]

  /**
   * Time since system boot
   * Units: us
   */
  timestamp: uint64_t
  /**
   * Ambient temperature
   * Units: degC
   */
  TempAmbient: float
  /**
   * Relative humidity
   * Units: %
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
    new MavLinkPacketField('batmon_timestamp', 'batmonTimestamp', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('temperature', 'temperature', 8, false, 4, 'float', 'degC'),
    new MavLinkPacketField('safetystatus', 'safetystatus', 12, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('operationstatus', 'operationstatus', 16, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('voltage', 'voltage', 20, false, 2, 'uint16_t', 'mV'),
    new MavLinkPacketField('current', 'current', 22, false, 2, 'int16_t', 'mA'),
    new MavLinkPacketField('batterystatus', 'batterystatus', 24, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('serialnumber', 'serialnumber', 26, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('cellvoltage1', 'cellvoltage1', 28, false, 2, 'uint16_t', 'mV'),
    new MavLinkPacketField('cellvoltage2', 'cellvoltage2', 30, false, 2, 'uint16_t', 'mV'),
    new MavLinkPacketField('cellvoltage3', 'cellvoltage3', 32, false, 2, 'uint16_t', 'mV'),
    new MavLinkPacketField('cellvoltage4', 'cellvoltage4', 34, false, 2, 'uint16_t', 'mV'),
    new MavLinkPacketField('cellvoltage5', 'cellvoltage5', 36, false, 2, 'uint16_t', 'mV'),
    new MavLinkPacketField('cellvoltage6', 'cellvoltage6', 38, false, 2, 'uint16_t', 'mV'),
    new MavLinkPacketField('SoC', 'SoC', 40, false, 1, 'uint8_t', ''),
  ]

  /**
   * Time since system start
   * Units: us
   */
  batmonTimestamp: uint64_t
  /**
   * Battery pack temperature
   * Units: degC
   */
  temperature: float
  /**
   * Battery pack voltage
   * Units: mV
   */
  voltage: uint16_t
  /**
   * Battery pack current
   * Units: mA
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
   * Units: mV
   */
  cellvoltage1: uint16_t
  /**
   * Battery pack cell 2 voltage
   * Units: mV
   */
  cellvoltage2: uint16_t
  /**
   * Battery pack cell 3 voltage
   * Units: mV
   */
  cellvoltage3: uint16_t
  /**
   * Battery pack cell 4 voltage
   * Units: mV
   */
  cellvoltage4: uint16_t
  /**
   * Battery pack cell 5 voltage
   * Units: mV
   */
  cellvoltage5: uint16_t
  /**
   * Battery pack cell 6 voltage
   * Units: mV
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
    new MavLinkPacketField('timestamp', 'timestamp', 0, false, 8, 'uint64_t', 'ms'),
    new MavLinkPacketField('timestampModeChanged', 'timestampModeChanged', 8, false, 8, 'uint64_t', 'ms'),
    new MavLinkPacketField('xW', 'xW', 16, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('xR', 'xR', 20, false, 4, 'float', 'm'),
    new MavLinkPacketField('xLat', 'xLat', 24, false, 4, 'float', 'deg'),
    new MavLinkPacketField('xLon', 'xLon', 28, false, 4, 'float', 'deg'),
    new MavLinkPacketField('VarW', 'VarW', 32, false, 4, 'float', ''),
    new MavLinkPacketField('VarR', 'VarR', 36, false, 4, 'float', ''),
    new MavLinkPacketField('VarLat', 'VarLat', 40, false, 4, 'float', ''),
    new MavLinkPacketField('VarLon', 'VarLon', 44, false, 4, 'float', ''),
    new MavLinkPacketField('LoiterRadius', 'LoiterRadius', 48, false, 4, 'float', 'm'),
    new MavLinkPacketField('LoiterDirection', 'LoiterDirection', 52, false, 4, 'float', ''),
    new MavLinkPacketField('DistToSoarPoint', 'DistToSoarPoint', 56, false, 4, 'float', 'm'),
    new MavLinkPacketField('vSinkExp', 'vSinkExp', 60, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('z1_LocalUpdraftSpeed', 'z1LocalUpdraftSpeed', 64, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('z2_DeltaRoll', 'z2DeltaRoll', 68, false, 4, 'float', 'deg'),
    new MavLinkPacketField('z1_exp', 'z1Exp', 72, false, 4, 'float', ''),
    new MavLinkPacketField('z2_exp', 'z2Exp', 76, false, 4, 'float', ''),
    new MavLinkPacketField('ThermalGSNorth', 'ThermalGSNorth', 80, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('ThermalGSEast', 'ThermalGSEast', 84, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('TSE_dot', 'TSEDot', 88, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('DebugVar1', 'DebugVar1', 92, false, 4, 'float', ''),
    new MavLinkPacketField('DebugVar2', 'DebugVar2', 96, false, 4, 'float', ''),
    new MavLinkPacketField('ControlMode', 'ControlMode', 100, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('valid', 'valid', 101, false, 1, 'uint8_t', ''),
  ]

  /**
   * Timestamp
   * Units: ms
   */
  timestamp: uint64_t
  /**
   * Timestamp since last mode change
   * Units: ms
   */
  timestampModeChanged: uint64_t
  /**
   * Thermal core updraft strength
   * Units: m/s
   */
  xW: float
  /**
   * Thermal radius
   * Units: m
   */
  xR: float
  /**
   * Thermal center latitude
   * Units: deg
   */
  xLat: float
  /**
   * Thermal center longitude
   * Units: deg
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
   * Units: m
   */
  LoiterRadius: float
  /**
   * Suggested loiter direction
   */
  LoiterDirection: float
  /**
   * Distance to soar point
   * Units: m
   */
  DistToSoarPoint: float
  /**
   * Expected sink rate at current airspeed, roll and throttle
   * Units: m/s
   */
  vSinkExp: float
  /**
   * Measurement / updraft speed at current/local airplane position
   * Units: m/s
   */
  z1LocalUpdraftSpeed: float
  /**
   * Measurement / roll angle tracking error
   * Units: deg
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
   * Units: m/s
   */
  ThermalGSNorth: float
  /**
   * Thermal drift (from estimator prediction step only)
   * Units: m/s
   */
  ThermalGSEast: float
  /**
   * Total specific energy change (filtered)
   * Units: m/s
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
    new MavLinkPacketField('timestamp', 'timestamp', 0, false, 8, 'uint64_t', 'ms'),
    new MavLinkPacketField('free_space', 'freeSpace', 8, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('visensor_rate_1', 'visensorRate1', 10, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('visensor_rate_2', 'visensorRate2', 11, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('visensor_rate_3', 'visensorRate3', 12, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('visensor_rate_4', 'visensorRate4', 13, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('recording_nodes_count', 'recordingNodesCount', 14, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('cpu_temp', 'cpuTemp', 15, false, 1, 'uint8_t', 'degC'),
  ]

  /**
   * Timestamp in linuxtime (since 1.1.1970)
   * Units: ms
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
   * Units: degC
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
    new MavLinkPacketField('timestamp', 'timestamp', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('pwr_brd_system_volt', 'pwrBrdSystemVolt', 8, false, 4, 'float', 'V'),
    new MavLinkPacketField('pwr_brd_servo_volt', 'pwrBrdServoVolt', 12, false, 4, 'float', 'V'),
    new MavLinkPacketField('pwr_brd_digital_volt', 'pwrBrdDigitalVolt', 16, false, 4, 'float', 'V'),
    new MavLinkPacketField('pwr_brd_mot_l_amp', 'pwrBrdMotLAmp', 20, false, 4, 'float', 'A'),
    new MavLinkPacketField('pwr_brd_mot_r_amp', 'pwrBrdMotRAmp', 24, false, 4, 'float', 'A'),
    new MavLinkPacketField('pwr_brd_analog_amp', 'pwrBrdAnalogAmp', 28, false, 4, 'float', 'A'),
    new MavLinkPacketField('pwr_brd_digital_amp', 'pwrBrdDigitalAmp', 32, false, 4, 'float', 'A'),
    new MavLinkPacketField('pwr_brd_ext_amp', 'pwrBrdExtAmp', 36, false, 4, 'float', 'A'),
    new MavLinkPacketField('pwr_brd_aux_amp', 'pwrBrdAuxAmp', 40, false, 4, 'float', 'A'),
    new MavLinkPacketField('pwr_brd_status', 'pwrBrdStatus', 44, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('pwr_brd_led_status', 'pwrBrdLedStatus', 45, false, 1, 'uint8_t', ''),
  ]

  /**
   * Timestamp
   * Units: us
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
   * Units: V
   */
  pwrBrdSystemVolt: float
  /**
   * Power board servo voltage
   * Units: V
   */
  pwrBrdServoVolt: float
  /**
   * Power board digital voltage
   * Units: V
   */
  pwrBrdDigitalVolt: float
  /**
   * Power board left motor current sensor
   * Units: A
   */
  pwrBrdMotLAmp: float
  /**
   * Power board right motor current sensor
   * Units: A
   */
  pwrBrdMotRAmp: float
  /**
   * Power board analog current sensor
   * Units: A
   */
  pwrBrdAnalogAmp: float
  /**
   * Power board digital current sensor
   * Units: A
   */
  pwrBrdDigitalAmp: float
  /**
   * Power board extension current sensor
   * Units: A
   */
  pwrBrdExtAmp: float
  /**
   * Power board aux current sensor
   * Units: A
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
    new MavLinkPacketField('timestamp', 'timestamp', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('gsm_modem_type', 'gsmModemType', 8, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('gsm_link_type', 'gsmLinkType', 9, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('rssi', 'rssi', 10, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('rsrp_rscp', 'rsrpRscp', 11, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sinr_ecio', 'sinrEcio', 12, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('rsrq', 'rsrq', 13, false, 1, 'uint8_t', ''),
  ]

  /**
   * Timestamp (of OBC)
   * Units: us
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
    new MavLinkPacketField('timestamp', 'timestamp', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('last_heartbeat', 'lastHeartbeat', 8, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('failed_sessions', 'failedSessions', 16, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('successful_sessions', 'successfulSessions', 18, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('signal_quality', 'signalQuality', 20, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('ring_pending', 'ringPending', 21, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('tx_session_pending', 'txSessionPending', 22, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('rx_session_pending', 'rxSessionPending', 23, false, 1, 'uint8_t', ''),
  ]

  /**
   * Timestamp
   * Units: us
   */
  timestamp: uint64_t
  /**
   * Timestamp of the last successful sbd session
   * Units: us
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
    new MavLinkPacketField('timestamp', 'timestamp', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('angleofattack', 'angleofattack', 8, false, 4, 'float', 'deg'),
    new MavLinkPacketField('sideslip', 'sideslip', 12, false, 4, 'float', 'deg'),
    new MavLinkPacketField('angleofattack_valid', 'angleofattackValid', 16, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sideslip_valid', 'sideslipValid', 17, false, 1, 'uint8_t', ''),
  ]

  /**
   * Timestamp
   * Units: us
   */
  timestamp: uint64_t
  /**
   * Angle of attack
   * Units: deg
   */
  angleofattack: float
  /**
   * Angle of attack measurement valid
   */
  angleofattackValid: uint8_t
  /**
   * Sideslip angle
   * Units: deg
   */
  sideslip: float
  /**
   * Sideslip angle measurement valid
   */
  sideslipValid: uint8_t
}

export const REGISTRY: MavLinkPacketRegistry = {
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
