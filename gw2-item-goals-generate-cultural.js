var costs = [
	[[10, 2000], [10, 2000], [20, 4000], [8, 1704], [15, 3000], [8, 1704]],
	[[25, 5000], [25, 5000], [50, 10000], [20, 4000], [38, 7504], [20, 4000]],
	[[500, 100000], [500, 100000], [750, 150000], [300, 60000], [625, 125000], [300, 60000]]
];

var dungeonWeaponCosts = [300, 300, 300, 300, 300, 300, 210, 210, 210, 210, 390, 390, 390, 390, 390, 390, 390, 390, 390];
var dungeonArmorCosts = [180, 210, 330, 180, 300, 180];

var sets = [
	{"race": "Asura", "light": ["Adept", "Genius", "Savant"], "medium": ["Protean", "Auxiliary Powered", "Prototype"], "heavy": ["Galvanic", "Electroplated", "Electromagnetic"]},
	{"race": "Charr", "light": ["Invoker's", "Archon", "Magus"], "medium": ["Drover", "Wrangler", "Trapper"], "heavy": ["Warband", "Legion", "Dreadnought"]},
	{"race": "Human", "light": ["Researcher's", "Aristocrat's", "Socrcerer's"], "medium": ["Scout's", "Falconer's", "Assassin's"], "heavy": ["Commander's", "Avenger's", "Protector's"]},
	{"race": "Norn", "light": ["Sheepskin", "Havroun", "Lupine"], "medium": ["Wolfborn", "Predatory", "Wolf"], "heavy": ["Dolyak", "Eagle", "Stag"]},
	{"race": "Sylvari", "light": ["Snapdragon", "Orchid", "Dryad"], "medium": ["Evergreen", "Nightshade", "Firstborn"], "heavy": ["Arborist", "Warden", "Oaken"]}
];

var weaponSets = ["Peacemaker's", "Adamant Guard", "Seraph", "Wolfborn", "Warden", "Ebon Vanguard", "Lionguard"];

