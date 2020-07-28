const width = 600;
const height = 600;
const box = 10; 
const size = width / box;
var canvas = document.getElementById("conway");
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext("2d");
generation = 0
let gameloop = null;
let genDisplay = document.getElementById("generation")


function draw(grid) {
    console.log("drawn")
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
                ctx.fillStyle = grid[i][j] ? "black" : "white"
                ctx.beginPath();
                ctx.rect(j * box, i * box, box, box );
                ctx.stroke();
                ctx.fill();
        }
    }
}

function createGrid() {
    let grid = []
    for (var i = 0; i < size; i++) {
        grid[i] = []
        for (var j = 0; j < size; j++) {
            grid[i][j] = Math.floor(Math.random() * 2)
        }
    }
    return grid
}

canvas.addEventListener('mousemove', e => {
    let mousePos = getMousePos(e)
    console.log(mousePos)
})

canvas.addEventListener('click', e => {
    console.log("hello")
    let box = getMousePos(e);
    let newValue = grid[box.y][box.x] == 1 ? 0 : 1;
    grid[box.y][box.x] = newValue;
    console.log(newValue);
    draw(grid)
})

let grid = createGrid();
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
// console.log(grid)
//console.log(nextGrid(grid))