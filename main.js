var feedbackButton = document.querySelector('#feedback-button');
var controlPanel = document.querySelector('#control-panel');
var closeFeedbackPanel = document.querySelector('#close-feedback-button');

const panelStyles = {
	position: 'absolute',
	bottom: '0px',
	right: '0',
	height: '200px',
	width: '200px',
	display: 'flex',
	flexDirection: 'column',
	backgroundColor: 'lightblue',
	padding: '5px',
	borderRadius: '10px',
};

feedbackButtonStyles = {
	display: 'none',
};

const applyStyles = (styles, element) => {
	console.log(element);
	Object.keys(styles).forEach(style => {
		element.style[style] = styles[style];
	});
};

closeFeedbackPanel.onclick = function() {
	applyStyles({ display: 'none' }, controlPanel);
	applyStyles({ display: 'block' }, feedbackButton);
};
feedbackButton.onclick = function() {
	console.log('clicked');
	applyStyles(panelStyles, controlPanel);
	applyStyles(feedbackButtonStyles, feedbackButton);
};
