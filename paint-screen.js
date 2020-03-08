var buttonPaint = document.querySelector('#btn-start-painting');
var buttonScreenShot = document.querySelector('#btn-screenshot');
var screenshotImg = document.getElementById('screenshot');

var myCanvas;

buttonPaint.onclick = function() {
	createCanvasOverlay('rgba(0,0,0,0)');
};
buttonScreenShot.onclick = function() {
	html2canvas(document.body).then(function(canvas) {
		paintScreenshot(canvas.toDataURL());
	});
};

function createCanvasOverlay(color, canvasContainer) {
	if (!myCanvas) {
		const container = createOrAssignContainter(canvasContainer);
		const context = createCanvas(color, container);

		var closeButton = createButton('CLOSE', hideCanvas);
		container.canvasContainer.appendChild(closeButton);
		var closeButton = createButton('Screen', hideCanvas);
		container.canvasContainer.appendChild(closeButton);

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
		//alert(myCanvas);
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
	// You must set this otherwise the canvas will be streethed to fit the container
	myCanvas.width = container.superContainer.scrollWidth;
	myCanvas.height = container.superContainer.scrollHeight;
	//surfaceElement.style.width=window.innerWidth;
	myCanvas.style.overflow = 'visible';
	myCanvas.style.position = 'absolute';
	myCanvas.style.left = '0px';
	myCanvas.style.top = '0px';
	var context = myCanvas.getContext('2d');
	console.log('color', color);
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

function paintScreenshot(screenshotUrl) {
	screenshotImg.src = screenshotUrl;
}

function createButton(text, buttonAction) {
	var closeButton = document.createElement('div');
	closeButton.style.position = 'relative';
	closeButton.style.float = 'right';
	closeButton.onclick = buttonAction;
	closeButton.style.left = '20px';
	closeButton.style.top = '14px';
	closeButton.style.width = '50px';
	closeButton.style.height = '20px';
	closeButton.style.background = '#f00';
	closeButtonText = document.createTextNode(text);
	closeButton.appendChild(closeButtonText);
	return closeButton;
}
