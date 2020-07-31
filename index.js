let width = 600;
let height = 600;
const box = 10; 
let size = width / box;
var canvas = document.getElementById("conway");
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext("2d");
generation = 0
let gameloop = null;
let genDisplay = document.getElementById("generation")
const glider = [
    {x: -1, y: -1, v: 1},
    {x: 0, y: -1, v: 1},
    {x: 1, y: -1, v: 1},
    {x: -1, y: 0, v: 1},
    {x: 0, y: 0, v: 0},
    {x: 1, y: 0, v: 0},
    {x: -1, y: 1, v: 0},
    {x: 0, y: 1, v: 1},
    {x: 1, y: 1, v: 0},
]
let CURRENT_STAMP = null


function draw(grid) {
    console.log("drawn")
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid.length; j++) {
                ctx.fillStyle = grid[i][j] ? "black" : "white"
                ctx.beginPath();
                ctx.rect(j * box, i * box, box, box );
                ctx.stroke();
                ctx.fill();
        }
    }
}

function createGrid(value) {
    let grid = []
    for (var i = 0; i < size; i++) {
        grid[i] = []
        for (var j = 0; j < size; j++) {
            grid[i][j] = (typeof value !== 'undefined') ? value : Math.floor(Math.random() * 2)
        }
    }
    return grid
}

function clearGrid() {
    pauseLoop()
    grid = createGrid(0)

    draw(grid)
    generation = 0
    genDisplay.innerHTML = generation
}

canvas.addEventListener('mousemove', e => {
    let mousePos = getMousePos(e)
})

function changeSize(newSize) {
    console.log("clicked")
    width = newSize * 10
    height = newSize * 10
    size = width / box;
    canvas.width = width;
    canvas.height = height;
    let grid = createGrid(0);
    draw(grid)
}

canvas.addEventListener('click', e => {
    console.log("hello")
    let box = getMousePos(e);
    if (CURRENT_STAMP) {
        console.log("current stamp")
        //stamp(box, CURRENT_STAMP)
        stampArray(box, CURRENT_STAMP.flat())
    } else {
    let newValue = grid[box.y][box.x] == 1 ? 0 : 1;
    grid[box.y][box.x] = newValue;
    }
    draw(grid)
})

// window.addEventListener('mousemove', e => {
//     let stampImage = document.getElementById("glider-copy")
//     stampImage.style.top = e.clientY + 'px';
//     stampImage.style.left = e.clientX + 'px';
// })

function rotateStamp() {
    if (CURRENT_STAMP) {
        console.log(CURRENT_STAMP)
        const nextStamp = CURRENT_STAMP.map(arr => [...arr])
        rotated = rotate(nextStamp)
        rotated2 = rotate(rotated)
        CURRENT_STAMP = rotated2
    }

}

function selectStamp(stamp) {
    console.log('stamp')
        switch(stamp) {
            case 'glider':
                console.log("glider")
                CURRENT_STAMP = gliderMatrix
                console.log(CURRENT_STAMP)
                break;
            case 'med-ship':
                console.log("med-ship")
                CURRENT_STAMP = middleSpaceShip
                break;
            case 'pulsar':
                CURRENT_STAMP = pulsar
                break;
            default:
                CURRENT_STAMP = null
        }

}


let grid = createGrid(0);
 draw(grid)

function getMousePos(e) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: Math.floor((e.clientX - rect.left) / box),
        y: Math.floor((e.clientY - rect.top) / box)
    };
}

function nextGrid(grid) {
    const nextGrid = grid.map(arr => [...arr])

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            let cell =  grid[i][j]
            let starting = cell
            let count = countNeighbors(grid, i, j)
            if (cell == 1 && count < 2) {
                cell = 0
            } else if (cell == 1 && count > 3) {
                cell = 0
            } else if (cell == 0 && count == 3) {
                cell = 1
            }
            nextGrid[i][j] = cell
            //console.log(starting, count, cell)
        }
    }
    return nextGrid
}

function startLoop() {
    gameloop = requestAnimationFrame(tick)
}

function pauseLoop() {
    console.log("PAUSE")
    cancelAnimationFrame(gameloop)
    gameloop = null;
}

function newStart() {
    generation = 0
    genDisplay.innerHTML = generation
    grid = createGrid()
    draw(grid)
}

function tick() {
    grid = nextGrid(grid)
    draw(grid)
    generation++
    genDisplay.innerHTML = generation
    //console.log(generation)
    if (gameloop){
        requestAnimationFrame(tick)
    }
    
}

function countNeighbors(grid, col, row) {
    let count = 0
    for (let n = -1; n < 2; n++) {
        for (let m = -1; m < 2; m++) {
            if (n == 0 && m == 0) {
                continue
            }
            x = col + n >= 0 ? ( col + n <= size -1 ? col + n : 0): size - 1
            y = row + m >= 0 ? ( row + m <= size -1 ? row + m : 0): size - 1            
        count += grid[x][y]
        }
    }
    return count
}

const gliderArray = [1,1,1,1,0,0,0,1,0]
const gliderMatrix = [[1,1,1],
                      [1,0,0],
                      [0,1,0]]
const middleSpaceShip = [[0,0,0,0,0],
                         [1,0,0,1,0],
                         [0,0,0,0,1],
                         [1,0,0,0,1],
                         [0,1,1,1,1]]
const pulsar = [
    [0,0,1,1,1,0,0,0,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [0,0,1,1,1,0,0,0,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,0,0,0,1,1,1,0,0],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,0,0,0,1,1,1,0,0],
]

function stampArray(origin, shape, left=-1, right=2) {
    let pos = 0
    if (shape.length === 25) {
        console.log("size 5")
        left = -2
        right = 3
    } else if (shape.length === 169) {
        left = -6
        right = 7
    }
    console.log("Left: ",left, " Right: ", right)
    for (let i = left; i < right; i++) {
        for (let j = left; j < right; j++) {
            y = origin.y + i
            x = origin.x + j
            grid[y][x] = shape[pos]
            pos++
        }
    }
}

function stamp(origin, shape) {
    shape.forEach(offset => {
        //console.log(offset)
        y = origin.y + offset.y
        x = origin.x + offset.x
        //console.log(x,y)
        grid[y][x] = offset.v
    })
}

function rotate(matrix) {
    const n = matrix.length
    const x = Math.floor(n/2)
    const y = n -1
    for (let i = 0; i < x; i++) {
        for (let j = i; j < y - 1; j++) {
            k = matrix[i][j]
            matrix[i][j] = matrix[y - j][i]
            matrix[y - j][i] = matrix[y - i][y - j]
            matrix[y - i][y - j] = matrix[j][y - i]
            matrix[j][y - i] = k
        }
    }
    return matrix
}

function showSize() {
    let controls = document.getElementById("controls-grid")
    controls.classList.toggle("hidden")
}

function toggleStamp(e) {
    let shape = e.currentTarget
    shape.classList.toggle("active")
}