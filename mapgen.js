var gridOverlayEl = document.getElementById("gridOverlay");
gridOverlayEl.setAttribute("tabindex", "0");
gridOverlayEl.addEventListener("keydown", keyboard);

var tileData = [];

var pictures = []

for (var i = 0; i <= 16; i++) {
    pictures.push(i + ".png");
}

width = prompt("Width of map: ");
height = prompt("Height of map: ");
blockSize = 40
cursorOpacity = 0.5;

gridOverlayEl.style.width = width*blockSize + "px";
gridOverlayEl.style.height = height*blockSize + "px";

for(var i = 0; i < width*height; i++){
    var clickableTile = document.createElement("div");
    clickableTile.id = i; 
    clickableTile.classList.add("tile");
    clickableTile.style.width = blockSize + "px"; 
    clickableTile.style.height = blockSize + "px";
    clickableTile.style.backgroundColor = "rgb(156,203,137)";
    tileData.push([0, 0]); // tiledata, rotation
    clickableTile.style.backgroundImage = "url(images/0.png)";
    // left click
    clickableTile.addEventListener("click", leftClick);
    // right click
    clickableTile.addEventListener("contextmenu", rightClick);
    // keyboard
    clickableTile.addEventListener("keydown", keyboard);
    gridOverlayEl.appendChild(clickableTile);
}

console.log(tileData)

let lastMousePos = { x: 0, y: 0 };

gridOverlayEl.addEventListener("mousemove", function(e) {
    lastMousePos.x = e.clientX;
    lastMousePos.y = e.clientY;
});

keybinds = {
    48: 0,
    49: 1,
    50: 2,
    51: 3,
    52: 4,
    53: 5,
    54: 6,
    55: 7,
    56: 8,
    57: 9,
    187: 10,
    81: 11,
    87: 12,
    69: 13,
    82: 14,
    84: 15,
    89: 16
}

function keyboard(e){
    let tileUnderCursor = document.elementFromPoint(lastMousePos.x, lastMousePos.y);

    // Ensure the element under the cursor is a tile
    if (tileUnderCursor && tileUnderCursor.classList.contains("tile")) {
        console.log("This is: " + tileUnderCursor.id + " and you pressed: " + e.keyCode);

        if (e.keyCode in keybinds) {
            _tileType = keybinds[e.keyCode]
            tileUnderCursor.style.backgroundImage = "url(images/" + (_tileType) + ".png)";
            tileData[tileUnderCursor.id][0] = _tileType;
        }
    }
    // if space
    if(e.keyCode == 32){
        e.preventDefault();
        console.log(tileDataToMap(tileData))
        console.log()
        console.log(tileDataToStations(tileData))
    }

    // if enter
    if(e.keyCode == 13){
        e.preventDefault();
        console.log(tileDataToMap(tileData, true))
        console.log()
        console.log(tileData)
    }

    // if z
    if(e.keyCode == 90){
        e.preventDefault();
        mapData = loadMap();
        tileData = mapData;
        // reload pictures and rotations
        var tileObjectsEl = document.getElementsByClassName("tile");
        for(var i = 0; i < tileObjectsEl.length; i++){
            tileObjectsEl[i].style.backgroundImage = "url(images/" + tileData[i][0] + ".png)";
            tileObjectsEl[i].style.transform = "rotate(" + tileData[i][1] + "deg)";
        }
    }

    // if 's' is pressed
    if(e.keyCode == 83){
        e.preventDefault();
        saveDataToFile(tileData, "map.csv");
    }
}

function leftClick(e){ 
    console.log("This is: " + e.target.id + ". Tile is: " + tileData[e.target.id][0] + " and rotation is: " + tileData[e.target.id][1]);
    tileData[e.target.id][0]++
    if (tileData[e.target.id][0] == pictures.length) {
        tileData[e.target.id][0] = 0;
    }
    e.target.style.backgroundImage = "url(images/" + tileData[e.target.id][0] + ".png)";
}

function rightClick(e){
    // prevent context menu
    e.preventDefault();
    // rotate
    tileData[e.target.id][1] += 90;
    if (tileData[e.target.id][1] == 360) {
        tileData[e.target.id][1] = 0;
    }
    e.target.style.transform = "rotate(" + tileData[e.target.id][1] + "deg)";
}

function tileDataToMap(tileData, raw = false){
    let mapOutput = "";
    for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++){
            i = h*width + w;
            if (raw) {
                mapOutput += "(" + tileData[i][0] + ", " + tileData[i][1] + ");";
            } else {
                if (tileData[i][0] == 11) {
                    mapOutput += "(1, 0);";
                } else if (tileData[i][0] == 12) {
                    mapOutput += "(1, 90);";
                } else if (tileData[i][0] == 13) {
                    mapOutput += "(7, 0);";
                } else if (tileData[i][0] == 14) {
                    mapOutput += "(7, 90);";
                } else if (tileData[i][0] == 15) {
                    mapOutput += "(7, 180);";
                } else if (tileData[i][0] == 16) {
                    mapOutput += "(7, 270);";
                } else {
                    mapOutput += "(" + tileData[i][0] + ", " + tileData[i][1] + ");";
                }
            }
        }
        mapOutput = mapOutput.substring(0, mapOutput.length - 1);
        mapOutput += "\n";
    }
    
    return mapOutput;
}

function tileDataToStations(tileData){
    // create stations
    let stations = "";
    for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++){
            i = h*width + w;
            if (tileData[i][0] > 10 && tileData[i][0] < 17) {
                stations += "(" + w + ", " + h + ");";
            }
        }
    }
    stations = stations.substring(0, stations.length - 1);

    return stations;
}

function saveDataToFile(data, filename){
    let formattedData = "";

    // Iterate over each element in the data array and format it
    for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++) {
            let i = h * width + w;
            formattedData += "(" + data[i][0] + ", " + data[i][1] + ");";
            if (w < width - 1) {
                formattedData += ""; // Add space between entries on the same line
            }
        }
        formattedData = formattedData.substring(0, formattedData.length - 1);
        formattedData += "\n";
    }
    formattedData = formattedData.substring(0, formattedData.length - 1);
    // Create a Blob from the formatted data
    let blob = new Blob([formattedData], {type: 'text/plain'});

    // Create a link for the blob
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    a.remove();
}

function loadMap(){
    mapData = prompt("Paste map data here: ");

    // Remove outer brackets
    mapData = mapData.substring(1, mapData.length - 1);

    // Split string into rows
    const rows = mapData.split("\n");

    // Parse each row and split into tuple pairs
    let result = [];
    rows.forEach(row => {
        // Add surrounding brackets to handle edge tuples
        row = '(' + row + ')';
        const tuples = row.split(");(");
        tuples.forEach(tuple => {
            const [a, b] = tuple.replace(/[()\[\]]/g, '').split(", ");
            result.push([parseInt(a, 10), parseInt(b, 10)]);
        });
    });
    return result;
}