var dungeons = [
	{"a": ["Ascalonian Performer armor", "Ascalonian Sentry armor", "Ascalonian Protector armor"], "w": "Royal Ascalonian weapons", "c": {"id":5,"name":"Ascalonian Tear","description":"Earned in Ascalonian Catacombs. Spent in Lion's Arch to purchase rare and exotic gear, runes and sigils, crafting materials, and the \"Gift of Ascalon\" component used in creating legendary weapons.","order":710,"icon":"https://render.guildwars2.com/file/2AA9C0B030BE152B915E0174D7F0495FDA711C54/619318.png"}},
	{"a": ["Council Ministry armor", "Council Watch armor", "Council Guard armor"], "w": "Golden Wing weapons", "c": {"id":9,"name":"Seal of Beetletun","description":"Earned in Caudecus's Manor. Spent in Lion's Arch to purchase rare and exotic gear, runes and sigils, crafting materials, and the \"Gift of the Nobleman\" component used in creating legendary weapons.","order":720,"icon":"https://render.guildwars2.com/file/C97B0607A6DB1FA1469D1DBBF2F107A057F8A313/619322.png"}},
	{"a": ["Nightmare Court armor (light)", "Nightmare Court armor (medium)", "Nightmare Court armor (heavy)"], "w": "Nightmare weapons", "c": {"id":11,"name":"Deadly Bloom","description":"Earned in Twilight Arbor. Spent in Lion's Arch to purchase rare and exotic gear, runes and sigils, crafting materials, and the \"Gift of Thorns\" component used in creating legendary weapons.","order":730,"icon":"https://render.guildwars2.com/file/F6F4F39212AF3324223D73BAA807026BD863997C/619324.png"}},
	{"a": ["Forgeman armor (light)", "Forgeman armor (medium)", "Forgeman armor (heavy)"], "w": "Dark Asuran weapons", "c": {"id":10,"name":"Manifesto of the Moletariate","description":"Earned in Sorrow's Embrace. Spent in Lion's Arch to purchase rare and exotic gear, runes and sigils, crafting materials, and the \"Gift of the Forgeman\" component used in creating legendary weapons.","order":740,"icon":"https://render.guildwars2.com/file/B83A4ED528FC237D4D1862CDD0250B773EAB36AA/619323.png"}},
	{"a": ["Flame Legion armor (light)", "Flame Legion armor (medium)", "Flame Legion armor (heavy)"], "w": "Molten weapons", "c": {"id":13,"name":"Flame Legion Charr Carving","description":"Earned in Citadel of Flame. Spent in Lion's Arch to purchase rare and exotic gear, runes and sigils, crafting materials, and the \"Gift of Baelfire\" component used in creating legendary weapons.","order":750,"icon":"https://render.guildwars2.com/file/310CA245DBF61A54BD0C5D5361E26F0821FCAAFD/619326.png"}},
	{"a": ["Armor of Koda (light)", "Armor of Koda (medium)", "Armor of Koda (heavy)"], "w": "Kodan weapons", "c": {"id":12,"name":"Symbol of Koda","description":"Earned in Honor of the Waves. Spent in Lion's Arch to purchase rare and exotic gear, runes and sigils, crafting materials, and the \"Gift of the Sanctuary\" component used in creating legendary weapons.","order":760,"icon":"https://render.guildwars2.com/file/2B9E2BC9D5D080C54C17E27CECACEFFC0D64EE22/619325.png"}},
	{"a": ["Inquest armor (light)", "Inquest armor (medium)", "Inquest armor (heavy)"], "w": "Inquest weapons", "c": {"id":14,"name":"Knowledge Crystal","description":"Earned in Crucible of Eternity. Spent in Lion's Arch to purchase rare and exotic gear, runes and sigils, crafting materials, and the \"Gift of Knowledge\" component used in creating legendary weapons.","order":770,"icon":"https://render.guildwars2.com/file/37CCE672250A3170B71760949C4C9C9B186517B1/619327.png"}},
	{"a": ["Armor of the Lich", "Accursed armor", "Grasping Dead armor"], "w": "Weapons of the Dragon's Deep", "c": {"id":6,"name":"Shard of Zhaitan","description":"Earned in the Ruined City of Arah. Spent in Lion's Arch to purchase rare and exotic gear, runes and sigils, crafting materials, and the \"Gift of Zhaitan\" component used in creating legendary weapons.","order":780,"icon":"https://render.guildwars2.com/file/06083C4F7321512918E23D57B999F04E94C8D9A3/619319.png"}}
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
	"CgICAAA=", "Cv8BAAA=", "ChECAAA=", "Cg4CAAA=", "CgwCAAA=", "ChQCAAA=",

	"CukQAAA=", "CvwQAAA=", "CtcQAAA=", "CqwQAAA=", "CqsQAAA=", "Cv4QAAA=", "CqoQAAA=", "CsgQAAA=", "Cr8QAAA=", "CrYQAAA=", "Cu8QAAA=", "CvQQAAA=", "CuwQAAA=", "CrEQAAA=", "CtgQAAA=", "CrcQAAA=", "Ct4QAAA=", "CsAQAAA=", "CqcQAAA=",
	"CuUQAAA=", "CvIQAAA=", "CuEQAAA=", "CqkQAAA=", "CucQAAA=", "Cv8QAAA=", "CuIQAAA=", "CsEQAAA=", "CrgQAAA=", "Ct8QAAA=", "CtQQAAA=", "CuMQAAA=", "CoQQAAA=", "Cs0QAAA=", "CtIQAAA=", "CvsQAAA=", "CtYQAAA=", "CrkQAAA=", "CroQAAA=",
	"CuYQAAA=", "CvoQAAA=", "CrIQAAA=", "CtkQAAA=", "CuoQAAA=", "CgARAAA=", "CuQQAAA=", "CscQAAA=", "CrwQAAA=", "CugQAAA=", "Cq8QAAA=", "CvMQAAA=", "CusQAAA=", "Cu0QAAA=", "CtMQAAA=", "Cv0QAAA=", "Ct0QAAA=", "Cr0QAAA=", "CsMQAAA=",
	"CsoQAAA=", "CvYQAAA=", "CskQAAA=", "CsUQAAA=", "Cs4QAAA=", "CvkQAAA=", "CsYQAAA=", "CrMQAAA=", "CrAQAAA=", "CtAQAAA=", "CtwQAAA=", "Cu4QAAA=", "Cs8QAAA=", "CtEQAAA=", "CrQQAAA=", "CvgQAAA=", "CtsQAAA=", "CrsQAAA=", "Cr4QAAA=",
	"CqQQAAA=", "CvUQAAA=", "CqMQAAA=", "Cq4QAAA=", "CqIQAAA=", "CqgQAAA=", "CtUQAAA=", "CqEQAAA=", "CsIQAAA=", "CqYQAAA=", "CvEQAAA=", "CvcQAAA=", "CqUQAAA=", "CvAQAAA=", "CtoQAAA=", "Cq0QAAA=", "CuAQAAA=", "CsQQAAA=", "CrUQAAA=",
	"CjASAAA=", "CjcSAAA=", "CgsSAAA=", "Cv0RAAA=", "CvoRAAA=", "CgMSAAA=", "CvkRAAA=", "CvERAAA=", "ChsSAAA=", "Cg4SAAA=", "CgESAAA=", "ChMSAAA=", "CgYSAAA=", "ChESAAA=", "CiYSAAA=", "ChQSAAA=", "CioSAAA=", "ChwSAAA=", "Ch8SAAA=",
	"CvYRAAA=", "CgcSAAA=", "Ci4SAAA=", "CiQSAAA=", "Cu4RAAA=", "ChUSAAA=", "CuoRAAA=", "Cu0RAAA=", "Ch0SAAA=", "CjESAAA=", "CjUSAAA=", "CgQSAAA=", "ChASAAA=", "CgISAAA=", "CigSAAA=", "Ch4SAAA=", "Ci0SAAA=", "CuwRAAA=", "CiASAAA=",

	"CnACAAA=", "CmsCAAA=", "CmUCAAA=", "CnMCAAA=", "CmYCAAA=", "CmwCAAA=",
	"Cm8CAAA=", "CmkCAAA=", "CmMCAAA=", "CnICAAA=", "CmQCAAA=", "CmoCAAA=",
	"CnECAAA=", "Cm0CAAA=", "CmcCAAA=", "CnQCAAA=", "CmgCAAA=", "Cm4CAAA=",
	"CpUCAAA=", "CpECAAA=", "Co4CAAA=", "CpcCAAA=", "Co8CAAA=", "CpMCAAA=",
	"CpQCAAA=", "CpACAAA=", "Co0CAAA=", "CpYCAAA=", "CowCAAA=", "CpICAAA=",
	"CosCAAA=", "CokCAAA=", "CocCAAA=", "CpgCAAA=", "CogCAAA=", "CooCAAA=",
	"CrACAAA=", "Cq4CAAA=", "CqwCAAA=", "CrECAAA=", "Cq0CAAA=", "Cq8CAAA=",
	"Cr0CAAA=", "CrQCAAA=", "CrICAAA=", "CrsCAAA=", "CrMCAAA=", "CrUCAAA=",
	"CroCAAA=", "CrgCAAA=", "CrYCAAA=", "CrwCAAA=", "CrcCAAA=", "CrkCAAA=",
	"CqICAAA=", "CqACAAA=", "Cp4CAAA=", "CqMCAAA=", "Cp8CAAA=", "CqECAAA=",
	"CqgCAAA=", "CqcCAAA=", "CqQCAAA=", "CqoCAAA=", "CqUCAAA=", "CqYCAAA=",
	"Cp0CAAA=", "CpsCAAA=", "CpkCAAA=", "CqsCAAA=", "CpoCAAA=", "CpwCAAA=",
	"CtoCAAA=", "CtcCAAA=", "CtYCAAA=", "CtkCAAA=", "CtUCAAA=", "CtgCAAA=",
	"Ct8CAAA=", "Ct0CAAA=", "CtwCAAA=", "CuACAAA=", "CtsCAAA=", "Ct4CAAA=",
	"CtQCAAA=", "CtICAAA=", "CtECAAA=", "CuECAAA=", "CtACAAA=", "CtMCAAA=",
	"CssCAAA=", "CsUCAAA=", "CsACAAA=", "Cs4CAAA=", "CsECAAA=", "CsgCAAA=",
	"CsoCAAA=", "CsQCAAA=", "Cr8CAAA=", "Cs0CAAA=", "Cr4CAAA=", "CscCAAA=",
	"CswCAAA=", "CsYCAAA=", "CsICAAA=", "Cs8CAAA=", "CsMCAAA=", "CskCAAA=",
	"CvACAAA=", "Cu4CAAA=", "Cu0CAAA=", "CvICAAA=", "CuwCAAA=", "Cu8CAAA=",
	"CusCAAA=", "CukCAAA=", "CucCAAA=", "CvECAAA=", "CugCAAA=", "CuoCAAA=",
	"CuYCAAA=", "CuQCAAA=", "CuICAAA=", "CvMCAAA=", "CuMCAAA=", "CuUCAAA=",
	"Cn8CAAA=", "CnwCAAA=", "CnoCAAA=", "Cn4CAAA=", "CnsCAAA=", "Cn0CAAA=",
	"CoQCAAA=", "CoICAAA=", "CoECAAA=", "CoUCAAA=", "CoACAAA=", "CoMCAAA=",
	"CnkCAAA=", "CncCAAA=", "CnYCAAA=", "CoYCAAA=", "CnUCAAA=", "CngCAAA=",

	"CggRAAA=", "ChURAAA=", "CgkRAAA=", "CmkRAAA=", "CgURAAA=", "CiwRAAA=", "CgQRAAA=", "CjMRAAA=", "CiARAAA=", "ChIRAAA=", "ChQRAAA=", "CiERAAA=", "CgsRAAA=", "CpIRAAA=", "CiYRAAA=", "CjARAAA=", "Co0RAAA=", "Ck8RAAA=", "CkURAAA=",
	"CmYRAAA=", "CqIRAAA=", "CmsRAAA=", "CmMRAAA=", "CmURAAA=", "CqoRAAA=", "CkYRAAA=", "ChARAAA=", "ChMRAAA=", "CmIRAAA=", "CnsRAAA=", "Cp8RAAA=", "CjcRAAA=", "Cm8RAAA=", "ChYRAAA=", "CpYRAAA=", "CoMRAAA=", "CkERAAA=", "CjsRAAA=",
	"CnARAAA=", "CqURAAA=", "CnoRAAA=", "CmgRAAA=", "CnERAAA=", "CroRAAA=", "ClERAAA=", "Ci8RAAA=", "ChwRAAA=", "CpkRAAA=", "CoIRAAA=", "CqARAAA=", "Cl4RAAA=", "CpARAAA=", "Ch8RAAA=", "CrERAAA=", "CooRAAA=", "CkwRAAA=", "Cj8RAAA=",
	"CnYRAAA=", "Ch0RAAA=", "ChsRAAA=", "ChoRAAA=", "CnkRAAA=", "CrQRAAA=", "CgcRAAA=", "CjERAAA=", "Ch4RAAA=", "CpwRAAA=", "CocRAAA=", "CqQRAAA=", "CmQRAAA=", "CjwRAAA=", "CiMRAAA=", "CrIRAAA=", "Ci4RAAA=", "ChcRAAA=", "CkQRAAA=",
	"CmwRAAA=", "CqMRAAA=", "CnMRAAA=", "CgIRAAA=", "CmoRAAA=", "CrkRAAA=", "CkoRAAA=", "CisRAAA=", "ChgRAAA=", "CgERAAA=", "CoERAAA=", "CgMRAAA=", "ClwRAAA=", "CowRAAA=", "ChkRAAA=", "CrARAAA=", "CoYRAAA=", "CkcRAAA=", "Ci0RAAA=",
	"Cl8RAAA=", "CiQRAAA=", "CmcRAAA=", "CloRAAA=", "CmERAAA=", "CrgRAAA=", "CkIRAAA=", "CioRAAA=", "Cg0RAAA=", "CpcRAAA=", "CngRAAA=", "CkgRAAA=", "ClQRAAA=", "Cj0RAAA=", "ChERAAA=", "Cq8RAAA=", "CoARAAA=", "Cg4RAAA=", "CjgRAAA=",
	"ClMRAAA=", "CpsRAAA=", "ClsRAAA=", "ClARAAA=", "ClcRAAA=", "CrcRAAA=", "CjkRAAA=", "CiURAAA=", "CgYRAAA=", "CpURAAA=", "Cm0RAAA=", "CpoRAAA=", "CkkRAAA=", "CoURAAA=", "CgwRAAA=", "Cq0RAAA=", "CncRAAA=", "CjoRAAA=", "CjIRAAA=",
	"Cl0RAAA=", "Cp0RAAA=", "CmARAAA=", "ClgRAAA=", "ClkRAAA=", "CqYRAAA=", "Cj4RAAA=", "CicRAAA=", "CgoRAAA=", "ClIRAAA=", "CnQRAAA=", "CnURAAA=", "Ck4RAAA=", "CosRAAA=", "Cg8RAAA=", "Co4RAAA=", "CnwRAAA=", "CkARAAA=", "CjYRAAA="
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
				output.push("\" alt=\"");
				output.push(skins[i].name);
				output.push("\" title=\"");
				output.push(skins[i].name);
				output.push("\"> <progress value=\"0\" max=\"1\" data-skin-goal=\"");
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
for (var weaponSet = 0; weaponSet < 7; weaponSet++) {
	output.push("\n\t\t\t<li id=\"");
	output.push(weaponSets[weaponSet].toLowerCase().replace(/ /g, '_').replace(/'/g, ''));
	output.push("_weapons\">\n\t\t\t\t<a href=\"https://wiki.guildwars2.com/wiki/");
	output.push(weaponSets[weaponSet].replace(/ /g, '_'));
	output.push("_weapons\"><img src=\"");
	output.push(skins[i].icon);
	output.push("\" alt=\"");
	output.push(weaponSets[weaponSet]);
	output.push(" weapons\" title=\"");
	output.push(weaponSets[weaponSet]);
	output.push(" weapons\"> <progress value=\"0\" max=\"1\" data-generic-goal></progress></a>\n\t\t\t\t<ul>");
	for (var weapon = 0; weapon < 19; weapon++) {
		output.push("\n\t\t\t\t\t<li>\n\t\t\t\t\t\t<a href=\"https://wiki.guildwars2.com/wiki/");
		output.push(skins[i].name.replace(/ /g, '_'));
		output.push("\"><img src=\"");
		output.push(skins[i].icon);
		output.push("\" alt=\"");
		output.push(skins[i].name);
		output.push("\" title=\"");
		output.push(skins[i].name);
		output.push("\"> <progress value=\"0\" max=\"1\" data-skin-goal=\"");
		output.push(skins[i].id);
		output.push("\"></progress></a>\n\t\t\t\t\t\t<ul>\n\t\t\t\t\t\t\t<li><a href=\"https://wiki.guildwars2.com/wiki/Karma\"><img src=\"https://render.guildwars2.com/file/94953FA23D3E0D23559624015DFEA4CFAA07F0E5/155026.png\" alt=\"Karma\" title=\"Karma\"> <progress value=\"0\" max=\"63000\" data-currency-goal=\"2\"></progress></a></li>\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t</li>");

		i++;
	}
	output.push("\n\t\t\t\t</ul>\n\t\t\t</li>");
}

for (var dungeon = 0; dungeon < 8; dungeon++) {
	for (var weight = 0; weight < 3; weight++) {
		output.push("\n\t\t\t<li id=\"");
		output.push(dungeons[dungeon].a[weight].toLowerCase().replace(/ /g, '_').replace(/'/g, ''));
		output.push("\">\n\t\t\t\t<a href=\"https://wiki.guildwars2.com/wiki/");
		output.push(dungeons[dungeon].a[weight].replace(/ /g, '_'));
		output.push("\"><img src=\"");
		output.push(skins[i].icon);
		output.push("\" alt=\"");
		output.push(dungeons[dungeon].a[weight]);
		output.push("\" title=\"");
		output.push(dungeons[dungeon].a[weight]);
		output.push("\"> <progress value=\"0\" max=\"1\" data-generic-goal></progress></a>\n\t\t\t\t<ul>");
		for (var piece = 0; piece < 6; piece++) {
			output.push("\n\t\t\t\t\t<li>\n\t\t\t\t\t\t<a href=\"https://wiki.guildwars2.com/wiki/");
			output.push(skins[i].name.replace(/ /g, '_'));
			output.push("\"><img src=\"");
			output.push(skins[i].icon);
			output.push("\" alt=\"");
			output.push(skins[i].name);
			output.push("\" title=\"");
			output.push(skins[i].name);
			output.push("\"> <progress value=\"0\" max=\"1\" data-skin-goal=\"");
			output.push(skins[i].id);
			output.push("\"></progress></a>\n\t\t\t\t\t\t<ul>\n\t\t\t\t\t\t\t<li><a href=\"https://wiki.guildwars2.com/wiki/");
			output.push(dungeons[dungeon].c.name.replace(/ /g, '_'));
			output.push("\"><img src=\"");
			output.push(dungeons[dungeon].c.icon);
			output.push("\" alt=\"");
			output.push(dungeons[dungeon].c.name);
			output.push("\" title=\"");
			output.push(dungeons[dungeon].c.name);
			output.push("\"> <progress value=\"0\" max=\"");
			output.push(dungeonArmorCosts[piece]);
			output.push("\" data-currency-goal=\"");
			output.push(dungeons[dungeon].c.id);
			output.push("\"></progress></a></li>\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t</li>");

			i++;
		}
		output.push("\n\t\t\t\t</ul>\n\t\t\t</li>");
	}
}

for (var dungeon = 0; dungeon < 8; dungeon++) {
	output.push("\n\t\t\t<li id=\"");
	output.push(dungeons[dungeon].w.toLowerCase().replace(/ /g, '_').replace(/'/g, ''));
	output.push("\">\n\t\t\t\t<a href=\"https://wiki.guildwars2.com/wiki/");
	output.push(dungeons[dungeon].w.replace(/ /g, '_'));
	output.push("\"><img src=\"");
	output.push(skins[i].icon);
	output.push("\" alt=\"");
	output.push(dungeons[dungeon].w);
	output.push("\" title=\"");
	output.push(dungeons[dungeon].w);
	output.push("\"> <progress value=\"0\" max=\"1\" data-generic-goal></progress></a>\n\t\t\t\t<ul>");
	for (var weapon = 0; weapon < 19; weapon++) {
		output.push("\n\t\t\t\t\t<li>\n\t\t\t\t\t\t<a href=\"https://wiki.guildwars2.com/wiki/");
		output.push(skins[i].name.replace(/ /g, '_'));
		output.push("\"><img src=\"");
		output.push(skins[i].icon);
		output.push("\" alt=\"");
		output.push(skins[i].name);
		output.push("\" title=\"");
		output.push(skins[i].name);
		output.push("\"> <progress value=\"0\" max=\"1\" data-skin-goal=\"");
		output.push(skins[i].id);
		output.push("\"></progress></a>\n\t\t\t\t\t\t<ul>\n\t\t\t\t\t\t\t<li><a href=\"https://wiki.guildwars2.com/wiki/");
		output.push(dungeons[dungeon].c.name.replace(/ /g, '_'));
		output.push("\"><img src=\"");
		output.push(dungeons[dungeon].c.icon);
		output.push("\" alt=\"");
		output.push(dungeons[dungeon].c.name);
		output.push("\" title=\"");
		output.push(dungeons[dungeon].c.name);
		output.push("\"> <progress value=\"0\" max=\"");
		output.push(dungeonWeaponCosts[weapon]);
		output.push("\" data-currency-goal=\"");
		output.push(dungeons[dungeon].c.id);
		output.push("\"></progress></a></li>\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t</li>");
		i++;
	}
	output.push("\n\t\t\t\t</ul>\n\t\t\t</li>");
}

open('data:text/plain,' + encodeURIComponent(output.join('')));
