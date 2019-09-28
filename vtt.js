(function() {
	"use strict";

	var style = document.createElement("style");
	style.textContent = "::cue(.hidden) { visibility: hidden; }";
	document.body.appendChild(style);

	var karaoke = /<(?:(?:([0-9]{2,}):)?([0-5][0-9]):)?([0-5][0-9]\.[0-9]{3})>/g;
	document.addEventListener("load", function(e) {
		var el = e.target;
		if (el.nodeType !== Node.ELEMENT_NODE || el.nodeName !== "TRACK") {
			return;
		}

		var track = el.track;
		var cues = [].slice.call(track.cues);
		cues.forEach(function(cue) {
			var parts = cue.text.split(karaoke);
			if (parts.length <= 1) {
				return;
			}
	
			var timestamps = [cue.startTime, cue.endTime];
			for (var i = 1; i < parts.length; i += 2) {
				var ts = parts.splice(i, 3, 0);
				var hrs = parseInt(ts[0] || "0", 10);
				var min = parseInt(ts[1] || "0", 10);
				var sec = parseFloat(ts[2]);
				parts[i] = (hrs * 60 + min) * 60 + sec;
				timestamps.push(parts[i]);
			}
	
			track.removeCue(cue);
	
			timestamps.sort(function(a, b) {
				return a - b;
			}).filter(function(v, i, a) {
				return a.indexOf(v) === i;
			});
	
			for (var i = 0; i < timestamps.length - 1; i++) {
				var start = timestamps[i];
				var end = timestamps[i + 1];
				var text = [parts[0]];
				for (var j = 1; j < parts.length; j += 2) {
					if (parts[j] <= start) {
						text.push(parts[j + 1]);
					} else {
						text.push("<c.hidden>");
						text.push(parts[j + 1]);
						text.push("</c>");
					}
				}
				track.addCue(new VTTCue(start, end, text.join("")));
			}
		});
	}, true);
})();
