var costs = [
	[[10, 2000], [10, 2000], [20, 4000], [8, 1704], [15, 3000], [8, 1704]],
	[[25, 5000], [25, 5000], [50, 10000], [20, 4000], [38, 7504], [20, 4000]],
	[[500, 100000], [500, 100000], [750, 150000], [300, 60000], [625, 125000], [300, 60000]]
];

var sets = [
	{"race": "Asura", "light": ["Adept", "Genius", "Savant"], "medium": ["Protean", "Auxiliary Powered", "Prototype"], "heavy": ["Galvanic", "Electroplated", "Electromagnetic"]},
	{"race": "Charr", "light": ["Invoker's", "Archon", "Magus"], "medium": ["Drover", "Wrangler", "Trapper"], "heavy": ["Warband", "Legion", "Dreadnought"]},
	{"race": "Human", "light": ["Researcher's", "Aristocrat's", "Socrcerer's"], "medium": ["Scout's", "Falconer's", "Assassin's"], "heavy": ["Commander's", "Avenger's", "Protector's"]},
	{"race": "Norn", "light": ["Sheepskin", "Havroun", "Lupine"], "medium": ["Wolfborn", "Predatory", "Wolf"], "heavy": ["Dolyak", "Eagle", "Stag"]},
	{"race": "Sylvari", "light": ["Snapdragon", "Orchid", "Dryad"], "medium": ["Evergreen", "Nightshade", "Firstborn"], "heavy": ["Arborist", "Warden", "Oaken"]}
];

