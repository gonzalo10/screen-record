var buttonPaint = document.querySelector('#btn-start-painting');
var buttonScreenShot = document.querySelector('#btn-screenshot');
var buttonDrawArrow = document.querySelector('#btn-arrow');
var buttonDrawFree = document.querySelector('#btn-free');
var buttonDrawRectangle = document.querySelector('#btn-rectangle');
var screenshotImg = document.getElementById('screenshot');

var myCanvas;
let container;
let ctx2;
buttonPaint.onclick = function() {
	container = createOrAssignContainter();
	ctx2 = createCanvas('rgba(0,0,0,0)', container);
};
buttonScreenShot.onclick = function() {
	createScreenShot().then(canvas => paintScreenshot(canvas.toDataURL()));
};

buttonDrawArrow.onclick = function() {
	drawGeometry('arrow');
};
buttonDrawRectangle.onclick = function() {
	drawGeometry('rectangle');
};
buttonDrawFree.onclick = function() {
	drawGeometry('free');
};

function drawRectangleOverlay(color, canvasContainer) {
	if (!myCanvas) {
		const container = createOrAssignContainter(canvasContainer);
		const context = createCanvas(color, container);

		// create control panel

		var controlPanel = createDiv();
		var closeButton = createButton('CLOSE', hideCanvas);
		controlPanel.appendChild(closeButton);
		var closeButton = createButton('ScreenShot', createAndPaintScreenshot);
		var freeDrawButton = createButton('Free Draw', freeDraw);
		var arrowButton = createButton('Arrow', () => drawGeometry('arrow'));
		var reactangleButton = createButton('Rectangle', () =>
			drawRectangleOverlay()
		);
		controlPanel.appendChild(freeDrawButton);
		controlPanel.appendChild(closeButton);
		controlPanel.appendChild(arrowButton);
		controlPanel.appendChild(reactangleButton);
		container.canvasContainer.appendChild(controlPanel);
		// here we can add new colors and withs to the line
		// TODO add arrows and squares, and text box
		context.strokeStyle = 'rgb(0,255,0)'; // a green line
		context.lineWidth = 4; // 4 pixels thickness
	} else myCanvas.parentNode.style.visibility = 'visible';
}

function freeDraw() {
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
	var Button = document.createElement('button');
	Button.onclick = buttonAction;
	Button.style.background = '#f00';
	ButtonText = document.createTextNode(text);
	Button.appendChild(ButtonText);
	return Button;
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
	// // NEW
	const ctx = createCanvas('rgba(0,0,0,0)', container);
	var canvas2 = ctx2.canvas;
	const canvas = ctx.canvas;
	var canvasOffset = canvas.getBoundingClientRect();
	var offsetX = canvasOffset.left;
	var offsetY = canvasOffset.top;
	var startX;
	var startY;
	var maxx = window.innerWidth;
	var maxy = window.innerHeight;
	var isDown = false;

	// // OLD DELETE event listeners
	// var old_element = document.getElementById('drawing');
	// var canvas = old_element.cloneNode(true);
	// old_element.parentNode.replaceChild(canvas, old_element);
	// var ctx = canvas.getContext('2d');

	// // OLD;
	// var canvas2 = document.getElementById('final');
	// var ctx2 = canvas2.getContext('2d');
	// var canvasOffset = canvas.getBoundingClientRect();
	// var offsetX = canvasOffset.left;
	// var offsetY = canvasOffset.top;
	// var startX;
	// var startY;
	// var maxx = 600;
	// var maxy = 400;
	// var isDown = false;

	console.log('type', type);
	switch (type) {
		case 'arrow':
			drawArrows();
			break;
		case 'rectangle':
			drawRectangle();
			break;
		case 'free':
			drawFree();
			break;
		default:
			break;
	}
	function drawFree() {
		function mouseMoveFreeDraw(event) {
			if (canvas2.drawing) {
				var mouseX = event.layerX;
				var mouseY = event.layerY;

				if (canvas2.pathBegun == false) {
					ctx2.beginPath();
					canvas2.pathBegun = true;
				} else {
					ctx2.lineTo(mouseX, mouseY);
					ctx2.stroke();
				}
			}
		}
		function mouseDownFreeMove(event) {
			console.log('mouse mouseDownFreeMove');
			canvas2.drawing = true;
			canvas2.pathBegun = false;
		}
		function mouseUpFreeMove(event) {
			canvas2.drawing = false;
			canvas2.pathBegun = false;
		}

		canvas.addEventListener('mousemove', mouseMoveFreeDraw, false);
		canvas.addEventListener('mousedown', mouseDownFreeMove, false);
		canvas.addEventListener('mouseup', mouseUpFreeMove, false);
	}

	function drawRectangle() {
		function drawRect(toX, toY, context) {
			context.beginPath();
			context.rect(startX, startY, toX - startX, toY - startY);
			context.stroke();
		}
		function handleMouseDown(e) {
			mouseX = parseInt(e.clientX - offsetX);
			mouseY = parseInt(e.clientY - offsetY);
			startX = mouseX;
			startY = mouseY;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			isDown = true;
		}
		function handleMouseUp(e) {
			mouseX = parseInt(e.clientX - offsetX);
			mouseY = parseInt(e.clientY - offsetY);
			isDown = false;
			drawRect(mouseX, mouseY, ctx2);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}

		function handleMouseMove(e) {
			if (isDown) {
				mouseX = parseInt(e.clientX - offsetX);
				mouseY = parseInt(e.clientY - offsetY);
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				drawRect(mouseX, mouseY, ctx);
			}
		}

		canvas.addEventListener('mousedown', handleMouseDown, false);
		canvas.addEventListener('mouseup', handleMouseUp, false);
		canvas.addEventListener('mousemove', handleMouseMove, false);
	}
	// Draw arrows
	function drawArrows() {
		function drawFilledPolygon(canvas3, shape) {
			console.log(canvas3);
			canvas3.beginPath();
			canvas3.moveTo(shape[0][0], shape[0][1]);
			for (p in shape) if (p > 0) canvas3.lineTo(shape[p][0], shape[p][1]);
			canvas3.lineTo(shape[0][0], shape[0][1]);
			canvas3.fill();
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

		function drawLineArrow(context, x1, y1, x2, y2) {
			context.beginPath();
			context.moveTo(x1, y1);
			context.lineTo(x2, y2);
			context.stroke();
			var ang = Math.atan2(y2 - y1, x2 - x1);
			console.log('drawLineArrow');
			drawFilledPolygon(
				context,
				translateShape(rotateShape(arrow_shape, ang), x2, y2)
			);
		}

		function redrawLine(context, x1, y1, x2, y2) {
			context.clearRect(0, 0, maxx, maxy);
			drawLineArrow(context, x1, y1, x2, y2);
		}

		// Event handlers
		function mDown(e) {
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
				console.log('mDone');
				var p = get_offset(e);
				ctx.clearRect(0, 0, maxx, maxy);
				console.log(ctx2, ox, oy, p[0], p[1]);
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
			[-100, -40],
			[-80, 0],
			[-100, 40],
			[20, 0],
		];

		var xoff, yoff;
		var ox, oy;
		var drawing;

		canvas.addEventListener('mousemove', mMove, false);
		canvas.addEventListener('mousedown', mDown, false);
		canvas.addEventListener('mouseup', mDone, false);
	}
}
