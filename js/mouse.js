function MouseWatcher() {
	this.position = null;
	this.down     = {};
	this.listeners = {
		'move'       : [],
		'down'       : [],
		'up'         : [],
		'drag'       : [],
		'dragging'   : [],
		'scroll'     : []
	};
	this.dragThreshold = 20; // The distance needed to trigger a drag event
	this.start();
}

MouseWatcher.prototype.isDown = function(button) {
	if (button === undefined) {
		return Object.keys(this.down) > 0;
	}
	return button in this.down;
};

MouseWatcher.prototype.on = function(action, callback) {
	this.listeners[action].push(callback);
};

MouseWatcher.prototype.fire = function(action, data) {
	this.listeners[action].forEach(function(callback) {
		callback(data);
	});
};

MouseWatcher.prototype.distance = function(start, end) {
	if (!start || !end) {
		return 0;
	}
	var dx = start.x - end.x;
	var dy = start.y - end.y;
	return Math.sqrt(Math.abs(dx*dx + dy*dy));
};

MouseWatcher.prototype.difference = function(start, end, data) {
	data = data || {};
	data.distance = this.distance(start, end);
	if (end && end.when && start && start.when) {
		data.duration = end.when - start.when;
	}
	if (data.duration) {
		data.velocity = data.distance / data.duration;
	}
	return data;
};

MouseWatcher.prototype.normalizeEvent = function(event) {
	event.which = event.which || event.button;

	event.x = event.clientX;
	event.y = event.clientY;

	event.when = new Date();

	event.scrollX = event.wheelDeltaX;
	event.scrollY = event.wheelDetlaY;

	return event;
};

MouseWatcher.prototype.handleMove = function(event) {
	this.normalizeEvent(event);

	var data = {
		then: this.position,
		now : event
	}
	this.position = event;

	if (data.then) {
		this.difference(data.now, data.then, data);
	}

	this.fire('move', data);
	if (this.isDown()) {
		this.fire('dragging', data);
	}
};

MouseWatcher.prototype.handleDown = function(event) {
	event = this.normalizeEvent(event);
	if (this.down[event.which]) {
		return false;
	}
	this.down[event.which] = event;
	this.fire('down', event);
	if (event.which === 3) {
		return false;
	}
};

MouseWatcher.prototype.handleUp = function(event) {
	var data = {
		'up'  : this.normalizeEvent(event),
		'down': this.down[event.which]
	};

	this.difference(data.up, data.down, data);

	this.fire('up', data);

	if (data.distance > this.dragThreshold) {
		this.fire('drag', data);
	}

	delete this.down[event.which];
};

MouseWatcher.prototype.handleScroll = function(event) {
	event = this.normalizeEvent(event);
	this.fire('scroll', event);
};

MouseWatcher.prototype.start = function() {
	window.addEventListener('mousedown',  this.handleDown.bind(this));
	window.addEventListener('mouseup',    this.handleUp.bind(this));
	window.addEventListener('mousemove',  this.handleMove.bind(this));
	window.addEventListener('mousewheel', this.handleScroll.bind(this));
	document.oncontextmenu = function(e) {
		if (e.preventDefault) e.preventDefault();
		if (e.stopPropagation) e.stopPropagation();
		return false;
	};
};

var Mouse = new MouseWatcher();
Mouse.LEFT   = 1;
Mouse.MIDDLE = 2;
Mouse.RIGHT  = 3;
