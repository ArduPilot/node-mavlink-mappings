import {
  uint8_t,
  uint16_t,
  uint32_t,
  float,
} from './types'

import {
  MavLinkPacketField,
  MavLinkData
} from './mavlink'

import {
  GimbalDeviceErrorFlags,
} from './common'

/**
 * MAV_STORM32_TUNNEL_PAYLOAD_TYPE
 */
export enum MavStorm32TunnelPayloadType {
  'STORM32_CH1_IN'                             = 200,
  'STORM32_CH1_OUT'                            = 201,
  'STORM32_CH2_IN'                             = 202,
  'STORM32_CH2_OUT'                            = 203,
  'STORM32_CH3_IN'                             = 204,
  'STORM32_CH3_OUT'                            = 205,
  'STORM32_RESERVED6'                          = 206,
  'STORM32_RESERVED7'                          = 207,
  'STORM32_RESERVED8'                          = 208,
  'STORM32_RESERVED9'                          = 209,
}

/**
 * STorM32 gimbal prearm check flags.
 */
export enum MavStorm32GimbalPrearmFlags {
  'IS_NORMAL'                                  = 1,
  'IMUS_WORKING'                               = 2,
  'MOTORS_WORKING'                             = 4,
  'ENCODERS_WORKING'                           = 8,
  'VOLTAGE_OK'                                 = 16,
  'VIRTUALCHANNELS_RECEIVING'                  = 32,
  'MAVLINK_RECEIVING'                          = 64,
  'STORM32LINK_QFIX'                           = 128,
  'STORM32LINK_WORKING'                        = 256,
  'CAMERA_CONNECTED'                           = 512,
  'AUX0_LOW'                                   = 1024,
  'AUX1_LOW'                                   = 2048,
  'NTLOGGER_WORKING'                           = 4096,
}

/**
 * STorM32 camera prearm check flags.
 */
export enum MavStorm32CameraPrearmFlags {
  'CONNECTED'                                  = 1,
}

/**
 * Gimbal device capability flags.
 */
export enum MavStorm32GimbalDeviceCapFlags {
  'HAS_RETRACT'                                = 1,
  /**
   * Gimbal device supports a horizontal, forward looking position, stabilized. Can also be used to reset
   * the gimbal's orientation.
   */
  'HAS_NEUTRAL'                                = 2,
  'HAS_ROLL_AXIS'                              = 4,
  'HAS_ROLL_FOLLOW'                            = 8,
  'HAS_ROLL_LOCK'                              = 16,
  'HAS_PITCH_AXIS'                             = 32,
  'HAS_PITCH_FOLLOW'                           = 64,
  'HAS_PITCH_LOCK'                             = 128,
  'HAS_YAW_AXIS'                               = 256,
  'HAS_YAW_FOLLOW'                             = 512,
  'HAS_YAW_LOCK'                               = 1024,
  'HAS_INFINITE_YAW'                           = 2048,
  /**
   * Gimbal device supports absolute yaw angles (this usually requires support by an autopilot, and can
   * be dynamic, i.e., go on and off during runtime).
   */
  'HAS_ABSOLUTE_YAW'                           = 65536,
  'HAS_RC'                                     = 131072,
}

/**
 * Flags for gimbal device operation. Used for setting and reporting, unless specified otherwise.
 * Settings which are in violation of the capability flags are ignored by the gimbal device.
 */
