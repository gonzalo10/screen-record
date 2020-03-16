var buttonComment = document.querySelector('#btn-comment');
let paintable;
let counter = 0;

buttonComment.onclick = () => {
	window.addEventListener('click', addComment, false);
	paintable = false;
	counter = 0;
};

const addComment = e => {
	// var xPosition = e.clientX;
	// var yPosition = e.clientY;
	var xPosition = e.pageX - e.target.offsetLeft;
	var yPosition = e.pageY - e.target.offsetTop;

	if (paintable) {
		var comment = document.createElement('div');
		comment.style.width = '100px';
		comment.style.height = '100px';
		comment.style.border = '1px solid red';
		comment.style.position = 'absolute';
		comment.style.zIndex = '9999';
		comment.style.top = yPosition;
		comment.style.left = xPosition;
		comment.contentEditable = 'true';
		var body = document.getElementsByTagName('BODY')[0];
		body.appendChild(comment);
		paintable = false;
		return;
	}
	if (counter === 0) paintable = true;
	counter = 1;
};
