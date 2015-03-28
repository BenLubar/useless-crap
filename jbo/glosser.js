(function() {
	var input;
	var language_data;

	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'en.xml');
	xhr.overrideMimeType('text/xml');
	xhr.onload = function() {
		language_data = {};
		Array.prototype.forEach.call(xhr.responseXML.querySelectorAll('valsi'), function(valsi) {
			language_data[valsi.getAttribute('word')] = {
				type: valsi.getAttribute('type'),
				rafsi: Array.prototype.map.call(valsi.querySelectorAll('rafsi'), function(rafsi) { return rafsi.textContent; }),
				selmaho: (valsi.querySelector('selmaho') || {}).textContent,
				definition: valsi.querySelector('definition').textContent,
				notes: (valsi.querySelector('notes') || {}).textContent,
				gloss: Array.prototype.map.call(valsi.querySelectorAll('glossword'), function(gloss) { var word = gloss.getAttribute('word'); if (gloss.getAttribute('sense')) { word += ' (' + gloss.getAttribute('sense') + ')'; } return word; }),
				key: {}
			};
			Array.prototype.forEach.call(valsi.querySelectorAll('keyword'), function(key) {
				var word = key.getAttribute('word');
				if (key.getAttribute('sense')) {
					word += ' (' + key.getAttribute('sense') + ')';
				}
				language_data[valsi.getAttribute('word')].key[key.getAttribute('place')] = word;
			});
		});
		update();
	};
	xhr.send();

	function search(container, x) {
		if (typeof x === 'string') {
			var lang = language_data[x];
			var node;
			if (lang) {
				node = document.createElement('a');
				node.href = 'http://vlasisku.lojban.org/vlasisku/' + encodeURIComponent(x);
				node.textContent = lang.gloss.length ? lang.gloss[0] : (x + '?');
				node.title = lang.definition;
			} else {
				node = document.createTextNode(x + '?');
			}
			container.appendChild(node);
			container.appendChild(document.createTextNode(' '));
			//console.log(container, node, x, lang);
		} else if (typeof x[0] === 'string') {
			var node = document.createElement('span');
			node.classList.add(x[0]);
			container.appendChild(node);
			for (var i = 1; i < x.length; i++) {
				search(node, x[i]);
			}
			var matches;
			if (x[0] === 'indicator' && node.querySelector('.NAI a') && node.querySelector('.UI a') && (matches = /^attitudinal: (.*) - (.*) - (.*)\.$/.exec(node.querySelector('.UI a').title))) {
				node.querySelector('.NAI a').style.display = 'none';
				node.querySelector('.UI a').textContent = matches[3];
			}
		} else {
			var node = document.createElement('span');
			container.appendChild(node);
			for (var i = 0; i < x.length; i++) {
				search(node, x[i]);
			}
		}
	}

	function update() {
		if (!input || !result || !language_data) {
			return;
		}
		location.hash = input.value;
		result.innerHTML = '';
		search(result, camxes.parse(input.value));
	}

	document.addEventListener('DOMContentLoaded', function() {
		input = document.getElementById('input');
		result = document.getElementById('result');

		if (location.hash) {
			input.value = decodeURIComponent(location.hash.substring(1));
		}

		input.addEventListener('change', update);
		update();
	});
})();