var skinCodes = [
	"CgcBAAA=", "Cg0BAAA=", "ChEBAAA=", "Cg4BAAA=", "CgwBAAA=", "CiEBAAA=",
	"CgkBAAA=", "CgoBAAA=", "ChQBAAA=", "ChABAAA=", "ChIBAAA=", "CiQBAAA=",
	"CgsBAAA=", "CggBAAA=", "ChkBAAA=", "ChgBAAA=", "ChUBAAA=", "Ci8BAAA=",
	"ChMBAAA=", "ChoBAAA=", "Ch4BAAA=", "Ch0BAAA=", "ChsBAAA=", "CjgBAAA=",
	"ChYBAAA=", "Cg8BAAA=", "CigBAAA=", "CiABAAA=", "Ch8BAAA=", "CjABAAA=",
	"ChwBAAA=", "ChcBAAA=", "Ci0BAAA=", "CiUBAAA=", "CicBAAA=", "CjYBAAA=",
	"CiMBAAA=", "CioBAAA=", "CjEBAAA=", "Ci4BAAA=", "CiwBAAA=", "CjoBAAA=",
	"CikBAAA=", "CiIBAAA=", "CjQBAAA=", "CjIBAAA=", "CjMBAAA=", "CjsBAAA=",
	"CisBAAA=", "CiYBAAA=", "CjkBAAA=", "CjUBAAA=", "CjcBAAA=", "CjwBAAA=",
	"CkMBAAA=", "CkEBAAA=", "ClEBAAA=", "CkwBAAA=", "Ck4BAAA=", "CmABAAA=",
	"Cj8BAAA=", "CkABAAA=", "Ck0BAAA=", "CkkBAAA=", "CkUBAAA=", "Cl4BAAA=",
	"Cj0BAAA=", "Cj4BAAA=", "CkgBAAA=", "CkQBAAA=", "CkIBAAA=", "ClYBAAA=",
	"CkcBAAA=", "CkoBAAA=", "ClgBAAA=", "ClIBAAA=", "ClMBAAA=", "CmYBAAA=",
	"CksBAAA=", "CkYBAAA=", "Cl8BAAA=", "ClkBAAA=", "ClUBAAA=", "CmoBAAA=",
	"ClABAAA=", "Ck8BAAA=", "CmEBAAA=", "ClwBAAA=", "CloBAAA=", "Cm8BAAA=",
	"ClQBAAA=", "ClsBAAA=", "CmwBAAA=", "CmgBAAA=", "CmkBAAA=", "CnEBAAA=",
	"Cl0BAAA=", "CmMBAAA=", "Cm4BAAA=", "CmsBAAA=", "Cm0BAAA=", "CnIBAAA=",
	"CmUBAAA=", "ClcBAAA=", "CmcBAAA=", "CmIBAAA=", "CmQBAAA=", "CnABAAA=",
	"CnUBAAA=", "CnYBAAA=", "CoMBAAA=", "Cn8BAAA=", "CnwBAAA=", "CpQBAAA=",
	"CnoBAAA=", "CncBAAA=", "CogBAAA=", "CoABAAA=", "CoIBAAA=", "CpkBAAA=",
	"CnMBAAA=", "CnQBAAA=", "Cn0BAAA=", "CngBAAA=", "CnkBAAA=", "CooBAAA=",
	"CocBAAA=", "CoYBAAA=", "CpYBAAA=", "CpABAAA=", "CpUBAAA=", "CqQBAAA=",
	"CoQBAAA=", "CoEBAAA=", "CpMBAAA=", "Co0BAAA=", "Co4BAAA=", "CqABAAA=",
	"Cn4BAAA=", "CnsBAAA=", "CowBAAA=", "CokBAAA=", "CoUBAAA=", "Cp8BAAA=",
	"CpIBAAA=", "CpEBAAA=", "CqIBAAA=", "Cp0BAAA=", "Cp4BAAA=", "CqcBAAA=",
	"CpcBAAA=", "CpgBAAA=", "CqUBAAA=", "CqMBAAA=", "CqEBAAA=", "CqgBAAA=",
	"Co8BAAA=", "CosBAAA=", "CpwBAAA=", "CpsBAAA=", "CpoBAAA=", "CqYBAAA=",
	"CqwBAAA=", "CqsBAAA=", "CrYBAAA=", "CrMBAAA=", "CrEBAAA=", "CsYBAAA=",
	"CqoBAAA=", "CqkBAAA=", "CrUBAAA=", "Cq8BAAA=", "CrABAAA=", "CsQBAAA=",
	"Cq4BAAA=", "Cq0BAAA=", "Cr0BAAA=", "CrgBAAA=", "CroBAAA=", "Cs4BAAA=",
	"CrkBAAA=", "CrcBAAA=", "CsgBAAA=", "CsEBAAA=", "CsIBAAA=", "CtkBAAA=",
	"Cr8BAAA=", "CrsBAAA=", "CswBAAA=", "CskBAAA=", "CscBAAA=", "CtsBAAA=",
	"CrIBAAA=", "CrQBAAA=", "CsABAAA=", "CrwBAAA=", "Cr4BAAA=", "CtMBAAA=",
	"CssBAAA=", "CsoBAAA=", "CtgBAAA=", "CtQBAAA=", "CtIBAAA=", "Ct0BAAA=",
	"CsMBAAA=", "CsUBAAA=", "CtUBAAA=", "Cs8BAAA=", "CtABAAA=", "CtwBAAA=",
	"Cs0BAAA=", "CtEBAAA=", "CtoBAAA=", "CtcBAAA=", "CtYBAAA=", "Ct4BAAA=",
	"CuABAAA=", "CuUBAAA=", "CuoBAAA=", "CuYBAAA=", "CuQBAAA=", "CvkBAAA=",
	"CuEBAAA=", "CuIBAAA=", "Cu0BAAA=", "CusBAAA=", "CugBAAA=", "Cv4BAAA=",
	"CuMBAAA=", "Ct8BAAA=", "CvQBAAA=", "Cu4BAAA=", "CvABAAA=", "CgcCAAA=",
	"CukBAAA=", "CvUBAAA=", "CvYBAAA=", "CvEBAAA=", "CvMBAAA=", "ChACAAA=",
	"Cu8BAAA=", "CucBAAA=", "CvwBAAA=", "CvoBAAA=", "CvcBAAA=", "CgkCAAA=",
	"CvIBAAA=", "CuwBAAA=", "CgUCAAA=", "Cv0BAAA=", "CgACAAA=", "Cg8CAAA=",
	"CvsBAAA=", "CgYCAAA=", "CggCAAA=", "CgQCAAA=", "CgMCAAA=", "ChICAAA=",
	"CgECAAA=", "CvgBAAA=", "Cg0CAAA=", "CgsCAAA=", "CgoCAAA=", "ChMCAAA=",
	"CgICAAA=", "Cv8BAAA=", "ChECAAA=", "Cg4CAAA=", "CgwCAAA=", "ChQCAAA="
];

