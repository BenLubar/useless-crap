var search = location.search ? location.search.substring(1).split(/&/g) : [];

if (search.indexOf("debug") !== -1) {
	window.onerror = function(message, source, lineno, colno, error) {
		alert(lineno + ':' + colno + ':' + message);
	};
}

var apiKey = "806A2E66-D870-8E4F-BF35-840D64723775629D5348-A87D-4D4D-A90B-7BB3426B395C";
search.forEach(function(q) {
	if (q.indexOf('access_token=') === 0) {
		apiKey = q.substring('access_token='.length);
	}
});

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

function init() {
	var data = {currency: {}, item: {}, skin: {}, mini: {}, achievement: {}, upgrade: {}}, waiting = 8;

	function done() {
		waiting--;
		if (waiting !== 0) {
			return;
		}

		function listRemaining(details) {
			var list = document.createElement('dl');
			var rawMaterials = {};
			['item', 'currency'].forEach(function(type) {
				[].slice.call(details.querySelectorAll('[data-' + type + '-goal]')).forEach(function(g) {
					var id = g.getAttribute('data-' + type + '-goal');

					if (rawMaterials[type + ':' + id])
						return;
					rawMaterials[type + ':' + id] = true;

					var seenAchievements = {};

					var count = [].slice.call(details.querySelectorAll('[data-' + type + '-goal="' + id + '"]')).map(function(el) {
						if (el.parentNode.nextElementSibling) {
							return 0;
						}
						for (var p = el; p != document.body; p = p.parentNode) {
							if (p.classList.contains('complete')) {
								return 0;
							}
							if (p.nodeName === 'LI') {
								var achievement = p.firstElementChild.firstElementChild.nextElementSibling.getAttribute('data-achievement-goal');
								if (achievement) {
									if (seenAchievements[achievement]) {
										return 0;
									}
									seenAchievements[achievement] = true;
								}
							}
						}
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
						count = count.toString();
						var i = count.length;
						if (type === 'currency' && id === '1') {
							count += 'c';
							i -= 2;
							if (i > 0) {
								count = count.slice(0, i) + 's' + count.slice(i);
							}
							i -= 2;
							if (i > 0) {
								count = count.slice(0, i) + 'g' + count.slice(i);
							}
						}
						for (i -= 3; i > 0; i -= 3) {
							count = count.slice(0, i) + ',' + count.slice(i);
						}
						dd.textContent = count;
						list.appendChild(dd);
					}
				});
			});

			return list;
		}

		[].slice.call(document.querySelectorAll("body > details")).forEach(function(details) {
			function recurse(parent, selector) {
				var completed = 0;
				var goals = [].slice.call(parent.querySelectorAll(selector + " > progress"));
				goals.forEach(function(goal) {
					if (parent !== details) {
						var parentProgress = parent.querySelector("a > progress");
						var batch = goal.parentNode.parentNode.parentNode.getAttribute('data-batch-size') || 1;
						goal.max *= Math.ceil((parentProgress.max - parentProgress.value) / batch) * batch;
						goal.setAttribute('max', goal.max.toString()); // fix "1e+6"
					}

					if (goal.getAttribute('data-item-goal')) {
						var count = Math.min(data.item[goal.getAttribute('data-item-goal')] || 0, goal.max);
						goal.value = count;
						data.item[goal.getAttribute('data-item-goal')] -= count;
					} else if (goal.getAttribute('data-upgrade-goal')) {
						var count = Math.min(data.upgrade[goal.getAttribute('data-upgrade-goal')] || 0, goal.max);
						goal.value = count;
						data.upgrade[goal.getAttribute('data-upgrade-goal')] -= count;
					} else if (goal.getAttribute('data-currency-goal')) {
						var count = Math.min(data.currency[goal.getAttribute('data-currency-goal')] || 0, goal.max);
						goal.value = count;
						data.currency[goal.getAttribute('data-currency-goal')] -= count;
					} else if (goal.getAttribute('data-skin-goal')) {
						goal.max = 1;
						goal.value = data.skin[goal.getAttribute('data-skin-goal')] ? 1 : 0;
					} else if (goal.getAttribute('data-mini-goal')) {
						goal.max = 1;
						goal.value = data.mini[goal.getAttribute('data-mini-goal')] ? 1 : 0;
					} else if (goal.getAttribute('data-achievement-goal')) {
						var achievement = data.achievement[goal.getAttribute('data-achievement-goal')];
						goal.max = achievement ? achievement.max : 1;
						goal.value = achievement ? achievement.current : 0;
						if (achievement && achievement.done) {
							goal.parentNode.parentNode.classList.add('complete');
							completed++;
						} else {
							recurse(goal.parentNode.parentNode, selector + " + ul > li:not(.complete) > a");
						}
						goal.parentNode.title = goal.parentNode.firstElementChild.title;
						return;
					} else if (goal.getAttribute('data-achievement-bit')) {
						var achievement = data.achievement[goal.parentNode.parentNode.parentNode.parentNode.querySelector("a > progress").getAttribute('data-achievement-goal')];
						goal.max = 1;
						if (achievement && achievement.bits.indexOf(+goal.getAttribute('data-achievement-bit')) !== -1) {
							goal.value = 1;
							goal.parentNode.parentNode.classList.add('complete');
							completed++;
						} else {
							goal.value = 0;
							recurse(goal.parentNode.parentNode, selector + " + ul > li:not(.complete) > a");
						}
						goal.parentNode.title = goal.parentNode.firstElementChild.title;
						return;
					} else if (goal.getAttribute('data-generic-goal') !== null) {
						goal.max = 1;
						var generic = recurse(goal.parentNode.parentNode, selector + " + ul > li:not(.complete) > a");
						goal.value = generic[0];
						goal.max = generic[1];
						if (goal.value === goal.max) {
							goal.parentNode.parentNode.classList.add('complete');
							completed++;
						}
						goal.parentNode.title = goal.parentNode.firstElementChild.title;
						return;
					}

					goal.setAttribute('value', goal.value.toString()); // fix "1e+6"

					if (goal.value === goal.max) {
						goal.parentNode.parentNode.classList.add('complete');
						goal.parentNode.title = goal.parentNode.firstElementChild.title;
						completed++;
					} else {
						goal.parentNode.title = goal.parentNode.firstElementChild.title + ' (' + (goal.max - goal.value) + ' remaining)';
						recurse(goal.parentNode.parentNode, selector + " + ul > li:not(.complete) > a");
					}
				});

				return [completed, goals.length];
			}
			recurse(details, "body > details > ul > li:not(.complete) > a");

			details.appendChild(listRemaining(details));
		});

		var remaining = listRemaining(document.body);
		if (remaining.children.length) {
			var details = document.createElement('details');
			var summary = document.createElement('summary');
			var h1 = document.createElement('h1');
			h1.appendChild(document.createTextNode('Total Remaining Resources'));
			summary.appendChild(h1);
			details.appendChild(summary);
			remaining.id = 'total_remaining_resources';
			details.appendChild(remaining);
			document.body.appendChild(details);
		}

		var el = document.querySelector(location.hash ? location.hash + ', [name="' + location.hash.replace(/\W/g, '') + '"]' : 'body > details > ul > li:not(.complete)');
		if (el) {
			if (el.scrollIntoViewIfNeeded) {
				el.scrollIntoViewIfNeeded();
			} else {
				el.scrollIntoView();
			}
			for (; el && el !== document.body; el = el.parentNode) {
				if (el.nodeName == "DETAILS") {
					el.open = true;
					break;
				}
			}
		}
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

	request("account/minis", function(err, minis) {
		if (err) {
			console.log("minis:", err);
			return;
		}

		minis.forEach(function(mini) {
			data.mini[mini] = true;
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
				(item.upgrades || []).concat(item.infusions || []).forEach(function(upgrade) {
					if (upgrade) {
						var key = character.name + ':' + upgrade;
						data.upgrade[key] = (data.upgrade[key] || 0) + 1;
					}
				});
			});
		});

		done();
	});
}

if (!window.skipInit) {
	init();
}
