
window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./sw.js');
  }
}

document.querySelector("#read-file").addEventListener('click', function () {
  if (document.querySelector("#file").value == '') {
    console.log('No file selected')
    return
  }

  const files = document.querySelector("#file").files

  document.querySelector("#gmae-data").style.display = 'none'

  GameMain(new Resources(files))
})

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowUp: {
    pressed: false
  },
  Control: {
    pressed: false
  }
}

let game;
let player;
let fps, fpsInterval, startTime, now, then, elapsed
var resLoaded = []

async function GameMain(resources) {
  game = new Renderer({ width: 1440, height: 810 })

  resLoaded['boy'] = { name: "boy", spr: await resources.SprLoad('data/OBJ/boy.spr', 0), mot: await resources.MotLoad('data/OBJ/boy.mot', 0) }
  resLoaded['girl'] = { name: "girl", spr: await resources.SprLoad('data/OBJ/girl.spr', 0), mot: await resources.MotLoad('data/OBJ/girl.mot', 0) }

  //let eyeCsp = await resources.SprLoad('data/Avatar/eye.csp', 1)
  //let eyeCmo = await resources.MotLoad('data/Avatar/eye.cmo', 1)
  //console.log(eyeCsp)
  //console.log(eyeCmo)
  player = new Player({
    sprSrc: resLoaded.girl.spr,
    motSrc: resLoaded.girl.mot,
    position: {
      x: 100,
      y: 100
    },
    velocity: {
      x: 0,
      y: 0
    },
    attackBox: {
      offset: {
        x: -170,
        y: 50
      },
      width: 170,
      height: 50
    }
  })

  fps = 35

  fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;
  animate()

  // 搖桿
  let div3 = document.querySelector('.div3')
  let div2 = document.querySelector('.div2')
  let r = 25		//搖桿的半徑
  let r2 = 100	//底盤的半徑
  let x = div2.offsetLeft + r		//加上r半徑的偏移到中心
  let y = div2.offsetTop + r
  div3.ontouchmove = joyPadTouchMove
  div3.ontouchend = joyPadTouchend
  // 鍵盤
  window.addEventListener('keydown', keyDown)
  window.addEventListener('keyup', keyUp)
}

function animate() {
  window.requestAnimationFrame(animate)
  now = Date.now();
  elapsed = now - then;

  // if enough time has elapsed, draw the next frame

  if (elapsed > fpsInterval) {

    // Get ready for next frame by setting then=now, but also adjust for your
    // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
    then = now - (elapsed % fpsInterval);

    // Put your drawing code here
    game.clear()
    if (player != undefined) {
      player.update(game._ctx)
    }

    player.velocity.x = 0

    let notMoveAction = (player.action != player.getSpriteId('HJUMP_1'))

    let notDarwAction = (player.action !== player.getSpriteId('LJUMP_1')
      && player.action !== player.getSpriteId('HJUMP_2')
      && player.action !== player.getSpriteId('HJUMP_3')
      && player.action != player.getSpriteId('HJUMP_1'))

    if (keys.ArrowLeft.pressed && player.lastKey === 'ArrowLeft' && notMoveAction) {
      player.direct = 1
      player.velocity.x = player.isRunning ? -10 : -5
      if (notDarwAction)
        player.switchSprite(player.isRunning ? 'RUN_1' : 'WALK_1')
    } else if (keys.ArrowRight.pressed && player.lastKey === 'ArrowRight' && notMoveAction) {
      player.direct = 0
      player.velocity.x = player.isRunning ? 10 : 5
      if (notDarwAction)
        player.switchSprite(player.isRunning ? 'RUN_1' : 'WALK_1')
    } else if (player.action === player.getSpriteId('HJUMP_4')) {
      setTimeout("player.switchSprite('STAND_1')", 300)
      console.log(now)
    } else {
      if (notDarwAction)
        player.switchSprite('STAND_1')
    }

    // jumping
    //console.log(player.isHightJump)
    if (player.velocity.y < 0) {
      if (player.isHightJump) {
        player.switchSprite('HJUMP_2')
      } else {
        player.switchSprite('LJUMP_1')
      }
    } else if (player.velocity.y > player.gravity) {
      if (player.isHightJump) {
        player.switchSprite('HJUMP_3')
      } else {
        player.switchSprite('LJUMP_2')
      }
    }

    if (player.action === player.getSpriteId('HJUMP_1') && !keys.ArrowUp.pressed) {
      player.isHightJump = true
      if (player.velocity.y == 0)
        player.velocity.y = -25
    }
  }
}

function joyPadTouchMove(e) {
  let t = e.changedTouches[0]
  //開根號 觸控點到搖桿中心點的距離
  let d = Math.sqrt(Math.pow(t.pageX - x, 2) + Math.pow(t.pageY - y, 2))
  d = d > (r2 - r) ? r2 - r : d
  //三角函數求反正切 減去xy偏移到中心點
  let radin = Math.atan2(t.pageY - y, t.pageX - x)
  let vx = x + Math.cos(radin) * d
  let vy = y + Math.sin(radin) * d
  div2.style.left = vx + 'px'
  div2.style.top = vy + 'px'
  if (vx > x) {
    keys.ArrowRight.pressed = true
    player.lastKey = 'ArrowRight'
  } else if (vx < x) {
    keys.ArrowLeft.pressed = true
    player.lastKey = 'ArrowLeft'
  }
}

function joyPadTouchend() {
  div2.style.left = x + 'px'
  div2.style.top = y + 'px'
  keys.ArrowRight.pressed = false
  keys.ArrowLeft.pressed = false
}

function keyDown(event) {
  if (!player.dead) {
    console.log(event.key)
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        player.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        player.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        if (keys.Control.pressed) {
          keys.ArrowUp.pressed = true
          player.switchSprite('HJUMP_1')
        } else {
          if (player.velocity.y == 0)
            player.velocity.y = -15
        }
        break
      case ' ':
        player.attack()
        break
      case 'z':
        player.isRunning = player.isRunning ? false : true
        console.log(player.isRunning)
        break
      case 'Control':
        keys.Control.pressed = true
        break
    }
  }
}

function keyUp(event) {
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
    case 'ArrowUp':
      keys.ArrowUp.pressed = false
      break
    case 'Control':
      keys.Control.pressed = false
      break
  }
}
