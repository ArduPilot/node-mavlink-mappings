import {
  int8_t,
  uint8_t,
  int16_t,
  uint16_t,
  int32_t,
  uint32_t,
  float
} from './types'

import {
  MavLinkPacketField,
  MavLinkData
} from './mavlink'

/**
 * Action required when performing CMD_PREFLIGHT_STORAGE
 */
export enum MavPreflightStorageAction {
  'READ_ALL'                   = 0,
  'WRITE_ALL'                  = 1,
  'CLEAR_ALL'                  = 2,
  'READ_SPECIFIC'              = 3,
  'WRITE_SPECIFIC'             = 4,
  'CLEAR_SPECIFIC'             = 5,
  'DO_NOTHING'                 = 6,
}

/**
 * MAV_CMD
 */
export enum MavCmd {
  /**
   * Request storage of different parameter values and logs. This command will be only accepted if in
   * pre-flight mode.
   */
  'PREFLIGHT_STORAGE_ADVANCED' = 0,
}

/**
 * Depreciated but used as a compiler flag. Do not remove
 */
export class FlexifunctionSet extends MavLinkData {
  static MSG_ID = 150
  static MSG_NAME = 'FLEXIFUNCTION_SET'
  static PAYLOAD_LENGTH = 2
  static MAGIC_NUMBER = 181

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
 * Reqest reading of flexifunction data
 */
export class FlexifunctionReadReq extends MavLinkData {
  static MSG_ID = 151
  static MSG_NAME = 'FLEXIFUNCTION_READ_REQ'
  static PAYLOAD_LENGTH = 6
  static MAGIC_NUMBER = 26