export enum MavStorm32GimbalDeviceFlags {
  /**
   * Retracted safe position (no stabilization), takes presedence over NEUTRAL flag. If supported by the
   * gimbal, the angles in the retracted position can be set in addition.
   */
  'RETRACT'                                    = 1,
  'NEUTRAL'                                    = 2,
  /**
   * Lock roll angle to absolute angle relative to horizon (not relative to drone). This is generally the
   * default.
   */
  'ROLL_LOCK'                                  = 4,
  /**
   * Lock pitch angle to absolute angle relative to horizon (not relative to drone). This is generally
   * the default.
   */
  'PITCH_LOCK'                                 = 8,
  /**
   * Lock yaw angle to absolute angle relative to earth (not relative to drone). When the YAW_ABSOLUTE
   * flag is set, the quaternion is in the Earth frame with the x-axis pointing North (yaw absolute),
   * else it is in the Earth frame rotated so that the x-axis is pointing forward (yaw relative to
   * vehicle).
   */
  'YAW_LOCK'                                   = 16,
  /**
   * Gimbal device can accept absolute yaw angle input. This flag cannot be set, is only for reporting
   * (attempts to set it are rejected by the gimbal device).
   */
  'CAN_ACCEPT_YAW_ABSOLUTE'                    = 256,
  /**
   * Yaw angle is absolute (is only accepted if CAN_ACCEPT_YAW_ABSOLUTE is set). If this flag is set, the
   * quaternion is in the Earth frame with the x-axis pointing North (yaw absolute), else it is in the
   * Earth frame rotated so that the x-axis is pointing forward (yaw relative to vehicle).
   */
  'YAW_ABSOLUTE'                               = 512,
  /**
   * RC control. The RC input signal fed to the gimbal device exclusively controls the gimbal's
   * orientation. Overrides RC_MIXED flag if that is also set.
   */
  'RC_EXCLUSIVE'                               = 1024,
  /**
   * RC control. The RC input signal fed to the gimbal device is mixed into the gimbal's orientation. Is
   * overriden by RC_EXCLUSIVE flag if that is also set.
   */
  'RC_MIXED'                                   = 2048,
  'NONE'                                       = 65535,
}

/**
 * Gimbal device error and condition flags (0 means no error or other condition).
 */
export enum MavStorm32GimbalDeviceErrorFlags {
  'AT_ROLL_LIMIT'                              = 1,
  'AT_PITCH_LIMIT'                             = 2,
  'AT_YAW_LIMIT'                               = 4,
  'ENCODER_ERROR'                              = 8,
  'POWER_ERROR'                                = 16,
  'MOTOR_ERROR'                                = 32,
  'SOFTWARE_ERROR'                             = 64,
  'COMMS_ERROR'                                = 128,
  'CALIBRATION_RUNNING'                        = 256,
  'NO_MANAGER'                                 = 32768,
}

/**
 * Gimbal manager capability flags.
 */
export enum MavStorm32GimbalManagerCapFlags {
  'HAS_PROFILES'                               = 1,
  /**
   * The gimbal manager supports changing the gimbal manager during run time, i.e. can be
   * enabled/disabled.
   */
  'SUPPORTS_CHANGE'                            = 2,
}

/**
 * Flags for gimbal manager operation. Used for setting and reporting, unless specified otherwise. If a
 * setting is accepted by the gimbal manger, is reported in the STORM32_GIMBAL_MANAGER_STATUS message.
 */
export enum MavStorm32GimbalManagerFlags {
  'NONE'                                       = 0,
  /**
   * Request to set RC input to active, or report RC input is active. Implies RC mixed. RC exclusive is
   * achieved by setting all clients to inactive.
   */
  'RC_ACTIVE'                                  = 1,
  'CLIENT_ONBOARD_ACTIVE'                      = 2,
  'CLIENT_AUTOPILOT_ACTIVE'                    = 4,
  'CLIENT_GCS_ACTIVE'                          = 8,
  'CLIENT_CAMERA_ACTIVE'                       = 16,
  'CLIENT_GCS2_ACTIVE'                         = 32,
  'CLIENT_CAMERA2_ACTIVE'                      = 64,
  'CLIENT_CUSTOM_ACTIVE'                       = 128,
  'CLIENT_CUSTOM2_ACTIVE'                      = 256,
  'SET_SUPERVISON'                             = 512,
  'SET_RELEASE'                                = 1024,
}

/**
 * Gimbal manager client ID. In a prioritizing profile, the priorities are determined by the
 * implementation; they could e.g. be custom1 > onboard > GCS > autopilot/camera > GCS2 > custom2.
 */
export enum MavStorm32GimbalManagerClient {
  'NONE'                                       = 0,
  'ONBOARD'                                    = 1,
  'AUTOPILOT'                                  = 2,
  'GCS'                                        = 3,
  'CAMERA'                                     = 4,
  'GCS2'                                       = 5,
  'CAMERA2'                                    = 6,
  'CUSTOM'                                     = 7,
  'CUSTOM2'                                    = 8,
}

/**
 * Flags for gimbal manager set up. Used for setting and reporting, unless specified otherwise.
 */
