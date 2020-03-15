var buttonPaint = document.querySelector('#btn-start-painting');
var buttonScreenShot = document.querySelector('#btn-screenshot');
var buttonDrawArrow = document.querySelector('#btn-arrow');
var buttonDrawRectangle = document.querySelector('#btn-rectangle');
var screenshotImg = document.getElementById('screenshot');

var myCanvas;

buttonPaint.onclick = function() {
	createCanvasOverlay('rgba(0,0,0,0)');
};
buttonScreenShot.onclick = function() {
	createScreenShot().then(canvas => paintScreenshot(canvas.toDataURL()));
};

buttonDrawArrow.onclick = function() {
	drawGeometry('arrow');
};
buttonDrawRectangle.onclick = function() {
	// drawArrow('rectangle');
	drawGeometry('rectangle');
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

function drawGeometry(type) {
	var canvasgroup = document.getElementById('canvasgroup');
	const prevCanvas = document.getElementById('drawing');
	// if (prevCanvas) {
	// 	prevCanvas.parentNode.removeChild(prevCanvas);
	// }
	// var canvas = document.createElement('canvas');
	// canvas.id = 'drawing';
	// canvas.style.position = 'absolute';
	// canvas.style.top = '0px';
	// canvas.style.left = '0px';
	// canvas.style.outline = '1px solid red';
	// canvas.style.width = '100%';
	// canvas.style.height = '100%';
	// canvas.style.width = '100%';
	// canvas.style.height = '100%';

	// canvasgroup.appendChild(canvas);
	var canvas = document.getElementById('drawing');
	var ctx = canvas.getContext('2d');

	var canvas2 = document.getElementById('final');
	var ctx2 = canvas2.getContext('2d');
	var canvasOffset = canvas.getBoundingClientRect();
	var offsetX = canvasOffset.left;
	var offsetY = canvasOffset.top;
	var startX;
	var startY;
	var maxx = 600;
	var maxy = 400;
	var isDown = false;

	switch (type) {
		case 'arrow':
			drawArrows();
			break;
		case 'rectangle':
			drawRectangle();
			break;
		default:
			break;
	}

	function drawRectangle() {
		function drawRect(toX, toY, context) {
			context.beginPath();
			context.rect(startX, startY, toX - startX, toY - startY);
			context.stroke();
		}
		function handleMouseDown(e) {
			console.log('handleMouseDown');
			mouseX = parseInt(e.clientX - offsetX);
			mouseY = parseInt(e.clientY - offsetY);
			startX = mouseX;
			startY = mouseY;
			ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
			isDown = true;
		}
		function handleMouseUp(e) {
			mouseX = parseInt(e.clientX - offsetX);
			mouseY = parseInt(e.clientY - offsetY);
			isDown = false;
			drawRect(mouseX, mouseY, ctx);
			ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
		}

		function handleMouseMove(e) {
			if (isDown) {
				mouseX = parseInt(e.clientX - offsetX);
				mouseY = parseInt(e.clientY - offsetY);
				ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
				drawRect(mouseX, mouseY, ctx2);
			}
		}

		canvas.addEventListener('mousedown', handleMouseDown, false);
		canvas.addEventListener('mouseup', handleMouseUp, false);
		canvas.addEventListener('mousemove', handleMouseMove, false);
	}
	// Draw arrows
	function drawArrows() {
		function drawFilledPolygon(canvas, shape) {
			canvas.beginPath();
			canvas.moveTo(shape[0][0], shape[0][1]);

			for (p in shape) if (p > 0) canvas.lineTo(shape[p][0], shape[p][1]);

			canvas.lineTo(shape[0][0], shape[0][1]);
			canvas.fill();
		}

		function translateShape(shape, x, y) {
			var rv = [];
			for (p in shape) rv.push([shape[p][0] + x, shape[p][1] + y]);
			return rv;
		}

		function rotateShape(shape, ang) {
			var rv = [];
			for (p in shape) rv.push(rotatePoint(ang, shape[p][0], shape[p][1]));
			return rv;
		}

		function rotatePoint(ang, x, y) {
			return [
				x * Math.cos(ang) - y * Math.sin(ang),
				x * Math.sin(ang) + y * Math.cos(ang),
			];
		}

		function drawLineArrow(canvas, x1, y1, x2, y2) {
			canvas.beginPath();
			canvas.moveTo(x1, y1);
			canvas.lineTo(x2, y2);
			canvas.stroke();
			var ang = Math.atan2(y2 - y1, x2 - x1);
			drawFilledPolygon(
				canvas,
				translateShape(rotateShape(arrow_shape, ang), x2, y2)
			);
		}

		function redrawLine(canvas, x1, y1, x2, y2) {
			canvas.clearRect(0, 0, maxx, maxy);
			drawLineArrow(canvas, x1, y1, x2, y2);
		}

		// Event handlers
		function mDown(e) {
			console.log('mDown');
			read_position();
			var p = get_offset(e);
			if (p[0] < 0 || p[1] < 0) return;
			if (p[0] > maxx || p[1] > maxy) return;
			drawing = true;
			ox = p[0];
			oy = p[1];
			return nothing(e);
		}

		function mMove(e) {
			if (!!drawing) {
				var p = get_offset(e);
				// Constrain the line to the canvas...
				if (p[0] < 0) p[0] = 0;
				if (p[1] < 0) p[1] = 0;
				if (p[0] > maxx) p[0] = maxx;
				if (p[1] > maxy) p[1] = maxy;
				redrawLine(ctx, ox, oy, p[0], p[1]);
			}
			return nothing(e);
		}

		function mDone(e) {
			if (drawing) {
				var p = get_offset(e);
				ctx.clearRect(0, 0, maxx, maxy);
				drawLineArrow(ctx2, ox, oy, p[0], p[1]);
				drawing = false;
			}
		}

		function nothing(e) {
			e.stopPropagation();
			e.preventDefault();
			return false;
		}

		function read_position() {
			// console.log(obj);
			var o = canvas.getBoundingClientRect();
			yoff = o.top;
			xoff = o.left;
		}

		function get_offset(e) {
			return [e.pageX - xoff, e.pageY - yoff];
		}

		var arrow_shape = [
			[-10, -4],
			[-8, 0],
			[-10, 4],
			[2, 0],
		];

		var xoff, yoff;
		var ox, oy;
		var drawing;

		canvas.addEventListener('mousemove', mMove, false);
		canvas.addEventListener('mousedown', mDown, false);
		canvas.addEventListener('mouseup', mDone, false);
	}
}
