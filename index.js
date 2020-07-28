const width = 800;
const height = 800;
const box = 10; 
const size = width / box;
var canvas = document.getElementById("conway");
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext("2d");
generation = 0


function draw(grid) {
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (grid[i][j]) {
                ctx.fillStyle = 'blue'
                ctx.beginPath();
                ctx.rect(j * box, i * box, box, box );
                ctx.stroke();
                ctx.fill();
            }
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

let grid = createGrid();
draw(grid)

requestAnimationFrame(tick)


function nextGrid(grid) {
    const nextGrid = grid.map(arr => [...arr])

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            let cell =  grid[i][j]
            let count = countNeighbors(grid, i, j)
            console.log(i,j, "C ", count)
            if (cell == 1 && count < 2) {
                cell = 0
            } else if (cell == 1 && count > 3) {
                cell = 0
            } else if (cell == 0 && count == 3) {
                cell = 1
            }
            nextGrid[i][j] = cell
        }
    }
    return nextGrid
}

function tick() {
    grid = nextGrid(grid)
    draw(grid)
    generation++
    console.log(generation)
    requestAnimationFrame(tick)
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
        console.log("Added", x, y)
        }
    }
    return count
}
// console.log(grid)
console.log(nextGrid(grid))