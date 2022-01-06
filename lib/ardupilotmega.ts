import {
  char,
  int8_t,
  uint8_t,
  int16_t,
  uint16_t,
  int32_t,
  uint32_t,
  uint64_t,
  float
} from './types'

import {
  MavLinkPacketRegistry,
  MavLinkPacketField,
  MavLinkData
} from './mavlink'

import {
  MavMountMode,
  MavDistanceSensor,
  MavFrame,
  MagCalStatus
} from './common'

/**
 * ACCELCAL_VEHICLE_POS
 */
export enum AccelcalVehiclePos {
  'LEVEL'                             = 1,
  'LEFT'                              = 2,
  'RIGHT'                             = 3,
  'NOSEDOWN'                          = 4,
  'NOSEUP'                            = 5,
  'BACK'                              = 6,
  'SUCCESS'                           = 16777215,
  'FAILED'                            = 16777216,
}

/**
 * HEADING_TYPE
 */
export enum HeadingType {
  'COURSE_OVER_GROUND'                = 0,
  'HEADING'                           = 1,
}

/**
 * SPEED_TYPE
 */
export enum SpeedType {
  'AIRSPEED'                          = 0,
  'GROUNDSPEED'                       = 1,
}

/**
 * MAV_CMD
 */
export enum MavCmd {
  'DO_SET_RESUME_REPEAT_DIST'         = 215,
  'DO_SPRAYER'                        = 216,
  'DO_SEND_SCRIPT_MESSAGE'            = 217,
  'DO_AUX_FUNCTION'                   = 218,
  /**
   * Mission command to wait for an altitude or downwards vertical speed. This is meant for high altitude
   * balloon launches, allowing the aircraft to be idle until either an altitude is reached or a negative
   * vertical speed is reached (indicating early balloon burst). The wiggle time is how often to wiggle
   * the control surfaces to prevent them seizing up.
   */
  'NAV_ALTITUDE_WAIT'                 = 83,
  'POWER_OFF_INITIATED'               = 42000,
  'SOLO_BTN_FLY_CLICK'                = 42001,
  'SOLO_BTN_FLY_HOLD'                 = 42002,
  'SOLO_BTN_PAUSE_CLICK'              = 42003,
  /**
   * Magnetometer calibration based on fixed position in earth field given by inclination, declination
   * and intensity.
   */
  'FIXED_MAG_CAL'                     = 42004,
  'FIXED_MAG_CAL_FIELD'               = 42005,
  'SET_EKF_SOURCE_SET'                = 42007,
  'DO_START_MAG_CAL'                  = 42424,
  'DO_ACCEPT_MAG_CAL'                 = 42425,
  'DO_CANCEL_MAG_CAL'                 = 42426,
  /**
   * Used when doing accelerometer calibration. When sent to the GCS tells it what position to put the
   * vehicle in. When sent to the vehicle says what position the vehicle is in.
   */
  'ACCELCAL_VEHICLE_POS'              = 42429,
  'DO_SEND_BANNER'                    = 42428,
  'SET_FACTORY_TEST_MODE'             = 42427,
  'GIMBAL_RESET'                      = 42501,
  'GIMBAL_AXIS_CALIBRATION_STATUS'    = 42502,
  'GIMBAL_REQUEST_AXIS_CALIBRATION'   = 42503,
  'GIMBAL_FULL_RESET'                 = 42505,
  'FLASH_BOOTLOADER'                  = 42650,
  'BATTERY_RESET'                     = 42651,
  'DEBUG_TRAP'                        = 42700,
  'SCRIPTING'                         = 42701,
  /**
   * Change flight speed at a given rate. This slews the vehicle at a controllable rate between it's
   * previous speed and the new one. (affects GUIDED only. Outside GUIDED, aircraft ignores these
   * commands. Designed for onboard companion-computer command-and-control, not normally operator/GCS
   * control.)
   */
  'GUIDED_CHANGE_SPEED'               = 43000,
  /**
   * Change target altitude at a given rate. This slews the vehicle at a controllable rate between it's
   * previous altitude and the new one. (affects GUIDED only. Outside GUIDED, aircraft ignores these
   * commands. Designed for onboard companion-computer command-and-control, not normally operator/GCS
   * control.)
   */
  'GUIDED_CHANGE_ALTITUDE'            = 43001,
  /**
   * Change to target heading at a given rate, overriding previous heading/s. This slews the vehicle at a
   * controllable rate between it's previous heading and the new one. (affects GUIDED only. Exiting
   * GUIDED returns aircraft to normal behaviour defined elsewhere. Designed for onboard
   * companion-computer command-and-control, not normally operator/GCS control.)
   */
  'GUIDED_CHANGE_HEADING'             = 43002,
}

/**
 * SCRIPTING_CMD
 */
export enum ScriptingCmd {
  'REPL_START'                        = 0,
  'REPL_STOP'                         = 1,
}

/**
 * LIMITS_STATE
 */
export enum LimitsState {
  'INIT'                              = 0,
  'DISABLED'                          = 1,
  'ENABLED'                           = 2,
  'TRIGGERED'                         = 3,
  'RECOVERING'                        = 4,
  'RECOVERED'                         = 5,
}

/**
 * LIMIT_MODULE
 */
export enum LimitModule {
  'GPSLOCK'                           = 1,
  'GEOFENCE'                          = 2,
  'ALTITUDE'                          = 4,
}

/**
 * Flags in RALLY_POINT message.
 */
export enum RallyFlags {
  'FAVORABLE_WIND'                    = 1,
  /**
   * Flag set when plane is to immediately descend to break altitude and land without GCS intervention.
   * Flag not set when plane is to loiter at Rally point until commanded to land.
   */
  'LAND_IMMEDIATELY'                  = 2,
}

/**
 * CAMERA_STATUS_TYPES
 */
export enum CameraStatusTypes {
  'HEARTBEAT'                         = 0,
  'TRIGGER'                           = 1,
  'DISCONNECT'                        = 2,
  'ERROR'                             = 3,
  'LOWBATT'                           = 4,
  'LOWSTORE'                          = 5,
  'LOWSTOREV'                         = 6,
}

/**
 * CAMERA_FEEDBACK_FLAGS
 */
export enum CameraFeedbackFlags {
  'PHOTO'                             = 0,
  'VIDEO'                             = 1,
  'BADEXPOSURE'                       = 2,
  'CLOSEDLOOP'                        = 3,
  /**
   * Open loop camera, an image trigger has been requested but we can't know for sure it has successfully
   * taken a picture.
   */
  'OPENLOOP'                          = 4,
}

/**
 * MAV_MODE_GIMBAL
 */
export enum MavModeGimbal {
  'UNINITIALIZED'                     = 0,
  'CALIBRATING_PITCH'                 = 1,
  'CALIBRATING_ROLL'                  = 2,
  'CALIBRATING_YAW'                   = 3,
  /**
   * Gimbal has finished calibrating and initializing, but is relaxed pending reception of first rate
   * command from copter.
   */
  'INITIALIZED'                       = 4,
  'ACTIVE'                            = 5,
  /**
   * Gimbal is relaxed because it missed more than 10 expected rate command messages in a row. Gimbal
   * will move back to active mode when it receives a new rate command.
   */
  'RATE_CMD_TIMEOUT'                  = 6,
}

/**
 * GIMBAL_AXIS
 */
export enum GimbalAxis {
  'YAW'                               = 0,
  'PITCH'                             = 1,
  'ROLL'                              = 2,
}

/**
 * GIMBAL_AXIS_CALIBRATION_STATUS
 */
export enum GimbalAxisCalibrationStatus {
  'IN_PROGRESS'                       = 0,
  'SUCCEEDED'                         = 1,
  'FAILED'                            = 2,
}

/**
 * GIMBAL_AXIS_CALIBRATION_REQUIRED
 */
export enum GimbalAxisCalibrationRequired {
  'UNKNOWN'                           = 0,
  'TRUE'                              = 1,
  'FALSE'                             = 2,
}

/**
 * GOPRO_HEARTBEAT_STATUS
 */
export enum GoproHeartbeatStatus {
  'DISCONNECTED'                      = 0,
  'INCOMPATIBLE'                      = 1,
  'CONNECTED'                         = 2,
  'ERROR'                             = 3,
}

/**
 * GOPRO_HEARTBEAT_FLAGS
 */
export enum GoproHeartbeatFlags {
  'RECORDING'                         = 1,
}

/**
 * GOPRO_REQUEST_STATUS
 */
export enum GoproRequestStatus {
  'SUCCESS'                           = 0,
  'FAILED'                            = 1,
}

/**
 * GOPRO_COMMAND
 */
export enum GoproCommand {
  'POWER'                             = 0,
  'CAPTURE_MODE'                      = 1,
  'SHUTTER'                           = 2,
  'BATTERY'                           = 3,
  'MODEL'                             = 4,
  'VIDEO_SETTINGS'                    = 5,
  'LOW_LIGHT'                         = 6,
  'PHOTO_RESOLUTION'                  = 7,
  'PHOTO_BURST_RATE'                  = 8,
  'PROTUNE'                           = 9,
  'PROTUNE_WHITE_BALANCE'             = 10,
  'PROTUNE_COLOUR'                    = 11,
  'PROTUNE_GAIN'                      = 12,
  'PROTUNE_SHARPNESS'                 = 13,
  'PROTUNE_EXPOSURE'                  = 14,
  'TIME'                              = 15,
  'CHARGING'                          = 16,
}

/**
 * GOPRO_CAPTURE_MODE
 */
export enum GoproCaptureMode {
  'VIDEO'                             = 0,
  'PHOTO'                             = 1,
  'BURST'                             = 2,
  'TIME_LAPSE'                        = 3,
  'MULTI_SHOT'                        = 4,
  'PLAYBACK'                          = 5,
  'SETUP'                             = 6,
  'UNKNOWN'                           = 255,
}

/**
 * GOPRO_RESOLUTION
 */
export enum GoproResolution {
  'GOPRO_RESOLUTION_480p'             = 0,
  'GOPRO_RESOLUTION_720p'             = 1,
  'GOPRO_RESOLUTION_960p'             = 2,
  'GOPRO_RESOLUTION_1080p'            = 3,
  'GOPRO_RESOLUTION_1440p'            = 4,
  'GOPRO_RESOLUTION_2_7k_17_9'        = 5,
  'GOPRO_RESOLUTION_2_7k_16_9'        = 6,
  'GOPRO_RESOLUTION_2_7k_4_3'         = 7,
  'GOPRO_RESOLUTION_4k_16_9'          = 8,
  'GOPRO_RESOLUTION_4k_17_9'          = 9,
  'GOPRO_RESOLUTION_720p_SUPERVIEW'   = 10,
  'GOPRO_RESOLUTION_1080p_SUPERVIEW'  = 11,
  'GOPRO_RESOLUTION_2_7k_SUPERVIEW'   = 12,
  'GOPRO_RESOLUTION_4k_SUPERVIEW'     = 13,
}

/**
 * GOPRO_FRAME_RATE
 */
export enum GoproFrameRate {
  'GOPRO_FRAME_RATE_12'               = 0,
  'GOPRO_FRAME_RATE_15'               = 1,
  'GOPRO_FRAME_RATE_24'               = 2,
  'GOPRO_FRAME_RATE_25'               = 3,
  'GOPRO_FRAME_RATE_30'               = 4,
  'GOPRO_FRAME_RATE_48'               = 5,
  'GOPRO_FRAME_RATE_50'               = 6,
  'GOPRO_FRAME_RATE_60'               = 7,
  'GOPRO_FRAME_RATE_80'               = 8,
  'GOPRO_FRAME_RATE_90'               = 9,
  'GOPRO_FRAME_RATE_100'              = 10,
  'GOPRO_FRAME_RATE_120'              = 11,
  'GOPRO_FRAME_RATE_240'              = 12,
  'GOPRO_FRAME_RATE_12_5'             = 13,
}

/**
 * GOPRO_FIELD_OF_VIEW
 */
export enum GoproFieldOfView {
  'WIDE'                              = 0,
  'MEDIUM'                            = 1,
  'NARROW'                            = 2,
}

/**
 * GOPRO_VIDEO_SETTINGS_FLAGS
 */
export enum GoproVideoSettingsFlags {
  'MODE'                              = 1,
}

/**
 * GOPRO_PHOTO_RESOLUTION
 */
export enum GoproPhotoResolution {
  'GOPRO_PHOTO_RESOLUTION_5MP_MEDIUM' = 0,
  'GOPRO_PHOTO_RESOLUTION_7MP_MEDIUM' = 1,
  'GOPRO_PHOTO_RESOLUTION_7MP_WIDE'   = 2,
  'GOPRO_PHOTO_RESOLUTION_10MP_WIDE'  = 3,
  'GOPRO_PHOTO_RESOLUTION_12MP_WIDE'  = 4,
}

/**
 * GOPRO_PROTUNE_WHITE_BALANCE
 */
export enum GoproProtuneWhiteBalance {
  'AUTO'                              = 0,
  'GOPRO_PROTUNE_WHITE_BALANCE_3000K' = 1,
  'GOPRO_PROTUNE_WHITE_BALANCE_5500K' = 2,
  'GOPRO_PROTUNE_WHITE_BALANCE_6500K' = 3,
  'RAW'                               = 4,
}

/**
 * GOPRO_PROTUNE_COLOUR
 */
export enum GoproProtuneColour {
  'STANDARD'                          = 0,
  'NEUTRAL'                           = 1,
}

/**
 * GOPRO_PROTUNE_GAIN
 */
export enum GoproProtuneGain {
  'GOPRO_PROTUNE_GAIN_400'            = 0,
  'GOPRO_PROTUNE_GAIN_800'            = 1,
  'GOPRO_PROTUNE_GAIN_1600'           = 2,
  'GOPRO_PROTUNE_GAIN_3200'           = 3,
  'GOPRO_PROTUNE_GAIN_6400'           = 4,
}

/**
 * GOPRO_PROTUNE_SHARPNESS
 */
