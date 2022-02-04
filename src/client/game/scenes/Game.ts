import Phaser from "phaser"

import * as Colyseus from "colyseus.js"
import { deepEqual } from "../utils/index"

export default class Demo extends Phaser.Scene {
  client!: Colyseus.Client
  players: Phaser.GameObjects.Group
  session: string
  playersRef: any
  keyboard!: any
  room: Colyseus.Room<unknown>
  prevInputs: { up: boolean; right: boolean; left: boolean; down: boolean }

  constructor() {
    super("GameScene")
  }

  preload() {}

  create() {
    this.players = this.add.group()
    this.playersRef = {}
    this.keyboard = this.input.keyboard.addKeys("up,right,left,down")

    this.client = new Colyseus.Client("ws://localhost:300")
    const client = this.client
    client
      .joinOrCreate("game_instance")
      .then((room) => {
        this.room = room
        this.session = room.sessionId
        room.onStateChange((changes: any) => {
          let presences = {}
          changes.presences.forEach((value, key) => {
            presences[key] = value
          })
          this.patchPlayer({
            presences: presences,
            presenceList: Object.keys(presences),
          })
        })
      })
      .catch((err) => {
        console.error(err)
      })

    this.prevInputs = {
      up: false,
      right: false,
      left: false,
      down: false,
    }
  }

  patchPlayer(list: any) {
    // create instance of all presence

    console.log(list)

    list.presenceList.map((item, idx) => {
      if (this.playersRef[item] === undefined) {
        const x = list.presences[item].x
        const y = list.presences[item].y
        const player = this.add
          .sprite(x, y, "")
          .setData({ ClientId: list.presenceList[idx] })
        this.players.add(player)
        this.playersRef[item] = player
      } else {
        this.playersRef[item].x = list.presences[item].x
        this.playersRef[item].y = list.presences[item].y
      }
    })

    // deleted non existance

    this.players.children.iterate((child) => {
      if (list.presences[child.data.values.ClientId] === undefined) {
        this.playersRef[child.data.values.ClientId].destroy(true)
        delete this.playersRef[child.data.values.ClientId]
      }
    })
  }

  update() {
    if (this.room) {
      const { up, right, left, down } = this.keyboard

      const inputs = {
        up: up.isDown ? true : false,
        right: right.isDown ? true : false,
        left: left.isDown ? true : false,
        down: down.isDown ? true : false,
      }

      if (!deepEqual(inputs, this.prevInputs)) {
        this.prevInputs = inputs
        this.room.send("inputs", inputs)
      }
    }
  }
}
