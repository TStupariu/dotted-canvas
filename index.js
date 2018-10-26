const REFRESH_RATE = 25
const HEIGHT = 200
const WIDTH = 400
const PROXY_X = 80
const PROXY_Y = 80
const DOT_H = 10
const DOT_W = 10

let dots = []
let mouseX = null
let mouseY = null

const canvas = document.getElementById('cvs')
const ctx = canvas.getContext('2d')

const randInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const randFloat = (min, max) => {
  return Math.random() * (max - min) + min
}

const drawDot = (x, y) => {
	ctx.fillStyle = '#000'
	ctx.beginPath();
	ctx.fillRect(x, y, DOT_H, DOT_W)
	ctx.fill()	
}

const generateInitialRow = () => {
	const nrOfDots = randInt(1, 5)
	for (let i = 0; i < nrOfDots; i++) {
		const y = randInt(0, 200)
		const trajectory = randFloat(-0.5, 0.5)
		dots.push({
			x: 0,
			y,
			tDiff: trajectory
		})
	}
}

const drawLines = () => {
	if (mouseX && mouseY) {
		const proxyPoints = dots.filter(dot => {
			const {x, y} = dot
			return Math.abs(mouseX - x) < PROXY_X && Math.abs(mouseY - y) < PROXY_Y
		}).forEach(dot => {
			const {x, y} = dot
			const center_x = x + Math.floor(DOT_W / 2)
			const center_y = y + Math.floor(DOT_H / 2)
			ctx.beginPath();
			ctx.moveTo(center_x, center_y);
			ctx.lineTo(mouseX, mouseY);
			ctx.stroke();
		})
	}
}

const redraw = () => {
	ctx.clearRect(0, 0, WIDTH, HEIGHT)

	dots.forEach(dot => {
		const {x, y} = dot
		drawDot(x, y)
	})
	drawLines()
}

const moveDots = () => {
	dots = dots.map(dot => {
		const {x, y, tDiff} = dot
		return {
			x: x + 1,
			y: y + tDiff,
			tDiff
		}
	}).filter(dot => {
		const {x, y} = dot
		return x < WIDTH && y < HEIGHT && y > 0
	})
}
	
let currentTick = 0
let tick = 50

canvas.addEventListener('mousemove', (e) => {
	const {left, top} = canvas.getBoundingClientRect()
	mouseX = e.clientX - left
	mouseY = e.clientY - top
})

generateInitialRow()
const loop = () => {
	currentTick = currentTick + 1
	if (currentTick === tick) {
		generateInitialRow()
		currentTick = 0
		tick = randInt(30, 60)
	}
	moveDots()
	redraw()
	setTimeout(() => loop(), REFRESH_RATE)
}

loop()