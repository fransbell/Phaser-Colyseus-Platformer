//@ts-nocheck

import { Player } from "../../RoomState"

export default class PlayerClass extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    sprite: string,
    ClientID: string
  ) {
    super(scene, x, y, sprite)
    this.init(scene, ClientID)
  }

  init(scene: Phaser.Scene, ClientID: string) {
    this.scene = scene
    this.ClientID = ClientID
  }

  update(time: number, deltaTime: number) {
    const input = this.scene.room.userInputs[this.ClientID]
    const { up, right, down, left } = input

    let dir = 0

    if (left) {
      dir += -1
    }
    if (right) {
      dir += 1
    }

    if (up) {
      this.setVelocityY(-300)
    }

    this.setVelocityX(dir * deltaTime * 10)

    this.scene.room.state.presences.set(
      this.ClientID,
      new Player({ x: this.x, y: this.y })
    )
  }
}
