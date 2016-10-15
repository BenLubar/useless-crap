var legendaries = [30684,30685,30686,30687,30688,30689,30690,30691,30692,30693,30694,30695,30696,30697,30698,30699,30700,30701,30702,71383,72713,76158,78556,79562];

function request(path, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', (path.indexOf('http') === 0 ? '' : 'https://api.guildwars2.com/v2/') + path);
	xhr.onload = function() {
		if (xhr.status >= 400) {
			return callback(new Error(xhr.statusText));
		}
		callback(null, JSON.parse(xhr.responseText));
	};
	xhr.onerror = function() {
		callback(new Error('an unknown error occurred'));
	};
	xhr.send();
}

function cachedByID(name) {
	var cache = {};

	return function(ids, callback) {
		function done() {
			callback(null, ids.map(function(id) { return cache[id]; }));
		}

		var filteredIDs = ids.filter(function(id) { return !(id in cache); });
		if (filteredIDs.length === 0) {
			return setTimeout(done, 1); // don't run on the same stack because JavaScript is a callback-based language with a very small stack limit
		}

		request(name + '?ids=' + filteredIDs.join(','), function(err, items) {
			if (err) {
				return callback(err);
			}
			items.forEach(function(item) {
				cache[item.id] = item;
			});
			done();
		});
	};
}

var getItem = cachedByID('items');
var getCurrency = cachedByID('currencies');
var getAchievement = cachedByID('achievements');
var getMini = cachedByID('minis');
var getRealRecipe = cachedByID('recipes');

var recipesOutputCache = {};

function getRealRecipesByOutput(itemID, callback) {
	if (itemID in recipesOutputCache) {
		return callback(null, recipesOutputCache[itemID]);
	}

	request('recipes/search?output=' + itemID, function(err, ids) {
		if (err) {
			return callback(err);
		}

		recipesOutputCache[itemID] = ids;
		callback(null, ids);
	});
}

var output = ['<!DOCTYPE html>\n<html>\n<head>\n\t<title>GW2 Legendary Item Goals</title>\n\t<style>\n\t\timg {\n\t\t\twidth: 24px;\n\t\t\theight: 24px;\n\t\t\tvertical-align: middle;\n\t\t}\n\t\ta {\n\t\t\ttext-decoration: none;\n\t\t}\n\t\t.complete ul {\n\t\t\tdisplay: none;\n\t\t}\n\t\tsummary h1 {\n\t\t\tdisplay: inline-block;\n\t\t}\n\t</style>\n</head>\n<body>'];