var skinIDs = skinCodes.map(function(text) {
	var str = atob(text).substr(1, 4);
	var bytes = new Uint8Array(4);
	for (var i = 0; i < 4; i++) {
		bytes[i] = str.charCodeAt(i);
	}
	return new Uint32Array(bytes.buffer, 0, 1)[0];
});

var skins = [];

for (var chunk = 0; chunk < skinIDs.length; chunk += 50) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://api.guildwars2.com/v2/skins?ids=' + skinIDs.slice(chunk, Math.min(chunk + 50, skinIDs.length)).join(','), false);
	xhr.send(null);

	skins = skins.concat(JSON.parse(xhr.responseText));
}

var output = [];

var i = 0;
for (var race = 0; race < 5; race++) {
	for (var tier = 0; tier < 3; tier++) {
		for (var weight = 0; weight < 3; weight++) {
			var weightName = ["light", "medium", "heavy"][weight];
			output.push("\n\t\t\t<li id=\"");
			output.push(sets[race][weightName][tier].toLowerCase().replace(/ /g, '_').replace(/'/g, ''));
			output.push("_armor\">\n\t\t\t\t<a href=\"https://wiki.guildwars2.com/wiki/");
			output.push(sets[race][weightName][tier].replace(/ /g, '_'));
			output.push("_armor\"><img src=\"");
			output.push(skins[i].icon);
			output.push("\" alt=\"");
			output.push(sets[race][weightName][tier]);
			output.push(" armor\" title=\"");
			output.push(sets[race][weightName][tier]);
			output.push(" armor\"> <progress value=\"0\" max=\"1\" data-generic-goal></progress></a>\n\t\t\t\t<ul>");
			for (var piece = 0; piece < 6; piece++) {
				output.push("\n\t\t\t\t\t<li>\n\t\t\t\t\t\t<a href=\"https://wiki.guildwars2.com/wiki/");
				output.push(skins[i].name.replace(/ /g, '_'));
				output.push("\"><img src=\"");
				output.push(skins[i].icon);
				output.push("\" alt=\"\" title=\"\"> <progress value=\"0\" max=\"1\" data-skin-goal=\"");
				output.push(skins[i].id);
				output.push("\"></progress></a>\n\t\t\t\t\t\t<ul>\n\t\t\t\t\t\t\t<li><a href=\"https://wiki.guildwars2.com/wiki/Badge_of_Honor\"><img src=\"https://render.guildwars2.com/file/AC3178E7BD066BC597F9D4247848E6033A047EDE/699004.png\" alt=\"Badge of Honor\" title=\"Badge of Honor\"> <progress value=\"0\" max=\"");
				output.push(costs[tier][piece][0]);
				output.push("\" data-currency-goal=\"15\"></progress></a></li>\n\t\t\t\t\t\t\t<li><a href=\"https://wiki.guildwars2.com/wiki/Coin\"><img src=\"https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png\" alt=\"Coin\" title=\"Coin\"> <progress value=\"0\" max=\"");
				output.push(costs[tier][piece][1]);
				output.push("\" data-currency-goal=\"1\"></progress></a></li>\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t</li>");

				i++;
			}
			output.push("\n\t\t\t\t</ul>\n\t\t\t</li>");
		}
	}
}

open('data:text/plain,' + encodeURIComponent(output.join('')));