  static FIELDS = [
    new MavLinkPacketField('readReqType', 0, false, 2, 'int16_t', ''),
    new MavLinkPacketField('dataIndex', 2, false, 2, 'int16_t', ''),
    new MavLinkPacketField('targetSystem', 4, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('targetComponent', 5, false, 1, 'uint8_t', ''),
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
   * Type of flexifunction data requested
   */
  readReqType: int16_t
  /**
   * index into data where needed
   */
  dataIndex: int16_t
}

/**
 * Flexifunction type and parameters for component at function index from buffer
 */
export class MemInfo extends MavLinkData {
  static MSG_ID = 152
  static MSG_NAME = 'FLEXIFUNCTION_BUFFER_FUNCTION'
  static PAYLOAD_LENGTH = 58
  static MAGIC_NUMBER = 101

  static FIELDS = [
    new MavLinkPacketField('funcIndex', 0, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('funcCount', 2, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('dataAddress', 4, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('dataSize', 6, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('targetSystem', 8, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('targetComponent', 9, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('data', 10, false, 1, 'int8_t[]', '', 48),
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
   * Function index
   */
  funcIndex: uint16_t
  /**
   * Total count of functions
   */
  funcCount: uint16_t
  /**
   * Address in the flexifunction data, Set to 0xFFFF to use address in target memory
   */
  dataAddress: uint16_t
  /**
   * Size of the
   */
  dataSize: uint16_t
  /**
   * Settings data
   */
  data: int8_t[]
}

/**
 * Flexifunction type and parameters for component at function index from buffer
 */
export class FlexifunctionBufferFunctionAck extends MavLinkData {
  static MSG_ID = 153
  static MSG_NAME = 'FLEXIFUNCTION_BUFFER_FUNCTION_ACK'
  static PAYLOAD_LENGTH = 6
  static MAGIC_NUMBER = 109

  static FIELDS = [
    new MavLinkPacketField('funcIndex', 0, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('result', 2, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('targetSystem', 4, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('targetComponent', 5, false, 1, 'uint8_t', ''),
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
   * Function index
   */
  funcIndex: uint16_t
  /**
   * result of acknowledge, 0=fail, 1=good
   */
  result: uint16_t
}

/**
 * Acknowldge sucess or failure of a flexifunction command
 */
export class FlexifunctionDirectory extends MavLinkData {
  static MSG_ID = 155
  static MSG_NAME = 'FLEXIFUNCTION_DIRECTORY'
  static PAYLOAD_LENGTH = 53
  static MAGIC_NUMBER = 12

  static FIELDS = [
    new MavLinkPacketField('targetSystem', 0, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('targetComponent', 1, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('directoryType', 2, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('startIndex', 3, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('count', 4, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('directoryData', 5, false, 1, 'int8_t[]', '', 48),
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
   * 0=inputs, 1=outputs
   */
  directoryType: uint8_t
  /**
   * index of first directory entry to write
   */
  startIndex: uint8_t
  /**
   * count of directory entries to write
   */
  count: uint8_t
  /**
   * Settings data
   */
  directoryData: int8_t[]
}

/**
 * Acknowldge sucess or failure of a flexifunction command
 */
export class FlexifunctionDirectoryAck extends MavLinkData {
  static MSG_ID = 156
  static MSG_NAME = 'FLEXIFUNCTION_DIRECTORY_ACK'
  static PAYLOAD_LENGTH = 7
  static MAGIC_NUMBER = 218

  static FIELDS = [
    new MavLinkPacketField('result', 0, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('targetSystem', 2, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('targetComponent', 3, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('directoryType', 4, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('startIndex', 5, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('count', 6, false, 1, 'uint8_t', ''),
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
   * 0=inputs, 1=outputs
   */
  directoryType: uint8_t
  /**
   * index of first directory entry to write
   */
  startIndex: uint8_t
  /**
   * count of directory entries to write
   */
  count: uint8_t
  /**
   * result of acknowledge, 0=fail, 1=good
   */
  result: uint16_t
}

/**
 * Acknowldge sucess or failure of a flexifunction command
 */
export class FlexifunctionCommand extends MavLinkData {
  static MSG_ID = 157
  static MSG_NAME = 'FLEXIFUNCTION_COMMAND'
  static PAYLOAD_LENGTH = 3
  static MAGIC_NUMBER = 133

  static FIELDS = [
    new MavLinkPacketField('targetSystem', 0, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('targetComponent', 1, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('commandType', 2, false, 1, 'uint8_t', ''),
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
   * Flexifunction command type
   */
  commandType: uint8_t
}

/**
 * Acknowldge sucess or failure of a flexifunction command
 */
export class FlexifunctionCommandAck extends MavLinkData {
  static MSG_ID = 158
  static MSG_NAME = 'FLEXIFUNCTION_COMMAND_ACK'
  static PAYLOAD_LENGTH = 4
  static MAGIC_NUMBER = 208

  static FIELDS = [
    new MavLinkPacketField('commandType', 0, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('result', 2, false, 2, 'uint16_t', ''),
  ]

  /**
   * Command acknowledged
   */
  commandType: uint16_t
  /**
   * result of acknowledge
   */
  result: uint16_t
}

/**
 * Backwards compatible MAVLink version of SERIAL_UDB_EXTRA - F2: Format Part A
 */
export class SerialUdbExtraF2A extends MavLinkData {
  static MSG_ID = 170
  static MSG_NAME = 'SERIAL_UDB_EXTRA_F2_A'
  static PAYLOAD_LENGTH = 61
  static MAGIC_NUMBER = 103

  static FIELDS = [
    new MavLinkPacketField('sueTime', 0, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('sueLatitude', 4, false, 4, 'int32_t', ''),
    new MavLinkPacketField('sueLongitude', 8, false, 4, 'int32_t', ''),
    new MavLinkPacketField('sueAltitude', 12, false, 4, 'int32_t', ''),
    new MavLinkPacketField('sueWaypointIndex', 16, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('sueRmat0', 18, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueRmat1', 20, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueRmat2', 22, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueRmat3', 24, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueRmat4', 26, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueRmat5', 28, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueRmat6', 30, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueRmat7', 32, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueRmat8', 34, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueCog', 36, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('sueSog', 38, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueCpuLoad', 40, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('sueAirSpeed3DIMU', 42, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('sueEstimatedWind0', 44, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueEstimatedWind1', 46, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueEstimatedWind2', 48, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueMagFieldEarth0', 50, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueMagFieldEarth1', 52, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueMagFieldEarth2', 54, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueSvs', 56, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueHdop', 58, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueStatus', 60, false, 1, 'uint8_t', ''),
  ]

  /**
   * Serial UDB Extra Time
   */
  sueTime: uint32_t
  /**
   * Serial UDB Extra Status
   */
  sueStatus: uint8_t
  /**
   * Serial UDB Extra Latitude
   */
  sueLatitude: int32_t
  /**
   * Serial UDB Extra Longitude
   */
  sueLongitude: int32_t
  /**
   * Serial UDB Extra Altitude
   */
  sueAltitude: int32_t
  /**
   * Serial UDB Extra Waypoint Index
   */
  sueWaypointIndex: uint16_t
  /**
   * Serial UDB Extra Rmat 0
   */
  sueRmat0: int16_t
  /**
   * Serial UDB Extra Rmat 1
   */
  sueRmat1: int16_t
  /**
   * Serial UDB Extra Rmat 2
   */
  sueRmat2: int16_t
  /**
   * Serial UDB Extra Rmat 3
   */
  sueRmat3: int16_t
  /**
   * Serial UDB Extra Rmat 4
   */
  sueRmat4: int16_t
  /**
   * Serial UDB Extra Rmat 5
   */
  sueRmat5: int16_t
  /**
   * Serial UDB Extra Rmat 6
   */
  sueRmat6: int16_t
  /**
   * Serial UDB Extra Rmat 7
   */
  sueRmat7: int16_t
  /**
   * Serial UDB Extra Rmat 8
   */
  sueRmat8: int16_t
  /**
   * Serial UDB Extra GPS Course Over Ground
   */
  sueCog: uint16_t
  /**
   * Serial UDB Extra Speed Over Ground
   */
  sueSog: int16_t
  /**
   * Serial UDB Extra CPU Load
   */
  sueCpuLoad: uint16_t
  /**
   * Serial UDB Extra 3D IMU Air Speed
   */
  sueAirSpeed3DIMU: uint16_t
  /**
   * Serial UDB Extra Estimated Wind 0
   */
  sueEstimatedWind0: int16_t
  /**
   * Serial UDB Extra Estimated Wind 1
   */
  sueEstimatedWind1: int16_t
  /**
   * Serial UDB Extra Estimated Wind 2
   */
  sueEstimatedWind2: int16_t
  /**
   * Serial UDB Extra Magnetic Field Earth 0
   */
  sueMagFieldEarth0: int16_t
  /**
   * Serial UDB Extra Magnetic Field Earth 1
   */
  sueMagFieldEarth1: int16_t
  /**
   * Serial UDB Extra Magnetic Field Earth 2
   */
  sueMagFieldEarth2: int16_t
  /**
   * Serial UDB Extra Number of Sattelites in View
   */
  sueSvs: int16_t
  /**
   * Serial UDB Extra GPS Horizontal Dilution of Precision
   */
  sueHdop: int16_t
}

/**
 * Backwards compatible version of SERIAL_UDB_EXTRA - F2: Part B
 */
export class SerialUdbExtraF2B extends MavLinkData {
  static MSG_ID = 171
  static MSG_NAME = 'SERIAL_UDB_EXTRA_F2_B'
  static PAYLOAD_LENGTH = 108
  static MAGIC_NUMBER = 245

  static FIELDS = [
    new MavLinkPacketField('sueTime', 0, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('sueFlags', 4, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('sueBaromPress', 8, false, 4, 'int32_t', ''),
    new MavLinkPacketField('sueBaromAlt', 12, false, 4, 'int32_t', ''),
    new MavLinkPacketField('suePwmInput1', 16, false, 2, 'int16_t', ''),
    new MavLinkPacketField('suePwmInput2', 18, false, 2, 'int16_t', ''),
    new MavLinkPacketField('suePwmInput3', 20, false, 2, 'int16_t', ''),
    new MavLinkPacketField('suePwmInput4', 22, false, 2, 'int16_t', ''),
    new MavLinkPacketField('suePwmInput5', 24, false, 2, 'int16_t', ''),
    new MavLinkPacketField('suePwmInput6', 26, false, 2, 'int16_t', ''),
    new MavLinkPacketField('suePwmInput7', 28, false, 2, 'int16_t', ''),
    new MavLinkPacketField('suePwmInput8', 30, false, 2, 'int16_t', ''),
    new MavLinkPacketField('suePwmInput9', 32, false, 2, 'int16_t', ''),
    new MavLinkPacketField('suePwmInput10', 34, false, 2, 'int16_t', ''),
    new MavLinkPacketField('suePwmInput11', 36, false, 2, 'int16_t', ''),
    new MavLinkPacketField('suePwmInput12', 38, false, 2, 'int16_t', ''),
    new MavLinkPacketField('suePwmOutput1', 40, false, 2, 'int16_t', ''),
    new MavLinkPacketField('suePwmOutput2', 42, false, 2, 'int16_t', ''),
    new MavLinkPacketField('suePwmOutput3', 44, false, 2, 'int16_t', ''),
    new MavLinkPacketField('suePwmOutput4', 46, false, 2, 'int16_t', ''),
    new MavLinkPacketField('suePwmOutput5', 48, false, 2, 'int16_t', ''),
    new MavLinkPacketField('suePwmOutput6', 50, false, 2, 'int16_t', ''),
    new MavLinkPacketField('suePwmOutput7', 52, false, 2, 'int16_t', ''),
    new MavLinkPacketField('suePwmOutput8', 54, false, 2, 'int16_t', ''),
    new MavLinkPacketField('suePwmOutput9', 56, false, 2, 'int16_t', ''),
    new MavLinkPacketField('suePwmOutput10', 58, false, 2, 'int16_t', ''),
    new MavLinkPacketField('suePwmOutput11', 60, false, 2, 'int16_t', ''),
    new MavLinkPacketField('suePwmOutput12', 62, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueImuLocationX', 64, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueImuLocationY', 66, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueImuLocationZ', 68, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueLocationErrorEarthX', 70, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueLocationErrorEarthY', 72, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueLocationErrorEarthZ', 74, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueOscFails', 76, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueImuVelocityX', 78, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueImuVelocityY', 80, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueImuVelocityZ', 82, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueWaypointGoalX', 84, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueWaypointGoalY', 86, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueWaypointGoalZ', 88, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueAeroX', 90, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueAeroY', 92, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueAeroZ', 94, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueBaromTemp', 96, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueBatVolt', 98, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueBatAmp', 100, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueBatAmpHours', 102, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueDesiredHeight', 104, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueMemoryStackFree', 106, false, 2, 'int16_t', ''),
  ]

  /**
   * Serial UDB Extra Time
   */
  sueTime: uint32_t
  /**
   * Serial UDB Extra PWM Input Channel 1
   */
  suePwmInput1: int16_t
  /**
   * Serial UDB Extra PWM Input Channel 2
   */
  suePwmInput2: int16_t
  /**
   * Serial UDB Extra PWM Input Channel 3
   */
  suePwmInput3: int16_t
  /**
   * Serial UDB Extra PWM Input Channel 4
   */
  suePwmInput4: int16_t
  /**
   * Serial UDB Extra PWM Input Channel 5
   */
  suePwmInput5: int16_t
  /**
   * Serial UDB Extra PWM Input Channel 6
   */
  suePwmInput6: int16_t
  /**
   * Serial UDB Extra PWM Input Channel 7
   */
  suePwmInput7: int16_t
  /**
   * Serial UDB Extra PWM Input Channel 8
   */
  suePwmInput8: int16_t
  /**
   * Serial UDB Extra PWM Input Channel 9
   */
  suePwmInput9: int16_t
  /**
   * Serial UDB Extra PWM Input Channel 10
   */
  suePwmInput10: int16_t
  /**
   * Serial UDB Extra PWM Input Channel 11
   */
  suePwmInput11: int16_t
  /**
   * Serial UDB Extra PWM Input Channel 12
   */
  suePwmInput12: int16_t
  /**
   * Serial UDB Extra PWM Output Channel 1
   */
  suePwmOutput1: int16_t
  /**
   * Serial UDB Extra PWM Output Channel 2
   */
  suePwmOutput2: int16_t
  /**
   * Serial UDB Extra PWM Output Channel 3
   */
  suePwmOutput3: int16_t
  /**
   * Serial UDB Extra PWM Output Channel 4
   */
  suePwmOutput4: int16_t
  /**
   * Serial UDB Extra PWM Output Channel 5
   */
  suePwmOutput5: int16_t
  /**
   * Serial UDB Extra PWM Output Channel 6
   */
  suePwmOutput6: int16_t
  /**
   * Serial UDB Extra PWM Output Channel 7
   */
  suePwmOutput7: int16_t
  /**
   * Serial UDB Extra PWM Output Channel 8
   */
  suePwmOutput8: int16_t
  /**
   * Serial UDB Extra PWM Output Channel 9
   */
  suePwmOutput9: int16_t
  /**
   * Serial UDB Extra PWM Output Channel 10
   */
  suePwmOutput10: int16_t
  /**
   * Serial UDB Extra PWM Output Channel 11
   */
  suePwmOutput11: int16_t
  /**
   * Serial UDB Extra PWM Output Channel 12
   */
  suePwmOutput12: int16_t
  /**
   * Serial UDB Extra IMU Location X
   */
  sueImuLocationX: int16_t
  /**
   * Serial UDB Extra IMU Location Y
   */
  sueImuLocationY: int16_t
  /**
   * Serial UDB Extra IMU Location Z
   */
  sueImuLocationZ: int16_t
  /**
   * Serial UDB Location Error Earth X
   */
  sueLocationErrorEarthX: int16_t
  /**
   * Serial UDB Location Error Earth Y
   */
  sueLocationErrorEarthY: int16_t
  /**
   * Serial UDB Location Error Earth Z
   */
  sueLocationErrorEarthZ: int16_t
  /**
   * Serial UDB Extra Status Flags
   */
  sueFlags: uint32_t
  /**
   * Serial UDB Extra Oscillator Failure Count
   */
  sueOscFails: int16_t
  /**
   * Serial UDB Extra IMU Velocity X
   */
  sueImuVelocityX: int16_t
  /**
   * Serial UDB Extra IMU Velocity Y
   */
  sueImuVelocityY: int16_t
  /**
   * Serial UDB Extra IMU Velocity Z
   */
  sueImuVelocityZ: int16_t
  /**
   * Serial UDB Extra Current Waypoint Goal X
   */
  sueWaypointGoalX: int16_t
  /**
   * Serial UDB Extra Current Waypoint Goal Y
   */
  sueWaypointGoalY: int16_t
  /**
   * Serial UDB Extra Current Waypoint Goal Z
   */
  sueWaypointGoalZ: int16_t
  /**
   * Aeroforce in UDB X Axis
   */
  sueAeroX: int16_t
  /**
   * Aeroforce in UDB Y Axis
   */
  sueAeroY: int16_t
  /**
   * Aeroforce in UDB Z axis
   */
  sueAeroZ: int16_t
  /**
   * SUE barometer temperature
   */
  sueBaromTemp: int16_t
  /**
   * SUE barometer pressure
   */
  sueBaromPress: int32_t
  /**
   * SUE barometer altitude
   */
  sueBaromAlt: int32_t
  /**
   * SUE battery voltage
   */
  sueBatVolt: int16_t
  /**
   * SUE battery current
   */
  sueBatAmp: int16_t
  /**
   * SUE battery milli amp hours used
   */
  sueBatAmpHours: int16_t
  /**
   * Sue autopilot desired height
   */
  sueDesiredHeight: int16_t
  /**
   * Serial UDB Extra Stack Memory Free
   */
  sueMemoryStackFree: int16_t
}

/**
 * Backwards compatible version of SERIAL_UDB_EXTRA F4: format
 */
export class SerialUdbExtraF4 extends MavLinkData {
  static MSG_ID = 172
  static MSG_NAME = 'SERIAL_UDB_EXTRA_F4'
  static PAYLOAD_LENGTH = 10
  static MAGIC_NUMBER = 191

  static FIELDS = [
    new MavLinkPacketField('sueROLLSTABILIZATIONAILERONS', 0, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sueROLLSTABILIZATIONRUDDER', 1, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('suePITCHSTABILIZATION', 2, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sueYAWSTABILIZATIONRUDDER', 3, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sueYAWSTABILIZATIONAILERON', 4, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sueAILERONNAVIGATION', 5, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sueRUDDERNAVIGATION', 6, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sueALTITUDEHOLDSTABILIZED', 7, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sueALTITUDEHOLDWAYPOINT', 8, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sueRACINGMODE', 9, false, 1, 'uint8_t', ''),
  ]

  /**
   * Serial UDB Extra Roll Stabilization with Ailerons Enabled
   */
  sueROLLSTABILIZATIONAILERONS: uint8_t
  /**
   * Serial UDB Extra Roll Stabilization with Rudder Enabled
   */
  sueROLLSTABILIZATIONRUDDER: uint8_t
  /**
   * Serial UDB Extra Pitch Stabilization Enabled
   */
  suePITCHSTABILIZATION: uint8_t
  /**
   * Serial UDB Extra Yaw Stabilization using Rudder Enabled
   */
  sueYAWSTABILIZATIONRUDDER: uint8_t
  /**
   * Serial UDB Extra Yaw Stabilization using Ailerons Enabled
   */
  sueYAWSTABILIZATIONAILERON: uint8_t
  /**
   * Serial UDB Extra Navigation with Ailerons Enabled
   */
  sueAILERONNAVIGATION: uint8_t
  /**
   * Serial UDB Extra Navigation with Rudder Enabled
   */
  sueRUDDERNAVIGATION: uint8_t
  /**
   * Serial UDB Extra Type of Alitude Hold when in Stabilized Mode
   */
  sueALTITUDEHOLDSTABILIZED: uint8_t
  /**
   * Serial UDB Extra Type of Alitude Hold when in Waypoint Mode
   */
  sueALTITUDEHOLDWAYPOINT: uint8_t
  /**
   * Serial UDB Extra Firmware racing mode enabled
   */
  sueRACINGMODE: uint8_t
}

/**
 * Backwards compatible version of SERIAL_UDB_EXTRA F5: format
 */
export class RangeFinder extends MavLinkData {
  static MSG_ID = 173
  static MSG_NAME = 'SERIAL_UDB_EXTRA_F5'
  static PAYLOAD_LENGTH = 16
  static MAGIC_NUMBER = 54

  static FIELDS = [
    new MavLinkPacketField('sueYAWKPAILERON', 0, false, 4, 'float', ''),
    new MavLinkPacketField('sueYAWKDAILERON', 4, false, 4, 'float', ''),
    new MavLinkPacketField('sueROLLKP', 8, false, 4, 'float', ''),
    new MavLinkPacketField('sueROLLKD', 12, false, 4, 'float', ''),
  ]

  /**
   * Serial UDB YAWKP_AILERON Gain for Proporional control of navigation
   */
  sueYAWKPAILERON: float
  /**
   * Serial UDB YAWKD_AILERON Gain for Rate control of navigation
   */
  sueYAWKDAILERON: float
  /**
   * Serial UDB Extra ROLLKP Gain for Proportional control of roll stabilization
   */
  sueROLLKP: float
  /**
   * Serial UDB Extra ROLLKD Gain for Rate control of roll stabilization
   */
  sueROLLKD: float
}

/**
 * Backwards compatible version of SERIAL_UDB_EXTRA F6: format
 */
export class SerialUdbExtraF6 extends MavLinkData {
  static MSG_ID = 174
  static MSG_NAME = 'SERIAL_UDB_EXTRA_F6'
  static PAYLOAD_LENGTH = 20
  static MAGIC_NUMBER = 54

  static FIELDS = [
    new MavLinkPacketField('suePITCHGAIN', 0, false, 4, 'float', ''),
    new MavLinkPacketField('suePITCHKD', 4, false, 4, 'float', ''),
    new MavLinkPacketField('sueRUDDERELEVMIX', 8, false, 4, 'float', ''),
    new MavLinkPacketField('sueROLLELEVMIX', 12, false, 4, 'float', ''),
    new MavLinkPacketField('sueELEVATORBOOST', 16, false, 4, 'float', ''),
  ]

  /**
   * Serial UDB Extra PITCHGAIN Proportional Control
   */
  suePITCHGAIN: float
  /**
   * Serial UDB Extra Pitch Rate Control
   */
  suePITCHKD: float
  /**
   * Serial UDB Extra Rudder to Elevator Mix
   */
  sueRUDDERELEVMIX: float
  /**
   * Serial UDB Extra Roll to Elevator Mix
   */
  sueROLLELEVMIX: float
  /**
   * Gain For Boosting Manual Elevator control When Plane Stabilized
   */
  sueELEVATORBOOST: float
}

/**
 * Backwards compatible version of SERIAL_UDB_EXTRA F7: format
 */
export class SerialUdbExtraF7 extends MavLinkData {
  static MSG_ID = 175
  static MSG_NAME = 'SERIAL_UDB_EXTRA_F7'
  static PAYLOAD_LENGTH = 24
  static MAGIC_NUMBER = 171

  static FIELDS = [
    new MavLinkPacketField('sueYAWKPRUDDER', 0, false, 4, 'float', ''),
    new MavLinkPacketField('sueYAWKDRUDDER', 4, false, 4, 'float', ''),
    new MavLinkPacketField('sueROLLKPRUDDER', 8, false, 4, 'float', ''),
    new MavLinkPacketField('sueROLLKDRUDDER', 12, false, 4, 'float', ''),
    new MavLinkPacketField('sueRUDDERBOOST', 16, false, 4, 'float', ''),
    new MavLinkPacketField('sueRTLPITCHDOWN', 20, false, 4, 'float', ''),
  ]

  /**
   * Serial UDB YAWKP_RUDDER Gain for Proporional control of navigation
   */
  sueYAWKPRUDDER: float
  /**
   * Serial UDB YAWKD_RUDDER Gain for Rate control of navigation
   */
  sueYAWKDRUDDER: float
  /**
   * Serial UDB Extra ROLLKP_RUDDER Gain for Proportional control of roll stabilization
   */
  sueROLLKPRUDDER: float
  /**
   * Serial UDB Extra ROLLKD_RUDDER Gain for Rate control of roll stabilization
   */
  sueROLLKDRUDDER: float
  /**
   * SERIAL UDB EXTRA Rudder Boost Gain to Manual Control when stabilized
   */
  sueRUDDERBOOST: float
  /**
   * Serial UDB Extra Return To Landing - Angle to Pitch Plane Down
   */
  sueRTLPITCHDOWN: float
}

/**
 * Backwards compatible version of SERIAL_UDB_EXTRA F8: format
 */
export class SerialUdbExtraF8 extends MavLinkData {
  static MSG_ID = 176
  static MSG_NAME = 'SERIAL_UDB_EXTRA_F8'
  static PAYLOAD_LENGTH = 28
  static MAGIC_NUMBER = 142

  static FIELDS = [
    new MavLinkPacketField('sueHEIGHTTARGETMAX', 0, false, 4, 'float', ''),
    new MavLinkPacketField('sueHEIGHTTARGETMIN', 4, false, 4, 'float', ''),
    new MavLinkPacketField('sueALTHOLDTHROTTLEMIN', 8, false, 4, 'float', ''),
    new MavLinkPacketField('sueALTHOLDTHROTTLEMAX', 12, false, 4, 'float', ''),
    new MavLinkPacketField('sueALTHOLDPITCHMIN', 16, false, 4, 'float', ''),
    new MavLinkPacketField('sueALTHOLDPITCHMAX', 20, false, 4, 'float', ''),
    new MavLinkPacketField('sueALTHOLDPITCHHIGH', 24, false, 4, 'float', ''),
  ]

  /**
   * Serial UDB Extra HEIGHT_TARGET_MAX
   */
  sueHEIGHTTARGETMAX: float
  /**
   * Serial UDB Extra HEIGHT_TARGET_MIN
   */
  sueHEIGHTTARGETMIN: float
  /**
   * Serial UDB Extra ALT_HOLD_THROTTLE_MIN
   */
  sueALTHOLDTHROTTLEMIN: float
  /**
   * Serial UDB Extra ALT_HOLD_THROTTLE_MAX
   */
  sueALTHOLDTHROTTLEMAX: float
  /**
   * Serial UDB Extra ALT_HOLD_PITCH_MIN
   */
  sueALTHOLDPITCHMIN: float
  /**
   * Serial UDB Extra ALT_HOLD_PITCH_MAX
   */
  sueALTHOLDPITCHMAX: float
  /**
   * Serial UDB Extra ALT_HOLD_PITCH_HIGH
   */
  sueALTHOLDPITCHHIGH: float
}

/**
 * Backwards compatible version of SERIAL_UDB_EXTRA F13: format
 */
export class CompassMotStatus extends MavLinkData {
  static MSG_ID = 177
  static MSG_NAME = 'SERIAL_UDB_EXTRA_F13'
  static PAYLOAD_LENGTH = 14
  static MAGIC_NUMBER = 249

  static FIELDS = [
    new MavLinkPacketField('sueLatOrigin', 0, false, 4, 'int32_t', ''),
    new MavLinkPacketField('sueLonOrigin', 4, false, 4, 'int32_t', ''),
    new MavLinkPacketField('sueAltOrigin', 8, false, 4, 'int32_t', ''),
    new MavLinkPacketField('sueWeekNo', 12, false, 2, 'int16_t', ''),
  ]

  /**
   * Serial UDB Extra GPS Week Number
   */
  sueWeekNo: int16_t
  /**
   * Serial UDB Extra MP Origin Latitude
   */
  sueLatOrigin: int32_t
  /**
   * Serial UDB Extra MP Origin Longitude
   */
  sueLonOrigin: int32_t
  /**
   * Serial UDB Extra MP Origin Altitude Above Sea Level
   */
  sueAltOrigin: int32_t
}

/**
 * Backwards compatible version of SERIAL_UDB_EXTRA F14: format
 */
export class SerialUdbExtraF14 extends MavLinkData {
  static MSG_ID = 178
  static MSG_NAME = 'SERIAL_UDB_EXTRA_F14'
  static PAYLOAD_LENGTH = 17
  static MAGIC_NUMBER = 123

  static FIELDS = [
    new MavLinkPacketField('sueTRAPSOURCE', 0, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('sueRCON', 4, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueTRAPFLAGS', 6, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueOscFailCount', 8, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueWINDESTIMATION', 10, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sueGPSTYPE', 11, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sueDR', 12, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sueBOARDTYPE', 13, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sueAIRFRAME', 14, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sueCLOCKCONFIG', 15, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sueFLIGHTPLANTYPE', 16, false, 1, 'uint8_t', ''),
  ]

  /**
   * Serial UDB Extra Wind Estimation Enabled
   */
  sueWINDESTIMATION: uint8_t
  /**
   * Serial UDB Extra Type of GPS Unit
   */
  sueGPSTYPE: uint8_t
  /**
   * Serial UDB Extra Dead Reckoning Enabled
   */
  sueDR: uint8_t
  /**
   * Serial UDB Extra Type of UDB Hardware
   */
  sueBOARDTYPE: uint8_t
  /**
   * Serial UDB Extra Type of Airframe
   */
  sueAIRFRAME: uint8_t
  /**
   * Serial UDB Extra Reboot Register of DSPIC
   */
  sueRCON: int16_t
  /**
   * Serial UDB Extra Last dspic Trap Flags
   */
  sueTRAPFLAGS: int16_t
  /**
   * Serial UDB Extra Type Program Address of Last Trap
   */
  sueTRAPSOURCE: uint32_t
  /**
   * Serial UDB Extra Number of Ocillator Failures
   */
  sueOscFailCount: int16_t
  /**
   * Serial UDB Extra UDB Internal Clock Configuration
   */
  sueCLOCKCONFIG: uint8_t
  /**
   * Serial UDB Extra Type of Flight Plan
   */
  sueFLIGHTPLANTYPE: uint8_t
}

/**
 * Backwards compatible version of SERIAL_UDB_EXTRA F15 format
 */
export class SerialUdbExtraF15 extends MavLinkData {
  static MSG_ID = 179
  static MSG_NAME = 'SERIAL_UDB_EXTRA_F15'
  static PAYLOAD_LENGTH = 60
  static MAGIC_NUMBER = 7

  static FIELDS = [
    new MavLinkPacketField('sueIDVEHICLEMODELNAME', 0, false, 1, 'uint8_t[]', '', 40),
    new MavLinkPacketField('sueIDVEHICLEREGISTRATION', 40, false, 1, 'uint8_t[]', '', 20),
  ]

  /**
   * Serial UDB Extra Model Name Of Vehicle
   */
  sueIDVEHICLEMODELNAME: uint8_t[]
  /**
   * Serial UDB Extra Registraton Number of Vehicle
   */
  sueIDVEHICLEREGISTRATION: uint8_t[]
}

/**
 * Backwards compatible version of SERIAL_UDB_EXTRA F16 format
 */
export class SerialUdbExtraF16 extends MavLinkData {
  static MSG_ID = 180
  static MSG_NAME = 'SERIAL_UDB_EXTRA_F16'
  static PAYLOAD_LENGTH = 110
  static MAGIC_NUMBER = 222

  static FIELDS = [
    new MavLinkPacketField('sueIDLEADPILOT', 0, false, 1, 'uint8_t[]', '', 40),
    new MavLinkPacketField('sueIDDIYDRONESURL', 40, false, 1, 'uint8_t[]', '', 70),
  ]

  /**
   * Serial UDB Extra Name of Expected Lead Pilot
   */
  sueIDLEADPILOT: uint8_t[]
  /**
   * Serial UDB Extra URL of Lead Pilot or Team
   */
  sueIDDIYDRONESURL: uint8_t[]
}

/**
 * The altitude measured by sensors and IMU
 */
export class Altitudes extends MavLinkData {
  static MSG_ID = 181
  static MSG_NAME = 'ALTITUDES'
  static PAYLOAD_LENGTH = 28
  static MAGIC_NUMBER = 55

  static FIELDS = [
    new MavLinkPacketField('timeBootMs', 0, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('altGps', 4, false, 4, 'int32_t', ''),
    new MavLinkPacketField('altImu', 8, false, 4, 'int32_t', ''),
    new MavLinkPacketField('altBarometric', 12, false, 4, 'int32_t', ''),
    new MavLinkPacketField('altOpticalFlow', 16, false, 4, 'int32_t', ''),
    new MavLinkPacketField('altRangeFinder', 20, false, 4, 'int32_t', ''),
    new MavLinkPacketField('altExtra', 24, false, 4, 'int32_t', ''),
  ]

  /**
   * Timestamp (milliseconds since system boot)
   */
  timeBootMs: uint32_t
  /**
   * GPS altitude (MSL) in meters, expressed as * 1000 (millimeters)
   */
  altGps: int32_t
  /**
   * IMU altitude above ground in meters, expressed as * 1000 (millimeters)
   */
  altImu: int32_t
  /**
   * barometeric altitude above ground in meters, expressed as * 1000 (millimeters)
   */
  altBarometric: int32_t
  /**
   * Optical flow altitude above ground in meters, expressed as * 1000 (millimeters)
   */
  altOpticalFlow: int32_t
  /**
   * Rangefinder Altitude above ground in meters, expressed as * 1000 (millimeters)
   */
  altRangeFinder: int32_t
  /**
   * Extra altitude above ground in meters, expressed as * 1000 (millimeters)
   */
  altExtra: int32_t
}

/**
 * The airspeed measured by sensors and IMU
 */
export class Airspeeds extends MavLinkData {
  static MSG_ID = 182
  static MSG_NAME = 'AIRSPEEDS'
  static PAYLOAD_LENGTH = 16
  static MAGIC_NUMBER = 154

  static FIELDS = [
    new MavLinkPacketField('timeBootMs', 0, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('airspeedImu', 4, false, 2, 'int16_t', ''),
    new MavLinkPacketField('airspeedPitot', 6, false, 2, 'int16_t', ''),
    new MavLinkPacketField('airspeedHotWire', 8, false, 2, 'int16_t', ''),
    new MavLinkPacketField('airspeedUltrasonic', 10, false, 2, 'int16_t', ''),
    new MavLinkPacketField('aoa', 12, false, 2, 'int16_t', ''),
    new MavLinkPacketField('aoy', 14, false, 2, 'int16_t', ''),
  ]

  /**
   * Timestamp (milliseconds since system boot)
   */
  timeBootMs: uint32_t
  /**
   * Airspeed estimate from IMU, cm/s
   */
  airspeedImu: int16_t
  /**
   * Pitot measured forward airpseed, cm/s
   */
  airspeedPitot: int16_t
  /**
   * Hot wire anenometer measured airspeed, cm/s
   */
  airspeedHotWire: int16_t
  /**
   * Ultrasonic measured airspeed, cm/s
   */
  airspeedUltrasonic: int16_t
  /**
   * Angle of attack sensor, degrees * 10
   */
  aoa: int16_t
  /**
   * Yaw angle sensor, degrees * 10
   */
  aoy: int16_t
}

/**
 * Backwards compatible version of SERIAL_UDB_EXTRA F17 format
 */
export class SerialUdbExtraF17 extends MavLinkData {
  static MSG_ID = 183
  static MSG_NAME = 'SERIAL_UDB_EXTRA_F17'
  static PAYLOAD_LENGTH = 12
  static MAGIC_NUMBER = 175

  static FIELDS = [
    new MavLinkPacketField('sueFeedForward', 0, false, 4, 'float', ''),
    new MavLinkPacketField('sueTurnRateNav', 4, false, 4, 'float', ''),
    new MavLinkPacketField('sueTurnRateFbw', 8, false, 4, 'float', ''),
  ]

  /**
   * SUE Feed Forward Gain
   */
  sueFeedForward: float
  /**
   * SUE Max Turn Rate when Navigating
   */
  sueTurnRateNav: float
  /**
   * SUE Max Turn Rate in Fly By Wire Mode
   */
  sueTurnRateFbw: float
}

/**
 * Backwards compatible version of SERIAL_UDB_EXTRA F18 format
 */
export class SerialUdbExtraF18 extends MavLinkData {
  static MSG_ID = 184
  static MSG_NAME = 'SERIAL_UDB_EXTRA_F18'
  static PAYLOAD_LENGTH = 20
  static MAGIC_NUMBER = 41

  static FIELDS = [
    new MavLinkPacketField('angleOfAttackNormal', 0, false, 4, 'float', ''),
    new MavLinkPacketField('angleOfAttackInverted', 4, false, 4, 'float', ''),
    new MavLinkPacketField('elevatorTrimNormal', 8, false, 4, 'float', ''),
    new MavLinkPacketField('elevatorTrimInverted', 12, false, 4, 'float', ''),
    new MavLinkPacketField('referenceSpeed', 16, false, 4, 'float', ''),
  ]

  /**
   * SUE Angle of Attack Normal
   */
  angleOfAttackNormal: float
  /**
   * SUE Angle of Attack Inverted
   */
  angleOfAttackInverted: float
  /**
   * SUE Elevator Trim Normal
   */
  elevatorTrimNormal: float
  /**
   * SUE Elevator Trim Inverted
   */
  elevatorTrimInverted: float
  /**
   * SUE reference_speed
   */
  referenceSpeed: float
}

/**
 * Backwards compatible version of SERIAL_UDB_EXTRA F19 format
 */
export class SerialUdbExtraF19 extends MavLinkData {
  static MSG_ID = 185
  static MSG_NAME = 'SERIAL_UDB_EXTRA_F19'
  static PAYLOAD_LENGTH = 8
  static MAGIC_NUMBER = 87

  static FIELDS = [
    new MavLinkPacketField('sueAileronOutputChannel', 0, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sueAileronReversed', 1, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sueElevatorOutputChannel', 2, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sueElevatorReversed', 3, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sueThrottleOutputChannel', 4, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sueThrottleReversed', 5, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sueRudderOutputChannel', 6, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('sueRudderReversed', 7, false, 1, 'uint8_t', ''),
  ]

  /**
   * SUE aileron output channel
   */
  sueAileronOutputChannel: uint8_t
  /**
   * SUE aileron reversed
   */
  sueAileronReversed: uint8_t
  /**
   * SUE elevator output channel
   */
  sueElevatorOutputChannel: uint8_t
  /**
   * SUE elevator reversed
   */
  sueElevatorReversed: uint8_t
  /**
   * SUE throttle output channel
   */
  sueThrottleOutputChannel: uint8_t
  /**
   * SUE throttle reversed
   */
  sueThrottleReversed: uint8_t
  /**
   * SUE rudder output channel
   */
  sueRudderOutputChannel: uint8_t
  /**
   * SUE rudder reversed
   */
  sueRudderReversed: uint8_t
}

/**
 * Backwards compatible version of SERIAL_UDB_EXTRA F20 format
 */
export class SerialUdbExtraF20 extends MavLinkData {
  static MSG_ID = 186
  static MSG_NAME = 'SERIAL_UDB_EXTRA_F20'
  static PAYLOAD_LENGTH = 25
  static MAGIC_NUMBER = 144

  static FIELDS = [
    new MavLinkPacketField('sueTrimValueInput1', 0, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueTrimValueInput2', 2, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueTrimValueInput3', 4, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueTrimValueInput4', 6, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueTrimValueInput5', 8, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueTrimValueInput6', 10, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueTrimValueInput7', 12, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueTrimValueInput8', 14, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueTrimValueInput9', 16, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueTrimValueInput10', 18, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueTrimValueInput11', 20, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueTrimValueInput12', 22, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueNumberOfInputs', 24, false, 1, 'uint8_t', ''),
  ]

  /**
   * SUE Number of Input Channels
   */
  sueNumberOfInputs: uint8_t
  /**
   * SUE UDB PWM Trim Value on Input 1
   */
  sueTrimValueInput1: int16_t
  /**
   * SUE UDB PWM Trim Value on Input 2
   */
  sueTrimValueInput2: int16_t
  /**
   * SUE UDB PWM Trim Value on Input 3
   */
  sueTrimValueInput3: int16_t
  /**
   * SUE UDB PWM Trim Value on Input 4
   */
  sueTrimValueInput4: int16_t
  /**
   * SUE UDB PWM Trim Value on Input 5
   */
  sueTrimValueInput5: int16_t
  /**
   * SUE UDB PWM Trim Value on Input 6
   */
  sueTrimValueInput6: int16_t
  /**
   * SUE UDB PWM Trim Value on Input 7
   */
  sueTrimValueInput7: int16_t
  /**
   * SUE UDB PWM Trim Value on Input 8
   */
  sueTrimValueInput8: int16_t
  /**
   * SUE UDB PWM Trim Value on Input 9
   */
  sueTrimValueInput9: int16_t
  /**
   * SUE UDB PWM Trim Value on Input 10
   */
  sueTrimValueInput10: int16_t
  /**
   * SUE UDB PWM Trim Value on Input 11
   */
  sueTrimValueInput11: int16_t
  /**
   * SUE UDB PWM Trim Value on Input 12
   */
  sueTrimValueInput12: int16_t
}

/**
 * Backwards compatible version of SERIAL_UDB_EXTRA F21 format
 */
export class SerialUdbExtraF21 extends MavLinkData {
  static MSG_ID = 187
  static MSG_NAME = 'SERIAL_UDB_EXTRA_F21'
  static PAYLOAD_LENGTH = 12
  static MAGIC_NUMBER = 134

  static FIELDS = [
    new MavLinkPacketField('sueAccelXOffset', 0, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueAccelYOffset', 2, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueAccelZOffset', 4, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueGyroXOffset', 6, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueGyroYOffset', 8, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueGyroZOffset', 10, false, 2, 'int16_t', ''),
  ]

  /**
   * SUE X accelerometer offset
   */
  sueAccelXOffset: int16_t
  /**
   * SUE Y accelerometer offset
   */
  sueAccelYOffset: int16_t
  /**
   * SUE Z accelerometer offset
   */
  sueAccelZOffset: int16_t
  /**
   * SUE X gyro offset
   */
  sueGyroXOffset: int16_t
  /**
   * SUE Y gyro offset
   */
  sueGyroYOffset: int16_t
  /**
   * SUE Z gyro offset
   */
  sueGyroZOffset: int16_t
}

/**
 * Backwards compatible version of SERIAL_UDB_EXTRA F22 format
 */
export class SerialUdbExtraF22 extends MavLinkData {
  static MSG_ID = 188
  static MSG_NAME = 'SERIAL_UDB_EXTRA_F22'
  static PAYLOAD_LENGTH = 12
  static MAGIC_NUMBER = 91

  static FIELDS = [
    new MavLinkPacketField('sueAccelXAtCalibration', 0, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueAccelYAtCalibration', 2, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueAccelZAtCalibration', 4, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueGyroXAtCalibration', 6, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueGyroYAtCalibration', 8, false, 2, 'int16_t', ''),
    new MavLinkPacketField('sueGyroZAtCalibration', 10, false, 2, 'int16_t', ''),
  ]

  /**
   * SUE X accelerometer at calibration time
   */
  sueAccelXAtCalibration: int16_t
  /**
   * SUE Y accelerometer at calibration time
   */
  sueAccelYAtCalibration: int16_t
  /**
   * SUE Z accelerometer at calibration time
   */
  sueAccelZAtCalibration: int16_t
  /**
   * SUE X gyro at calibration time
   */
  sueGyroXAtCalibration: int16_t
  /**
   * SUE Y gyro at calibration time
   */
  sueGyroYAtCalibration: int16_t
  /**
   * SUE Z gyro at calibration time
   */
  sueGyroZAtCalibration: int16_t
}

export const REGISTRY = {
  150: FlexifunctionSet,
  151: FlexifunctionReadReq,
  152: MemInfo,
  153: FlexifunctionBufferFunctionAck,
  155: FlexifunctionDirectory,
  156: FlexifunctionDirectoryAck,
  157: FlexifunctionCommand,
  158: FlexifunctionCommandAck,
  170: SerialUdbExtraF2A,
  171: SerialUdbExtraF2B,
  172: SerialUdbExtraF4,
  173: RangeFinder,
  174: SerialUdbExtraF6,
  175: SerialUdbExtraF7,
  176: SerialUdbExtraF8,
  177: CompassMotStatus,
  178: SerialUdbExtraF14,
  179: SerialUdbExtraF15,
  180: SerialUdbExtraF16,
  181: Altitudes,
  182: Airspeeds,
  183: SerialUdbExtraF17,
  184: SerialUdbExtraF18,
  185: SerialUdbExtraF19,
  186: SerialUdbExtraF20,
  187: SerialUdbExtraF21,
  188: SerialUdbExtraF22,
}
