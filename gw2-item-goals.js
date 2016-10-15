if (location.search === "?debug") {
	window.onerror = function(message, source, lineno, colno, error) {
		alert(lineno + ':' + colno + ':' + message);
	};
}

(function() {
	var apiKey = "806A2E66-D870-8E4F-BF35-840D64723775629D5348-A87D-4D4D-A90B-7BB3426B395C";
	function request(path, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "https://api.guildwars2.com/v2/" + path + (path.indexOf("?") > -1 ? "&" : "?") + "access_token=" + apiKey);
		xhr.onload = function() {
			if (xhr.status >= 400) {
				return callback(new Error(xhr.statusText));
			}
			callback(null, JSON.parse(xhr.responseText));
		};
		xhr.onerror = function() {
			callback(new Error("an unknown error occurred"));
		};
		xhr.send();
	}

	var data = {currency: {}, item: {}, skin: {}, achievement: {}}, waiting = 7;

	function done() {
		waiting--;
		if (waiting !== 0) {
			return;
		}

		[].slice.call(document.querySelectorAll("body > details")).forEach(function(details) {
			for (var selector = "body > details > ul > li:not(.complete) > a"; ; selector += " + ul > li:not(.complete) > a") {
				var elements = [].slice.call(details.querySelectorAll(selector + " > progress"));
				if (!elements.length) {
					break;
				}

				elements.forEach(function(goal) {
					if (goal.parentNode.parentNode.parentNode.parentNode.parentNode !== document.body) {
						var parent = goal.parentNode.parentNode.parentNode.parentNode.querySelector("a > progress");
						goal.max *= parent.max - parent.value;
					}

					if (goal.getAttribute('data-item-goal')) {
						var count = Math.min(data.item[goal.getAttribute('data-item-goal')] || 0, goal.max);
						goal.value = count;
						data.item[goal.getAttribute('data-item-goal')] -= count;
					} else if (goal.getAttribute('data-currency-goal')) {
						var count = Math.min(data.currency[goal.getAttribute('data-currency-goal')] || 0, goal.max);
						goal.value = count;
						data.currency[goal.getAttribute('data-currency-goal')] -= count;
					} else if (goal.getAttribute('data-skin-goal')) {
						goal.max = 1;
						goal.value = data.skin[goal.getAttribute('data-skin-goal')] ? 1 : 0;
					} else if (goal.getAttribute('data-achievement-goal')) {
						var achievement = data.achievement[goal.getAttribute('data-achievement-goal')];
						goal.max = achievement ? achievement.max : 1;
						goal.value = achievement ? achievement.current : 0;
						if (achievement && achievement.done) {
							goal.parentNode.parentNode.classList.add('complete');
						}
						goal.parentNode.title = goal.parentNode.firstElementChild.title;
						return;
					} else if (goal.getAttribute('data-achievement-bit')) {
						var achievement = data.achievement[goal.parentNode.parentNode.parentNode.parentNode.querySelector("a > progress").getAttribute('data-achievement-goal')];
						goal.max = 1;
						if (achievement && achievement.bits.indexOf(+goal.getAttribute('data-achievement-bit')) !== -1) {
							goal.value = 1;
							goal.parentNode.parentNode.classList.add('complete');
						} else {
							goal.value = 0;
						}
						goal.parentNode.title = goal.parentNode.firstElementChild.title;
						return;
					}

					if (goal.value === goal.max) {
						goal.parentNode.parentNode.classList.add('complete');
						goal.parentNode.title = goal.parentNode.firstElementChild.title;
					} else {
						goal.parentNode.title = goal.parentNode.firstElementChild.title + ' (' + (goal.max - goal.value) + ' remaining)';
					}
				});
			}

			var list = document.createElement('dl');
			var rawMaterials = {};
			['item', 'currency'].forEach(function(type) {
				[].slice.call(details.querySelectorAll('[data-' + type + '-goal]')).forEach(function(g) {
					var id = g.getAttribute('data-' + type + '-goal');

					if (rawMaterials[type + ':' + id])
						return;
					rawMaterials[type + ':' + id] = true;

					var count = [].slice.call(details.querySelectorAll('[data-' + type + '-goal="' + id + '"]')).map(function(el) {
						if (el.parentNode.nextElementSibling)
							return 0;
						for (var p = el; p != document.body; p = p.parentNode)
							if (p.classList.contains('complete'))
								return 0;
						return el.max - el.value;
					}).reduce(function(a, b) {
						return a + b;
					});

					if (count > 0) {
						var icon = document.createElement('img');
						icon.src = g.parentNode.firstElementChild.src;
						icon.alt = '';
						var link = document.createElement('a');
						link.href = g.parentNode.href;
						link.appendChild(icon);
						link.appendChild(document.createTextNode(' ' + g.parentNode.firstElementChild.title));
						var dt = document.createElement('dt');
						dt.appendChild(link);
						list.appendChild(dt);
						var dd = document.createElement('dd');
						dd.textContent = count;
						list.appendChild(dd);
					}
				});
			});
			details.appendChild(list);
		});
	}

	request("account/wallet", function(err, wallet) {
		if (err) {
			console.log("wallet:", err);
			return;
		}

		wallet.forEach(function(currency) {
			data.currency[currency.id] = (data.currency[currency.id] || 0) + currency.value;
		});

		done();
	});

	request("account/skins", function(err, skins) {
		if (err) {
			console.log("skins:", err);
			return;
		}

		skins.forEach(function(skin) {
			data.skin[skin] = true;
		});

		done();
	});

	request("account/achievements", function(err, achievements) {
		if (err) {
			console.log("achievements:", err);
			return;
		}

		achievements.forEach(function(achievement) {
			data.achievement[achievement.id] = achievement;
		});

		done();
	});

	function doneItems(err, items) {
		if (err) {
			console.log("items:", err);
			return;
		}

		items.forEach(function(item) {
			if (!item) {
				return;
			}

			data.item[item.id] = (data.item[item.id] || 0) + item.count;
		});

		done();
	}

	request("account/bank", doneItems);
	request("account/inventory", doneItems);
	request("account/materials", doneItems);

	request("characters?ids=all", function(err, characters) {
		if (err) {
			console.log("characters:", err);
			return;
		}

		characters.forEach(function(character) {
			character.bags.forEach(function(bag) {
				if (!bag) {
					return;
				}
				data.item[bag.id] = (data.item[bag.id] || 0) + 1;

				bag.inventory.forEach(function(item) {
					if (!item) {
						return;
					}

					data.item[item.id] = (data.item[item.id] || 0) + item.count;
				});
			});

			character.equipment.forEach(function(item) {
				data.item[item.id] = (data.item[item.id] || 0) + 1;
			});
		});

		done();
	});

	if (location.hash) {
		for (var el = document.querySelector(location.hash + ', [name="' + location.hash.substring(1) + '"]'); el && el !== document.body; el = el.parentNode) {
			if (el.nodeName == "DETAILS") {
				el.open = true;
				break;
			}
		}
	}
})();