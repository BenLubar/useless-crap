var search = location.search ? location.search.substring(1).split(/&/g) : [];

if (search.indexOf("debug") !== -1) {
	window.onerror = function(message, source, lineno, colno, error) {
		alert(lineno + ':' + colno + ':' + message);
	};
}

var apiKeys = [
	"806A2E66-D870-8E4F-BF35-840D64723775629D5348-A87D-4D4D-A90B-7BB3426B395C",
	"12D91B66-48B4-244D-BC12-C4ECF7AFC470309AB904-3A99-495D-9A4D-509D3E2CFF3C"
];
search.forEach(function(q) {
	if (q.indexOf('access_token=') === 0) {
		apiKeys = [q.substring('access_token='.length)];
	}
});

async function requestIDs(path, ids, auth) {
	if (ids.length === 0) {
		return [];
	}

	var requests = [];
	for (var i = 0; i < ids.length; i += 200) {
		requests.push(request(path + (path.indexOf("?") > -1 ? "&" : "?") + "ids=" + ids.slice(i, Math.min(i + 200, ids.length)).join(","), auth));
	}
	var results = await Promise.all(requests);
	return [].concat.apply([], results);
}

async function request(path, auth) {
	if (auth) {
		var requests = apiKeys.map(async function(apiKey) {
			var data = await request(path + (path.indexOf("?") > -1 ? "&" : "?") + "access_token=" + apiKey, false);
			if (Array.isArray(data)) {
				return data.map(function(x) {
					if (x === null) {
						return null;
					}
					if (typeof x === "number") {
						x = {data: x};
					}
					x.access_token = apiKey;
					return x;
				});
			}
			debugger;
		});
		var results = await Promise.all(requests);
		return [].concat.apply([], results);
	}

	return new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "https://api.guildwars2.com/v2/" + path);
		xhr.onload = function() {
			if (xhr.status >= 400) {
				return reject(new Error(xhr.statusText));
			}
			try {
				resolve(JSON.parse(xhr.responseText));
			} catch (ex) {
				reject(ex);
			}
		};
		xhr.onerror = function() {
			reject(new Error("an unknown error occurred"));
		};
		xhr.send();
	});
}

function formatCoin(count) {
	if (count <= 0) {
		return String(count);
	}

	var str = "";
	if (count % 100 !== 0) {
		str = (count % 100) + "c";
	}
	count = Math.floor(count / 100);
	if (count % 100 !== 0) {
		str = (count % 100) + "s" + str;
	}
	count = Math.floor(count / 100);
	if (count !== 0) {
		str = formatNumber(count) + "g" + str;
	}
	return str;
}

function formatNumber(count) {
	count = String(count);
	var i = count.indexOf('.');
	if (i === -1) {
		i = count.length;
	}
	for (i -= 3; i > 0; i -= 3) {
		count = count.slice(0, i) + ',' + count.slice(i);
	}
	return count;
}

