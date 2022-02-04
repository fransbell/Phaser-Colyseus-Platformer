//@ts-nocheck

import "@geckos.io/phaser-on-nodejs"
import { Room, Client } from "colyseus"
import config from "./config"

import { RoomState, Player, Input } from "./RoomState"

export default class GameRooms extends Room {
  Game!: Phaser.Game
  scene!: Phaser.Scene

  constructor() {
    super()
    this.autoDispose = false
    this.setPatchRate(17)
    this.maxClients = 4
  }

  onCreate(options: any) {
    this.setState(new RoomState())
    this.userInputs = {}

    this.Game = new Phaser.Game(config)
    this.scene = this.Game.scene.scenes[0]
    this.scene.setRoom(this)

    this.onMessage("inputs", (client, message) => {
      this.userInputs[client.id] = message
    })
  }

  onJoin(client: Client, options: any, auth: any) {
    console.log(`${client.id} has joined!`)
    this.userInputs[client.id] = {
      up: false,
      right: false,
      down: false,
      left: false,
    }
    const presences = this.scene.createPlayer(client.id)
    for (const [key, value] of Object.entries(presences.presences)) {
      this.state.presences.set(key, new Player(value))
    }
  }

  onLeave(client: Client, consented: boolean) {
    console.log(`${client.id} left !! `)
    const presences = this.scene.removePlayer(client.id)
    this.state.presences.delete(client.id)
    delete this.userInputs[client.id]
  }

  onDispose() {
    console.log(`${this.roomId} shutting down!!`)
  }
}