request('http://gw2profits.com/json/v3', function(err, forgeRecipes) {
	if (err) {
		throw err;
	}

	var fakeRecipes = {};
	forgeRecipes.forEach(function(r) {
		if (r.output_item_count_range || (r.output_item_count !== 1 && r.disciplines[0] === 'Salvage')) {
			return;
		}

		if (r.ingredients.some(function(i) { return i.item_id === r.output_item_id; })) {
			return;
		}

		fakeRecipes[r.output_item_id] = fakeRecipes[r.output_item_id] || [];
		fakeRecipes[r.output_item_id].push(r);
	});

	var getRecipesFor = function(itemID, callback) {
		getRealRecipesByOutput(itemID, function(err, realRecipeIDs) {
			if (err) {
				return callback(err);
			}

			getRealRecipe(realRecipeIDs, function(err, realRecipes) {
				if (err) {
					return callback(err);
				}

				callback(null, realRecipes.concat(fakeRecipes[itemID] || []));
			});
		});
	};

	function addRecipe(recipe, indent, done) {
		if (recipe.achievement_id) {
			return getAchievement([recipe.achievement_id], function(err, achievements) {
				if (err) {
					throw err;
				}

				addAchievement(achievements[0], indent, done);
			});
		}

		var outputCount = recipe.output_item_count;
		var ingredients = recipe.ingredients.slice(0);

		output.push(indent);
		output.push('<ul>');
		var nextIndent = indent + '\t';
		function next() {
			if (ingredients.length === 0) {
				output.push(indent);
				output.push('</ul>');
				return done();
			}

			var ingredient = ingredients.shift();
			addItem(ingredient.item_id, nextIndent, ingredient.count / outputCount, next);
		}
		next();
	}

	function addAchievement(achievement, indent, done) {
		var bits = achievement.bits;
		var i = -1;

		output.push(indent);
		output.push('<ul>');
		var nextIndent = indent + '\t';
		function next() {
			i++;
			if (!bits || bits.length <= i) {
				output.push(indent);
				output.push('</ul>');
				return done();
			}

			var bit = bits[i];
			switch (bit.type) {
				case 'Item':
					addItem(bit.id, nextIndent, 1, next, '" data-achievement-bit="' + i);
					break;
				case "Minipet":
					getMini([bit.id], function(err, minis) {
						if (err) {
							throw err;
						}

						addItem(minis[0].item_id, nextIndent, 1, next, '" data-achievement-bit="' + i);
					});
					break;
				default:
					throw bit.type;
			}
		}
		next();
	}

	function addItem(itemID, indent, count, done, customGoal) {
		if (itemID < 0) {
			return addCurrency(-itemID, indent, count, done);
		}

		getItem([itemID], function(err, items) {
			if (err) {
				throw err;
			}

			getRecipesFor(itemID, function(err, recipes) {
				if (err) {
					throw err;
				}

				var item = items[0];
				var recipe = recipes[0];

				if (recipe && recipe.achievement_id && item.flags.indexOf('AccountBound') === -1) {
					// assume achievements that reward tradable items are incorrect (see: glob of ectoplasm)
					recipe = null;
				}
				if (recipe && recipe.disciplines[0] === 'Mystic Forge' && item.type === 'CraftingMaterial' && item.rarity === 'Ascended') {
					// assume mystic forge on ascended items is incorrect (see: condensed/coagulated/crystallized mists essence)
					recipe = null;
				}

				var nextIndent = indent + '\t';

				output.push(indent);
				output.push('<li>');
				output.push(nextIndent);
				output.push('<a href="https://wiki.guildwars2.com/wiki/');
				output.push(item.name.replace(/ /g, '_'));
				output.push('"><img src="');
				output.push(item.icon);
				output.push('" alt="');
				output.push(item.name);
				output.push('" title="');
				output.push(item.name);
				output.push('"> <progress value="0" max="');
				output.push(count);
				if (customGoal) {
					output.push(customGoal);
				} else if (recipe && recipe.achievement_id) {
					output.push('" data-achievement-goal="');
					output.push(recipe.achievement_id);
				} else {
					output.push('" data-item-goal="');
					output.push(item.id);
				}
				output.push('"></progress></a>');
				if (recipe) {
					addRecipe(recipe, nextIndent, function() {
						output.push(indent);
						output.push('</li>');
						done();
					});
				} else {
					output.push(indent);
					output.push('</li>');
					done();
				}
			});
		})
	}

	function addCurrency(currencyID, indent, count, done) {
		getCurrency([currencyID], function(err, currencies) {
			if (err) {
				throw err;
			}

			var currency = currencies[0];
			output.push(indent);
			output.push('<li>');
			output.push(indent);
			output.push('\t<a href="https://wiki.guildwars2.com/wiki/');
			output.push(currency.name.replace(/ /g, '_'));
			output.push('"><img src="');
			output.push(currency.icon);
			output.push('" alt="');
			output.push(currency.name);
			output.push('" title="');
			output.push(currency.name);
			output.push('"> <progress value="0" max="');
			output.push(count);
			output.push('" data-currency-goal="');
			output.push(currency.id);
			output.push('"></progress></a>');
			output.push(indent);
			output.push('</li>');
			done();
		});
	}

	getItem(legendaries, function(err, legendaryItems) {
		if (err) {
			throw err;
		}

		function next() {
			if (legendaryItems.length === 0) {
				output.push('\n\t<script src="gw2-item-goals.js"></script>\n</body>\n</html>\n');
				window.open('data:text/plain,' + encodeURIComponent(output.join('')));
				return;
			}

			var legendaryItem = legendaryItems.shift();
			var liID = 'legendary_' + legendaryItem.name.toLowerCase().replace(/^the /, '').replace(/'/g, '').replace(/ /g, '_');
			output.push('\n\t<details>\n\t\t<summary><h1>');
			output.push(legendaryItem.name);
			output.push('</h1></summary>\n\t\t<ul>\n\t\t\t<li id="');
			output.push(liID);
			output.push('">\n\t\t\t\t<a href="https://wiki.guildwars2.com/wiki/');
			output.push(legendaryItem.name.replace(/ /g, '_'));
			output.push('"><img src="');
			output.push(legendaryItem.icon);
			output.push('" alt="');
			output.push(legendaryItem.name);
			output.push('" title="');
			output.push(legendaryItem.name);
			output.push('"> <progress value="0" max="1" data-skin-goal="');
			output.push(legendaryItem.default_skin);
			output.push('"></progress></a>');
			getRecipesFor(legendaryItem.id, function(err, recipes) {
				if (err) {
					throw err;
				}

				if (recipes.length === 0) {
					throw 'no recipe for legendary?!';
				}

				addRecipe(recipes[0], '\n\t\t\t\t', function() {
					output.push('\n\t\t\t</li>\n\t\t</ul>\n\t\t<a name="');
					output.push(liID);
					output.push('_remaining"></a>\n\t</details>\n');
					next();
				});
			});
		}
		next();
	});
});
