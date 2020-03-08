var buttonPaint = document.querySelector('#btn-start-painting');
var buttonScreenShot = document.querySelector('#btn-screenshot');
var screenshotImg = document.getElementById('screenshot');

var myCanvas;

buttonPaint.onclick = function() {
	createCanvasOverlay('rgba(0,0,0,0)');
};
buttonScreenShot.onclick = function() {
	createScreenShot().then(canvas => paintScreenshot(canvas.toDataURL()));
};

function createCanvasOverlay(color, canvasContainer) {
	if (!myCanvas) {
		const container = createOrAssignContainter(canvasContainer);
		const context = createCanvas(color, container);

		// create control panel

		var controlPanel = createDiv();
		var closeButton = createButton('CLOSE', hideCanvas);
		controlPanel.appendChild(closeButton);
		var closeButton = createButton('ScreenShot', createAndPaintScreenshot);
		controlPanel.appendChild(closeButton);
		container.canvasContainer.appendChild(controlPanel);

		// here we can add new colors and withs to the line
		// TODO add arrows and squares, and text box
		context.strokeStyle = 'rgb(0,255,0)'; // a green line
		context.lineWidth = 4; // 4 pixels thickness
		myCanvas.parentNode.addEventListener(
			'mousemove',
			onMouseMoveOnMyCanvas,
			false
		);
		myCanvas.parentNode.addEventListener(
			'mousedown',
			onMouseClickOnMyCanvas,
			false
		);
		myCanvas.parentNode.addEventListener(
			'mouseup',
			onMouseClickOnMyCanvas,
			false
		);
	} else myCanvas.parentNode.style.visibility = 'visible';
}

function onMouseMoveOnMyCanvas(event) {
	if (myCanvas.drawing) {
		var mouseX = event.layerX;
		var mouseY = event.layerY;

		var context = myCanvas.getContext('2d');
		if (myCanvas.pathBegun == false) {
			context.beginPath();
			myCanvas.pathBegun = true;
		} else {
			context.lineTo(mouseX, mouseY);
			context.stroke();
		}
	}
}

function onMouseClickOnMyCanvas(event) {
	myCanvas.drawing = !myCanvas.drawing;
	// reset the path when starting over
	if (myCanvas.drawing) myCanvas.pathBegun = false;
}

function hideCanvas() {
	if (myCanvas) {
		myCanvas.parentNode.style.visibility = 'hidden';
	}
}

function createCanvas(color, container) {
	myCanvas = document.createElement('canvas');
	myCanvas.style.width = container.superContainer.scrollWidth + 'px';
	myCanvas.style.height = container.superContainer.scrollHeight + 'px';
	myCanvas.width = container.superContainer.scrollWidth;
	myCanvas.height = container.superContainer.scrollHeight;
	myCanvas.style.overflow = 'visible';
	myCanvas.style.position = 'absolute';
	myCanvas.style.left = '0px';
	myCanvas.style.top = '0px';
	var context = myCanvas.getContext('2d');
	context.fillStyle = color;
	context.fillRect(0, 0, myCanvas.width, myCanvas.height);
	container.canvasContainer.appendChild(myCanvas);
	return context;
}
function createOrAssignContainter(canvasContainer) {
	if (!canvasContainer) {
		canvasContainer = document.createElement('div');
		document.body.appendChild(canvasContainer);
		canvasContainer.style.position = 'absolute';
		canvasContainer.style.left = '0';
		canvasContainer.style.top = '0';
		canvasContainer.style.width = '100vw';
		canvasContainer.style.height = '100vh';
		canvasContainer.style.zIndex = '1000';
		superContainer = document.body;
	} else superContainer = canvasContainer;
	return { canvasContainer, superContainer };
}

function createScreenShot() {
	const canvas = html2canvas(document.body);
	return canvas;
}

function paintScreenshot(screenshotUrl) {
	screenshotImg.src = screenshotUrl;
}

function createAndPaintScreenshot() {
	return createScreenShot().then(canvas => paintScreenshot(canvas.toDataURL()));
}

function createButton(text, buttonAction) {
	var closeButton = document.createElement('button');
	closeButton.onclick = buttonAction;
	closeButton.style.background = '#f00';
	closeButtonText = document.createTextNode(text);
	closeButton.appendChild(closeButtonText);
	return closeButton;
}
function createDiv() {
	var div = document.createElement('div');
	div.style.position = 'absolute';
	div.style.left = '50%';
	div.style.top = '0';
	div.style.transform = 'translate(-50%)';
	div.style.width = '300px';
	div.style.height = '50px';
	div.style.background = 'transparent';
	div.style.border = '1px solid lightblue';
	div.style.display = 'flex';
	div.style.alignItems = 'center';
	div.style.justifyContent = 'space-evenly';
	return div;
}
