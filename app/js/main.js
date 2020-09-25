


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
const mouse = {
    x: 0,
    y: 0,
}

// === DATA ===

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
    console.log(figures)
})

circle.addEventListener('dragend', e => {
    cursorInCanvas(e)
    const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    if (elemBelow === cnv) {
        figures.push(new Circle((mouse.x - 25), (mouse.y - 25)))
    }
    console.log(figures)
})

// === DRAG FIGURES METHODS ===

// === METHODS ===

const drawFigure = (figure) => {
    ctx.fillStyle = figure.color
    figure.draw()
}

// === METHODS ===


// === RENDER ===

setInterval(function (e) {
    cnvCoords = cnv.getBoundingClientRect()
    ctx.clearRect(0, 0, width, height)
    for (let i in figures) {
        drawFigure(figures[i])
        // if (figures[i] === selected) {
        //     figures[i].stroke()
        // }
    }
    // if (drag.elemType === 'rect') {
    //     rectIsMoving(drag)
    // }
    // if (drag.elemType === 'circle') {
    //     circleIsMoving()
    // }
}, 1)

// === RENDER ===