var feedbackButton = document.querySelector('#feedback-button');
var controlPanel = document.querySelector('#control-panel');
var closeFeedbackPanel = document.querySelector('#close-feedback-button');

const panelStyles = {
	position: 'sticky',
	bottom: '0',
	left: '100%',
	height: '210px',
	width: '400px',
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
