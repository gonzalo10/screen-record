var video = document.querySelector('video');
var button = document.querySelector('#btn-test-getDisplayMedia');
var buttonStop = document.querySelector('#btn-stop-getDisplayMedia');
var stream;

buttonStop.onclick = function() {
	stream.getTracks().forEach(track => track.stop());
};
button.onclick = function() {
	this.disabled = true;

	invokeGetDisplayMedia(
		function(screen) {
			addStreamStopListener(screen, function() {
				location.reload();
			});
			console.log(screen);

			video.srcObject = screen;

			var _capabilities = screen.getTracks()[0].getCapabilities();
			capabilities.value =
				'capabilities:\n\n' + JSON.stringify(_capabilities, null, '\t');
			capabilities.style.display = '';

			var _settings = screen.getTracks()[0].getSettings();
			settings.value = 'settings:\n\n' + JSON.stringify(_settings, null, '\t');
			settings.style.display = '';
		},
		function(e) {
			button.disabled = false;

			var error = {
				name: e.name || 'UnKnown',
				message: e.message || 'UnKnown',
				stack: e.stack || 'UnKnown',
			};

			if (error.name === 'PermissionDeniedError') {
				if (location.protocol !== 'https:') {
					error.message = 'Please use HTTPs.';
					error.stack = 'HTTPs is required.';
				}
			}

			console.error(error.name);
			console.error(error.message);
			console.error(error.stack);

			alert(
				'Unable to capture your screen.\n\n' +
					error.name +
					'\n\n' +
					error.message +
					'\n\n' +
					error.stack
			);
		}
	);
};

if (!navigator.getDisplayMedia && !navigator.mediaDevices.getDisplayMedia) {
	var error = 'Your browser does NOT supports getDisplayMedia API.';
	document.querySelector('h1').innerHTML = error;
	document.querySelector('h1').style.color = 'red';

	document.querySelector('video').style.display = 'none';
	button.style.display = 'none';
	throw new Error(error);
}

function invokeGetDisplayMedia(success, error) {
	async function _startCapturing() {
		stream = await _startScreenCapture();
		success(stream);
	}
	_startCapturing();
}

function _startScreenCapture() {
	if (navigator.getDisplayMedia) {
		return navigator.getDisplayMedia({ video: true });
	} else if (navigator.mediaDevices.getDisplayMedia) {
		return navigator.mediaDevices.getDisplayMedia({ video: true });
	} else {
		return navigator.mediaDevices.getUserMedia({
			video: { mediaSource: 'screen' },
		});
	}
}

function addStreamStopListener(stream, callback) {
	stream.addEventListener(
		'ended',
		function() {
			callback();
			callback = function() {};
		},
		false
	);
	stream.addEventListener(
		'inactive',
		function() {
			callback();
			callback = function() {};
		},
		false
	);
	stream.getTracks().forEach(function(track) {
		track.addEventListener(
			'ended',
			function() {
				callback();
				callback = function() {};
			},
			false
		);
		track.addEventListener(
			'inactive',
			function() {
				callback();
				callback = function() {};
			},
			false
		);
	});
}
