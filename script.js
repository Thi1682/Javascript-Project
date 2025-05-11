  const container = document.querySelector('.container')
  const scoreDisplay = document.querySelector('#score')
  const grid = document.querySelector('.grid');
  const startBtn = document.getElementById('startBtn')
  const blockWidth = 100
  const blockHeight = 20
  const userStart = [230, 10]
  const boardWidth = 560
  const boardHeight = 300
  let currentPosition = [...userStart];
  const ballStart = [270, 40]
  let ballCurrentPosition = [...ballStart];
  let timerId = null
  const ballDiameter = 20
  let xDirection = -2
  let yDirection = 2
  let score = 0

  class Block {
    constructor(xAxis, yAxis) {
      this.bottomLeft = [xAxis, yAxis];
      this.bottomRight = [xAxis + blockWidth, yAxis]
      this.topLeft = [xAxis, yAxis + blockHeight]
    }
  }

  let blocks = []
  function createBlocks() {
    blocks = [
      new Block(10, 270),
      new Block(120, 270),
      new Block(230, 270),
      new Block(340, 270), 
      new Block(450, 270),
      new Block(10, 240),
      new Block(120, 240), 
      new Block(230, 240), 
      new Block(340, 240), 
      new Block(450, 240),
      new Block(10, 210), 
      new Block(120, 210), 
      new Block(230, 210), 
      new Block(340, 210), 
      new Block(450, 210)
    ];
  }
  //addBlocks

  function addBlocks() {
    for (let block of blocks) {
      const blockEl = document.createElement('div');
      blockEl.classList.add('block');
      blockEl.style.left = block.bottomLeft[0] + 'px';
      blockEl.style.bottom = block.bottomLeft[1] + 'px';
      grid.appendChild(blockEl);
    }
  }

  createBlocks()
  addBlocks()

  const user = document.createElement('div')
  user.classList.add('user')
  grid.appendChild(user)

  const ball = document.createElement('div')
  ball.classList.add('ball')
  grid.appendChild(ball)
//draw the ball
  function drawBall() {
    ball.style.left = ballCurrentPosition[0] + 'px'
    ball.style.bottom = ballCurrentPosition[1] + 'px'
  }
//draw the user
  function drawUser() {
    user.style.left = currentPosition[0] + 'px'
    user.style.bottom = currentPosition[1] + 'px'
  }
//move user
  function moveUser(e) {
    switch (e.key) {
      case 'ArrowLeft':
        if (currentPosition[0] > 0) {
          currentPosition[0] -= 10
          drawUser()
        }
        break;
      case 'ArrowRight':
        if (currentPosition[0] < boardWidth - blockWidth) {
          currentPosition[0] += 10
          drawUser()
        }
        break;
    }
  }

  document.addEventListener('keydown', moveUser)

  drawUser()
  drawBall()

  function moveBall() {
    ballCurrentPosition[0] += xDirection
    ballCurrentPosition[1] += yDirection
    drawBall()
    checkForCollisions()
  }

  function checkForCollisions() {
    // check for block collisions
    for (let i = 0; i < blocks.length; i++) {
      if (
        (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
        ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1])
      ) {
        const allBlocks = Array.from(document.querySelectorAll('.block'))
        allBlocks[i].classList.remove('block')
        blocks.splice(i, 1)
        changeDirection()
        score++
        scoreDisplay.innerHTML = score

        if (blocks.length === 0) {
          clearInterval(timerId)
          scoreDisplay.innerHTML = 'YOU WIN!'
          startBtn.innerText = "Restart"
        }
      }
    }

    // check for wall collisions
    if (
      ballCurrentPosition[0] >= (boardWidth - ballDiameter) ||
      ballCurrentPosition[1] >= (boardHeight - ballDiameter) ||
      ballCurrentPosition[0] <= 0
    ) {
      changeDirection()
    }

    // check for user collision
    if (
      (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
      (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight)
    ) {
      changeDirection()
    }

    // lose
    if (ballCurrentPosition[1] <= 0) {
      clearInterval(timerId)
      scoreDisplay.innerHTML = 'YOU LOSE!'
      startBtn.innerText = "Restart"
    }
  }

  function changeDirection() {
    if (xDirection === 2 && yDirection === 2) {
      yDirection = -2
      return
    }
    if (xDirection === 2 && yDirection === -2) {
      xDirection = -2
      return
    }
    if (xDirection === -2 && yDirection === -2) {
      yDirection = 2
      return
    }
    if (xDirection === -2 && yDirection === 2) {
      xDirection = 2
      return
    }
  }

  function resetGame() {
    clearInterval(timerId)
    score = 0
    scoreDisplay.innerHTML = score
    ballCurrentPosition = [...ballStart]
    currentPosition = [...userStart]
    xDirection = -2
    yDirection = 2
    document.querySelectorAll('.block').forEach(b => b.remove())
    createBlocks()
    addBlocks()
    drawBall()
    drawUser()
  }

  startBtn.onclick = () => {
    if (!timerId) {
      if (scoreDisplay.innerHTML === 'YOU LOSE!' || scoreDisplay.innerHTML === 'YOU WIN!') {
        resetGame()
        startBtn.innerText = 'Pause'
      }
      timerId = setInterval(moveBall, 23)
      startBtn.innerText = 'Pause'
    } else {
      clearInterval(timerId)
      timerId = null
      startBtn.innerText = 'Start'
    }
  }