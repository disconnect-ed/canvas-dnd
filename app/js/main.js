// === BUTTONS ===

const saveFigures = document.querySelector('#save')
const loadFigures = document.querySelector('#load')
const expJson = document.querySelector('#export')
const impJson = document.querySelector('#import')
const clear = document.querySelector('#clear')

// === BUTTONS ===


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
let dragOnCanvas = false
let dragBehindCanvas = false
let cloneIsCreated = false
let selectedClone = null

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
const cloneBlock = document.querySelector('#block').cloneNode()
const cloneCircle = document.querySelector('#circle').cloneNode()
cloneBlock.style = 'position: fixed; opacity: 0.8;'
cloneCircle.style = 'position: fixed; opacity: 0.8;'


block.draggable = true
circle.draggable = true

const cursorInCanvas = (e) => {
    const targetCoords = cnv.getBoundingClientRect();
    mouse.x = e.pageX - targetCoords.x
    mouse.y = e.pageY - targetCoords.y
}

block.ondragend = e => {
    const figure = 'rect'
    const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    if (elemBelow === cnv) {
        addFigure(e, figure)
    }
}

circle.ondragend = e => {
    const figure = 'circle'
    cursorInCanvas(e)
    const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    if (elemBelow === cnv) {
        addFigure(e, figure)
    }
}

// === DRAG FIGURES METHODS ===

// === METHODS ===

const addFigure = (e, figure) => {
    cursorInCanvas(e)
    if (figure.elemType === 'rect' || figure === 'rect') {
        figures.push(new Rect((mouse.x - 25), (mouse.y - 25), 50, 50, 'gold', 'rect'))
        isBorderOut(figures[figures.length - 1])
    } else if (figure.elemType === 'circle' || figure === 'circle') {
        figures.push(new Circle((mouse.x - 25), (mouse.y - 25)))
        isBorderOut(figures[figures.length - 1])
    }
}

const exportJson = (e) => {
    const newJson = JSON.stringify(figures)
    if (e.type === 'click') {
        localStorage.setItem('localJsonFile', newJson);
    } else {
        sessionStorage.setItem('sessionJsonFile', newJson)
    }
}

const importJson = (e) => {
    figures.length = 0
    let newData = null
    if (e.type === 'click') {
        newData = JSON.parse(localStorage.getItem('localJsonFile'))
    } else {
        newData = JSON.parse(sessionStorage.getItem('sessionJsonFile'))
    }
    newData.forEach(elem => {
        if (elem.elemType === 'rect') {
            figures.push(new Rect(elem.x, elem.y, elem.w, elem.h, elem.color, elem.elemType))
        }
        if (elem.elemType === 'circle') {
            figures.push(new Circle((elem.x - elem.r), (elem.y - elem.r), elem.r, elem.sAngle, elem.eAngle,
                elem.clockwise, elem.color, elem.elemType))
        }
    })
}

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

const deleteFigure = (figure) => {
    if (!figure) return
    figures.pop()
    selected = false
    dragOnCanvas = false
}


const figureMovingBehindCanvas = () => {
    selected = false
    const lastFigure = figures.pop()
    if (!cloneIsCreated) {
        cloneIsCreated = lastFigure.elemType
        if (cloneIsCreated === 'rect') {
            selectedClone = cloneBlock
        } else if (cloneIsCreated === 'circle') {
            selectedClone = cloneCircle
        }
        document.body.append(selectedClone)
    }
}

const isBorderOut = (figure) => {
    if (figure.elemType === 'rect') {
        isRightBorderRectOut(figure)
        isBottomBorderRectOut(figure)
        isLeftBorderRectOut(figure)
        isTopBorderRectOut(figure)
    } else if (figure.elemType === 'circle') {
        isRightBorderCircleOut(figure)
        isBottomBorderCircleOut(figure)
        isLeftBorderCircleOut(figure)
        isTopBorderCircleOut(figure)
    }
}

const isRightBorderRectOut = (figure) => {
    if (((figure.x + figure.w) > cnv.width)) {
        figure.x = cnv.width - figure.w - 1
    }
}

const isBottomBorderRectOut = (figure) => {
    if (((figure.y + figure.h) > cnv.height)) {
        figure.y = cnv.height - figure.h - 1
    }
}

const isLeftBorderRectOut = (figure) => {
    if (figure.x <= 0) {
        figure.x = 1
    }
}

const isTopBorderRectOut = (figure) => {
    if (figure.y <= 0) {
        figure.y = 1
    }
}

const isRightBorderCircleOut = (figure) => {
    if (((figure.x + figure.r) > cnv.width)) {
        figure.x = cnv.width - figure.r - 1
    }
}

const isBottomBorderCircleOut = (figure) => {
    if (((figure.y + figure.r) > cnv.height)) {
        figure.y = cnv.height - figure.r - 1
    }
}

