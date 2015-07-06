function KeyWatcher() {
	this.active    = {};
	this.listeners = {
		'down'  : [],
		'up'    : [],
		'press' : []
	};
	this.start();
}


KeyWatcher.prototype.forEachDown = function(callback) {
	for (var keycode in this.active) {
		callback(keycode, this.active[keycode]);
	}
};


KeyWatcher.prototype.isDown = function(keyCode) {
	return keyCode in this.active;
};

KeyWatcher.prototype.on = function(action, callback) {
	if (action in this.listeners) {
		this.listeners[action].push(callback);
	}
};

KeyWatcher.prototype.fire = function(action, data) {
	if (action in this.listeners) {
		var keyname = Key.Codes[data.which];
		if (keyname) {
			data[Key.toVariable(keyname)] = true;
		}
		this.listeners[action].forEach(function(callback) {
			callback(data);
		});
	}
};

KeyWatcher.prototype.handleKeyDown = function(event) {
	event.timing = {
		start    : new Date(),
		end      : null,
		duration : null
	};

	this.fire('down', event);

	if (!this.active[event.keyCode]) {
		this.active[event.keyCode] = event;
		this.fire('press', event);
	}
};

KeyWatcher.prototype.handleKeyUp = function(event) {
	if (!(event.keyCode in this.active)) {
		return true;
	}

	var timing = this.active[event.keyCode].timing;
	timing.end = new Date();
	timing.duration = timing.start - timing.end;

	event.timing = timing;

	this.fire('up', event);
	delete this.active[event.keyCode];
};

KeyWatcher.prototype.start = function() {
	window.addEventListener('keyup', this.handleKeyUp.bind(this));
	window.addEventListener('keydown', this.handleKeyDown.bind(this));
};

var Key = new KeyWatcher();

Key.Codes = {
	3 : "break",
	8 : "backspace / delete",
	9 : "tab",
	12 : 'clear',
	13 : "enter",
	16 : "shift",
	17 : "ctrl",
	18 : "alt",
	19 : "pause/break",
	20 : "caps lock",
	27 : "escape",
	32 : "spacebar",
	33 : "page up",
	34 : "page down",
	35 : "end",
	36 : "home",
	37 : "left arrow",
	38 : "up arrow",
	39 : "right arrow",
	40 : "down arrow",
	41 : "select",
	42 : "print",
	43 : "execute",
	44 : "Print Screen",
	45 : "insert",
	46 : "delete",
	48 : "num 0",
	49 : "num 1",
	50 : "num 2",
	51 : "num 3",
	52 : "num 4",
	53 : "num 5",
	54 : "num 6",
	55 : "num 7",
	56 : "num 8",
	57 : "num 9",
	65 : "a",
	66 : "b",
	67 : "c",
	68 : "d",
	69 : "e",
	70 : "f",
	71 : "g",
	72 : "h",
	73 : "i",
	74 : "j",
	75 : "k",
	76 : "l",
	77 : "m",
	78 : "n",
	79 : "o",
	80 : "p",
	81 : "q",
	82 : "r",
	83 : "s",
	84 : "t",
	85 : "u",
	86 : "v",
	87 : "w",
	88 : "x",
	89 : "y",
	90 : "z",
	91 : "Windows Key / Left ⌘",
	92 : "right window key",
	93 : "Windows Menu / Right ⌘",
	96 : "numpad 0",
	97 : "numpad 1",
	98 : "numpad 2",
	99 : "numpad 3",
	100 : "numpad 4",
	101 : "numpad 5",
	102 : "numpad 6",
	103 : "numpad 7",
	104 : "numpad 8",
	105 : "numpad 9",
	106 : "multiply",
	107 : "add",
	109 : "subtract",
	110 : "decimal point",
	111 : "divide",
	112 : "f1",
	113 : "f2",
	114 : "f3",
	115 : "f4",
	116 : "f5",
	117 : "f6",
	118 : "f7",
	119 : "f8",
	120 : "f9",
	121 : "f10",
	122 : "f11",
	123 : "f12",
	124 : "f13",
	125 : "f14",
	126 : "f15",
	127 : "f16",
	128 : "f17",
	129 : "f18",
	130 : "f19",
	144 : "num lock",
	145 : "scroll lock",
	173 : "mute/unmute",
	174 : "decrease volume level",
	175 : "increase volume level",
	181 : "mute/unmute",
	182 : "decrease volume level",
	183 : "increase volume level",
	186 : "semi-colon",
	187 : "equal sign",
	188 : "comma",
	189 : "dash",
	190 : "period",
	191 : "forward slash",
	192 : "grave accent",
	219 : "open bracket",
	220 : "back slash",
	221 : "close bracket",
	222 : "single quote",
	224 : "left or right ⌘ key",
	225 : "altgr",
	255 : "toggle touchpad"
};

Key.toVariable = function(name) {
	name = name.replace(/[^a-zA-Z0-9]/g, '_');
	name = name.replace(/_+/g, '_');
	name = name.toUpperCase();
	return name;
}

for (var code in Key.Codes) {
	var name = Key.Codes[code];
	Key[Key.toVariable(name)] = code;
}
