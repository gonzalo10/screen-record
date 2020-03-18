var buttonComment = document.querySelector('#btn-comment');
let paintable;
let counter = 0;

buttonComment.onclick = () => {
	window.addEventListener('click', addComment, false);
	paintable = false;
	counter = 0;
};

const commentStyles = {
	width: '150px',
	padding: '10px',
	height: '100px',
	border: '1px solid red',
	position: 'absolute',
	zIndex: '9999',
	background: '#ffffffb3',
	borderRadius: '35px',
};

const addComment = e => {
	var xPosition = e.pageX - e.target.offsetLeft;
	var yPosition = e.pageY - e.target.offsetTop;

	if (paintable) {
		var comment = document.createElement('div');
		applyStyles(commentStyles, comment);
		comment.style.top = `${yPosition}px`;
		comment.style.left = `${xPosition}px`;
		comment.contentEditable = 'true';
		var body = document.getElementsByTagName('BODY')[0];
		body.appendChild(comment);
		paintable = false;
		return;
	}
	if (counter === 0) paintable = true;
	counter = 1;
};