const isLeftBorderCircleOut = (figure) => {
    if ((figure.x - figure.r) <= 0) {
        figure.x = figure.r + 1
    }
}

const isTopBorderCircleOut = (figure) => {
    if ((figure.y - figure.r) <= 0) {
        figure.y = figure.r + 1
    }
}

const rectIsMoving = () => {
    if (((selected.x + selected.w) > cnv.width)) {
        selected.x = cnv.width - selected.w - 1

        dragOnCanvas = false
        return
    }
    if (((selected.y + selected.h) > cnv.height)) {
        selected.y = cnv.height - selected.w - 1
        dragOnCanvas = false
        return
    }
    if (((selected.x) < 0)) {
        selected.x = 1
        dragOnCanvas = false
        return
    }
    if (((selected.y) < 0)) {
        selected.y = 1
        dragOnCanvas = false
        return
    }
    selected.x = mouse.x - cnvCoords.x - selected.w / 2
    selected.y = mouse.y - cnvCoords.y - selected.h / 2
}

const circleIsMoving = () => {
    if (((selected.x + selected.r) > cnv.width)) {
        selected.x = cnv.width - selected.r - 1
        dragOnCanvas = false
        return
    }
    if (((selected.y + selected.r) > cnv.height)) {
        selected.y = cnv.height - selected.r - 1
        dragOnCanvas = false
        return
    }
    if (((selected.x - selected.r) < 0)) {
        selected.x = selected.r + 1
        dragOnCanvas = false
        return
    }
    if (((selected.y - selected.r) < 0)) {
        selected.y = selected.r + 1
        dragOnCanvas = false
        return
    }
    selected.x = mouse.x - cnvCoords.x
    selected.y = mouse.y - cnvCoords.y
}

const cursorBehindCanvas = (cnvCoords) => {
    return (mouse.x < cnvCoords.left || mouse.x > cnvCoords.right
        || mouse.y < cnvCoords.top || mouse.y > cnvCoords.bottom)
}

// === METHODS ===

// === HANDLERS ===

window.onload = (e) => {
    addEventListener('keydown', e => {
        const keyCode = e.code
        if (keyCode === 'Delete') {
            deleteFigure(selected)
        }
    })
    importJson(e)
}

window.onbeforeunload = (e) => {
    exportJson(e)
}

window.onmousemove = (e) => {
    mouse.x = e.pageX
    mouse.y = e.pageY
    const cursorIsBehindCanvas = cursorBehindCanvas(cnvCoords)
    if (selected && !dragOnCanvas &&
        dragBehindCanvas && cursorIsBehindCanvas) {
        figureMovingBehindCanvas()
    }
}

cnv.onclick = () => {
    selected = false
    dragOnCanvas = false
    dragBehindCanvas = false
    const cursorOnFigures = figures.filter(item => isCursorInFigure(item))
    const lastFigure = cursorOnFigures[cursorOnFigures.length - 1]
    const selectFigureInd = figures.lastIndexOf(lastFigure)
    if (selectFigureInd > -1) {
        const selectedFigure = figures.splice(selectFigureInd, 1)
        figures.push(selectedFigure[0])
        selected = selectedFigure[0]
    }
}

cnv.onmousedown = () => {
    if (selected) {
        for (let i in figures) {
            if (isCursorInFigure(figures[i]) && figures[i] === selected) {
                dragOnCanvas = figures[i]
                dragBehindCanvas = figures[i]
            }
        }
    }
}

window.onmouseup = (e) => {
    dragOnCanvas = false
    if (!cursorBehindCanvas(cnvCoords) && !dragOnCanvas
        && dragBehindCanvas && !selected) {
        addFigure(e, dragBehindCanvas)
    }
    dragBehindCanvas = false
    if (selectedClone && cloneIsCreated) {
        selectedClone.remove()
        cloneIsCreated = false
        selectedClone = false
    }
}

saveFigures.onclick = () => {
    writeData()
}

loadFigures.onclick = () => {
    readData()
}

expJson.onclick = (e) => {
    exportJson(e)
}

impJson.onclick = (e) => {
    importJson(e)
}

clear.onclick = () => {
    firebase.database().ref('figures/').set([])
    figures.length = 0
    localStorage.removeItem('jsonFile')
}

// === HANDLERS ===

// === RENDER ===

setInterval(() => {
    cnvCoords = cnv.getBoundingClientRect()
    ctx.clearRect(0, 0, width, height)
    for (let i in figures) {
        drawFigure(figures[i])
        if (figures[i] === selected) {
            figures[i].stroke()
        }
    }
    if (dragOnCanvas.elemType === 'rect') {
        rectIsMoving(selected)
    } else if (dragOnCanvas.elemType === 'circle') {
        circleIsMoving()
    }
    if (selectedClone && dragBehindCanvas) {
        selectedClone.style.left = `${mouse.x - 25}px`
        selectedClone.style.top = `${mouse.y - 25}px`
    }
}, 20)

// === RENDER ===