export enum GoproProtuneSharpness {
  'LOW'                               = 0,
  'MEDIUM'                            = 1,
  'HIGH'                              = 2,
}

/**
 * GOPRO_PROTUNE_EXPOSURE
 */
export enum GoproProtuneExposure {
  'NEG_5_0'                           = 0,
  'NEG_4_5'                           = 1,
  'NEG_4_0'                           = 2,
  'NEG_3_5'                           = 3,
  'NEG_3_0'                           = 4,
  'NEG_2_5'                           = 5,
  'NEG_2_0'                           = 6,
  'NEG_1_5'                           = 7,
  'NEG_1_0'                           = 8,
  'NEG_0_5'                           = 9,
  'ZERO'                              = 10,
  'POS_0_5'                           = 11,
  'POS_1_0'                           = 12,
  'POS_1_5'                           = 13,
  'POS_2_0'                           = 14,
  'POS_2_5'                           = 15,
  'POS_3_0'                           = 16,
  'POS_3_5'                           = 17,
  'POS_4_0'                           = 18,
  'POS_4_5'                           = 19,
  'POS_5_0'                           = 20,
}

/**
 * GOPRO_CHARGING
 */
export enum GoproCharging {
  'DISABLED'                          = 0,
  'ENABLED'                           = 1,
}

/**
 * GOPRO_MODEL
 */
export enum GoproModel {
  'UNKNOWN'                           = 0,
  'HERO_3_PLUS_SILVER'                = 1,
  'HERO_3_PLUS_BLACK'                 = 2,
  'HERO_4_SILVER'                     = 3,
  'HERO_4_BLACK'                      = 4,
}

/**
 * GOPRO_BURST_RATE
 */
export enum GoproBurstRate {
  'GOPRO_BURST_RATE_3_IN_1_SECOND'    = 0,
  'GOPRO_BURST_RATE_5_IN_1_SECOND'    = 1,
  'GOPRO_BURST_RATE_10_IN_1_SECOND'   = 2,
  'GOPRO_BURST_RATE_10_IN_2_SECOND'   = 3,
  'GOPRO_BURST_RATE_10_IN_3_SECOND'   = 4,
  'GOPRO_BURST_RATE_30_IN_1_SECOND'   = 5,
  'GOPRO_BURST_RATE_30_IN_2_SECOND'   = 6,
  'GOPRO_BURST_RATE_30_IN_3_SECOND'   = 7,
  'GOPRO_BURST_RATE_30_IN_6_SECOND'   = 8,
}

/**
 * MAV_CMD_DO_AUX_FUNCTION_SWITCH_LEVEL
 */
export enum MavCmdDoAuxFunctionSwitchLevel {
  'LOW'                               = 0,
  'MIDDLE'                            = 1,
  'HIGH'                              = 2,
}

/**
 * LED_CONTROL_PATTERN
 */
export enum LedControlPattern {
  'OFF'                               = 0,
  'FIRMWAREUPDATE'                    = 1,
  'CUSTOM'                            = 255,
}

/**
 * Flags in EKF_STATUS message.
 */
export enum EkfStatusFlags {
  'ATTITUDE'                          = 1,
  'VELOCITY_HORIZ'                    = 2,
  'VELOCITY_VERT'                     = 4,
  'POS_HORIZ_REL'                     = 8,
  'POS_HORIZ_ABS'                     = 16,
  'POS_VERT_ABS'                      = 32,
  'POS_VERT_AGL'                      = 64,
  'CONST_POS_MODE'                    = 128,
  'PRED_POS_HORIZ_REL'                = 256,
  'PRED_POS_HORIZ_ABS'                = 512,
  'UNINITIALIZED'                     = 1024,
}

/**
 * PID_TUNING_AXIS
 */
export enum PidTuningAxis {
  'ROLL'                              = 1,
  'PITCH'                             = 2,
  'YAW'                               = 3,
  'ACCZ'                              = 4,
  'STEER'                             = 5,
  'LANDING'                           = 6,
}

/**
 * Special ACK block numbers control activation of dataflash log streaming.
 */
export enum MavRemoteLogDataBlockCommands {
  'STOP'                              = 2147483645,
  'START'                             = 2147483646,
}

/**
 * Possible remote log data block statuses.
 */
export enum MavRemoteLogDataBlockStatuses {
  'NACK'                              = 0,
  'ACK'                               = 1,
}

/**
 * Bus types for device operations.
 */
export enum DeviceOpBustype {
  'I2C'                               = 0,
  'SPI'                               = 1,
}

/**
 * Deepstall flight stage.
 */
export enum DeepstallStage {
  'FLY_TO_LANDING'                    = 0,
  'ESTIMATE_WIND'                     = 1,
  'WAIT_FOR_BREAKOUT'                 = 2,
  'FLY_TO_ARC'                        = 3,
  'ARC'                               = 4,
  'APPROACH'                          = 5,
  'LAND'                              = 6,
}

/**
 * A mapping of plane flight modes for custom_mode field of heartbeat.
 */
export enum PlaneMode {
  'MANUAL'                            = 0,
  'CIRCLE'                            = 1,
  'STABILIZE'                         = 2,
  'TRAINING'                          = 3,
  'ACRO'                              = 4,
  'FLY_BY_WIRE_A'                     = 5,
  'FLY_BY_WIRE_B'                     = 6,
  'CRUISE'                            = 7,
  'AUTOTUNE'                          = 8,
  'AUTO'                              = 10,
  'RTL'                               = 11,
  'LOITER'                            = 12,
  'TAKEOFF'                           = 13,
  'AVOID_ADSB'                        = 14,
  'GUIDED'                            = 15,
  'INITIALIZING'                      = 16,
  'QSTABILIZE'                        = 17,
  'QHOVER'                            = 18,
  'QLOITER'                           = 19,
  'QLAND'                             = 20,
  'QRTL'                              = 21,
  'QAUTOTUNE'                         = 22,
  'QACRO'                             = 23,
  'THERMAL'                           = 24,
}

/**
 * A mapping of copter flight modes for custom_mode field of heartbeat.
 */
export enum CopterMode {
  'STABILIZE'                         = 0,
  'ACRO'                              = 1,
  'ALT_HOLD'                          = 2,
  'AUTO'                              = 3,
  'GUIDED'                            = 4,
  'LOITER'                            = 5,
  'RTL'                               = 6,
  'CIRCLE'                            = 7,
  'LAND'                              = 9,
  'DRIFT'                             = 11,
  'SPORT'                             = 13,
  'FLIP'                              = 14,
  'AUTOTUNE'                          = 15,
  'POSHOLD'                           = 16,
  'BRAKE'                             = 17,
  'THROW'                             = 18,
  'AVOID_ADSB'                        = 19,
  'GUIDED_NOGPS'                      = 20,
  'SMART_RTL'                         = 21,
  'FLOWHOLD'                          = 22,
  'FOLLOW'                            = 23,
  'ZIGZAG'                            = 24,
  'SYSTEMID'                          = 25,
  'AUTOROTATE'                        = 26,
  'AUTO_RTL'                          = 27,
}

/**
 * A mapping of sub flight modes for custom_mode field of heartbeat.
 */
export enum SubMode {
  'STABILIZE'                         = 0,
  'ACRO'                              = 1,
  'ALT_HOLD'                          = 2,
  'AUTO'                              = 3,
  'GUIDED'                            = 4,
  'CIRCLE'                            = 7,
  'SURFACE'                           = 9,
  'POSHOLD'                           = 16,
  'MANUAL'                            = 19,
}

/**
 * A mapping of rover flight modes for custom_mode field of heartbeat.
 */
export enum RoverMode {
  'MANUAL'                            = 0,
  'ACRO'                              = 1,
  'STEERING'                          = 3,
  'HOLD'                              = 4,
  'LOITER'                            = 5,
  'FOLLOW'                            = 6,
  'SIMPLE'                            = 7,
  'AUTO'                              = 10,
  'RTL'                               = 11,
  'SMART_RTL'                         = 12,
  'GUIDED'                            = 15,
  'INITIALIZING'                      = 16,
}

/**
 * A mapping of antenna tracker flight modes for custom_mode field of heartbeat.
 */
export enum TrackerMode {
  'MANUAL'                            = 0,
  'STOP'                              = 1,
  'SCAN'                              = 2,
  'SERVO_TEST'                        = 3,
  'AUTO'                              = 10,
  'INITIALIZING'                      = 16,
}

/**
 * The type of parameter for the OSD parameter editor.
 */
export enum OsdParamConfigType {
  'NONE'                              = 0,
  'SERIAL_PROTOCOL'                   = 1,
  'SERVO_FUNCTION'                    = 2,
  'AUX_FUNCTION'                      = 3,
  'FLIGHT_MODE'                       = 4,
  'FAILSAFE_ACTION'                   = 5,
  'FAILSAFE_ACTION_1'                 = 6,
  'FAILSAFE_ACTION_2'                 = 7,
  'NUM_TYPES'                         = 8,
}

/**
 * The error type for the OSD parameter editor.
 */
export enum OsdParamConfigError {
  'SUCCESS'                           = 0,
  'INVALID_SCREEN'                    = 1,
  'INVALID_PARAMETER_INDEX'           = 2,
  'INVALID_PARAMETER'                 = 3,
}

/**
 * Offsets and calibrations values for hardware sensors. This makes it easier to debug the calibration
 * process.
 */
export class SensorOffsets extends MavLinkData {
  static MSG_ID = 150
  static MSG_NAME = 'SENSOR_OFFSETS'
  static PAYLOAD_LENGTH = 42
  static MAGIC_NUMBER = 134

  static FIELDS = [
    new MavLinkPacketField('mag_declination', 'magDeclination', 0, false, 4, 'float', 'rad'),
    new MavLinkPacketField('raw_press', 'rawPress', 4, false, 4, 'int32_t', ''),
    new MavLinkPacketField('raw_temp', 'rawTemp', 8, false, 4, 'int32_t', ''),
    new MavLinkPacketField('gyro_cal_x', 'gyroCalX', 12, false, 4, 'float', ''),
    new MavLinkPacketField('gyro_cal_y', 'gyroCalY', 16, false, 4, 'float', ''),
    new MavLinkPacketField('gyro_cal_z', 'gyroCalZ', 20, false, 4, 'float', ''),
    new MavLinkPacketField('accel_cal_x', 'accelCalX', 24, false, 4, 'float', ''),
    new MavLinkPacketField('accel_cal_y', 'accelCalY', 28, false, 4, 'float', ''),
    new MavLinkPacketField('accel_cal_z', 'accelCalZ', 32, false, 4, 'float', ''),
    new MavLinkPacketField('mag_ofs_x', 'magOfsX', 36, false, 2, 'int16_t', ''),
    new MavLinkPacketField('mag_ofs_y', 'magOfsY', 38, false, 2, 'int16_t', ''),
    new MavLinkPacketField('mag_ofs_z', 'magOfsZ', 40, false, 2, 'int16_t', ''),
  ]

  /**
   * Magnetometer X offset.
   */
  magOfsX: int16_t
  /**
   * Magnetometer Y offset.
   */
  magOfsY: int16_t
  /**
   * Magnetometer Z offset.
   */
  magOfsZ: int16_t
  /**
   * Magnetic declination.
   * Units: rad
   */
  magDeclination: float
  /**
   * Raw pressure from barometer.
   */
  rawPress: int32_t
  /**
   * Raw temperature from barometer.
   */
  rawTemp: int32_t
  /**
   * Gyro X calibration.
   */
  gyroCalX: float
  /**
   * Gyro Y calibration.
   */
  gyroCalY: float
  /**
   * Gyro Z calibration.
   */
  gyroCalZ: float
  /**
   * Accel X calibration.
   */
  accelCalX: float
  /**
   * Accel Y calibration.
   */
  accelCalY: float
  /**
   * Accel Z calibration.
   */
  accelCalZ: float
}

/**
 * Set the magnetometer offsets
 *
 * @deprecated since 2014-07, replaced by MAV_CMD_PREFLIGHT_SET_SENSOR_OFFSETS
 */
export class SetMagOffsets extends MavLinkData {
  static MSG_ID = 151
  static MSG_NAME = 'SET_MAG_OFFSETS'
  static PAYLOAD_LENGTH = 8
  static MAGIC_NUMBER = 219

  static FIELDS = [
    new MavLinkPacketField('mag_ofs_x', 'magOfsX', 0, false, 2, 'int16_t', ''),
    new MavLinkPacketField('mag_ofs_y', 'magOfsY', 2, false, 2, 'int16_t', ''),
    new MavLinkPacketField('mag_ofs_z', 'magOfsZ', 4, false, 2, 'int16_t', ''),
    new MavLinkPacketField('target_system', 'targetSystem', 6, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 7, false, 1, 'uint8_t', ''),
  ]

  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Component ID.
   */
  targetComponent: uint8_t
  /**
   * Magnetometer X offset.
   */
  magOfsX: int16_t
  /**
   * Magnetometer Y offset.
   */
  magOfsY: int16_t
  /**
   * Magnetometer Z offset.
   */
  magOfsZ: int16_t
}

/**
 * State of APM memory.
 */
export class MemInfo extends MavLinkData {
  static MSG_ID = 152
  static MSG_NAME = 'MEMINFO'
  static PAYLOAD_LENGTH = 8
  static MAGIC_NUMBER = 208

  static FIELDS = [
    new MavLinkPacketField('brkval', 'brkval', 0, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('freemem', 'freemem', 2, false, 2, 'uint16_t', 'bytes'),
    new MavLinkPacketField('freemem32', 'freemem32', 4, true, 4, 'uint32_t', 'bytes'),
  ]

  /**
   * Heap top.
   */
  brkval: uint16_t
  /**
   * Free memory.
   * Units: bytes
   */
  freemem: uint16_t
  /**
   * Free memory (32 bit).
   * Units: bytes
   */
  freemem32: uint32_t
}

/**
 * Raw ADC output.
 */
export class ApAdc extends MavLinkData {
  static MSG_ID = 153
  static MSG_NAME = 'AP_ADC'
  static PAYLOAD_LENGTH = 12
  static MAGIC_NUMBER = 188

