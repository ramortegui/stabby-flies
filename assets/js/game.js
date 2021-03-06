import Player from './player'
import { setupCanvas, sortByKills } from './utils/'
import Fly from './fly'

// import {MotionBlurFilter} from '@pixi/filter-motion-blur';
import { BloomFilter } from '@pixi/filter-bloom'
import { OutlineFilter } from '@pixi/filter-outline'
import { CRTFilter } from '@pixi/filter-crt'

import Explosion from './explosion'
import Debug from './debug'
import Text from './text'

var Viewport = require('pixi-viewport')

export class Game {
  constructor (props = {}) {
    this.props = props
    this.display = undefined
    this.engine = undefined
    this.loaded = false
    this.blurred = false

    window.__game = this

    this.state = {
      camera: {
        x: 5,
        y: 5
      }
    }

    this.players = []

    this.gameObjects = []

    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight
    })
    setupCanvas(this.app)
    this.app.renderer.backgroundColor = 0x69243e

    window.onresize = () => {
      this.viewport.screenWidth = window.innerWidth
      this.viewport.screenHeight = window.innerHeight
      this.app.renderer.resize(window.innerWidth, window.innerHeight)
    }
    this.app.renderer.autoResize = true

    this.viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: 3000,
      worldHeight: 1000,
      interaction: this.app.renderer.interaction, // the interaction module is important for wheel() to work properly when renderer.view is placed or scaled,
      x: 1500
    })

    this.viewport.on('clicked', event => {
      const { x, y } = event.world
      window.stab()
    })

    this.viewport.fit()

    this.viewport
      .wheel({ percent: 0.03 })
      .clamp({
        left: 0,
        right: 3000,
        bottom: 400,
        top: -150
      })
      // .zoomPercent(1.5)
      .decelerate()

    this.viewport.emit(new Event('moved-end', {}))

    this.viewport.zoomPercent(4)

    this.viewport.filters = []

    this.app.stage.addChild(this.viewport)

    window.onfocus = () => {
      document.title = 'Stabby Flies'

      this.blurred = false
      this.players.forEach(player => {
        player.x = player.serverX
        player.y = player.serverY
      })
    }

    PIXI.loader
      .add('/images/spritesheet.json')
      .load(this.spritesLoaded.bind(this))
  }

  playerIsHit (payload) {
    const { damage, socket_id } = payload

    const player = this.players.find(player => {
      return player.socket_id == socket_id
    })

    this.createExplosion({
      x: player.x,
      y: player.y
    })
    player && player.takeDamage(damage)
  }

  createExplosion (position) {
    const explosion = new Explosion(position)
    this.viewport.addChild(explosion)
    this.gameObjects.push(explosion)
  }

  playerStabs (socket_id) {
    const player = this.players.find(player => {
      return player.socket_id == socket_id
    })

    player && player.stab(this.players)
  }

  setLocalPlayer (socket_id) {
    const player = this.players.find(player => {
      return player.socket_id == socket_id
    })
    if (!player) {
      setTimeout(this.setLocalPlayer.bind(this, socket_id), 5)
      return
    }
    this.setPlayerFilters()

    this.viewport.follow(player, { speed: 8 })
    this.viewport.fit(player, 400, 400)

    this.viewport.moveCenter(player.x, player.y)

    const f = new OutlineFilter(3, 0x101010)
    f.padding = -1
    player.filters = [f]

    player.localPlayer = true
    this.localPlayer = player

    this.drawLocalPlayerAboveOthers()

    setInterval(() => {
      this.updateScoreboard()
    }, 500)
  }

  setPlayerFilters () {
    const f = new OutlineFilter(3, 0xbb2222)
    f.padding = -1
    this.players.forEach(_player => {
      !_player.localPlayer && (_player.filters = [f])
    })
  }

  spritesLoaded (obj) {
    const floor = new PIXI.extras.TilingSprite(
      PIXI.Texture.fromImage('images/earthenfloor.png'),
      5000,
      100
    )

    // const bg = new PIXI.extras.TilingSprite(
    //   PIXI.Textug.fromImage('bg.png'),
    //   5000,
    //   600
    // )

    // bg.y = -200
    // this.viewport.addChild(bg)

    for (let i = 0; i < 10; i++) {
      const cloud = new PIXI.Sprite(PIXI.Texture.fromImage('cloud.png'))

      const x = Math.floor(Math.random() * 3000)
      const y = Math.floor(Math.random() * 150) - 100
      cloud.x = x
      cloud.y = y
      this.viewport.addChild(cloud)
    }
    const f = new OutlineFilter(5, 0x101010)
    f.padding = -1
    // f.
    floor.filters = [f]

    let rectangle = new PIXI.Graphics()
    // rectangle.beginFill(0x66CC00);
    rectangle.beginFill(0x303030)
    rectangle.drawRect(0, 300, 5000, window.innerHeight)
    rectangle.endFill()
    this.viewport.addChild(rectangle)

    floor.y = 200

    this.viewport.addChild(floor)
    this.loaded = true

    this.introText()

    requestAnimationFrame(this.animate.bind(this))
  }

  animate () {
    this.gameObjects.forEach((gameObject, index) => {
      gameObject.update()
      // clean up
      if (gameObject.children.length === 0) {
        this.gameObjects.splice(index, 1)
      }
    })
    this.players.forEach(player => {
      player.update()
    })
    requestAnimationFrame(this.animate.bind(this))
  }

  updatePlayerCount () {
    if (!localStorage.getItem('seen_tutorial')) {
      return
    }

    this.app.stage.removeChild(this.playerCountText)

    const playerCountText = this.players.length === 1 ? 'player' : 'players'

    this.playerCountText = new PIXI.Text(
      `${this.players.length} ${playerCountText} online`,
      { fontSize: 15, fontFamily: 'monospace' }
    )
    this.playerCountText.x = 2
    this.playerCountText.y = 2

    this.app.stage.addChild(this.playerCountText)
  }

  addPlayer (obj) {
    if (this.blurred) {
      document.title = '(1) Stabby Flies'
    }
    if (!this.loaded) {
      setTimeout(this.addPlayer.bind(this, obj), 1)
      return
    }

    const alreadyThere = this.players.find(player => {
      return player.socket_id == obj.socket_id
    })
    if (alreadyThere) {
      return
    }

    const player = new Fly({ ...obj, socket_id: obj.socket_id })

    this.players.push(player)
    this.drawPlayer(player)
    this.setPlayerFilters()
    this.updatePlayerCount()

    this.drawLocalPlayerAboveOthers()
  }
  drawLocalPlayerAboveOthers () {
    if (!this.localPlayer) {
      return
    }
    this.viewport.removeChild(this.localPlayer)
    this.viewport.addChild(this.localPlayer)
  }
  updatePlayer (obj) {
    const { socket_id, x, y, hp } = obj
    let player = this.players.find(player => player.socket_id == socket_id)
    player && player.updateVariables(obj, this.viewport)
  }

  removePlayerById (socket_id) {
    const playerIndex = this.players.findIndex(player => player.socket_id == socket_id)
    const player = this.players[playerIndex]
    this.viewport.removeChild(player)
    this.players.splice(playerIndex, 1)
    this.updatePlayerCount()
  }

  drawPlayer (player) {
    this.viewport.addChild(player)
  }

  updateScoreboard () {
    if (!this.scoreBoard) {
      this.scoreBoard = new PIXI.Container()
      this.app.stage.addChild(this.scoreBoard)
    } else {
      this.scoreBoard.removeChildren()
    }

    const bg = new PIXI.Graphics()

    this.scoreBoard.addChild(bg)

    this.scoreBoard.addChild(
      new PIXI.Text('High Score', { fontSize: 20, fontFamily: 'monospace' })
    )

    const playerNamesAndKills = sortByKills(this.players, this.localPlayer)
    .map(p => `${p.kill_count}: ${p.name || 'Unknown'}`)
    .join("\n")
    
    

    const scoresText = new PIXI.Text(
      playerNamesAndKills,
      {
        fontSize: 15,
        fontFamily: 'monospace'
      }
    )
    scoresText.y = 20

    this.scoreBoard.addChild(scoresText)

    this.scoreBoard.x = window.innerWidth - this.scoreBoard.width - 5
    this.scoreBoard.y = 5

    bg.beginFill(0x222222)
    bg.drawRect(0, 0, this.scoreBoard.width, this.scoreBoard.height)
    bg.endFill()
    bg.alpha = 0.5
  }

  debugShape (obj) {
    const { shape } = obj
    switch (shape) {
      case 'circle':
        break
      case 'rectangle':
        const debug = new Debug(obj)
        this.viewport.addChild(debug)
        this.gameObjects.push(debug)
        break
      default:
        throw `Woops: unreqcognized shape ${shape}`
    }
  }

  introText () {
    if (localStorage.getItem('seen_tutorial') === 'true') {
      return
    }
    setTimeout(() => {
      const messageone = new Text({
        message: 'Hello & Welcome to Stabby Flies',
        duration: 2000,
        fade: false
      })
      this.app.stage.addChild(messageone)
      this.gameObjects.push(messageone)
    }, 1000)

    setTimeout(() => {
      const messagetwo = new Text({
        message: 'Your objective is to take down other players',
        duration: 2000,
        fade: false
      })
      this.app.stage.addChild(messagetwo)
      this.gameObjects.push(messagetwo)
    }, 3000)

    setTimeout(() => {
      const messageone = new Text({
        message: 'Controls are:',
        duration: 2000,
        fade: false
      })
      this.app.stage.addChild(messageone)
      this.gameObjects.push(messageone)
    }, 5000)
    setTimeout(() => {
      const messagetwo = new Text({
        message: 'move: w a s d\nstab: left click',
        duration: 4000,
        fade: false
      })
      this.app.stage.addChild(messagetwo)
      this.gameObjects.push(messagetwo)
    }, 7000)

    setTimeout(() => {
      const messagethree = new Text({
        message: '& the tip of your sword does the damage',
        duration: 3000,
        fade: false
      })
      this.app.stage.addChild(messagethree)
      this.gameObjects.push(messagethree)
    }, 11000)

    setTimeout(() => {
      const messagethree = new Text({
        message: 'If no one is on send them a link and fight them!',
        duration: 5000,
        fade: false
      })
      this.app.stage.addChild(messagethree)
      this.gameObjects.push(messagethree)
    }, 14000)

    setTimeout(() => {
      const messagethree = new Text({
        message: 'Enjoy!',
        duration: 3000,
        fade: false
      })
      this.app.stage.addChild(messagethree)
      this.gameObjects.push(messagethree)

      localStorage.setItem('seen_tutorial', true)
    }, 19000)

    setTimeout(() => {
      this.updatePlayerCount()
    }, 22000)
  }
}
