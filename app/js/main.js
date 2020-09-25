// === CANVAS ===

const cnv = document.querySelector('#canvas')
const ctx = cnv.getContext('2d')
const width = 546
const height = 456
let cnvCoords = cnv.getBoundingClientRect()
cnv.width = width
cnv.height = height

// === CANVAS ===


// === DATA ===

const figures = []

// === DATA ===

// === STATE ===

const mouse = {
    x: 0,
    y: 0,
}

let selected = false
let drag = false

// === STATE ===

// === DRAG FIGURES ===

const Rect = function (x, y, w = 50, h = 50, color = 'gold', elemType = 'rect') {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.color = color
    this.elemType = elemType
}

const Circle = function (x, y, r = 25, sAngle = 0, eAngle = (2 * Math.PI), clockwise = false,
                         color = 'lime', elemType = 'circle',) {
    this.x = x + r
    this.y = y + r
    this.r = r
    this.sAngle = sAngle
    this.eAngle = eAngle
    this.clockwise = clockwise
    this.color = color
    this.elemType = elemType
}

Rect.prototype = {
    draw() {
        ctx.fillRect(this.x, this.y, this.w, this.h)
    },
    stroke() {
        ctx.strokeRect(this.x, this.y, this.w, this.h)
    }
}

Circle.prototype = {
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, this.sAngle, this.eAngle, this.clockwise)
        ctx.fill()
        ctx.closePath()
    },
    stroke() {
        ctx.stroke()
    }
}

// === DRAG FIGURES ===

// === DRAG FIGURES METHODS ===

const block = document.querySelector('#block')
const circle = document.querySelector('#circle')

block.draggable = true
circle.draggable = true

const cursorInCanvas = (e) => {
    const targetCoords = cnv.getBoundingClientRect();
    mouse.x = e.pageX - targetCoords.x
    mouse.y = e.pageY - targetCoords.y
}

block.addEventListener('dragend', e => {
    cursorInCanvas(e)
    const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    if (elemBelow === cnv) {
        figures.push(new Rect((mouse.x - 25), (mouse.y - 25), 50, 50, 'gold', 'rect'))
    }
})

circle.addEventListener('dragend', e => {
    cursorInCanvas(e)
    const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    if (elemBelow === cnv) {
        figures.push(new Circle((mouse.x - 25), (mouse.y - 25)))
    }
})

// === DRAG FIGURES METHODS ===

// === METHODS ===

const drawFigure = (figure) => {
    ctx.fillStyle = figure.color
    figure.draw()
}

const isCursorInRect = function (rect) {
    return mouse.x > (rect.x + cnvCoords.x) && mouse.x < (rect.x + rect.w + cnvCoords.x) &&
        mouse.y > (rect.y + cnvCoords.y) && mouse.y < (rect.y + rect.h + cnvCoords.y)
}

const isCursorInCircle = function (circle) {
    return mouse.x > (circle.x - circle.r + cnvCoords.x) && mouse.x < (circle.x + circle.r + cnvCoords.x) &&
        mouse.y > (circle.y - circle.r + cnvCoords.y) && mouse.y < (circle.y + circle.r + cnvCoords.y)
}

const isCursorInFigure = function (figure) {
    if (figure.elemType === 'rect') {
        return isCursorInRect(figure)
    } else if (figure.elemType === 'circle') {
        return isCursorInCircle(figure)
    }
}

// === METHODS ===

// === HANDLERS ===

window.onmousemove = (e) => {
    mouse.x = e.pageX
    mouse.y = e.pageY
}

window.onclick = () => {
    selected = false
    drag = false
    const cursorOnFigures = figures.filter(item => isCursorInFigure(item))
    const lastFigure = cursorOnFigures[cursorOnFigures.length - 1]
    const selectFigureInd = figures.lastIndexOf(lastFigure)
    if (selectFigureInd > -1) {
        const selectedFigure = figures.splice(selectFigureInd, 1)
        figures.push(selectedFigure[0])
        selected = selectedFigure[0]
    }
}

// === HANDLERS ===

// === RENDER ===

setInterval(function (e) {
    cnvCoords = cnv.getBoundingClientRect()
    ctx.clearRect(0, 0, width, height)
    for (let i in figures) {
        drawFigure(figures[i])
        if (figures[i] === selected) {
            figures[i].stroke()
        }
    }
    // if (drag.elemType === 'rect') {
    //     rectIsMoving(drag)
    // }
    // if (drag.elemType === 'circle') {
    //     circleIsMoving()
    // }
}, 1)

// === RENDER ===