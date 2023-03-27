import {
  int8_t,
  uint8_t,
  int16_t,
  uint16_t,
  int32_t,
  uint32_t,
  int64_t,
  uint64_t,
  float,
  double
} from './types'

import {
  MavLinkPacketRegistry,
  MavLinkPacketField,
  MavLinkData,
  MavLinkDataConstructor
} from './mavlink'

import {
  MavType,
  MavAutopilot,
  MavModeFlag
} from './minimal'

export type MavLinkCommandRegistry = Record<number, MavLinkDataConstructor<CommandLong>>