export enum MavStorm32GimbalManagerSetupFlags {
  'ENABLE'                                     = 16384,
  'DISABLE'                                    = 32768,
}

/**
 * Gimbal manager profiles. Only standard profiles are defined. Any implementation can define it's own
 * profile in addition, and should use enum values > 16.
 */
export enum MavStorm32GimbalManagerProfile {
  'DEFAULT'                                    = 0,
  /**
   * Custom profile. Configurable profile according to the STorM32 definition. Is configured with
   * STORM32_GIMBAL_MANAGER_PROFIL.
   */
  'CUSTOM'                                     = 1,
  /**
   * Default cooperative profile. Uses STorM32 custom profile with default settings to achieve
   * cooperative behavior.
   */
  'COOPERATIVE'                                = 2,
  /**
   * Default exclusive profile. Uses STorM32 custom profile with default settings to achieve exclusive
   * behavior.
   */
  'EXCLUSIVE'                                  = 3,
  /**
   * Default priority profile with cooperative behavior for equal priority. Uses STorM32 custom profile
   * with default settings to achieve priority-based behavior.
   */
  'PRIORITY_COOPERATIVE'                       = 4,
  /**
   * Default priority profile with exclusive behavior for equal priority. Uses STorM32 custom profile
   * with default settings to achieve priority-based behavior.
   */
  'PRIORITY_EXCLUSIVE'                         = 5,
}

/**
 * Gimbal actions.
 */
export enum MavStorm32GimbalAction {
  'RECENTER'                                   = 1,
  'CALIBRATION'                                = 2,
  'DISCOVER_MANAGER'                           = 3,
}

/**
 * Enumeration of possible shot modes.
 */
export enum MavQshotMode {
  'UNDEFINED'                                  = 0,
  'DEFAULT'                                    = 1,
  'GIMBAL_RETRACT'                             = 2,
  'GIMBAL_NEUTRAL'                             = 3,
  'GIMBAL_MISSION'                             = 4,
  'GIMBAL_RC_CONTROL'                          = 5,
  'POI_TARGETING'                              = 6,
  'SYSID_TARGETING'                            = 7,
  'CABLECAM_2POINT'                            = 8,
  'HOME_TARGETING'                             = 9,
}

/**
 * MAV_CMD
 */
export enum MavCmd {
  /**
   * Command to a gimbal manager to control the gimbal tilt and pan angles. It is possible to set
   * combinations of the values below. E.g. an angle as well as a desired angular rate can be used to get
   * to this angle at a certain angular rate, or an angular rate only will result in continuous turning.
   * NaN is to be used to signal unset. A gimbal device is never to react to this command.
   */
  'STORM32_DO_GIMBAL_MANAGER_CONTROL_PITCHYAW' = 60002,
  /**
   * Command to configure a gimbal manager. A gimbal device is never to react to this command. The
   * selected profile is reported in the STORM32_GIMBAL_MANAGER_STATUS message.
   */
  'STORM32_DO_GIMBAL_MANAGER_SETUP'            = 60010,
  /**
   * Command to initiate gimbal actions. Usually performed by the gimbal device, but some can also be
   * done by the gimbal manager. It is hence best to broadcast this command.
   */
  'STORM32_DO_GIMBAL_ACTION'                   = 60011,
  'QSHOT_DO_CONFIGURE'                         = 60020,
}

/**
 * Message reporting the current status of a gimbal device. This message should be broadcasted by a
 * gimbal device component at a low regular rate (e.g. 4 Hz). For higher rates it should be emitted
 * with a target.
 */
export class Storm32GimbalDeviceStatus extends MavLinkData {
  static MSG_ID = 60001
  static MSG_NAME = 'STORM32_GIMBAL_DEVICE_STATUS'
  static PAYLOAD_LENGTH = 42
  static MAGIC_NUMBER = 186

