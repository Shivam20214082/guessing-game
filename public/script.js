const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearCanvas = document.querySelector(".clear-canvas"),
  saveImg = document.querySelector(".save-img"),
  ctx = canvas.getContext("2d");

// Global variables with default values
let prevMouseX, prevMouseY, snapshot,
  isDrawing = false,
  selectedTool = "brush",
  brushWidth = 5,
  selectedColor = "#000";

const setCanvasBackground = () => {
  // Setting the whole canvas background to white, so the downloaded image background will be white
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor; // Setting fillstyle back to the selectedColor; it'll be the brush color
};

window.addEventListener("load", () => {
  // Setting canvas width/height; offsetWidth/height returns the viewable width/height of an element
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

const drawRect = (e) => {
  // If fillColor isn't checked, draw a rectangle with a border; else, draw a rectangle with a background
  if (!fillColor.checked) {
    // Creating a rectangle according to the mouse pointer
    return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
  }
  ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
};

const drawCircle = (e) => {
  ctx.beginPath(); // Creating a new path to draw a circle
  // Getting the radius for the circle according to the mouse pointer
  let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // Creating a circle according to the mouse pointer
  fillColor.checked ? ctx.fill() : ctx.stroke(); // If fillColor is checked, fill the circle; else, draw the border of the circle
};

const drawTriangle = (e) => {
  ctx.beginPath(); // Creating a new path to draw a triangle
  ctx.moveTo(prevMouseX, prevMouseY); // Moving the triangle to the mouse pointer
  ctx.lineTo(e.offsetX, e.offsetY); // Creating the first line according to the mouse pointer
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // Creating the bottom line of the triangle
  ctx.closePath(); // Closing the path of a triangle so the third line is drawn automatically
  fillColor.checked ? ctx.fill() : ctx.stroke(); // If fillColor is checked, fill the triangle; else, draw the border
};

const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX; // Passing the current mouseX position as prevMouseX value
  prevMouseY = e.offsetY; // Passing the current mouseY position as prevMouseY value
  ctx.beginPath(); // Creating a new path to draw
  ctx.lineWidth = brushWidth; // Passing brushSize as the line width
  ctx.strokeStyle = selectedColor; // Passing selectedColor as the stroke style
  ctx.fillStyle = selectedColor; // Passing selectedColor as the fill style
  // Copying canvas data and passing it as the snapshot value; this avoids dragging the image
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
  if (!isDrawing) return; // If isDrawing is false, return from here
  ctx.putImageData(snapshot, 0, 0); // Adding the copied canvas data to this canvas

  if (selectedTool === "brush" || selectedTool === "eraser") {
    // If the selected tool is eraser, then set strokeStyle to white
    // To paint white color on the existing canvas content; else, set the stroke color to the selected color
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY); // Creating a line according to the mouse pointer
    ctx.stroke(); // Drawing/filling the line with color
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else {
    drawTriangle(e);
  }
};

toolBtns.forEach(btn => {
  btn.addEventListener("click", () => { // Adding click event to all tool options
    // Removing the active class from the previous option and adding it to the current clicked option
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
  });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); // Passing slider value as brushSize

colorBtns.forEach(btn => {
  btn.addEventListener("click", () => { // Adding click event to all color buttons
    // Removing the selected class from the previous option and adding it to the current clicked option
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    // Passing the selected button's background color as selectedColor value
    selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
  });
});

colorPicker.addEventListener("change", () => {
  // Passing the picked color value from the color picker to the last color button's background
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clearing the whole canvas
  setCanvasBackground();
});

saveImg.addEventListener("click", () => {
  const link = document.createElement("a"); // Creating an <a> element
  link.download = `${Date.now()}.jpg`; // Passing the current date as the link's download value
  link.href = canvas.toDataURL(); // Passing canvasData as the link's href value
  link.click(); // Clicking the link to download the image
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);

document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector(".toggle-button");
    const toolBoard = document.querySelector(".tools-board");

    toggleButton.addEventListener("click", function () {
        if (toolBoard.style.display === "none") {
            toolBoard.style.display = "block";
        } else {
            toolBoard.style.display = "none";
        }
    });
});



document.addEventListener("DOMContentLoaded", function () {
    // const socket = io('http://localhost:3000');
    const socket = io('https://gussing-game-63hl.onrender.com/');
    const form = document.getElementById('send-container');
    const messageInput = document.getElementById('message-input');
    const messageContainer = document.querySelector(".chat-messages");

    const appendMessage = (message, position) => {
        const messageElement = document.createElement('div');
        messageElement.innerText = message;
        messageElement.classList.add('message');
        messageElement.classList.add(position);
        messageContainer.append(messageElement);
    }

    const appendNotification = (message, position) => {
        const notificationElement = document.createElement('div');
        notificationElement.innerText = message;
        notificationElement.classList.add('message');
        notificationElement.classList.add(position);
        messageContainer.append(notificationElement);
    }

    const name = prompt("Enter your name to join");
    socket.emit('new-user-joined', name);

    socket.on('user-joined', name => {
        appendNotification(`${name} joined the chat`, 'center');
    });

    socket.on('receive', data => {
        if (data.name === name) {
            appendNotification(`You: ${data.message}`, 'center');
        } else {
            appendMessage(`${data.name}: ${data.message}`, 'left');
        }
    });

    socket.on('left', name => {
        appendNotification(`${name} left the chat`, 'center');
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = messageInput.value;
        appendMessage(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    let isDrawing = false;
    let drawingData = [];

    // Initialize Socket.IO connection
    const socket = io(); // Connect to the current host

    canvas.addEventListener("mousedown", (e) => {
        isDrawing = true;
        const { offsetX, offsetY } = e;
        drawingData.push({
            type: "start",
            x: offsetX,
            y: offsetY
        });
    });

    canvas.addEventListener("mousemove", (e) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = e;
        drawingData.push({
            type: "draw",
            x: offsetX,
            y: offsetY
        });
        draw();
    });

    canvas.addEventListener("mouseup", () => {
        isDrawing = false;
        drawingData.push({
            type: "end"
        });

        // Send drawing data to the server using Socket.IO
        socket.emit("drawing", drawingData);

        // Reset the drawing data
        drawingData = [];
    });

    function draw() {
        ctx.beginPath();
        ctx.moveTo(drawingData[0].x, drawingData[0].y);

        for (let i = 1; i < drawingData.length; i++) {
            if (drawingData[i].type === "draw") {
                ctx.lineTo(drawingData[i].x, drawingData[i].y);
                ctx.stroke();
            } else if (drawingData[i].type === "start") {
                ctx.moveTo(drawingData[i].x, drawingData[i].y);
            } else if (drawingData[i].type === "end") {
                ctx.closePath();
            }
        }
    }

    // Event listener for receiving drawing data from other users
    socket.on("drawing", (data) => {
        drawingData = data;
        draw();
    });
});



