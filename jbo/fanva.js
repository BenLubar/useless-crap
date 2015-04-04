'use strict';

var fanva = function(camxes) {
	var English = {
	};

	function to(language, parsed) {
		throw 'not yet implemented';
	}

	return {
		toEnglish: function(text) {
			return to(English, camxes.parse(text));
		}
	};
}(typeof require === 'function' ? require('./camxes.js') : this.camxes);

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = fanva;
}