  static FIELDS = [
    new MavLinkPacketField('adc1', 'adc1', 0, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('adc2', 'adc2', 2, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('adc3', 'adc3', 4, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('adc4', 'adc4', 6, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('adc5', 'adc5', 8, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('adc6', 'adc6', 10, false, 2, 'uint16_t', ''),
  ]

  /**
   * ADC output 1.
   */
  adc1: uint16_t
  /**
   * ADC output 2.
   */
  adc2: uint16_t
  /**
   * ADC output 3.
   */
  adc3: uint16_t
  /**
   * ADC output 4.
   */
  adc4: uint16_t
  /**
   * ADC output 5.
   */
  adc5: uint16_t
  /**
   * ADC output 6.
   */
  adc6: uint16_t
}

/**
 * Configure on-board Camera Control System.
 */
export class DigicamConfigure extends MavLinkData {
  static MSG_ID = 154
  static MSG_NAME = 'DIGICAM_CONFIGURE'
  static PAYLOAD_LENGTH = 15
  static MAGIC_NUMBER = 84

  static FIELDS = [
    new MavLinkPacketField('extra_value', 'extraValue', 0, false, 4, 'float', ''),
    new MavLinkPacketField('shutter_speed', 'shutterSpeed', 4, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('target_system', 'targetSystem', 6, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 7, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('mode', 'mode', 8, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('aperture', 'aperture', 9, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('iso', 'iso', 10, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('exposure_type', 'exposureType', 11, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('command_id', 'commandId', 12, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('engine_cut_off', 'engineCutOff', 13, false, 1, 'uint8_t', 'ds'),
    new MavLinkPacketField('extra_param', 'extraParam', 14, false, 1, 'uint8_t', ''),
  ]

  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Component ID.
   */
  targetComponent: uint8_t
  /**
   * Mode enumeration from 1 to N //P, TV, AV, M, etc. (0 means ignore).
   */
  mode: uint8_t
  /**
   * Divisor number //e.g. 1000 means 1/1000 (0 means ignore).
   */
  shutterSpeed: uint16_t
  /**
   * F stop number x 10 //e.g. 28 means 2.8 (0 means ignore).
   */
  aperture: uint8_t
  /**
   * ISO enumeration from 1 to N //e.g. 80, 100, 200, Etc (0 means ignore).
   */
  iso: uint8_t
  /**
   * Exposure type enumeration from 1 to N (0 means ignore).
   */
  exposureType: uint8_t
  /**
   * Command Identity (incremental loop: 0 to 255). //A command sent multiple times will be executed or
   * pooled just once.
   */
  commandId: uint8_t
  /**
   * Main engine cut-off time before camera trigger (0 means no cut-off).
   * Units: ds
   */
  engineCutOff: uint8_t
  /**
   * Extra parameters enumeration (0 means ignore).
   */
  extraParam: uint8_t
  /**
   * Correspondent value to given extra_param.
   */
  extraValue: float
}

/**
 * Control on-board Camera Control System to take shots.
 */
export class DigicamControl extends MavLinkData {
  static MSG_ID = 155
  static MSG_NAME = 'DIGICAM_CONTROL'
  static PAYLOAD_LENGTH = 13
  static MAGIC_NUMBER = 22

  static FIELDS = [
    new MavLinkPacketField('extra_value', 'extraValue', 0, false, 4, 'float', ''),
    new MavLinkPacketField('target_system', 'targetSystem', 4, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 5, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('session', 'session', 6, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('zoom_pos', 'zoomPos', 7, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('zoom_step', 'zoomStep', 8, false, 1, 'int8_t', ''),
    new MavLinkPacketField('focus_lock', 'focusLock', 9, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('shot', 'shot', 10, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('command_id', 'commandId', 11, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('extra_param', 'extraParam', 12, false, 1, 'uint8_t', ''),
  ]

  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Component ID.
   */
  targetComponent: uint8_t
  /**
   * 0: stop, 1: start or keep it up //Session control e.g. show/hide lens.
   */
  session: uint8_t
  /**
   * 1 to N //Zoom's absolute position (0 means ignore).
   */
  zoomPos: uint8_t
  /**
   * -100 to 100 //Zooming step value to offset zoom from the current position.
   */
  zoomStep: int8_t
  /**
   * 0: unlock focus or keep unlocked, 1: lock focus or keep locked, 3: re-lock focus.
   */
  focusLock: uint8_t
  /**
   * 0: ignore, 1: shot or start filming.
   */
  shot: uint8_t
  /**
   * Command Identity (incremental loop: 0 to 255)//A command sent multiple times will be executed or
   * pooled just once.
   */
  commandId: uint8_t
  /**
   * Extra parameters enumeration (0 means ignore).
   */
  extraParam: uint8_t
  /**
   * Correspondent value to given extra_param.
   */
  extraValue: float
}

/**
 * Message to configure a camera mount, directional antenna, etc.
 */
export class MountConfigure extends MavLinkData {
  static MSG_ID = 156
  static MSG_NAME = 'MOUNT_CONFIGURE'
  static PAYLOAD_LENGTH = 6
  static MAGIC_NUMBER = 19

  static FIELDS = [
    new MavLinkPacketField('target_system', 'targetSystem', 0, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 1, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('mount_mode', 'mountMode', 2, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('stab_roll', 'stabRoll', 3, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('stab_pitch', 'stabPitch', 4, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('stab_yaw', 'stabYaw', 5, false, 1, 'uint8_t', ''),
  ]

  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Component ID.
   */
  targetComponent: uint8_t
  /**
   * Mount operating mode.
   */
  mountMode: MavMountMode
  /**
   * (1 = yes, 0 = no).
   */
  stabRoll: uint8_t
  /**
   * (1 = yes, 0 = no).
   */
  stabPitch: uint8_t
  /**
   * (1 = yes, 0 = no).
   */
  stabYaw: uint8_t
}

/**
 * Message to control a camera mount, directional antenna, etc.
 */
export class MountControl extends MavLinkData {
  static MSG_ID = 157
  static MSG_NAME = 'MOUNT_CONTROL'
  static PAYLOAD_LENGTH = 15
  static MAGIC_NUMBER = 21

  static FIELDS = [
    new MavLinkPacketField('input_a', 'inputA', 0, false, 4, 'int32_t', ''),
    new MavLinkPacketField('input_b', 'inputB', 4, false, 4, 'int32_t', ''),
    new MavLinkPacketField('input_c', 'inputC', 8, false, 4, 'int32_t', ''),
    new MavLinkPacketField('target_system', 'targetSystem', 12, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 13, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('save_position', 'savePosition', 14, false, 1, 'uint8_t', ''),
  ]

  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Component ID.
   */
  targetComponent: uint8_t
  /**
   * Pitch (centi-degrees) or lat (degE7), depending on mount mode.
   */
  inputA: int32_t
  /**
   * Roll (centi-degrees) or lon (degE7) depending on mount mode.
   */
  inputB: int32_t
  /**
   * Yaw (centi-degrees) or alt (cm) depending on mount mode.
   */
  inputC: int32_t
  /**
   * If "1" it will save current trimmed position on EEPROM (just valid for NEUTRAL and LANDING).
   */
  savePosition: uint8_t
}

/**
 * Message with some status from APM to GCS about camera or antenna mount.
 */
export class MountStatus extends MavLinkData {
  static MSG_ID = 158
  static MSG_NAME = 'MOUNT_STATUS'
  static PAYLOAD_LENGTH = 14
  static MAGIC_NUMBER = 134

  static FIELDS = [
    new MavLinkPacketField('pointing_a', 'pointingA', 0, false, 4, 'int32_t', 'cdeg'),
    new MavLinkPacketField('pointing_b', 'pointingB', 4, false, 4, 'int32_t', 'cdeg'),
    new MavLinkPacketField('pointing_c', 'pointingC', 8, false, 4, 'int32_t', 'cdeg'),
    new MavLinkPacketField('target_system', 'targetSystem', 12, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 13, false, 1, 'uint8_t', ''),
  ]

  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Component ID.
   */
  targetComponent: uint8_t
  /**
   * Pitch.
   * Units: cdeg
   */
  pointingA: int32_t
  /**
   * Roll.
   * Units: cdeg
   */
  pointingB: int32_t
  /**
   * Yaw.
   * Units: cdeg
   */
  pointingC: int32_t
}

/**
 * A fence point. Used to set a point when from GCS -> MAV. Also used to return a point from MAV ->
 * GCS.
 */
export class FencePoint extends MavLinkData {
  static MSG_ID = 160
  static MSG_NAME = 'FENCE_POINT'
  static PAYLOAD_LENGTH = 12
  static MAGIC_NUMBER = 78

  static FIELDS = [
    new MavLinkPacketField('lat', 'lat', 0, false, 4, 'float', 'deg'),
    new MavLinkPacketField('lng', 'lng', 4, false, 4, 'float', 'deg'),
    new MavLinkPacketField('target_system', 'targetSystem', 8, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 9, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('idx', 'idx', 10, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('count', 'count', 11, false, 1, 'uint8_t', ''),
  ]

  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Component ID.
   */
  targetComponent: uint8_t
  /**
   * Point index (first point is 1, 0 is for return point).
   */
  idx: uint8_t
  /**
   * Total number of points (for sanity checking).
   */
  count: uint8_t
  /**
   * Latitude of point.
   * Units: deg
   */
  lat: float
  /**
   * Longitude of point.
   * Units: deg
   */
  lng: float
}

/**
 * Request a current fence point from MAV.
 */
export class FenceFetchPoint extends MavLinkData {
  static MSG_ID = 161
  static MSG_NAME = 'FENCE_FETCH_POINT'
  static PAYLOAD_LENGTH = 3
  static MAGIC_NUMBER = 68

  static FIELDS = [
    new MavLinkPacketField('target_system', 'targetSystem', 0, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 1, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('idx', 'idx', 2, false, 1, 'uint8_t', ''),
  ]

  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Component ID.
   */
  targetComponent: uint8_t
  /**
   * Point index (first point is 1, 0 is for return point).
   */
  idx: uint8_t
}

/**
 * Status of DCM attitude estimator.
 */
export class Ahrs extends MavLinkData {
  static MSG_ID = 163
  static MSG_NAME = 'AHRS'
  static PAYLOAD_LENGTH = 28
  static MAGIC_NUMBER = 127

  static FIELDS = [
    new MavLinkPacketField('omegaIx', 'omegaIx', 0, false, 4, 'float', 'rad/s'),
    new MavLinkPacketField('omegaIy', 'omegaIy', 4, false, 4, 'float', 'rad/s'),
    new MavLinkPacketField('omegaIz', 'omegaIz', 8, false, 4, 'float', 'rad/s'),
    new MavLinkPacketField('accel_weight', 'accelWeight', 12, false, 4, 'float', ''),
    new MavLinkPacketField('renorm_val', 'renormVal', 16, false, 4, 'float', ''),
    new MavLinkPacketField('error_rp', 'errorRp', 20, false, 4, 'float', ''),
    new MavLinkPacketField('error_yaw', 'errorYaw', 24, false, 4, 'float', ''),
  ]

  /**
   * X gyro drift estimate.
   * Units: rad/s
   */
  omegaIx: float
  /**
   * Y gyro drift estimate.
   * Units: rad/s
   */
  omegaIy: float
  /**
   * Z gyro drift estimate.
   * Units: rad/s
   */
  omegaIz: float
  /**
   * Average accel_weight.
   */
  accelWeight: float
  /**
   * Average renormalisation value.
   */
  renormVal: float
  /**
   * Average error_roll_pitch value.
   */
  errorRp: float
  /**
   * Average error_yaw value.
   */
  errorYaw: float
}

/**
 * Status of simulation environment, if used.
 */
export class SimState extends MavLinkData {
  static MSG_ID = 164
  static MSG_NAME = 'SIMSTATE'
  static PAYLOAD_LENGTH = 44
  static MAGIC_NUMBER = 154

  static FIELDS = [
    new MavLinkPacketField('roll', 'roll', 0, false, 4, 'float', 'rad'),
    new MavLinkPacketField('pitch', 'pitch', 4, false, 4, 'float', 'rad'),
    new MavLinkPacketField('yaw', 'yaw', 8, false, 4, 'float', 'rad'),
    new MavLinkPacketField('xacc', 'xacc', 12, false, 4, 'float', 'm/s/s'),
    new MavLinkPacketField('yacc', 'yacc', 16, false, 4, 'float', 'm/s/s'),
    new MavLinkPacketField('zacc', 'zacc', 20, false, 4, 'float', 'm/s/s'),
    new MavLinkPacketField('xgyro', 'xgyro', 24, false, 4, 'float', 'rad/s'),
    new MavLinkPacketField('ygyro', 'ygyro', 28, false, 4, 'float', 'rad/s'),
    new MavLinkPacketField('zgyro', 'zgyro', 32, false, 4, 'float', 'rad/s'),
    new MavLinkPacketField('lat', 'lat', 36, false, 4, 'int32_t', 'degE7'),
    new MavLinkPacketField('lng', 'lng', 40, false, 4, 'int32_t', 'degE7'),
  ]

  /**
   * Roll angle.
   * Units: rad
   */
  roll: float
  /**
   * Pitch angle.
   * Units: rad
   */
  pitch: float
  /**
   * Yaw angle.
   * Units: rad
   */
  yaw: float
  /**
   * X acceleration.
   * Units: m/s/s
   */
  xacc: float
  /**
   * Y acceleration.
   * Units: m/s/s
   */
  yacc: float
  /**
   * Z acceleration.
   * Units: m/s/s
   */
  zacc: float
  /**
   * Angular speed around X axis.
   * Units: rad/s
   */
  xgyro: float
  /**
   * Angular speed around Y axis.
   * Units: rad/s
   */
  ygyro: float
  /**
   * Angular speed around Z axis.
   * Units: rad/s
   */
  zgyro: float
  /**
   * Latitude.
   * Units: degE7
   */
  lat: int32_t
  /**
   * Longitude.
   * Units: degE7
   */
  lng: int32_t
}

/**
 * Status of key hardware.
 */
export class HwStatus extends MavLinkData {
  static MSG_ID = 165
  static MSG_NAME = 'HWSTATUS'
  static PAYLOAD_LENGTH = 3
  static MAGIC_NUMBER = 21

  static FIELDS = [
    new MavLinkPacketField('Vcc', 'Vcc', 0, false, 2, 'uint16_t', 'mV'),
    new MavLinkPacketField('I2Cerr', 'I2Cerr', 2, false, 1, 'uint8_t', ''),
  ]

  /**
   * Board voltage.
   * Units: mV
   */
  Vcc: uint16_t
  /**
   * I2C error count.
   */
  I2Cerr: uint8_t
}

/**
 * Status generated by radio.
 */
export class Radio extends MavLinkData {
  static MSG_ID = 166
  static MSG_NAME = 'RADIO'
  static PAYLOAD_LENGTH = 9
  static MAGIC_NUMBER = 21

  static FIELDS = [
    new MavLinkPacketField('rxerrors', 'rxerrors', 0, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('fixed', 'fixed', 2, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('rssi', 'rssi', 4, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('remrssi', 'remrssi', 5, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('txbuf', 'txbuf', 6, false, 1, 'uint8_t', '%'),
    new MavLinkPacketField('noise', 'noise', 7, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('remnoise', 'remnoise', 8, false, 1, 'uint8_t', ''),
  ]

  /**
   * Local signal strength.
   */
  rssi: uint8_t
  /**
   * Remote signal strength.
   */
  remrssi: uint8_t
  /**
   * How full the tx buffer is.
   * Units: %
   */
  txbuf: uint8_t
  /**
   * Background noise level.
   */
  noise: uint8_t
  /**
   * Remote background noise level.
   */
  remnoise: uint8_t
  /**
   * Receive errors.
   */
  rxerrors: uint16_t
  /**
   * Count of error corrected packets.
   */
  fixed: uint16_t
}

/**
 * Status of AP_Limits. Sent in extended status stream when AP_Limits is enabled.
 */
export class LimitsStatus extends MavLinkData {
  static MSG_ID = 167
  static MSG_NAME = 'LIMITS_STATUS'
  static PAYLOAD_LENGTH = 22
  static MAGIC_NUMBER = 144

  static FIELDS = [
    new MavLinkPacketField('last_trigger', 'lastTrigger', 0, false, 4, 'uint32_t', 'ms'),
    new MavLinkPacketField('last_action', 'lastAction', 4, false, 4, 'uint32_t', 'ms'),
    new MavLinkPacketField('last_recovery', 'lastRecovery', 8, false, 4, 'uint32_t', 'ms'),
    new MavLinkPacketField('last_clear', 'lastClear', 12, false, 4, 'uint32_t', 'ms'),
    new MavLinkPacketField('breach_count', 'breachCount', 16, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('limits_state', 'limitsState', 18, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('mods_enabled', 'modsEnabled', 19, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('mods_required', 'modsRequired', 20, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('mods_triggered', 'modsTriggered', 21, false, 1, 'uint8_t', ''),
  ]

  /**
   * State of AP_Limits.
   */
  limitsState: LimitsState
  /**
   * Time (since boot) of last breach.
   * Units: ms
   */
  lastTrigger: uint32_t
  /**
   * Time (since boot) of last recovery action.
   * Units: ms
   */
  lastAction: uint32_t
  /**
   * Time (since boot) of last successful recovery.
   * Units: ms
   */
  lastRecovery: uint32_t
  /**
   * Time (since boot) of last all-clear.
   * Units: ms
   */
  lastClear: uint32_t
  /**
   * Number of fence breaches.
   */
  breachCount: uint16_t
  /**
   * AP_Limit_Module bitfield of enabled modules.
   */
  modsEnabled: LimitModule
  /**
   * AP_Limit_Module bitfield of required modules.
   */
  modsRequired: LimitModule
  /**
   * AP_Limit_Module bitfield of triggered modules.
   */
  modsTriggered: LimitModule
}

/**
 * Wind estimation.
 */
export class Wind extends MavLinkData {
  static MSG_ID = 168
  static MSG_NAME = 'WIND'
  static PAYLOAD_LENGTH = 12
  static MAGIC_NUMBER = 1

  static FIELDS = [
    new MavLinkPacketField('direction', 'direction', 0, false, 4, 'float', 'deg'),
    new MavLinkPacketField('speed', 'speed', 4, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('speed_z', 'speedZ', 8, false, 4, 'float', 'm/s'),
  ]

  /**
   * Wind direction (that wind is coming from).
   * Units: deg
   */
  direction: float
  /**
   * Wind speed in ground plane.
   * Units: m/s
   */
  speed: float
  /**
   * Vertical wind speed.
   * Units: m/s
   */
  speedZ: float
}

/**
 * Data packet, size 16.
 */
export class Data16 extends MavLinkData {
  static MSG_ID = 169
  static MSG_NAME = 'DATA16'
  static PAYLOAD_LENGTH = 18
  static MAGIC_NUMBER = 234

  static FIELDS = [
    new MavLinkPacketField('type', 'type', 0, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('len', 'len', 1, false, 1, 'uint8_t', 'bytes'),
    new MavLinkPacketField('data', 'data', 2, false, 1, 'uint8_t[]', '', 16),
  ]

  /**
   * Data type.
   */
  type: uint8_t
  /**
   * Data length.
   * Units: bytes
   */
  len: uint8_t
  /**
   * Raw data.
   */
  data: uint8_t[]
}

/**
 * Data packet, size 32.
 */
export class Data32 extends MavLinkData {
  static MSG_ID = 170
  static MSG_NAME = 'DATA32'
  static PAYLOAD_LENGTH = 34
  static MAGIC_NUMBER = 73

  static FIELDS = [
    new MavLinkPacketField('type', 'type', 0, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('len', 'len', 1, false, 1, 'uint8_t', 'bytes'),
    new MavLinkPacketField('data', 'data', 2, false, 1, 'uint8_t[]', '', 32),
  ]

  /**
   * Data type.
   */
  type: uint8_t
  /**
   * Data length.
   * Units: bytes
   */
  len: uint8_t
  /**
   * Raw data.
   */
  data: uint8_t[]
}

/**
 * Data packet, size 64.
 */
export class Data64 extends MavLinkData {
  static MSG_ID = 171
  static MSG_NAME = 'DATA64'
  static PAYLOAD_LENGTH = 66
  static MAGIC_NUMBER = 181

  static FIELDS = [
    new MavLinkPacketField('type', 'type', 0, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('len', 'len', 1, false, 1, 'uint8_t', 'bytes'),
    new MavLinkPacketField('data', 'data', 2, false, 1, 'uint8_t[]', '', 64),
  ]

  /**
   * Data type.
   */
  type: uint8_t
  /**
   * Data length.
   * Units: bytes
   */
  len: uint8_t
  /**
   * Raw data.
   */
  data: uint8_t[]
}

/**
 * Data packet, size 96.
 */
export class Data96 extends MavLinkData {
  static MSG_ID = 172
  static MSG_NAME = 'DATA96'
  static PAYLOAD_LENGTH = 98
  static MAGIC_NUMBER = 22

  static FIELDS = [
    new MavLinkPacketField('type', 'type', 0, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('len', 'len', 1, false, 1, 'uint8_t', 'bytes'),
    new MavLinkPacketField('data', 'data', 2, false, 1, 'uint8_t[]', '', 96),
  ]

  /**
   * Data type.
   */
  type: uint8_t
  /**
   * Data length.
   * Units: bytes
   */
  len: uint8_t
  /**
   * Raw data.
   */
  data: uint8_t[]
}

/**
 * Rangefinder reporting.
 */
export class RangeFinder extends MavLinkData {
  static MSG_ID = 173
  static MSG_NAME = 'RANGEFINDER'
  static PAYLOAD_LENGTH = 8
  static MAGIC_NUMBER = 83

  static FIELDS = [
    new MavLinkPacketField('distance', 'distance', 0, false, 4, 'float', 'm'),
    new MavLinkPacketField('voltage', 'voltage', 4, false, 4, 'float', 'V'),
  ]

  /**
   * Distance.
   * Units: m
   */
  distance: float
  /**
   * Raw voltage if available, zero otherwise.
   * Units: V
   */
  voltage: float
}

/**
 * Airspeed auto-calibration.
 */
export class AirspeedAutocal extends MavLinkData {
  static MSG_ID = 174
  static MSG_NAME = 'AIRSPEED_AUTOCAL'
  static PAYLOAD_LENGTH = 48
  static MAGIC_NUMBER = 167

  static FIELDS = [
    new MavLinkPacketField('vx', 'vx', 0, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('vy', 'vy', 4, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('vz', 'vz', 8, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('diff_pressure', 'diffPressure', 12, false, 4, 'float', 'Pa'),
    new MavLinkPacketField('EAS2TAS', 'EAS2TAS', 16, false, 4, 'float', ''),
    new MavLinkPacketField('ratio', 'ratio', 20, false, 4, 'float', ''),
    new MavLinkPacketField('state_x', 'stateX', 24, false, 4, 'float', ''),
    new MavLinkPacketField('state_y', 'stateY', 28, false, 4, 'float', ''),
    new MavLinkPacketField('state_z', 'stateZ', 32, false, 4, 'float', ''),
    new MavLinkPacketField('Pax', 'Pax', 36, false, 4, 'float', ''),
    new MavLinkPacketField('Pby', 'Pby', 40, false, 4, 'float', ''),
    new MavLinkPacketField('Pcz', 'Pcz', 44, false, 4, 'float', ''),
  ]

  /**
   * GPS velocity north.
   * Units: m/s
   */
  vx: float
  /**
   * GPS velocity east.
   * Units: m/s
   */
  vy: float
  /**
   * GPS velocity down.
   * Units: m/s
   */
  vz: float
  /**
   * Differential pressure.
   * Units: Pa
   */
  diffPressure: float
  /**
   * Estimated to true airspeed ratio.
   */
  EAS2TAS: float
  /**
   * Airspeed ratio.
   */
  ratio: float
  /**
   * EKF state x.
   */
  stateX: float
  /**
   * EKF state y.
   */
  stateY: float
  /**
   * EKF state z.
   */
  stateZ: float
  /**
   * EKF Pax.
   */
  Pax: float
  /**
   * EKF Pby.
   */
  Pby: float
  /**
   * EKF Pcz.
   */
  Pcz: float
}

/**
 * A rally point. Used to set a point when from GCS -> MAV. Also used to return a point from MAV ->
 * GCS.
 */
export class RallyPoint extends MavLinkData {
  static MSG_ID = 175
  static MSG_NAME = 'RALLY_POINT'
  static PAYLOAD_LENGTH = 19
  static MAGIC_NUMBER = 138

  static FIELDS = [
    new MavLinkPacketField('lat', 'lat', 0, false, 4, 'int32_t', 'degE7'),
    new MavLinkPacketField('lng', 'lng', 4, false, 4, 'int32_t', 'degE7'),
    new MavLinkPacketField('alt', 'alt', 8, false, 2, 'int16_t', 'm'),
    new MavLinkPacketField('break_alt', 'breakAlt', 10, false, 2, 'int16_t', 'm'),
    new MavLinkPacketField('land_dir', 'landDir', 12, false, 2, 'uint16_t', 'cdeg'),
    new MavLinkPacketField('target_system', 'targetSystem', 14, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 15, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('idx', 'idx', 16, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('count', 'count', 17, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('flags', 'flags', 18, false, 1, 'uint8_t', ''),
  ]

  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Component ID.
   */
  targetComponent: uint8_t
  /**
   * Point index (first point is 0).
   */
  idx: uint8_t
  /**
   * Total number of points (for sanity checking).
   */
  count: uint8_t
  /**
   * Latitude of point.
   * Units: degE7
   */
  lat: int32_t
  /**
   * Longitude of point.
   * Units: degE7
   */
  lng: int32_t
  /**
   * Transit / loiter altitude relative to home.
   * Units: m
   */
  alt: int16_t
  /**
   * Break altitude relative to home.
   * Units: m
   */
  breakAlt: int16_t
  /**
   * Heading to aim for when landing.
   * Units: cdeg
   */
  landDir: uint16_t
  /**
   * Configuration flags.
   */
  flags: RallyFlags
}

/**
 * Request a current rally point from MAV. MAV should respond with a RALLY_POINT message. MAV should
 * not respond if the request is invalid.
 */
export class RallyFetchPoint extends MavLinkData {
  static MSG_ID = 176
  static MSG_NAME = 'RALLY_FETCH_POINT'
  static PAYLOAD_LENGTH = 3
  static MAGIC_NUMBER = 234

  static FIELDS = [
    new MavLinkPacketField('target_system', 'targetSystem', 0, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 1, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('idx', 'idx', 2, false, 1, 'uint8_t', ''),
  ]

  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Component ID.
   */
  targetComponent: uint8_t
  /**
   * Point index (first point is 0).
   */
  idx: uint8_t
}

/**
 * Status of compassmot calibration.
 */
export class CompassMotStatus extends MavLinkData {
  static MSG_ID = 177
  static MSG_NAME = 'COMPASSMOT_STATUS'
  static PAYLOAD_LENGTH = 20
  static MAGIC_NUMBER = 240

  static FIELDS = [
    new MavLinkPacketField('current', 'current', 0, false, 4, 'float', 'A'),
    new MavLinkPacketField('CompensationX', 'CompensationX', 4, false, 4, 'float', ''),
    new MavLinkPacketField('CompensationY', 'CompensationY', 8, false, 4, 'float', ''),
    new MavLinkPacketField('CompensationZ', 'CompensationZ', 12, false, 4, 'float', ''),
    new MavLinkPacketField('throttle', 'throttle', 16, false, 2, 'uint16_t', 'd%'),
    new MavLinkPacketField('interference', 'interference', 18, false, 2, 'uint16_t', '%'),
  ]

  /**
   * Throttle.
   * Units: d%
   */
  throttle: uint16_t
  /**
   * Current.
   * Units: A
   */
  current: float
  /**
   * Interference.
   * Units: %
   */
  interference: uint16_t
  /**
   * Motor Compensation X.
   */
  CompensationX: float
  /**
   * Motor Compensation Y.
   */
  CompensationY: float
  /**
   * Motor Compensation Z.
   */
  CompensationZ: float
}

/**
 * Status of secondary AHRS filter if available.
 */
export class Ahrs2 extends MavLinkData {
  static MSG_ID = 178
  static MSG_NAME = 'AHRS2'
  static PAYLOAD_LENGTH = 24
  static MAGIC_NUMBER = 47

  static FIELDS = [
    new MavLinkPacketField('roll', 'roll', 0, false, 4, 'float', 'rad'),
    new MavLinkPacketField('pitch', 'pitch', 4, false, 4, 'float', 'rad'),
    new MavLinkPacketField('yaw', 'yaw', 8, false, 4, 'float', 'rad'),
    new MavLinkPacketField('altitude', 'altitude', 12, false, 4, 'float', 'm'),
    new MavLinkPacketField('lat', 'lat', 16, false, 4, 'int32_t', 'degE7'),
    new MavLinkPacketField('lng', 'lng', 20, false, 4, 'int32_t', 'degE7'),
  ]

  /**
   * Roll angle.
   * Units: rad
   */
  roll: float
  /**
   * Pitch angle.
   * Units: rad
   */
  pitch: float
  /**
   * Yaw angle.
   * Units: rad
   */
  yaw: float
  /**
   * Altitude (MSL).
   * Units: m
   */
  altitude: float
  /**
   * Latitude.
   * Units: degE7
   */
  lat: int32_t
  /**
   * Longitude.
   * Units: degE7
   */
  lng: int32_t
}

/**
 * Camera Event.
 */
export class CameraStatus extends MavLinkData {
  static MSG_ID = 179
  static MSG_NAME = 'CAMERA_STATUS'
  static PAYLOAD_LENGTH = 29
  static MAGIC_NUMBER = 189

  static FIELDS = [
    new MavLinkPacketField('time_usec', 'timeUsec', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('p1', 'p1', 8, false, 4, 'float', ''),
    new MavLinkPacketField('p2', 'p2', 12, false, 4, 'float', ''),
    new MavLinkPacketField('p3', 'p3', 16, false, 4, 'float', ''),
    new MavLinkPacketField('p4', 'p4', 20, false, 4, 'float', ''),
    new MavLinkPacketField('img_idx', 'imgIdx', 24, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('target_system', 'targetSystem', 26, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('cam_idx', 'camIdx', 27, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('event_id', 'eventId', 28, false, 1, 'uint8_t', ''),
  ]

  /**
   * Image timestamp (since UNIX epoch, according to camera clock).
   * Units: us
   */
  timeUsec: uint64_t
  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Camera ID.
   */
  camIdx: uint8_t
  /**
   * Image index.
   */
  imgIdx: uint16_t
  /**
   * Event type.
   */
  eventId: CameraStatusTypes
  /**
   * Parameter 1 (meaning depends on event_id, see CAMERA_STATUS_TYPES enum).
   */
  p1: float
  /**
   * Parameter 2 (meaning depends on event_id, see CAMERA_STATUS_TYPES enum).
   */
  p2: float
  /**
   * Parameter 3 (meaning depends on event_id, see CAMERA_STATUS_TYPES enum).
   */
  p3: float
  /**
   * Parameter 4 (meaning depends on event_id, see CAMERA_STATUS_TYPES enum).
   */
  p4: float
}

/**
 * Camera Capture Feedback.
 */
export class CameraFeedback extends MavLinkData {
  static MSG_ID = 180
  static MSG_NAME = 'CAMERA_FEEDBACK'
  static PAYLOAD_LENGTH = 47
  static MAGIC_NUMBER = 52

  static FIELDS = [
    new MavLinkPacketField('time_usec', 'timeUsec', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('lat', 'lat', 8, false, 4, 'int32_t', 'degE7'),
    new MavLinkPacketField('lng', 'lng', 12, false, 4, 'int32_t', 'degE7'),
    new MavLinkPacketField('alt_msl', 'altMsl', 16, false, 4, 'float', 'm'),
    new MavLinkPacketField('alt_rel', 'altRel', 20, false, 4, 'float', 'm'),
    new MavLinkPacketField('roll', 'roll', 24, false, 4, 'float', 'deg'),
    new MavLinkPacketField('pitch', 'pitch', 28, false, 4, 'float', 'deg'),
    new MavLinkPacketField('yaw', 'yaw', 32, false, 4, 'float', 'deg'),
    new MavLinkPacketField('foc_len', 'focLen', 36, false, 4, 'float', 'mm'),
    new MavLinkPacketField('img_idx', 'imgIdx', 40, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('target_system', 'targetSystem', 42, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('cam_idx', 'camIdx', 43, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('flags', 'flags', 44, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('completed_captures', 'completedCaptures', 45, true, 2, 'uint16_t', ''),
  ]

  /**
   * Image timestamp (since UNIX epoch), as passed in by CAMERA_STATUS message (or autopilot if no CCB).
   * Units: us
   */
  timeUsec: uint64_t
  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Camera ID.
   */
  camIdx: uint8_t
  /**
   * Image index.
   */
  imgIdx: uint16_t
  /**
   * Latitude.
   * Units: degE7
   */
  lat: int32_t
  /**
   * Longitude.
   * Units: degE7
   */
  lng: int32_t
  /**
   * Altitude (MSL).
   * Units: m
   */
  altMsl: float
  /**
   * Altitude (Relative to HOME location).
   * Units: m
   */
  altRel: float
  /**
   * Camera Roll angle (earth frame, +-180).
   * Units: deg
   */
  roll: float
  /**
   * Camera Pitch angle (earth frame, +-180).
   * Units: deg
   */
  pitch: float
  /**
   * Camera Yaw (earth frame, 0-360, true).
   * Units: deg
   */
  yaw: float
  /**
   * Focal Length.
   * Units: mm
   */
  focLen: float
  /**
   * Feedback flags.
   */
  flags: CameraFeedbackFlags
  /**
   * Completed image captures.
   */
  completedCaptures: uint16_t
}

/**
 * 2nd Battery status
 *
 * @deprecated since 2017-04, replaced by BATTERY_STATUS
 */
export class Battery2 extends MavLinkData {
  static MSG_ID = 181
  static MSG_NAME = 'BATTERY2'
  static PAYLOAD_LENGTH = 4
  static MAGIC_NUMBER = 174

  static FIELDS = [
    new MavLinkPacketField('voltage', 'voltage', 0, false, 2, 'uint16_t', 'mV'),
    new MavLinkPacketField('current_battery', 'currentBattery', 2, false, 2, 'int16_t', 'cA'),
  ]

  /**
   * Voltage.
   * Units: mV
   */
  voltage: uint16_t
  /**
   * Battery current, -1: autopilot does not measure the current.
   * Units: cA
   */
  currentBattery: int16_t
}

/**
 * Status of third AHRS filter if available. This is for ANU research group (Ali and Sean).
 */
export class Ahrs3 extends MavLinkData {
  static MSG_ID = 182
  static MSG_NAME = 'AHRS3'
  static PAYLOAD_LENGTH = 40
  static MAGIC_NUMBER = 229

  static FIELDS = [
    new MavLinkPacketField('roll', 'roll', 0, false, 4, 'float', 'rad'),
    new MavLinkPacketField('pitch', 'pitch', 4, false, 4, 'float', 'rad'),
    new MavLinkPacketField('yaw', 'yaw', 8, false, 4, 'float', 'rad'),
    new MavLinkPacketField('altitude', 'altitude', 12, false, 4, 'float', 'm'),
    new MavLinkPacketField('lat', 'lat', 16, false, 4, 'int32_t', 'degE7'),
    new MavLinkPacketField('lng', 'lng', 20, false, 4, 'int32_t', 'degE7'),
    new MavLinkPacketField('v1', 'v1', 24, false, 4, 'float', ''),
    new MavLinkPacketField('v2', 'v2', 28, false, 4, 'float', ''),
    new MavLinkPacketField('v3', 'v3', 32, false, 4, 'float', ''),
    new MavLinkPacketField('v4', 'v4', 36, false, 4, 'float', ''),
  ]

  /**
   * Roll angle.
   * Units: rad
   */
  roll: float
  /**
   * Pitch angle.
   * Units: rad
   */
  pitch: float
  /**
   * Yaw angle.
   * Units: rad
   */
  yaw: float
  /**
   * Altitude (MSL).
   * Units: m
   */
  altitude: float
  /**
   * Latitude.
   * Units: degE7
   */
  lat: int32_t
  /**
   * Longitude.
   * Units: degE7
   */
  lng: int32_t
  /**
   * Test variable1.
   */
  v1: float
  /**
   * Test variable2.
   */
  v2: float
  /**
   * Test variable3.
   */
  v3: float
  /**
   * Test variable4.
   */
  v4: float
}

/**
 * Request the autopilot version from the system/component.
 */
export class AutopilotVersionRequest extends MavLinkData {
  static MSG_ID = 183
  static MSG_NAME = 'AUTOPILOT_VERSION_REQUEST'
  static PAYLOAD_LENGTH = 2
  static MAGIC_NUMBER = 85

  static FIELDS = [
    new MavLinkPacketField('target_system', 'targetSystem', 0, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 1, false, 1, 'uint8_t', ''),
  ]

  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Component ID.
   */
  targetComponent: uint8_t
}

/**
 * Send a block of log data to remote location.
 */
export class RemoteLogDataBlock extends MavLinkData {
  static MSG_ID = 184
  static MSG_NAME = 'REMOTE_LOG_DATA_BLOCK'
  static PAYLOAD_LENGTH = 206
  static MAGIC_NUMBER = 159

  static FIELDS = [
    new MavLinkPacketField('seqno', 'seqno', 0, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('target_system', 'targetSystem', 4, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 5, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('data', 'data', 6, false, 1, 'uint8_t[]', '', 200),
  ]

  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Component ID.
   */
  targetComponent: uint8_t
  /**
   * Log data block sequence number.
   */
  seqno: MavRemoteLogDataBlockCommands
  /**
   * Log data block.
   */
  data: uint8_t[]
}

/**
 * Send Status of each log block that autopilot board might have sent.
 */
export class RemoteLogBlockStatus extends MavLinkData {
  static MSG_ID = 185
  static MSG_NAME = 'REMOTE_LOG_BLOCK_STATUS'
  static PAYLOAD_LENGTH = 7
  static MAGIC_NUMBER = 186

  static FIELDS = [
    new MavLinkPacketField('seqno', 'seqno', 0, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('target_system', 'targetSystem', 4, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 5, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('status', 'status', 6, false, 1, 'uint8_t', ''),
  ]

  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Component ID.
   */
  targetComponent: uint8_t
  /**
   * Log data block sequence number.
   */
  seqno: uint32_t
  /**
   * Log data block status.
   */
  status: MavRemoteLogDataBlockStatuses
}

/**
 * Control vehicle LEDs.
 */
export class LedControl extends MavLinkData {
  static MSG_ID = 186
  static MSG_NAME = 'LED_CONTROL'
  static PAYLOAD_LENGTH = 29
  static MAGIC_NUMBER = 72

  static FIELDS = [
    new MavLinkPacketField('target_system', 'targetSystem', 0, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 1, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('instance', 'instance', 2, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('pattern', 'pattern', 3, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('custom_len', 'customLen', 4, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('custom_bytes', 'customBytes', 5, false, 1, 'uint8_t[]', '', 24),
  ]

  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Component ID.
   */
  targetComponent: uint8_t
  /**
   * Instance (LED instance to control or 255 for all LEDs).
   */
  instance: uint8_t
  /**
   * Pattern (see LED_PATTERN_ENUM).
   */
  pattern: uint8_t
  /**
   * Custom Byte Length.
   */
  customLen: uint8_t
  /**
   * Custom Bytes.
   */
  customBytes: uint8_t[]
}

/**
 * Reports progress of compass calibration.
 */
export class MagCalProgress extends MavLinkData {
  static MSG_ID = 191
  static MSG_NAME = 'MAG_CAL_PROGRESS'
  static PAYLOAD_LENGTH = 27
  static MAGIC_NUMBER = 92

  static FIELDS = [
    new MavLinkPacketField('direction_x', 'directionX', 0, false, 4, 'float', ''),
    new MavLinkPacketField('direction_y', 'directionY', 4, false, 4, 'float', ''),
    new MavLinkPacketField('direction_z', 'directionZ', 8, false, 4, 'float', ''),
    new MavLinkPacketField('compass_id', 'compassId', 12, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('cal_mask', 'calMask', 13, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('cal_status', 'calStatus', 14, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('attempt', 'attempt', 15, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('completion_pct', 'completionPct', 16, false, 1, 'uint8_t', '%'),
    new MavLinkPacketField('completion_mask', 'completionMask', 17, false, 1, 'uint8_t[]', '', 10),
  ]

  /**
   * Compass being calibrated.
   */
  compassId: uint8_t
  /**
   * Bitmask of compasses being calibrated.
   */
  calMask: uint8_t
  /**
   * Calibration Status.
   */
  calStatus: MagCalStatus
  /**
   * Attempt number.
   */
  attempt: uint8_t
  /**
   * Completion percentage.
   * Units: %
   */
  completionPct: uint8_t
  /**
   * Bitmask of sphere sections (see http://en.wikipedia.org/wiki/Geodesic_grid).
   */
  completionMask: uint8_t[]
  /**
   * Body frame direction vector for display.
   */
  directionX: float
  /**
   * Body frame direction vector for display.
   */
  directionY: float
  /**
   * Body frame direction vector for display.
   */
  directionZ: float
}

/**
 * EKF Status message including flags and variances.
 */
export class EkfStatusReport extends MavLinkData {
  static MSG_ID = 193
  static MSG_NAME = 'EKF_STATUS_REPORT'
  static PAYLOAD_LENGTH = 26
  static MAGIC_NUMBER = 71

  static FIELDS = [
    new MavLinkPacketField('velocity_variance', 'velocityVariance', 0, false, 4, 'float', ''),
    new MavLinkPacketField('pos_horiz_variance', 'posHorizVariance', 4, false, 4, 'float', ''),
    new MavLinkPacketField('pos_vert_variance', 'posVertVariance', 8, false, 4, 'float', ''),
    new MavLinkPacketField('compass_variance', 'compassVariance', 12, false, 4, 'float', ''),
    new MavLinkPacketField('terrain_alt_variance', 'terrainAltVariance', 16, false, 4, 'float', ''),
    new MavLinkPacketField('flags', 'flags', 20, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('airspeed_variance', 'airspeedVariance', 22, true, 4, 'float', ''),
  ]

  /**
   * Flags.
   */
  flags: EkfStatusFlags
  /**
   * Velocity variance.
   */
  velocityVariance: float
  /**
   * Horizontal Position variance.
   */
  posHorizVariance: float
  /**
   * Vertical Position variance.
   */
  posVertVariance: float
  /**
   * Compass variance.
   */
  compassVariance: float
  /**
   * Terrain Altitude variance.
   */
  terrainAltVariance: float
  /**
   * Airspeed variance.
   */
  airspeedVariance: float
}

/**
 * PID tuning information.
 */
export class PidTuning extends MavLinkData {
  static MSG_ID = 194
  static MSG_NAME = 'PID_TUNING'
  static PAYLOAD_LENGTH = 33
  static MAGIC_NUMBER = 98

  static FIELDS = [
    new MavLinkPacketField('desired', 'desired', 0, false, 4, 'float', ''),
    new MavLinkPacketField('achieved', 'achieved', 4, false, 4, 'float', ''),
    new MavLinkPacketField('FF', 'FF', 8, false, 4, 'float', ''),
    new MavLinkPacketField('P', 'P', 12, false, 4, 'float', ''),
    new MavLinkPacketField('I', 'I', 16, false, 4, 'float', ''),
    new MavLinkPacketField('D', 'D', 20, false, 4, 'float', ''),
    new MavLinkPacketField('axis', 'axis', 24, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('SRate', 'SRate', 25, true, 4, 'float', ''),
    new MavLinkPacketField('PDmod', 'PDmod', 29, true, 4, 'float', ''),
  ]

  /**
   * Axis.
   */
  axis: PidTuningAxis
  /**
   * Desired rate.
   */
  desired: float
  /**
   * Achieved rate.
   */
  achieved: float
  /**
   * FF component.
   */
  FF: float
  /**
   * P component.
   */
  P: float
  /**
   * I component.
   */
  I: float
  /**
   * D component.
   */
  D: float
  /**
   * Slew rate.
   */
  SRate: float
  /**
   * P/D oscillation modifier.
   */
  PDmod: float
}

/**
 * Deepstall path planning.
 */
export class Deepstall extends MavLinkData {
  static MSG_ID = 195
  static MSG_NAME = 'DEEPSTALL'
  static PAYLOAD_LENGTH = 37
  static MAGIC_NUMBER = 120

  static FIELDS = [
    new MavLinkPacketField('landing_lat', 'landingLat', 0, false, 4, 'int32_t', 'degE7'),
    new MavLinkPacketField('landing_lon', 'landingLon', 4, false, 4, 'int32_t', 'degE7'),
    new MavLinkPacketField('path_lat', 'pathLat', 8, false, 4, 'int32_t', 'degE7'),
    new MavLinkPacketField('path_lon', 'pathLon', 12, false, 4, 'int32_t', 'degE7'),
    new MavLinkPacketField('arc_entry_lat', 'arcEntryLat', 16, false, 4, 'int32_t', 'degE7'),
    new MavLinkPacketField('arc_entry_lon', 'arcEntryLon', 20, false, 4, 'int32_t', 'degE7'),
    new MavLinkPacketField('altitude', 'altitude', 24, false, 4, 'float', 'm'),
    new MavLinkPacketField('expected_travel_distance', 'expectedTravelDistance', 28, false, 4, 'float', 'm'),
    new MavLinkPacketField('cross_track_error', 'crossTrackError', 32, false, 4, 'float', 'm'),
    new MavLinkPacketField('stage', 'stage', 36, false, 1, 'uint8_t', ''),
  ]

  /**
   * Landing latitude.
   * Units: degE7
   */
  landingLat: int32_t
  /**
   * Landing longitude.
   * Units: degE7
   */
  landingLon: int32_t
  /**
   * Final heading start point, latitude.
   * Units: degE7
   */
  pathLat: int32_t
  /**
   * Final heading start point, longitude.
   * Units: degE7
   */
  pathLon: int32_t
  /**
   * Arc entry point, latitude.
   * Units: degE7
   */
  arcEntryLat: int32_t
  /**
   * Arc entry point, longitude.
   * Units: degE7
   */
  arcEntryLon: int32_t
  /**
   * Altitude.
   * Units: m
   */
  altitude: float
  /**
   * Distance the aircraft expects to travel during the deepstall.
   * Units: m
   */
  expectedTravelDistance: float
  /**
   * Deepstall cross track error (only valid when in DEEPSTALL_STAGE_LAND).
   * Units: m
   */
  crossTrackError: float
  /**
   * Deepstall stage.
   */
  stage: DeepstallStage
}

/**
 * 3 axis gimbal measurements.
 */
export class GimbalReport extends MavLinkData {
  static MSG_ID = 200
  static MSG_NAME = 'GIMBAL_REPORT'
  static PAYLOAD_LENGTH = 42
  static MAGIC_NUMBER = 134

  static FIELDS = [
    new MavLinkPacketField('delta_time', 'deltaTime', 0, false, 4, 'float', 's'),
    new MavLinkPacketField('delta_angle_x', 'deltaAngleX', 4, false, 4, 'float', 'rad'),
    new MavLinkPacketField('delta_angle_y', 'deltaAngleY', 8, false, 4, 'float', 'rad'),
    new MavLinkPacketField('delta_angle_z', 'deltaAngleZ', 12, false, 4, 'float', 'rad'),
    new MavLinkPacketField('delta_velocity_x', 'deltaVelocityX', 16, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('delta_velocity_y', 'deltaVelocityY', 20, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('delta_velocity_z', 'deltaVelocityZ', 24, false, 4, 'float', 'm/s'),
    new MavLinkPacketField('joint_roll', 'jointRoll', 28, false, 4, 'float', 'rad'),
    new MavLinkPacketField('joint_el', 'jointEl', 32, false, 4, 'float', 'rad'),
    new MavLinkPacketField('joint_az', 'jointAz', 36, false, 4, 'float', 'rad'),
    new MavLinkPacketField('target_system', 'targetSystem', 40, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 41, false, 1, 'uint8_t', ''),
  ]

  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Component ID.
   */
  targetComponent: uint8_t
  /**
   * Time since last update.
   * Units: s
   */
  deltaTime: float
  /**
   * Delta angle X.
   * Units: rad
   */
  deltaAngleX: float
  /**
   * Delta angle Y.
   * Units: rad
   */
  deltaAngleY: float
  /**
   * Delta angle X.
   * Units: rad
   */
  deltaAngleZ: float
  /**
   * Delta velocity X.
   * Units: m/s
   */
  deltaVelocityX: float
  /**
   * Delta velocity Y.
   * Units: m/s
   */
  deltaVelocityY: float
  /**
   * Delta velocity Z.
   * Units: m/s
   */
  deltaVelocityZ: float
  /**
   * Joint ROLL.
   * Units: rad
   */
  jointRoll: float
  /**
   * Joint EL.
   * Units: rad
   */
  jointEl: float
  /**
   * Joint AZ.
   * Units: rad
   */
  jointAz: float
}

/**
 * Control message for rate gimbal.
 */
export class GimbalControl extends MavLinkData {
  static MSG_ID = 201
  static MSG_NAME = 'GIMBAL_CONTROL'
  static PAYLOAD_LENGTH = 14
  static MAGIC_NUMBER = 205

  static FIELDS = [
    new MavLinkPacketField('demanded_rate_x', 'demandedRateX', 0, false, 4, 'float', 'rad/s'),
    new MavLinkPacketField('demanded_rate_y', 'demandedRateY', 4, false, 4, 'float', 'rad/s'),
    new MavLinkPacketField('demanded_rate_z', 'demandedRateZ', 8, false, 4, 'float', 'rad/s'),
    new MavLinkPacketField('target_system', 'targetSystem', 12, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 13, false, 1, 'uint8_t', ''),
  ]

  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Component ID.
   */
  targetComponent: uint8_t
  /**
   * Demanded angular rate X.
   * Units: rad/s
   */
  demandedRateX: float
  /**
   * Demanded angular rate Y.
   * Units: rad/s
   */
  demandedRateY: float
  /**
   * Demanded angular rate Z.
   * Units: rad/s
   */
  demandedRateZ: float
}

/**
 * 100 Hz gimbal torque command telemetry.
 */
export class GimbalTorqueCmdReport extends MavLinkData {
  static MSG_ID = 214
  static MSG_NAME = 'GIMBAL_TORQUE_CMD_REPORT'
  static PAYLOAD_LENGTH = 8
  static MAGIC_NUMBER = 69

  static FIELDS = [
    new MavLinkPacketField('rl_torque_cmd', 'rlTorqueCmd', 0, false, 2, 'int16_t', ''),
    new MavLinkPacketField('el_torque_cmd', 'elTorqueCmd', 2, false, 2, 'int16_t', ''),
    new MavLinkPacketField('az_torque_cmd', 'azTorqueCmd', 4, false, 2, 'int16_t', ''),
    new MavLinkPacketField('target_system', 'targetSystem', 6, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 7, false, 1, 'uint8_t', ''),
  ]

  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Component ID.
   */
  targetComponent: uint8_t
  /**
   * Roll Torque Command.
   */
  rlTorqueCmd: int16_t
  /**
   * Elevation Torque Command.
   */
  elTorqueCmd: int16_t
  /**
   * Azimuth Torque Command.
   */
  azTorqueCmd: int16_t
}

/**
 * Heartbeat from a HeroBus attached GoPro.
 */
export class GoproHeartbeat extends MavLinkData {
  static MSG_ID = 215
  static MSG_NAME = 'GOPRO_HEARTBEAT'
  static PAYLOAD_LENGTH = 3
  static MAGIC_NUMBER = 101

  static FIELDS = [
    new MavLinkPacketField('status', 'status', 0, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('capture_mode', 'captureMode', 1, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('flags', 'flags', 2, false, 1, 'uint8_t', ''),
  ]

  /**
   * Status.
   */
  status: GoproHeartbeatStatus
  /**
   * Current capture mode.
   */
  captureMode: GoproCaptureMode
  /**
   * Additional status bits.
   */
  flags: GoproHeartbeatFlags
}

/**
 * Request a GOPRO_COMMAND response from the GoPro.
 */
export class GoproGetRequest extends MavLinkData {
  static MSG_ID = 216
  static MSG_NAME = 'GOPRO_GET_REQUEST'
  static PAYLOAD_LENGTH = 3
  static MAGIC_NUMBER = 50

  static FIELDS = [
    new MavLinkPacketField('target_system', 'targetSystem', 0, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 1, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('cmd_id', 'cmdId', 2, false, 1, 'uint8_t', ''),
  ]

  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Component ID.
   */
  targetComponent: uint8_t
  /**
   * Command ID.
   */
  cmdId: GoproCommand
}

/**
 * Response from a GOPRO_COMMAND get request.
 */
export class GoproGetResponse extends MavLinkData {
  static MSG_ID = 217
  static MSG_NAME = 'GOPRO_GET_RESPONSE'
  static PAYLOAD_LENGTH = 6
  static MAGIC_NUMBER = 202

  static FIELDS = [
    new MavLinkPacketField('cmd_id', 'cmdId', 0, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('status', 'status', 1, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('value', 'value', 2, false, 1, 'uint8_t[]', '', 4),
  ]

  /**
   * Command ID.
   */
  cmdId: GoproCommand
  /**
   * Status.
   */
  status: GoproRequestStatus
  /**
   * Value.
   */
  value: uint8_t[]
}

/**
 * Request to set a GOPRO_COMMAND with a desired.
 */
export class GoproSetRequest extends MavLinkData {
  static MSG_ID = 218
  static MSG_NAME = 'GOPRO_SET_REQUEST'
  static PAYLOAD_LENGTH = 7
  static MAGIC_NUMBER = 17

  static FIELDS = [
    new MavLinkPacketField('target_system', 'targetSystem', 0, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 1, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('cmd_id', 'cmdId', 2, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('value', 'value', 3, false, 1, 'uint8_t[]', '', 4),
  ]

  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Component ID.
   */
  targetComponent: uint8_t
  /**
   * Command ID.
   */
  cmdId: GoproCommand
  /**
   * Value.
   */
  value: uint8_t[]
}

/**
 * Response from a GOPRO_COMMAND set request.
 */
export class GoproSetResponse extends MavLinkData {
  static MSG_ID = 219
  static MSG_NAME = 'GOPRO_SET_RESPONSE'
  static PAYLOAD_LENGTH = 2
  static MAGIC_NUMBER = 162

  static FIELDS = [
    new MavLinkPacketField('cmd_id', 'cmdId', 0, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('status', 'status', 1, false, 1, 'uint8_t', ''),
  ]

  /**
   * Command ID.
   */
  cmdId: GoproCommand
  /**
   * Status.
   */
  status: GoproRequestStatus
}

/**
 * RPM sensor output.
 */
export class Rpm extends MavLinkData {
  static MSG_ID = 226
  static MSG_NAME = 'RPM'
  static PAYLOAD_LENGTH = 8
  static MAGIC_NUMBER = 207

  static FIELDS = [
    new MavLinkPacketField('rpm1', 'rpm1', 0, false, 4, 'float', ''),
    new MavLinkPacketField('rpm2', 'rpm2', 4, false, 4, 'float', ''),
  ]

  /**
   * RPM Sensor1.
   */
  rpm1: float
  /**
   * RPM Sensor2.
   */
  rpm2: float
}

/**
 * Read registers for a device.
 */
export class DeviceOpRead extends MavLinkData {
  static MSG_ID = 11000
  static MSG_NAME = 'DEVICE_OP_READ'
  static PAYLOAD_LENGTH = 52
  static MAGIC_NUMBER = 134

  static FIELDS = [
    new MavLinkPacketField('request_id', 'requestId', 0, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('target_system', 'targetSystem', 4, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 5, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('bustype', 'bustype', 6, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('bus', 'bus', 7, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('address', 'address', 8, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('busname', 'busname', 9, false, 1, 'char[]', '', 40),
    new MavLinkPacketField('regstart', 'regstart', 49, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('count', 'count', 50, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('bank', 'bank', 51, true, 1, 'uint8_t', ''),
  ]

  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Component ID.
   */
  targetComponent: uint8_t
  /**
   * Request ID - copied to reply.
   */
  requestId: uint32_t
  /**
   * The bus type.
   */
  bustype: DeviceOpBustype
  /**
   * Bus number.
   */
  bus: uint8_t
  /**
   * Bus address.
   */
  address: uint8_t
  /**
   * Name of device on bus (for SPI).
   */
  busname: string
  /**
   * First register to read.
   */
  regstart: uint8_t
  /**
   * Count of registers to read.
   */
  count: uint8_t
  /**
   * Bank number.
   */
  bank: uint8_t
}

/**
 * Read registers reply.
 */
export class DeviceOpReadReply extends MavLinkData {
  static MSG_ID = 11001
  static MSG_NAME = 'DEVICE_OP_READ_REPLY'
  static PAYLOAD_LENGTH = 136
  static MAGIC_NUMBER = 15

  static FIELDS = [
    new MavLinkPacketField('request_id', 'requestId', 0, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('result', 'result', 4, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('regstart', 'regstart', 5, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('count', 'count', 6, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('data', 'data', 7, false, 1, 'uint8_t[]', '', 128),
    new MavLinkPacketField('bank', 'bank', 135, true, 1, 'uint8_t', ''),
  ]

  /**
   * Request ID - copied from request.
   */
  requestId: uint32_t
  /**
   * 0 for success, anything else is failure code.
   */
  result: uint8_t
  /**
   * Starting register.
   */
  regstart: uint8_t
  /**
   * Count of bytes read.
   */
  count: uint8_t
  /**
   * Reply data.
   */
  data: uint8_t[]
  /**
   * Bank number.
   */
  bank: uint8_t
}

/**
 * Write registers for a device.
 */
export class DeviceOpWrite extends MavLinkData {
  static MSG_ID = 11002
  static MSG_NAME = 'DEVICE_OP_WRITE'
  static PAYLOAD_LENGTH = 180
  static MAGIC_NUMBER = 234

  static FIELDS = [
    new MavLinkPacketField('request_id', 'requestId', 0, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('target_system', 'targetSystem', 4, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 5, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('bustype', 'bustype', 6, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('bus', 'bus', 7, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('address', 'address', 8, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('busname', 'busname', 9, false, 1, 'char[]', '', 40),
    new MavLinkPacketField('regstart', 'regstart', 49, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('count', 'count', 50, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('data', 'data', 51, false, 1, 'uint8_t[]', '', 128),
    new MavLinkPacketField('bank', 'bank', 179, true, 1, 'uint8_t', ''),
  ]

  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Component ID.
   */
  targetComponent: uint8_t
  /**
   * Request ID - copied to reply.
   */
  requestId: uint32_t
  /**
   * The bus type.
   */
  bustype: DeviceOpBustype
  /**
   * Bus number.
   */
  bus: uint8_t
  /**
   * Bus address.
   */
  address: uint8_t
  /**
   * Name of device on bus (for SPI).
   */
  busname: string
  /**
   * First register to write.
   */
  regstart: uint8_t
  /**
   * Count of registers to write.
   */
  count: uint8_t
  /**
   * Write data.
   */
  data: uint8_t[]
  /**
   * Bank number.
   */
  bank: uint8_t
}

/**
 * Write registers reply.
 */
export class DeviceOpWriteReply extends MavLinkData {
  static MSG_ID = 11003
  static MSG_NAME = 'DEVICE_OP_WRITE_REPLY'
  static PAYLOAD_LENGTH = 5
  static MAGIC_NUMBER = 64

  static FIELDS = [
    new MavLinkPacketField('request_id', 'requestId', 0, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('result', 'result', 4, false, 1, 'uint8_t', ''),
  ]

  /**
   * Request ID - copied from request.
   */
  requestId: uint32_t
  /**
   * 0 for success, anything else is failure code.
   */
  result: uint8_t
}

/**
 * Adaptive Controller tuning information.
 */
export class AdapTuning extends MavLinkData {
  static MSG_ID = 11010
  static MSG_NAME = 'ADAP_TUNING'
  static PAYLOAD_LENGTH = 49
  static MAGIC_NUMBER = 46

  static FIELDS = [
    new MavLinkPacketField('desired', 'desired', 0, false, 4, 'float', 'deg/s'),
    new MavLinkPacketField('achieved', 'achieved', 4, false, 4, 'float', 'deg/s'),
    new MavLinkPacketField('error', 'error', 8, false, 4, 'float', ''),
    new MavLinkPacketField('theta', 'theta', 12, false, 4, 'float', ''),
    new MavLinkPacketField('omega', 'omega', 16, false, 4, 'float', ''),
    new MavLinkPacketField('sigma', 'sigma', 20, false, 4, 'float', ''),
    new MavLinkPacketField('theta_dot', 'thetaDot', 24, false, 4, 'float', ''),
    new MavLinkPacketField('omega_dot', 'omegaDot', 28, false, 4, 'float', ''),
    new MavLinkPacketField('sigma_dot', 'sigmaDot', 32, false, 4, 'float', ''),
    new MavLinkPacketField('f', 'f', 36, false, 4, 'float', ''),
    new MavLinkPacketField('f_dot', 'fDot', 40, false, 4, 'float', ''),
    new MavLinkPacketField('u', 'u', 44, false, 4, 'float', ''),
    new MavLinkPacketField('axis', 'axis', 48, false, 1, 'uint8_t', ''),
  ]

  /**
   * Axis.
   */
  axis: PidTuningAxis
  /**
   * Desired rate.
   * Units: deg/s
   */
  desired: float
  /**
   * Achieved rate.
   * Units: deg/s
   */
  achieved: float
  /**
   * Error between model and vehicle.
   */
  error: float
  /**
   * Theta estimated state predictor.
   */
  theta: float
  /**
   * Omega estimated state predictor.
   */
  omega: float
  /**
   * Sigma estimated state predictor.
   */
  sigma: float
  /**
   * Theta derivative.
   */
  thetaDot: float
  /**
   * Omega derivative.
   */
  omegaDot: float
  /**
   * Sigma derivative.
   */
  sigmaDot: float
  /**
   * Projection operator value.
   */
  f: float
  /**
   * Projection operator derivative.
   */
  fDot: float
  /**
   * u adaptive controlled output command.
   */
  u: float
}

/**
 * Camera vision based attitude and position deltas.
 */
export class VisionPositionDelta extends MavLinkData {
  static MSG_ID = 11011
  static MSG_NAME = 'VISION_POSITION_DELTA'
  static PAYLOAD_LENGTH = 44
  static MAGIC_NUMBER = 106

  static FIELDS = [
    new MavLinkPacketField('time_usec', 'timeUsec', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('time_delta_usec', 'timeDeltaUsec', 8, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('angle_delta', 'angleDelta', 16, false, 4, 'float[]', 'rad', 3),
    new MavLinkPacketField('position_delta', 'positionDelta', 28, false, 4, 'float[]', 'm', 3),
    new MavLinkPacketField('confidence', 'confidence', 40, false, 4, 'float', '%'),
  ]

  /**
   * Timestamp (synced to UNIX time or since system boot).
   * Units: us
   */
  timeUsec: uint64_t
  /**
   * Time since the last reported camera frame.
   * Units: us
   */
  timeDeltaUsec: uint64_t
  /**
   * Defines a rotation vector [roll, pitch, yaw] to the current MAV_FRAME_BODY_FRD from the previous
   * MAV_FRAME_BODY_FRD.
   * Units: rad
   */
  angleDelta: float[]
  /**
   * Change in position to the current MAV_FRAME_BODY_FRD from the previous FRAME_BODY_FRD rotated to the
   * current MAV_FRAME_BODY_FRD.
   * Units: m
   */
  positionDelta: float[]
  /**
   * Normalised confidence value from 0 to 100.
   * Units: %
   */
  confidence: float
}

/**
 * Angle of Attack and Side Slip Angle.
 */
export class AoaSsa extends MavLinkData {
  static MSG_ID = 11020
  static MSG_NAME = 'AOA_SSA'
  static PAYLOAD_LENGTH = 16
  static MAGIC_NUMBER = 205

  static FIELDS = [
    new MavLinkPacketField('time_usec', 'timeUsec', 0, false, 8, 'uint64_t', 'us'),
    new MavLinkPacketField('AOA', 'AOA', 8, false, 4, 'float', 'deg'),
    new MavLinkPacketField('SSA', 'SSA', 12, false, 4, 'float', 'deg'),
  ]

  /**
   * Timestamp (since boot or Unix epoch).
   * Units: us
   */
  timeUsec: uint64_t
  /**
   * Angle of Attack.
   * Units: deg
   */
  AOA: float
  /**
   * Side Slip Angle.
   * Units: deg
   */
  SSA: float
}

/**
 * ESC Telemetry Data for ESCs 1 to 4, matching data sent by BLHeli ESCs.
 */
export class EscTelemetry1To4 extends MavLinkData {
  static MSG_ID = 11030
  static MSG_NAME = 'ESC_TELEMETRY_1_TO_4'
  static PAYLOAD_LENGTH = 44
  static MAGIC_NUMBER = 144

  static FIELDS = [
    new MavLinkPacketField('voltage', 'voltage', 0, false, 2, 'uint16_t[]', 'cV', 4),
    new MavLinkPacketField('current', 'current', 8, false, 2, 'uint16_t[]', 'cA', 4),
    new MavLinkPacketField('totalcurrent', 'totalcurrent', 16, false, 2, 'uint16_t[]', 'mAh', 4),
    new MavLinkPacketField('rpm', 'rpm', 24, false, 2, 'uint16_t[]', 'rpm', 4),
    new MavLinkPacketField('count', 'count', 32, false, 2, 'uint16_t[]', '', 4),
    new MavLinkPacketField('temperature', 'temperature', 40, false, 1, 'uint8_t[]', 'degC', 4),
  ]

  /**
   * Temperature.
   * Units: degC
   */
  temperature: uint8_t[]
  /**
   * Voltage.
   * Units: cV
   */
  voltage: uint16_t[]
  /**
   * Current.
   * Units: cA
   */
  current: uint16_t[]
  /**
   * Total current.
   * Units: mAh
   */
  totalcurrent: uint16_t[]
  /**
   * RPM (eRPM).
   * Units: rpm
   */
  rpm: uint16_t[]
  /**
   * count of telemetry packets received (wraps at 65535).
   */
  count: uint16_t[]
}

/**
 * ESC Telemetry Data for ESCs 5 to 8, matching data sent by BLHeli ESCs.
 */
export class EscTelemetry5To8 extends MavLinkData {
  static MSG_ID = 11031
  static MSG_NAME = 'ESC_TELEMETRY_5_TO_8'
  static PAYLOAD_LENGTH = 44
  static MAGIC_NUMBER = 133

  static FIELDS = [
    new MavLinkPacketField('voltage', 'voltage', 0, false, 2, 'uint16_t[]', 'cV', 4),
    new MavLinkPacketField('current', 'current', 8, false, 2, 'uint16_t[]', 'cA', 4),
    new MavLinkPacketField('totalcurrent', 'totalcurrent', 16, false, 2, 'uint16_t[]', 'mAh', 4),
    new MavLinkPacketField('rpm', 'rpm', 24, false, 2, 'uint16_t[]', 'rpm', 4),
    new MavLinkPacketField('count', 'count', 32, false, 2, 'uint16_t[]', '', 4),
    new MavLinkPacketField('temperature', 'temperature', 40, false, 1, 'uint8_t[]', 'degC', 4),
  ]

  /**
   * Temperature.
   * Units: degC
   */
  temperature: uint8_t[]
  /**
   * Voltage.
   * Units: cV
   */
  voltage: uint16_t[]
  /**
   * Current.
   * Units: cA
   */
  current: uint16_t[]
  /**
   * Total current.
   * Units: mAh
   */
  totalcurrent: uint16_t[]
  /**
   * RPM (eRPM).
   * Units: rpm
   */
  rpm: uint16_t[]
  /**
   * count of telemetry packets received (wraps at 65535).
   */
  count: uint16_t[]
}

/**
 * ESC Telemetry Data for ESCs 9 to 12, matching data sent by BLHeli ESCs.
 */
export class EscTelemetry9To12 extends MavLinkData {
  static MSG_ID = 11032
  static MSG_NAME = 'ESC_TELEMETRY_9_TO_12'
  static PAYLOAD_LENGTH = 44
  static MAGIC_NUMBER = 85

  static FIELDS = [
    new MavLinkPacketField('voltage', 'voltage', 0, false, 2, 'uint16_t[]', 'cV', 4),
    new MavLinkPacketField('current', 'current', 8, false, 2, 'uint16_t[]', 'cA', 4),
    new MavLinkPacketField('totalcurrent', 'totalcurrent', 16, false, 2, 'uint16_t[]', 'mAh', 4),
    new MavLinkPacketField('rpm', 'rpm', 24, false, 2, 'uint16_t[]', 'rpm', 4),
    new MavLinkPacketField('count', 'count', 32, false, 2, 'uint16_t[]', '', 4),
    new MavLinkPacketField('temperature', 'temperature', 40, false, 1, 'uint8_t[]', 'degC', 4),
  ]

  /**
   * Temperature.
   * Units: degC
   */
  temperature: uint8_t[]
  /**
   * Voltage.
   * Units: cV
   */
  voltage: uint16_t[]
  /**
   * Current.
   * Units: cA
   */
  current: uint16_t[]
  /**
   * Total current.
   * Units: mAh
   */
  totalcurrent: uint16_t[]
  /**
   * RPM (eRPM).
   * Units: rpm
   */
  rpm: uint16_t[]
  /**
   * count of telemetry packets received (wraps at 65535).
   */
  count: uint16_t[]
}

/**
 * Configure an OSD parameter slot.
 */
export class OsdParamConfig extends MavLinkData {
  static MSG_ID = 11033
  static MSG_NAME = 'OSD_PARAM_CONFIG'
  static PAYLOAD_LENGTH = 37
  static MAGIC_NUMBER = 195

  static FIELDS = [
    new MavLinkPacketField('request_id', 'requestId', 0, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('min_value', 'minValue', 4, false, 4, 'float', ''),
    new MavLinkPacketField('max_value', 'maxValue', 8, false, 4, 'float', ''),
    new MavLinkPacketField('increment', 'increment', 12, false, 4, 'float', ''),
    new MavLinkPacketField('target_system', 'targetSystem', 16, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 17, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('osd_screen', 'osdScreen', 18, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('osd_index', 'osdIndex', 19, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('param_id', 'paramId', 20, false, 1, 'char[]', '', 16),
    new MavLinkPacketField('config_type', 'configType', 36, false, 1, 'uint8_t', ''),
  ]

  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Component ID.
   */
  targetComponent: uint8_t
  /**
   * Request ID - copied to reply.
   */
  requestId: uint32_t
  /**
   * OSD parameter screen index.
   */
  osdScreen: uint8_t
  /**
   * OSD parameter display index.
   */
  osdIndex: uint8_t
  /**
   * Onboard parameter id, terminated by NULL if the length is less than 16 human-readable chars and
   * WITHOUT null termination (NULL) byte if the length is exactly 16 chars - applications have to
   * provide 16+1 bytes storage if the ID is stored as string
   */
  paramId: string
  /**
   * Config type.
   */
  configType: OsdParamConfigType
  /**
   * OSD parameter minimum value.
   */
  minValue: float
  /**
   * OSD parameter maximum value.
   */
  maxValue: float
  /**
   * OSD parameter increment.
   */
  increment: float
}

/**
 * Configure OSD parameter reply.
 */
export class OsdParamConfigReply extends MavLinkData {
  static MSG_ID = 11034
  static MSG_NAME = 'OSD_PARAM_CONFIG_REPLY'
  static PAYLOAD_LENGTH = 5
  static MAGIC_NUMBER = 79

  static FIELDS = [
    new MavLinkPacketField('request_id', 'requestId', 0, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('result', 'result', 4, false, 1, 'uint8_t', ''),
  ]

  /**
   * Request ID - copied from request.
   */
  requestId: uint32_t
  /**
   * Config error type.
   */
  result: OsdParamConfigError
}

/**
 * Read a configured an OSD parameter slot.
 */
export class OsdParamShowConfig extends MavLinkData {
  static MSG_ID = 11035
  static MSG_NAME = 'OSD_PARAM_SHOW_CONFIG'
  static PAYLOAD_LENGTH = 8
  static MAGIC_NUMBER = 128

  static FIELDS = [
    new MavLinkPacketField('request_id', 'requestId', 0, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('target_system', 'targetSystem', 4, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('target_component', 'targetComponent', 5, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('osd_screen', 'osdScreen', 6, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('osd_index', 'osdIndex', 7, false, 1, 'uint8_t', ''),
  ]

  /**
   * System ID.
   */
  targetSystem: uint8_t
  /**
   * Component ID.
   */
  targetComponent: uint8_t
  /**
   * Request ID - copied to reply.
   */
  requestId: uint32_t
  /**
   * OSD parameter screen index.
   */
  osdScreen: uint8_t
  /**
   * OSD parameter display index.
   */
  osdIndex: uint8_t
}

/**
 * Read configured OSD parameter reply.
 */
export class OsdParamShowConfigReply extends MavLinkData {
  static MSG_ID = 11036
  static MSG_NAME = 'OSD_PARAM_SHOW_CONFIG_REPLY'
  static PAYLOAD_LENGTH = 34
  static MAGIC_NUMBER = 177

  static FIELDS = [
    new MavLinkPacketField('request_id', 'requestId', 0, false, 4, 'uint32_t', ''),
    new MavLinkPacketField('min_value', 'minValue', 4, false, 4, 'float', ''),
    new MavLinkPacketField('max_value', 'maxValue', 8, false, 4, 'float', ''),
    new MavLinkPacketField('increment', 'increment', 12, false, 4, 'float', ''),
    new MavLinkPacketField('result', 'result', 16, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('param_id', 'paramId', 17, false, 1, 'char[]', '', 16),
    new MavLinkPacketField('config_type', 'configType', 33, false, 1, 'uint8_t', ''),
  ]

  /**
   * Request ID - copied from request.
   */
  requestId: uint32_t
  /**
   * Config error type.
   */
  result: OsdParamConfigError
  /**
   * Onboard parameter id, terminated by NULL if the length is less than 16 human-readable chars and
   * WITHOUT null termination (NULL) byte if the length is exactly 16 chars - applications have to
   * provide 16+1 bytes storage if the ID is stored as string
   */
  paramId: string
  /**
   * Config type.
   */
  configType: OsdParamConfigType
  /**
   * OSD parameter minimum value.
   */
  minValue: float
  /**
   * OSD parameter maximum value.
   */
  maxValue: float
  /**
   * OSD parameter increment.
   */
  increment: float
}

/**
 * Obstacle located as a 3D vector.
 */
export class ObstacleDistance3d extends MavLinkData {
  static MSG_ID = 11037
  static MSG_NAME = 'OBSTACLE_DISTANCE_3D'
  static PAYLOAD_LENGTH = 28
  static MAGIC_NUMBER = 130

  static FIELDS = [
    new MavLinkPacketField('time_boot_ms', 'timeBootMs', 0, false, 4, 'uint32_t', 'ms'),
    new MavLinkPacketField('x', 'x', 4, false, 4, 'float', 'm'),
    new MavLinkPacketField('y', 'y', 8, false, 4, 'float', 'm'),
    new MavLinkPacketField('z', 'z', 12, false, 4, 'float', 'm'),
    new MavLinkPacketField('min_distance', 'minDistance', 16, false, 4, 'float', 'm'),
    new MavLinkPacketField('max_distance', 'maxDistance', 20, false, 4, 'float', 'm'),
    new MavLinkPacketField('obstacle_id', 'obstacleId', 24, false, 2, 'uint16_t', ''),
    new MavLinkPacketField('sensor_type', 'sensorType', 26, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('frame', 'frame', 27, false, 1, 'uint8_t', ''),
  ]

  /**
   * Timestamp (time since system boot).
   * Units: ms
   */
  timeBootMs: uint32_t
  /**
   * Class id of the distance sensor type.
   */
  sensorType: MavDistanceSensor
  /**
   * Coordinate frame of reference.
   */
  frame: MavFrame
  /**
   * Unique ID given to each obstacle so that its movement can be tracked. Use UINT16_MAX if object ID is
   * unknown or cannot be determined.
   */
  obstacleId: uint16_t
  /**
   * X position of the obstacle.
   * Units: m
   */
  x: float
  /**
   * Y position of the obstacle.
   * Units: m
   */
  y: float
  /**
   * Z position of the obstacle.
   * Units: m
   */
  z: float
  /**
   * Minimum distance the sensor can measure.
   * Units: m
   */
  minDistance: float
  /**
   * Maximum distance the sensor can measure.
   * Units: m
   */
  maxDistance: float
}

/**
 * Water depth
 */
export class WaterDepth extends MavLinkData {
  static MSG_ID = 11038
  static MSG_NAME = 'WATER_DEPTH'
  static PAYLOAD_LENGTH = 38
  static MAGIC_NUMBER = 47

  static FIELDS = [
    new MavLinkPacketField('time_boot_ms', 'timeBootMs', 0, false, 4, 'uint32_t', 'ms'),
    new MavLinkPacketField('lat', 'lat', 4, false, 4, 'int32_t', 'degE7'),
    new MavLinkPacketField('lng', 'lng', 8, false, 4, 'int32_t', 'degE7'),
    new MavLinkPacketField('alt', 'alt', 12, false, 4, 'float', 'm'),
    new MavLinkPacketField('roll', 'roll', 16, false, 4, 'float', 'rad'),
    new MavLinkPacketField('pitch', 'pitch', 20, false, 4, 'float', 'rad'),
    new MavLinkPacketField('yaw', 'yaw', 24, false, 4, 'float', 'rad'),
    new MavLinkPacketField('distance', 'distance', 28, false, 4, 'float', 'm'),
    new MavLinkPacketField('temperature', 'temperature', 32, false, 4, 'float', 'degC'),
    new MavLinkPacketField('id', 'id', 36, false, 1, 'uint8_t', ''),
    new MavLinkPacketField('healthy', 'healthy', 37, false, 1, 'uint8_t', ''),
  ]

  /**
   * Timestamp (time since system boot)
   * Units: ms
   */
  timeBootMs: uint32_t
  /**
   * Onboard ID of the sensor
   */
  id: uint8_t
  /**
   * Sensor data healthy (0=unhealthy, 1=healthy)
   */
  healthy: uint8_t
  /**
   * Latitude
   * Units: degE7
   */
  lat: int32_t
  /**
   * Longitude
   * Units: degE7
   */
  lng: int32_t
  /**
   * Altitude (MSL) of vehicle
   * Units: m
   */
  alt: float
  /**
   * Roll angle
   * Units: rad
   */
  roll: float
  /**
   * Pitch angle
   * Units: rad
   */
  pitch: float
  /**
   * Yaw angle
   * Units: rad
   */
  yaw: float
  /**
   * Distance (uncorrected)
   * Units: m
   */
  distance: float
  /**
   * Water temperature
   * Units: degC
   */
  temperature: float
}

/**
 * The MCU status, giving MCU temperature and voltage. The min and max voltages are to allow for
 * detecting power supply instability.
 */
export class McuStatus extends MavLinkData {
  static MSG_ID = 11039
  static MSG_NAME = 'MCU_STATUS'
  static PAYLOAD_LENGTH = 9
  static MAGIC_NUMBER = 142

  static FIELDS = [
    new MavLinkPacketField('MCU_temperature', 'MCUTemperature', 0, false, 2, 'int16_t', 'cdegC'),
    new MavLinkPacketField('MCU_voltage', 'MCUVoltage', 2, false, 2, 'uint16_t', 'mV'),
    new MavLinkPacketField('MCU_voltage_min', 'MCUVoltageMin', 4, false, 2, 'uint16_t', 'mV'),
    new MavLinkPacketField('MCU_voltage_max', 'MCUVoltageMax', 6, false, 2, 'uint16_t', 'mV'),
    new MavLinkPacketField('id', 'id', 8, false, 1, 'uint8_t', ''),
  ]

  /**
   * MCU instance
   */
  id: uint8_t
  /**
   * MCU Internal temperature
   * Units: cdegC
   */
  MCUTemperature: int16_t
  /**
   * MCU voltage
   * Units: mV
   */
  MCUVoltage: uint16_t
  /**
   * MCU voltage minimum
   * Units: mV
   */
  MCUVoltageMin: uint16_t
  /**
   * MCU voltage maximum
   * Units: mV
   */
  MCUVoltageMax: uint16_t
}

export const REGISTRY: MavLinkPacketRegistry = {
  150: SensorOffsets,
  151: SetMagOffsets,
  152: MemInfo,
  153: ApAdc,
  154: DigicamConfigure,
  155: DigicamControl,
  156: MountConfigure,
  157: MountControl,
  158: MountStatus,
  160: FencePoint,
  161: FenceFetchPoint,
  163: Ahrs,
  164: SimState,
  165: HwStatus,
  166: Radio,
  167: LimitsStatus,
  168: Wind,
  169: Data16,
  170: Data32,
  171: Data64,
  172: Data96,
  173: RangeFinder,
  174: AirspeedAutocal,
  175: RallyPoint,
  176: RallyFetchPoint,
  177: CompassMotStatus,
  178: Ahrs2,
  179: CameraStatus,
  180: CameraFeedback,
  181: Battery2,
  182: Ahrs3,
  183: AutopilotVersionRequest,
  184: RemoteLogDataBlock,
  185: RemoteLogBlockStatus,
  186: LedControl,
  191: MagCalProgress,
  193: EkfStatusReport,
  194: PidTuning,
  195: Deepstall,
  200: GimbalReport,
  201: GimbalControl,
  214: GimbalTorqueCmdReport,
  215: GoproHeartbeat,
  216: GoproGetRequest,
  217: GoproGetResponse,
  218: GoproSetRequest,
  219: GoproSetResponse,
  226: Rpm,
  11000: DeviceOpRead,
  11001: DeviceOpReadReply,
  11002: DeviceOpWrite,
  11003: DeviceOpWriteReply,
  11010: AdapTuning,
  11011: VisionPositionDelta,
  11020: AoaSsa,
  11030: EscTelemetry1To4,
  11031: EscTelemetry5To8,
  11032: EscTelemetry9To12,
  11033: OsdParamConfig,
  11034: OsdParamConfigReply,
  11035: OsdParamShowConfig,
  11036: OsdParamShowConfigReply,
  11037: ObstacleDistance3d,
  11038: WaterDepth,
  11039: McuStatus,
}
