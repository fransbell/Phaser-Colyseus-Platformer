//@ts-nocheck

import {
  Schema,
  MapSchema,
  ArraySchema,
  CollectionSchema,
  type,
} from "@colyseus/schema"

export class Player extends Schema {
  @type("number") x?: number
  @type("number") y?: number
}

export class Input extends Schema {
  @type("boolean") left: boolean = false
  @type("boolean") right: boolean = false
  @type("boolean") up: boolean = false
  @type("boolean") down: boolean = false
}

export class RoomState extends Schema {
  //@ts-ignore
  @type({ map: Player }) presences = new MapSchema<Player>()
  @type({ map: Input }) playerInputs = new MapSchema<Input>()
}