async function init() {
	var data = {account: {}, currency: {}, item: {}, skin: {}, mini: {}, achievement: {}, upgrade: {}};

	var initRequests = [
		function() {
			return Promise.all(apiKeys.map(async function(apiKey) {
				data.account[apiKey] = await request("account?access_token=" + apiKey, false);
			}));
		},
		async function() {
			var wallet = await request("account/wallet", true);

			wallet.forEach(function(currency) {
				data.currency[currency.id] = data.currency[currency.id] || {};
				data.currency[currency.id].total = (data.currency[currency.id].total || 0) + currency.value;
				data.currency[currency.id][currency.access_token] = (data.currency[currency.id][currency.access_token] || 0) + currency.value;
			});
		},
		async function() {
			var skins = await request("account/skins", true);

			skins.forEach(function(skin) {
				data.skin[skin.data] = data.skin[skin.data] || {};
				data.skin[skin.data][skin.access_token] = true;
			});
		},
		async function() {
			var minis = await request("account/minis", true);

			minis.forEach(function(mini) {
				data.mini[mini.data] = data.mini[mini.data] || {};
				data.mini[mini.data][mini.access_token] = true;
			});
		},
		async function() {
			var achievements = await request("account/achievements", true);

			achievements.forEach(function(achievement) {
				data.achievement[achievement.id] = data.achievement[achievement.id] || {};
				data.achievement[achievement.id][achievement.access_token] = achievement;
			});
		},
		async function() {
			var bank = await request("account/bank", true);

			bank.forEach(function(item) {
				if (!item) {
					return;
				}

				data.item[item.id] = data.item[item.id] || {};
				data.item[item.id].total = (data.item[item.id].total || 0) + item.count;
				data.item[item.id][item.access_token] = (data.item[item.id][item.access_token] || 0) + item.count;
			});
		},
		async function() {
			var inventory = await request("account/inventory", true);

			inventory.forEach(function(item) {
				if (!item) {
					return;
				}

				data.item[item.id] = data.item[item.id] || {};
				data.item[item.id].total = (data.item[item.id].total || 0) + item.count;
				data.item[item.id][item.access_token] = (data.item[item.id][item.access_token] || 0) + item.count;
			});
		},
		async function() {
			var materials = await request("account/materials", true);

			materials.forEach(function(item) {
				if (!item) {
					return;
				}

				data.item[item.id] = data.item[item.id] || {};
				data.item[item.id].total = (data.item[item.id].total || 0) + item.count;
				data.item[item.id][item.access_token] = (data.item[item.id][item.access_token] || 0) + item.count;
			});
		},
		async function() {
			var characters = await request("characters?ids=all", true);

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

						data.item[item.id] = data.item[item.id] || {};
						data.item[item.id].total = (data.item[item.id].total || 0) + item.count;
						data.item[item.id][character.access_token] = (data.item[item.id][character.access_token] || 0) + item.count;
					});
				});

				character.equipment.forEach(function(item) {
					data.item[item.id] = data.item[item.id] || {};
					data.item[item.id].total = (data.item[item.id].total || 0) + item.count;
					data.item[item.id][character.access_token] = (data.item[item.id][character.access_token] || 0) + item.count;
					(item.upgrades || []).concat(item.infusions || []).forEach(function(upgrade) {
						if (upgrade) {
							var key = character.name + ':' + upgrade;
							data.upgrade[key] = (data.upgrade[key] || 0) + 1;
						}
					});
				});
			});
		}
	];

	await Promise.all(initRequests.map(function(f) {
		return f();
	}));

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
					if (type === 'currency' && id === '1') {
						count = formatCoin(count);
					} else {
						count = formatNumber(count);
					}
					dd.textContent = count;
					list.appendChild(dd);
				}
			});
		});

		return list;
	}

	var recipes = [
		{type: "Vendor", output_item_id: 12157, id: -12157, output_item_count: 10, ingredients: [{item_id: "coin", count: 80}]},
		{type: "Vendor", output_item_id: 12151, id: -12151, output_item_count: 10, ingredients: [{item_id: "coin", count: 80}]},
		{type: "Vendor", output_item_id: 12158, id: -12158, output_item_count: 10, ingredients: [{item_id: "coin", count: 80}]},
		{type: "Vendor", output_item_id: 12153, id: -12153, output_item_count: 10, ingredients: [{item_id: "coin", count: 80}]},
		{type: "Vendor", output_item_id: 12155, id: -12155, output_item_count: 10, ingredients: [{item_id: "coin", count: 80}]},
		{type: "Vendor", output_item_id: 12156, id: -12156, output_item_count: 10, ingredients: [{item_id: "coin", count: 80}]},
		{type: "Vendor", output_item_id: 12324, id: -12324, output_item_count: 10, ingredients: [{item_id: "coin", count: 80}]},
		{type: "Vendor", output_item_id: 12136, id: -12136, output_item_count: 10, ingredients: [{item_id: "coin", count: 80}]},
		{type: "Vendor", output_item_id: 12271, id: -12271, output_item_count: 10, ingredients: [{item_id: "coin", count: 80}]},
		{type: "Vendor", output_item_id: 19704, id: -19704, output_item_count: 10, ingredients: [{item_id: "coin", count: 80}]},
		{type: "Vendor", output_item_id: 19750, id: -19750, output_item_count: 10, ingredients: [{item_id: "coin", count: 160}]},
		{type: "Vendor", output_item_id: 19924, id: -19924, output_item_count: 10, ingredients: [{item_id: "coin", count: 480}]},
		{type: "Vendor", output_item_id: 19792, id: -19792, output_item_count: 10, ingredients: [{item_id: "coin", count: 80}]},
		{type: "Vendor", output_item_id: 19789, id: -19789, output_item_count: 10, ingredients: [{item_id: "coin", count: 160}]},
		{type: "Vendor", output_item_id: 19794, id: -19794, output_item_count: 10, ingredients: [{item_id: "coin", count: 240}]},
		{type: "Vendor", output_item_id: 19793, id: -19793, output_item_count: 10, ingredients: [{item_id: "coin", count: 320}]},
		{type: "Vendor", output_item_id: 19791, id: -19791, output_item_count: 10, ingredients: [{item_id: "coin", count: 480}]},
		{type: "Vendor", output_item_id: 19790, id: -19790, output_item_count: 10, ingredients: [{item_id: "coin", count: 640}]},
		{type: "Vendor", output_item_id: 46747, id: -46747, output_item_count: 10, ingredients: [{item_id: "coin", count: 1496}]},
		{type: "Vendor", output_item_id: 13010, id: -13010, output_item_count: 1, ingredients: [{item_id: "coin", count: 496}]},
		{type: "Vendor", output_item_id: 13006, id: -13006, output_item_count: 1, ingredients: [{item_id: "coin", count: 1480}]},
		{type: "Vendor", output_item_id: 13007, id: -13007, output_item_count: 1, ingredients: [{item_id: "coin", count: 5000}]},
		{type: "Vendor", output_item_id: 13008, id: -13008, output_item_count: 1, ingredients: [{item_id: "coin", count: 20000}]},
		{type: "Vendor", output_item_id: 13009, id: -13009, output_item_count: 1, ingredients: [{item_id: "coin", count: 100000}]},
		{type: "Vendor", output_item_id: 62942, id: -62942, output_item_count: 1, ingredients: [{item_id: "coin", count: 8}]},
		{type: "Vendor", output_item_id: 76839, id: -76839, output_item_count: 1, ingredients: [{item_id: "coin", count: 56}]},
		{type: "Vendor", output_item_id: 23001, id: -23001, output_item_count: 1, ingredients: [{item_id: "coin", count: 400}]},
	];
	var recipeForItem = {
		12157: {type: "Vendor", output_item_id: 12157, id: -12157, output_item_count: 10, ingredients: [{item_id: "coin", count: 80}]},
		12151: {type: "Vendor", output_item_id: 12151, id: -12151, output_item_count: 10, ingredients: [{item_id: "coin", count: 80}]},
		12158: {type: "Vendor", output_item_id: 12158, id: -12158, output_item_count: 10, ingredients: [{item_id: "coin", count: 80}]},
		12153: {type: "Vendor", output_item_id: 12153, id: -12153, output_item_count: 10, ingredients: [{item_id: "coin", count: 80}]},
		12155: {type: "Vendor", output_item_id: 12155, id: -12155, output_item_count: 10, ingredients: [{item_id: "coin", count: 80}]},
		12156: {type: "Vendor", output_item_id: 12156, id: -12156, output_item_count: 10, ingredients: [{item_id: "coin", count: 80}]},
		12324: {type: "Vendor", output_item_id: 12324, id: -12324, output_item_count: 10, ingredients: [{item_id: "coin", count: 80}]},
		12136: {type: "Vendor", output_item_id: 12136, id: -12136, output_item_count: 10, ingredients: [{item_id: "coin", count: 80}]},
		12271: {type: "Vendor", output_item_id: 12271, id: -12271, output_item_count: 10, ingredients: [{item_id: "coin", count: 80}]},
		19704: {type: "Vendor", output_item_id: 19704, id: -19704, output_item_count: 10, ingredients: [{item_id: "coin", count: 80}]},
		19750: {type: "Vendor", output_item_id: 19750, id: -19750, output_item_count: 10, ingredients: [{item_id: "coin", count: 160}]},
		19924: {type: "Vendor", output_item_id: 19924, id: -19924, output_item_count: 10, ingredients: [{item_id: "coin", count: 480}]},
		19792: {type: "Vendor", output_item_id: 19792, id: -19792, output_item_count: 10, ingredients: [{item_id: "coin", count: 80}]},
		19789: {type: "Vendor", output_item_id: 19789, id: -19789, output_item_count: 10, ingredients: [{item_id: "coin", count: 160}]},
		19794: {type: "Vendor", output_item_id: 19794, id: -19794, output_item_count: 10, ingredients: [{item_id: "coin", count: 240}]},
		19793: {type: "Vendor", output_item_id: 19793, id: -19793, output_item_count: 10, ingredients: [{item_id: "coin", count: 320}]},
		19791: {type: "Vendor", output_item_id: 19791, id: -19791, output_item_count: 10, ingredients: [{item_id: "coin", count: 480}]},
		19790: {type: "Vendor", output_item_id: 19790, id: -19790, output_item_count: 10, ingredients: [{item_id: "coin", count: 640}]},
		46747: {type: "Vendor", output_item_id: 46747, id: -46747, output_item_count: 10, ingredients: [{item_id: "coin", count: 1496}]},
		13010: {type: "Vendor", output_item_id: 13010, id: -13010, output_item_count: 1, ingredients: [{item_id: "coin", count: 496}]},
		13006: {type: "Vendor", output_item_id: 13006, id: -13006, output_item_count: 1, ingredients: [{item_id: "coin", count: 1480}]},
		13007: {type: "Vendor", output_item_id: 13007, id: -13007, output_item_count: 1, ingredients: [{item_id: "coin", count: 5000}]},
		13008: {type: "Vendor", output_item_id: 13008, id: -13008, output_item_count: 1, ingredients: [{item_id: "coin", count: 20000}]},
		13009: {type: "Vendor", output_item_id: 13009, id: -13009, output_item_count: 1, ingredients: [{item_id: "coin", count: 100000}]},
		62942: {type: "Vendor", output_item_id: 62942, id: -62942, output_item_count: 1, ingredients: [{item_id: "coin", count: 8}]},
		76839: {type: "Vendor", output_item_id: 76839, id: -76839, output_item_count: 1, ingredients: [{item_id: "coin", count: 56}]},
		23001: {type: "Vendor", output_item_id: 23001, id: -23001, output_item_count: 1, ingredients: [{item_id: "coin", count: 400}]},
	};
	var recipeItems = [];
	for (;;) {
		var recipeIDs = [];
		await Promise.all([].slice.call(document.querySelectorAll("[data-use-recipe]")).map(async function(goal) {
			if (!goal.getAttribute("data-use-recipe")) {
				if (!goal.getAttribute("data-item-goal")) {
					throw new Error("missing data-item-goal");
				}
				if (recipeForItem[goal.getAttribute("data-item-goal")]) {
					goal.setAttribute("data-use-recipe", recipeForItem[goal.getAttribute("data-item-goal")].id);
				} else {
					var ids = await request("recipes/search?output=" + goal.getAttribute("data-item-goal"), false);
					if (ids.length === 0) {
						goal.removeAttribute("data-use-recipe");
						if (!goal.getAttribute("data-account-key")) {
							goal.setAttribute("data-use-tp", "");
						}
						return;
					}
					goal.setAttribute("data-use-recipe", ids[0]); // TODO: cheapest recipe?
				}
			}
			recipeIDs.push(parseInt(goal.getAttribute("data-use-recipe"), 10));
		}));
		if (!recipeIDs.length) {
			break;
		}

		// make unique
		recipeIDs = recipeIDs.filter(function(v, i, a) {
			return a.indexOf(v) === i && !recipes.some(function(r) {
				return r.id === v;
			});
		});

		var newRecipes = await requestIDs("recipes", recipeIDs, false);
		newRecipes.forEach(function(r) {
			recipeForItem[r.output_item_id] = recipeForItem[r.output_item_id] || r;
		});

		var ingredientIDs = newRecipes.flatMap(function(r) {
			return r.ingredients.map(function(i) {
				return i.item_id;
			});
		}).filter(function(v, i, a) {
			return v !== "coin" && a.indexOf(v) === i && !recipeItems.some(function(item) {
				return item.id === v;
			});
		});

		recipes = recipes.concat(newRecipes);
		recipeItems = recipeItems.concat(await requestIDs("items", ingredientIDs, false));

		[].slice.call(document.querySelectorAll("[data-use-recipe]")).forEach(function(goal) {
			var recipe = recipes.find(function(r) {
				return r.id === parseInt(goal.getAttribute("data-use-recipe"), 10);
			});

			goal.removeAttribute("data-use-recipe");

			goal.parentNode.parentNode.setAttribute("data-batch-size", recipe.output_item_count);

			var ul = document.createElement("ul");
			goal.parentNode.parentNode.appendChild(ul);

			recipe.ingredients.forEach(function(ingredient) {
				var li = document.createElement("li");
				ul.appendChild(li);
				var a = document.createElement("a");
				li.appendChild(a);
				var img = document.createElement("img");
				a.appendChild(img);
				a.appendChild(document.createTextNode(" "));
				var progress = document.createElement("progress");
				a.appendChild(progress);
				progress.value = 0;
				progress.max = ingredient.count / recipe.output_item_count;

				if (ingredient.item_id === "coin") {
					a.href = "https://wiki.guildwars2.com/wiki/Coin";
					img.src = "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png";
					img.alt = "Coin";
					img.title = "Coin";
					progress.setAttribute("data-currency-goal", "1");
					return;
				}

				var item = recipeItems.find(function(item) { return item.id === ingredient.item_id; });

				a.href = "https://wiki.guildwars2.com/wiki/Special:Search?search=" + encodeURIComponent(item.chat_link) + "&go=Go";
				img.src = item.icon;
				img.alt = item.name;
				img.title = item.name;
				progress.setAttribute("data-item-goal", item.id);
				if (item.flags.indexOf("AccountBound") !== -1) {
					progress.setAttribute("data-account-key", goal.getAttribute("data-account-key") || "inherit");
				}
				progress.setAttribute("data-use-recipe", "");
			});
		});
	}

	var tradingPostListings = {};

	for (var details of document.querySelectorAll("body > details")) {
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
					var item = data.item[goal.getAttribute('data-item-goal')];
					if (!item) {
						goal.value = 0;
					} else {
						var token = goal.getAttribute('data-account-key');
						if (token === "inherit") {
							if (goal.parentNode.parentNode.parentNode.parentNode.querySelector(":scope > a > progress[data-account-key]")) {
								debugger;
							}

							var hasToken = goal.parentNode.parentNode.parentNode.querySelectorAll(":scope > li > a > progress[data-account-key]");
							if (hasToken.length === 1 && hasToken[0] === goal) {
								token = null;
							} else {
								debugger;
							}
						}

						if (!token) {
							goal.value = 0;
							var remaining = goal.max;
							apiKeys.forEach(function(apiKey) {
								var count = Math.min(item[apiKey] || 0, remaining);
								remaining -= count;
								goal.value += count;
								if (count !== 0) {
									goal.parentNode.firstElementChild.title += " (" + formatNumber(count) + " from " + data.account[apiKey].name + ")";
									item[apiKey] -= count;
									item.total -= count;
								}
							});
						} else {
							var count = Math.min(item[token] || 0, goal.max);
							goal.value = count;
							goal.parentNode.firstElementChild.title += " (" + data.account[token].name + ")";
							if (count !== 0) {
								item[token] -= count;
								item.total -= count;
							}
						}
					}
				} else if (goal.getAttribute('data-upgrade-goal')) {
					var count = Math.min(data.upgrade[goal.getAttribute('data-upgrade-goal')] || 0, goal.max);
					goal.value = count;
					data.upgrade[goal.getAttribute('data-upgrade-goal')] -= count;
				} else if (goal.getAttribute('data-currency-goal')) {
					var currency = data.currency[goal.getAttribute('data-currency-goal')];
					var format = goal.getAttribute('data-currency-goal') === "1" ? formatCoin : formatNumber;
					if (!currency) {
						goal.value = 0;
					} else {
						var token = goal.getAttribute('data-account-key');
						if (token === "inherit") {
							if (goal.parentNode.parentNode.parentNode.parentNode.querySelector(":scope > a > progress[data-account-key]")) {
								debugger;
							}

							var hasToken = goal.parentNode.parentNode.parentNode.querySelectorAll(":scope > li > a > progress[data-account-key]");
							if (hasToken.length === 1 && hasToken[0] === goal) {
								token = null;
							} else {
								debugger;
							}
						}

						if (!token) {
							goal.value = 0;
							var remaining = goal.max;
							apiKeys.forEach(function(apiKey) {
								var count = Math.min(currency[apiKey] || 0, remaining);
								remaining -= count;
								goal.value += count;
								if (count !== 0) {
									goal.parentNode.firstElementChild.title += " (" + format(count) + " from " + data.account[apiKey].name + ")";
									currency[apiKey] -= count;
									currency.total -= count;
								}
							});
						} else {
							var count = Math.min(currency[token] || 0, goal.max);
							goal.value = count;
							goal.parentNode.firstElementChild.title += " (" + data.account[token].name + ")";
							if (count !== 0) {
								currency[token] -= count;
								currency.total -= count;
							}
						}
					}
					var token = goal.getAttribute('data-account-key') || apiKeys[0];
					var count = Math.min(data.currency[goal.getAttribute('data-currency-goal')][token] || 0, goal.max);
					goal.value = count;
					if (count !== 0) {
						data.currency[goal.getAttribute('data-currency-goal')][token] -= count;
						data.currency[goal.getAttribute('data-currency-goal')].total -= count;
					}
				} else if (goal.getAttribute('data-skin-goal')) {
					var token = goal.getAttribute('data-account-key') || apiKeys[0];
					goal.max = 1;
					goal.value = data.skin[goal.getAttribute('data-skin-goal')] && data.skin[goal.getAttribute('data-skin-goal')][token] ? 1 : 0;
				} else if (goal.getAttribute('data-mini-goal')) {
					goal.max = 1;
					goal.value = data.mini[goal.getAttribute('data-mini-goal')] && data.mini[goal.getAttribute('data-mini-goal')][token] ? 1 : 0;
				} else if (goal.getAttribute('data-achievement-goal')) {
					var token = goal.getAttribute('data-account-key') || apiKeys[0];
					var achievement = data.achievement[goal.getAttribute('data-achievement-goal')];
					if (achievement) {
						achievement = achievement[token];
					}
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
					var token = goal.getAttribute('data-account-key') || apiKeys[0];
					var achievement = data.achievement[goal.parentNode.parentNode.parentNode.parentNode.querySelector("a > progress").getAttribute('data-achievement-goal')];
					if (achievement) {
						achievement = achievement[token];
					}
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
				} else if (goal.getAttribute("data-currency-goal") === "1") {
					goal.parentNode.title = goal.parentNode.firstElementChild.title + ' (' + formatCoin(goal.max - goal.value) + ' remaining)';
					recurse(goal.parentNode.parentNode, selector + " + ul > li:not(.complete) > a");
				} else {
					goal.parentNode.title = goal.parentNode.firstElementChild.title + ' (' + formatNumber(goal.max - goal.value) + ' remaining)';
					recurse(goal.parentNode.parentNode, selector + " + ul > li:not(.complete) > a");
				}
			});

			return [completed, goals.length];
		}
		recurse(details, "body > details > ul > li:not(.complete) > a");

		var useTP = [].slice.call(details.querySelectorAll("li:not(.complete) > a > [data-use-tp]"));

		var tpItemIDs = useTP.map(function(goal) {
			return parseInt(goal.getAttribute("data-item-goal"), 10);
		});

		tpItemIDs.filter(function(v, i, a) {
			return a.indexOf(v) === i && !Object.hasOwnProperty.call(tradingPostListings, v);
		});

		for (var item of await requestIDs("commerce/listings", tpItemIDs, false)) {
			tradingPostListings[item.id] = item.sells;
		}

		useTP.forEach(function(goal) {
			var quantity = goal.max - goal.value;
			var listings = tradingPostListings[goal.getAttribute("data-item-goal")] || [];
			var ul = document.createElement("ul");
			goal.parentNode.parentNode.appendChild(ul);
			ul.setAttribute("data-tp-prices", "");
			listings.forEach(function(price) {
				if (quantity <= 0) {
					return;
				}

				var count = Math.min(quantity, price.quantity);
				price.quantity -= count;
				quantity -= count;
				var li = document.createElement("li");
				ul.appendChild(li);
				var a = document.createElement("a");
				li.appendChild(a);
				var img = document.createElement("img");
				a.appendChild(img);
				img.src = "https://wiki.guildwars2.com/images/b/be/Black_Lion_Trading_Company_trading_post_icon.png";
				img.alt = "Trading Post";
				img.title = "Trading Post (" + formatNumber(price.listings) + " listing" + (price.listings === 1 ? "" : "s") + " at " + formatCoin(price.unit_price) + ")";
				a.appendChild(document.createTextNode(" "));
				var progress = document.createElement("progress");
				a.appendChild(progress);
				progress.value = 0;
				progress.max = count;
				a.appendChild(document.createTextNode(" " + formatCoin(price.unit_price)));
				var ul2 = document.createElement("ul");
				li.appendChild(ul2);
				var li2 = document.createElement("li");
				ul2.appendChild(li2);
				var a2 = document.createElement("a");
				li2.appendChild(a2);
				a2.href = "https://wiki.guildwars2.com/wiki/Coin";
				var img2 = document.createElement("img");
				a2.appendChild(img2);
				img2.src = "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png";
				img2.alt = "Coin";
				img2.title = "Coin";
				a2.appendChild(document.createTextNode(" "));
				var progress2 = document.createElement("progress");
				a2.appendChild(progress2);
				progress2.value = 0;
				progress2.max = price.unit_price;
				progress2.setAttribute("data-currency-goal", "1");
			});
		});
		recurse(details, "[data-tp-prices] > li:not(.complete) > a");

		details.appendChild(listRemaining(details));
	}

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

if (!window.skipInit) {
	init();
}