  static FIELDS = [
    new MavLinkPacketField('timeBootMs', 0, false, 4, 'uint32_t', 'ms'),
    new MavLinkPacketField('q', 4, false, 4, 'float[]', '', 4),
    new MavLinkPacketField('angularVelocityX', 20, false, 4, 'float', 'rad/s'),
    new MavLinkPacketField('angularVelocityY', 24, false, 4, 'float', 'rad/s'),
    new MavLinkPacketField('angularVelocityZ', 28, false, 4, 'float', 'rad/s'),
    new MavLinkPacketField('yawAbsolute', 32, false, 4, 'float', 'deg'),
    new MavLinkPacketField('flags', 36, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('failureFlags', 38, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('targetSystem', 40, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('targetComponent', 41, false, 1, 'uint8_t', ''),
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
   * Timestamp (time since system boot).
   */
  timeBootMs: uint32_t
  /**
   * Gimbal device flags currently applied.
   */
  flags: MavStorm32GimbalDeviceFlags
  /**
   * Quaternion components, w, x, y, z (1 0 0 0 is the null-rotation). The frame depends on the
   * STORM32_GIMBAL_DEVICE_FLAGS_YAW_ABSOLUTE flag.
   */
  q: float[]
  /**
   * X component of angular velocity (NaN if unknown).
   */
  angularVelocityX: float
  /**
   * Y component of angular velocity (NaN if unknown).
   */
  angularVelocityY: float
  /**
   * Z component of angular velocity (the frame depends on the STORM32_GIMBAL_DEVICE_FLAGS_YAW_ABSOLUTE
   * flag, NaN if unknown).
   */
  angularVelocityZ: float
  /**
   * Yaw in absolute frame relative to Earth's North, north is 0 (NaN if unknown).
   */
  yawAbsolute: float
  /**
   * Failure flags (0 for no failure).
   */
  failureFlags: GimbalDeviceErrorFlags
}

/**
 * Message to a gimbal device to control its attitude. This message is to be sent from the gimbal
 * manager to the gimbal device. Angles and rates can be set to NaN according to use case.
 */
export class Storm32GimbalDeviceControl extends MavLinkData {
  static MSG_ID = 60002
  static MSG_NAME = 'STORM32_GIMBAL_DEVICE_CONTROL'
  static PAYLOAD_LENGTH = 32
  static MAGIC_NUMBER = 69

  static FIELDS = [
    new MavLinkPacketField('q', 0, false, 4, 'float[]', '', 4),
    new MavLinkPacketField('angularVelocityX', 16, false, 4, 'float', 'rad/s'),
    new MavLinkPacketField('angularVelocityY', 20, false, 4, 'float', 'rad/s'),
    new MavLinkPacketField('angularVelocityZ', 24, false, 4, 'float', 'rad/s'),
    new MavLinkPacketField('flags', 28, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('targetSystem', 30, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('targetComponent', 31, false, 1, 'uint8_t', ''),
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
   * Gimbal device flags (UINT16_MAX to be ignored).
   */
  flags: MavStorm32GimbalDeviceFlags
  /**
   * Quaternion components, w, x, y, z (1 0 0 0 is the null-rotation, the frame is determined by the
   * STORM32_GIMBAL_DEVICE_FLAGS_YAW_ABSOLUTE flag, set first element to NaN to be ignored).
   */
  q: float[]
  /**
   * X component of angular velocity (positive: roll to the right, NaN to be ignored).
   */
  angularVelocityX: float
  /**
   * Y component of angular velocity (positive: tilt up, NaN to be ignored).
   */
  angularVelocityY: float
  /**
   * Z component of angular velocity (positive: pan to the right, the frame is determined by the
   * STORM32_GIMBAL_DEVICE_FLAGS_YAW_ABSOLUTE flag, NaN to be ignored).
   */
  angularVelocityZ: float
}

/**
 * Information about a gimbal manager. This message should be requested by a ground station using
 * MAV_CMD_REQUEST_MESSAGE. It mirrors some fields of the STORM32_GIMBAL_DEVICE_INFORMATION message,
 * but not all. If the additional information is desired, also STORM32_GIMBAL_DEVICE_INFORMATION should
 * be requested.
 */
export class Storm32GimbalManagerInformation extends MavLinkData {
  static MSG_ID = 60010
  static MSG_NAME = 'STORM32_GIMBAL_MANAGER_INFORMATION'
  static PAYLOAD_LENGTH = 33
  static MAGIC_NUMBER = 208

  static FIELDS = [
    new MavLinkPacketField('deviceCapFlags', 0, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('managerCapFlags', 4, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('rollMin', 8, false, 4, 'float', 'rad'),
    new MavLinkPacketField('rollMax', 12, false, 4, 'float', 'rad'),
    new MavLinkPacketField('pitchMin', 16, false, 4, 'float', 'rad'),
    new MavLinkPacketField('pitchMax', 20, false, 4, 'float', 'rad'),
    new MavLinkPacketField('yawMin', 24, false, 4, 'float', 'rad'),
    new MavLinkPacketField('yawMax', 28, false, 4, 'float', 'rad'),
    new MavLinkPacketField('gimbalId', 32, false, 1, 'uint8_t', ''),
  ]

  /**
   * Gimbal ID (component ID or 1-6 for non-MAVLink gimbal) that this gimbal manager is responsible for.
   */
  gimbalId: uint8_t
  /**
   * Gimbal device capability flags.
   */
  deviceCapFlags: MavStorm32GimbalDeviceCapFlags
  /**
   * Gimbal manager capability flags.
   */
  managerCapFlags: MavStorm32GimbalManagerCapFlags
  /**
   * Hardware minimum roll angle (positive: roll to the right, NaN if unknown).
   */
  rollMin: float
  /**
   * Hardware maximum roll angle (positive: roll to the right, NaN if unknown).
   */
  rollMax: float
  /**
   * Hardware minimum pitch/tilt angle (positive: tilt up, NaN if unknown).
   */
  pitchMin: float
  /**
   * Hardware maximum pitch/tilt angle (positive: tilt up, NaN if unknown).
   */
  pitchMax: float
  /**
   * Hardware minimum yaw/pan angle (positive: pan to the right, relative to the vehicle/gimbal base, NaN
   * if unknown).
   */
  yawMin: float
  /**
   * Hardware maximum yaw/pan angle (positive: pan to the right, relative to the vehicle/gimbal base, NaN
   * if unknown).
   */
  yawMax: float
}

/**
 * Message reporting the current status of a gimbal manager. This message should be broadcast at a low
 * regular rate (e.g. 1 Hz, may be increase momentarily to e.g. 5 Hz for a period of 1 sec after a
 * change).
 */
export class Storm32GimbalManagerStatus extends MavLinkData {
  static MSG_ID = 60011
  static MSG_NAME = 'STORM32_GIMBAL_MANAGER_STATUS'
  static PAYLOAD_LENGTH = 7
  static MAGIC_NUMBER = 183

  static FIELDS = [
    new MavLinkPacketField('deviceFlags', 0, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('managerFlags', 2, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('gimbalId', 4, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('supervisor', 5, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('profile', 6, false, 1, 'uint8_t', ''),
  ]

  /**
   * Gimbal ID (component ID or 1-6 for non-MAVLink gimbal) that this gimbal manager is responsible for.
   */
  gimbalId: uint8_t
  /**
   * Client who is currently supervisor (0 = none).
   */
  supervisor: MavStorm32GimbalManagerClient
  /**
   * Gimbal device flags currently applied.
   */
  deviceFlags: MavStorm32GimbalDeviceFlags
  /**
   * Gimbal manager flags currently applied.
   */
  managerFlags: MavStorm32GimbalManagerFlags
  /**
   * Profile currently applied (0 = default).
   */
  profile: MavStorm32GimbalManagerProfile
}

/**
 * Message to a gimbal manager to control the gimbal attitude. Angles and rates can be set to NaN
 * according to use case. A gimbal device is never to react to this message.
 */
export class Storm32GimbalManagerControl extends MavLinkData {
  static MSG_ID = 60012
  static MSG_NAME = 'STORM32_GIMBAL_MANAGER_CONTROL'
  static PAYLOAD_LENGTH = 36
  static MAGIC_NUMBER = 99

  static FIELDS = [
    new MavLinkPacketField('q', 0, false, 4, 'float[]', '', 4),
    new MavLinkPacketField('angularVelocityX', 16, false, 4, 'float', 'rad/s'),
    new MavLinkPacketField('angularVelocityY', 20, false, 4, 'float', 'rad/s'),
    new MavLinkPacketField('angularVelocityZ', 24, false, 4, 'float', 'rad/s'),
    new MavLinkPacketField('deviceFlags', 28, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('managerFlags', 30, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('targetSystem', 32, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('targetComponent', 33, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('gimbalId', 34, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('client', 35, false, 1, 'uint8_t', ''),
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
   * Gimbal ID of the gimbal manager to address (component ID or 1-6 for non-MAVLink gimbal, 0 for all
   * gimbals, send command multiple times for more than one but not all gimbals).
   */
  gimbalId: uint8_t
  /**
   * Client which is contacting the gimbal manager (must be set).
   */
  client: MavStorm32GimbalManagerClient
  /**
   * Gimbal device flags (UINT16_MAX to be ignored).
   */
  deviceFlags: MavStorm32GimbalDeviceFlags
  /**
   * Gimbal manager flags (0 to be ignored).
   */
  managerFlags: MavStorm32GimbalManagerFlags
  /**
   * Quaternion components, w, x, y, z (1 0 0 0 is the null-rotation, the frame is determined by the
   * GIMBAL_MANAGER_FLAGS_ABSOLUTE_YAW flag, set first element to NaN to be ignored).
   */
  q: float[]
  /**
   * X component of angular velocity (positive: roll to the right, NaN to be ignored).
   */
  angularVelocityX: float
  /**
   * Y component of angular velocity (positive: tilt up, NaN to be ignored).
   */
  angularVelocityY: float
  /**
   * Z component of angular velocity (positive: pan to the right, the frame is determined by the
   * STORM32_GIMBAL_DEVICE_FLAGS_YAW_ABSOLUTE flag, NaN to be ignored).
   */
  angularVelocityZ: float
}

/**
 * Message to a gimbal manager to control the gimbal tilt and pan angles. Angles and rates can be set
 * to NaN according to use case. A gimbal device is never to react to this message.
 */
export class Storm32GimbalManagerControlPitchyaw extends MavLinkData {
  static MSG_ID = 60013
  static MSG_NAME = 'STORM32_GIMBAL_MANAGER_CONTROL_PITCHYAW'
  static PAYLOAD_LENGTH = 24
  static MAGIC_NUMBER = 129

  static FIELDS = [
    new MavLinkPacketField('pitch', 0, false, 4, 'float', 'rad'),
    new MavLinkPacketField('yaw', 4, false, 4, 'float', 'rad'),
    new MavLinkPacketField('pitchRate', 8, false, 4, 'float', 'rad/s'),
    new MavLinkPacketField('yawRate', 12, false, 4, 'float', 'rad/s'),
    new MavLinkPacketField('deviceFlags', 16, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('managerFlags', 18, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('targetSystem', 20, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('targetComponent', 21, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('gimbalId', 22, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('client', 23, false, 1, 'uint8_t', ''),
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
   * Gimbal ID of the gimbal manager to address (component ID or 1-6 for non-MAVLink gimbal, 0 for all
   * gimbals, send command multiple times for more than one but not all gimbals).
   */
  gimbalId: uint8_t
  /**
   * Client which is contacting the gimbal manager (must be set).
   */
  client: MavStorm32GimbalManagerClient
  /**
   * Gimbal device flags (UINT16_MAX to be ignored).
   */
  deviceFlags: MavStorm32GimbalDeviceFlags
  /**
   * Gimbal manager flags (0 to be ignored).
   */
  managerFlags: MavStorm32GimbalManagerFlags
  /**
   * Pitch/tilt angle (positive: tilt up, NaN to be ignored).
   */
  pitch: float
  /**
   * Yaw/pan angle (positive: pan the right, the frame is determined by the
   * STORM32_GIMBAL_DEVICE_FLAGS_YAW_ABSOLUTE flag, NaN to be ignored).
   */
  yaw: float
  /**
   * Pitch/tilt angular rate (positive: tilt up, NaN to be ignored).
   */
  pitchRate: float
  /**
   * Yaw/pan angular rate (positive: pan to the right, the frame is determined by the
   * STORM32_GIMBAL_DEVICE_FLAGS_YAW_ABSOLUTE flag, NaN to be ignored).
   */
  yawRate: float
}

/**
 * Message to a gimbal manager to correct the gimbal roll angle. This message is typically used to
 * manually correct for a tilted horizon in operation. A gimbal device is never to react to this
 * message.
 */
export class Storm32GimbalManagerCorrectRoll extends MavLinkData {
  static MSG_ID = 60014
  static MSG_NAME = 'STORM32_GIMBAL_MANAGER_CORRECT_ROLL'
  static PAYLOAD_LENGTH = 8
  static MAGIC_NUMBER = 134

  static FIELDS = [
    new MavLinkPacketField('roll', 0, false, 4, 'float', 'rad'),
    new MavLinkPacketField('targetSystem', 4, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('targetComponent', 5, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('gimbalId', 6, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('client', 7, false, 1, 'uint8_t', ''),
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
   * Gimbal ID of the gimbal manager to address (component ID or 1-6 for non-MAVLink gimbal, 0 for all
   * gimbals, send command multiple times for more than one but not all gimbals).
   */
  gimbalId: uint8_t
  /**
   * Client which is contacting the gimbal manager (must be set).
   */
  client: MavStorm32GimbalManagerClient
  /**
   * Roll angle (positive to roll to the right).
   */
  roll: float
}

/**
 * Message to set a gimbal manager profile. A gimbal device is never to react to this command. The
 * selected profile is reported in the STORM32_GIMBAL_MANAGER_STATUS message.
 */
export class Storm32GimbalManagerProfile extends MavLinkData {
  static MSG_ID = 60015
  static MSG_NAME = 'STORM32_GIMBAL_MANAGER_PROFILE'
  static PAYLOAD_LENGTH = 22
  static MAGIC_NUMBER = 78

  static FIELDS = [
    new MavLinkPacketField('targetSystem', 0, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('targetComponent', 1, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('gimbalId', 2, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('profile', 3, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('priorities', 4, false, 1, 'uint8_t[]', '', 8),
    new MavLinkPacketField('profileFlags', 12, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('rcTimeout', 13, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('timeouts', 14, false, 1, 'uint8_t[]', '', 8),
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
   * Gimbal ID of the gimbal manager to address (component ID or 1-6 for non-MAVLink gimbal, 0 for all
   * gimbals, send command multiple times for more than one but not all gimbals).
   */
  gimbalId: uint8_t
  /**
   * Profile to be applied (0 = default).
   */
  profile: MavStorm32GimbalManagerProfile
  /**
   * Priorities for custom profile.
   */
  priorities: uint8_t[]
  /**
   * Profile flags for custom profile (0 = default).
   */
  profileFlags: uint8_t
  /**
   * Rc timeouts for custom profile (0 = infinite, in uints of 100 ms).
   */
  rcTimeout: uint8_t
  /**
   * Timeouts for custom profile (0 = infinite, in uints of 100 ms).
   */
  timeouts: uint8_t[]
}

/**
 * Information about the shot operation.
 */
export class QshotStatus extends MavLinkData {
  static MSG_ID = 60020
  static MSG_NAME = 'QSHOT_STATUS'
  static PAYLOAD_LENGTH = 4
  static MAGIC_NUMBER = 202

  static FIELDS = [
    new MavLinkPacketField('mode', 0, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('shotState', 2, false, 2, 'uint16_t', ''),
  ]

  /**
   * Current shot mode.
   */
  mode: MavQshotMode
  /**
   * Current state in the shot. States are specific to the selected shot mode.
   */
  shotState: uint16_t
}

/**
 * Message reporting the status of the prearm checks. The flags are component specific.
 */
export class ComponentPrearmStatus extends MavLinkData {
  static MSG_ID = 60025
  static MSG_NAME = 'COMPONENT_PREARM_STATUS'
  static PAYLOAD_LENGTH = 10
  static MAGIC_NUMBER = 20

  static FIELDS = [
    new MavLinkPacketField('enabledFlags', 0, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('failFlags', 4, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('targetSystem', 8, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('targetComponent', 9, false, 1, 'uint8_t', ''),
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
   * Currently enabled prearm checks. 0 means no checks are being performed, UINT32_MAX means not known.
   */
  enabledFlags: uint32_t
  /**
   * Currently not passed prearm checks. 0 means all checks have been passed.
   */
  failFlags: uint32_t
}

export const REGISTRY = {
  60001: Storm32GimbalDeviceStatus,
  60002: Storm32GimbalDeviceControl,
  60010: Storm32GimbalManagerInformation,
  60011: Storm32GimbalManagerStatus,
  60012: Storm32GimbalManagerControl,
  60013: Storm32GimbalManagerControlPitchyaw,
  60014: Storm32GimbalManagerCorrectRoll,
  60015: Storm32GimbalManagerProfile,
  60020: QshotStatus,
  60025: ComponentPrearmStatus,
}
