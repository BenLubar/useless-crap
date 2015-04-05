"use strict";

var fanva = function(camxes) {
	// new paragraph; change of subject
	function English_NIhO(word) {
		switch (word) {
		case "ni'o":
			this.description = "[introduce new topic]";
			break;
		case "no'i":
			this.description = "[resume previous topic]";
			break;
		default:
			throw "unrecognized NIhO: " + word;
		}
	}
	English_NIhO.prototype.toString = function(describe) {
		return describe ? this.description : "\n";
	};

	// sentence link
	function English_I(word) {
		if (word !== "i") {
			throw "unrecognized I: " + word;
		}
	}
	English_I.prototype.toString = function(describe) {
		if (describe) {
			return "[sentence link/continuation]";
		}
		throw "internal error: I cannot be translated directly to English";
	};

	// grammatical text left quote
	function English_LU(word) {
		switch (word) {
		case "lu":
			this.description = "[begin grammatical quotation] ";
			break;
		case "la'au":
			this.description = "[begin grammatical name quotation] ";
			break;
		default:
			throw "unrecognized LU: " + word;
		}
	}
	English_LU.prototype.toString = function(describe) {
		return describe ? this.description : "“";
	};

	// grammatical text right quote
	function English_LIhU(word) {
		switch (word) {
		case "li'u":
			this.description = " [end grammatical quotation]";
			break;
		default:
			throw "unrecognized LIhU: " + word;
		}
	}
	English_LIhU.prototype.toString = function(describe) {
		return describe ? this.description : "”";
	};

	// sumti descriptors
	function English_LE(word) {
		switch (word) {
		case "le":
			this.description = "[the one(s) described as]";
			this.simple = "the";
			break;
		case "loi":
			this.description = "[the mass of individual(s) that is/are]";
			this.simple = "the";
			break;
		case "lo'i":
			this.description = "[the set of those that really are (treated as a set)]";
			this.simple = "the";
			break;
		default:
			throw "unrecognized LE: " + word;
		}
	}
	English_LE.prototype.toString = function(describe) {
		return describe ? this.description : this.simple;
	};

	// conversions
	function English_SE(word) {
		switch (word) {
		case "se":
			this.conversion = 2;
			this.description = "[switch 1st/2nd places]";
			break;
		case "te":
			this.conversion = 3;
			this.description = "[switch 1st/3rd places]";
			break;
		case "se":
			this.conversion = 4;
			this.description = "[switch 1st/4th places]";
			break;
		case "xe":
			this.conversion = 5;
			this.description = "[switch 1st/5th places]";
			break;
		default:
			throw "unrecognized SE: " + word;
		}
	}
	English_SE.prototype.toString = function(describe) {
		if (describe) {
			return this.description;
		}
		throw "internal error: SE cannot be translated directly to English";
	};

	// modifier head generic case tag
	function English_FA(word) {
		switch (word) {
		case "fa":
			this.place = 1;
			this.description = "[1st place]";
			break;
		case "fe":
			this.place = 2;
			this.description = "[2nd place]";
			break;
		case "fi":
			this.place = 3;
			this.description = "[3rd place]";
			break;
		case "fo":
			this.place = 4;
			this.description = "[4th place]";
			break;
		case "fu":
			this.place = 5;
			this.description = "[5th place]";
			break;
		default:
			throw "unrecognized FA: " + word;
		}
	}
	English_FA.prototype.toString = function(describe) {
		if (describe) {
			return this.description;
		}
		throw "internal error: FA cannot be translated directly to English";
	};

	// separator between head sumti and selbri
	function English_CU(word) {
		if (word !== "cu") {
			throw "unrecognized CU: " + word;
		}
	}
	English_CU.prototype.toString = function(describe) {
		if (describe) {
			return "[separator between head sumti and selbri]";
		}
		throw "internal error: CU cannot be translated directly to English";
	};

	// right terminator for descriptions, etc.
	function English_KU(word) {
		if (word !== "ku") {
			throw "unrecognized KU: " + word;
		}
	}
	English_KU.prototype.toString = function(describe) {
		if (describe) {
			return "[end description, modal, or negator sumti]";
		}
		throw "internal error: KU cannot be translated directly to English";
	};

	// abstraction
	function English_NU(word) {
		switch (word) {
		case "nu":
			this.description = "[generalized event abstractor]";
			break;
		case "ka":
			this.description = "[property/quality abstractor]";
			break;
		default:
			throw "unrecognized NU: " + word;
		}
	}
	English_NU.prototype.toString = function(describe) {
		if (describe) {
			return this.description;
		}
		throw "internal error: NU cannot be translated directly to English";
	};

	// bridi negation
	function English_NA(word) {
		switch (word) {
		case "na":
			this.description = "[bridi contradictory negator]";
			break;
		default:
			throw "unrecognized NA: " + word;
		}
	}
	English_NA.prototype.toString = function(describe) {
		if (describe) {
			return this.description;
		}
		throw "internal error: NA cannot be translated directly to English";
	};

	// non-logical connectives
	function English_JOI(word) {
		switch (word) {
		case "joi":
			this.description = "[mixed conjunction]";
			this.simple = "and";
			break;
		default:
			throw "unrecognized JOI: " + word;
		}
	}
	English_JOI.prototype.toString = function(describe) {
		return describe ? this.description : this.simple;
	};

	// name descriptors
	function English_LA(word) {
		switch (word) {
		case "la":
			this.description = "[the one(s) called]";
			this.simple = "the";
			break;
		default:
			throw "unrecognized LA: " + word;
		}
	}
	English_LA.prototype.toString = function(describe) {
		return describe ? this.description : this.simple;
	};

	// pro-bridi
	function English_GOhA(word) {
		switch (word) {
		case "go'o":
			this.description = "[repeats a future bridi]";
			this.simple = "the next sentence";
			break;
		default:
			throw "unrecognized GOhA: " + word;
		}
	}
	English_GOhA.prototype.toString = function(describe) {
		return describe ? this.description : this.simple;
	};

	// attaches a sumti modifier to a sumti
	function English_GOI(word) {
		switch (word) {
		case "goi":
			this.description = "[sumti assignment]";
			this.simple = "now known as";
			break;
		default:
			throw "unrecognized GOI: " + word;
		}
	}
	English_GOI.prototype.toString = function(describe) {
		return describe ? this.description : this.simple;
	};

	// directions in time
	function English_PU(word) {
		switch (word) {
		case "ca":
			this.description = "[present tense]";
			break;
		default:
			throw "unrecognized PU: " + word;
		}
	}
	English_PU.prototype.toString = function(describe) {
		if (describe) {
			return this.description;
		}
		throw "internal error: PU cannot be translated directly to English";
	};

	// sumti anaphora
	function English_KOhA(word) {
		switch (word) {
		case "da":
			this.description = "[logically quantified existential pro-sumti: there exists something 1 (usually restricted)]";
			this.simple = "X";
			break;
		case "de":
			this.description = "[logically quantified existential pro-sumti: there exists something 2 (usually restricted)]";
			this.simple = "Y";
			break;
		case "di":
			this.description = "[logically quantified existential pro-sumti: there exists something 3 (usually restricted)]";
			this.simple = "Z";
			break;
		case "do":
			this.description = "[you, the listener(s)]";
			this.simple = "you";
			break;
		case "mi":
			this.description = "[I/we, the speaker(s)]";
			this.simple = "me";
			break;
		default:
			throw "unrecognized KOhA: " + word;
		}
	}
	English_KOhA.prototype.toString = function(describe) {
		return describe ? this.description : this.simple;
	};

	function English_fuhivla(word) {
		this.word = word;
	}
	English_fuhivla.prototype.toString = function(describe) {
		return "[unknown fu'ivla: " + this.word + "]";
	};

	function English_gismu(word) {
		this.word = word;
	}
	English_gismu.prototype.toString = function(describe) {
		return "[unknown gismu: " + this.word + "]";
	};

	function English_lujvo(word) {
		this.word = word;
	}
	English_lujvo.prototype.toString = function(describe) {
		return "[unknown lujvo: " + this.word + "]";
	};

	function English_BRIVLA(word) {
		if (typeof word === "string") {
			// fu'ivla
			word = new English_fuhivla(word);
		}
		this.word = word;
	}
	English_BRIVLA.prototype.toString = function(describe) {
		return this.word.toString(describe);
	};

	function English_SE_BRIVLA(se, brivla) {
		this.se = [se];
		this.brivla = brivla.word;
	}
	English_SE_BRIVLA.prototype.toString = function(describe) {
		if (describe) {
			return this.se.map(function(se) {
				return se.toString(true);
			}).join(" ") + " " + this.brivla.toString(true);
		}
		throw "internal error: SE BRIVLA is unimplemented";
	};

	function English_LE_KU(le, selbri) {
		this.le = le;
		this.selbri = selbri;
	}
	English_LE_KU.prototype.toString = function(describe) {
		return this.le.toString(describe) + " " + this.selbri.toString(describe);
	};

	function English_LU_LIhU(lu, bridi, lihu) {
		this.lu = lu;
		this.bridi = bridi;
		this.lihu = lihu;
	}
	English_LU_LIhU.prototype.toString = function(describe) {
		return this.lu.toString(describe) + this.bridi.toString(describe) + this.lihu.toString(describe);
	};

	function English_terms(terms) {
		this.terms = terms;
	}
	English_terms.prototype.toString = function(describe) {
		return this.terms.map(function(term) {
			return term.toString(describe);
		}).join(" ");
	}

	function English_tanru(words) {
		this.words = words;
	}
	English_tanru.prototype.toString = function(describe) {
		return this.words.map(function(word) {
			return word.toString(describe);
		}).join(" ");
	}

	function English_bridi(selbri, terms) {
		this.selbri = selbri;
		this.terms = [null].concat(terms.terms);
	}
	English_bridi.prototype.toString = function(describe) {
		throw "internal error: bridi is unimplemented";
	};

	function English_NU_bridi(nu, bridi) {
		this.nu = nu;
		this.bridi = bridi;
	}
	English_NU_bridi.prototype.toString = function(describe) {
		throw "internal error: NU bridi is unimplemented";
	};

	// individual lerfu words
	function English_BY(word) {
		switch (word) {
		case "by":
			this.description = "[letteral for b]";
			this.simple = "b";
			break;
		case "cy":
			this.description = "[letteral for c]";
			this.simple = "c";
			break;
		case "dy":
			this.description = "[letteral for d]";
			this.simple = "d";
			break;
		case "fy":
			this.description = "[letteral for f]";
			this.simple = "f";
			break;
		case "gy":
			this.description = "[letteral for g]";
			this.simple = "g";
			break;
		case "jy":
			this.description = "[letteral for j]";
			this.simple = "j";
			break;
		case "ky":
			this.description = "[letteral for k]";
			this.simple = "k";
			break;
		case "ly":
			this.description = "[letteral for l]";
			this.simple = "l";
			break;
		case "my":
			this.description = "[letteral for m]";
			this.simple = "m";
			break;
		case "ny":
			this.description = "[letteral for n]";
			this.simple = "n";
			break;
		case "py":
			this.description = "[letteral for p]";
			this.simple = "p";
			break;
		case "ry":
			this.description = "[letteral for r]";
			this.simple = "r";
			break;
		case "sy":
			this.description = "[letteral for s]";
			this.simple = "s";
			break;
		case "ty":
			this.description = "[letteral for t]";
			this.simple = "t";
			break;
		case "vy":
			this.description = "[letteral for v]";
			this.simple = "v";
			break;
		case "xy":
			this.description = "[letteral for x]";
			this.simple = "x";
			break;
		case "zy":
			this.description = "[letteral for z]";
			this.simple = "z";
			break;
		default:
			throw "unrecognized BY: " + word;
		}
	}
	English_BY.prototype.toString = function(describe) {
		return describe ? this.description : this.simple;
	};

	// numbers and numeric punctuation
	function English_PA(word) {
		switch (word) {
		case "no":
			this.description = "[numeral for zero]";
			this.simple = "0";
			break;
		case "pa":
			this.description = "[numeral for one]";
			this.simple = "1";
			break;
		case "re":
			this.description = "[numeral for two]";
			this.simple = "2";
			break;
		case "ci":
			this.description = "[numeral for three]";
			this.simple = "3";
			break;
		case "vo":
			this.description = "[numeral for four]";
			this.simple = "4";
			break;
		case "mu":
			this.description = "[numeral for five]";
			this.simple = "5";
			break;
		case "xa":
			this.description = "[numeral for six]";
			this.simple = "6";
			break;
		case "ze":
			this.description = "[numeral for seven]";
			this.simple = "7";
			break;
		case "bi":
			this.description = "[numeral for eight]";
			this.simple = "8";
			break;
		case "so":
			this.description = "[numeral for nine]";
			this.simple = "9";
			break;
		case "ro":
			this.description = "[numeral for each, all]";
			this.simple = "all";
			break;
		default:
			throw "unrecognized PA: " + word;
		}
	}
	English_PA.prototype.toString = function(describe) {
		return describe ? this.description : this.simple;
	};

	// event properties - inchoative, etc.
	function English_ZAhO(word) {
		switch (word) {
		case "mo'u":
			this.description = "[at the natural ending point of]"
			this.simple = "at the end of";
			break;
		default:
			throw "unrecognized ZAhO: " + word;
		}
	}
	English_ZAhO.prototype.toString = function(describe) {
		return describe ? this.description : this.simple;
	};

	function English_lerfu_string(letters) {
		this.letters = letters;
	}
	English_lerfu_string.prototype.toString = function(describe) {
		var s = this.letters.map(function(letter) {
			return letter.toString(describe);
		}).join("");
		if (!describe) {
			s = "‘" + s + "’";
		}
		return s;
	};

	function English_number(digits) {
		this.digits = digits;
	}
	English_number.prototype.toString = function(describe) {
		return this.digits.map(function(digit) {
			return digit.toString(describe);
		}).join("");
	};

	function English_relative_clause(goi, term) {
		this.goi = goi;
		this.term = term;
	}
	English_relative_clause.prototype.toString = function(describe) {
		var s = this.goi.toString(describe) + " " + this.term.toString(describe);
		if (!describe) {
			s = "(" + s + ")";
		}
		return s;
	};

	function English_relative_clauses(clauses) {
		this.term = null;
		this.clauses = clauses;
	}
	English_relative_clauses.prototype.toString = function(describe) {
		return this.term.toString(describe) + " " + this.clauses.map(function(clause) {
			return clause.toString(describe);
		}).join(" ");
	};

	function English_LA_term(la, term) {
		this.la = la;
		this.term = term;
	}
	English_LA_term.prototype.toString = function(describe) {
		return this.la.toString(describe) + " " + this.term.toString(describe);
	};

	function English_number_term(number, term) {
		this.number = number;
		this.term = term;
	}
	English_number_term.prototype.toString = function(describe) {
		return this.number.toString(describe) + " " + this.term.toString(describe);
	};

	function English_joik_jek(left, conjunction, right) {
		this.left = left;
		this.conjunction = conjunction;
		this.right = right;
	}
	English_joik_jek.prototype.toString = function(describe) {
		return this.left.toString(describe) + " " + this.conjunction.toString(describe) + " " + this.right.toString(describe);
	};

	function English_FA_term(fa, term) {
		this.fa = fa;
		this.term = term;
	}
	English_FA_term.prototype.toString = function(describe) {
		if (describe) {
			return this.fa.toString(true) + " " + this.term.toString(true);
		}
		throw "internal error: FA term cannot be translated directly to English";
	}

	function English_PU_term(pu, term) {
		this.pu = pu;
		this.term = term;
	}
	English_FA_term.prototype.toString = function(describe) {
		if (describe) {
			return this.pu.toString(true) + " " + this.term.toString(true);
		}
		throw "internal error: PU term cannot be translated directly to English";
	}

	var English = {
		NIhO: function(args) {
			if (args.length !== 1) { throw "internal error"; }
			return new English_NIhO(args[0]);
		},
		I: function(args) {
			if (args.length !== 1) { throw "internal error"; }
			return new English_I(args[0]);
		},
		LU: function(args) {
			if (args.length !== 1) { throw "internal error"; }
			return new English_LU(args[0]);
		},
		LIhU: function(args) {
			if (args.length !== 1) { throw "internal error"; }
			return new English_LIhU(args[0]);
		},
		LE: function(args) {
			if (args.length !== 1) { throw "internal error"; }
			return new English_LE(args[0]);
		},
		LA: function(args) {
			if (args.length !== 1) { throw "internal error"; }
			return new English_LA(args[0]);
		},
		SE: function(args) {
			if (args.length !== 1) { throw "internal error"; }
			return new English_SE(args[0]);
		},
		FA: function(args) {
			if (args.length !== 1) { throw "internal error"; }
			return new English_FA(args[0]);
		},
		CU: function(args) {
			if (args.length !== 1) { throw "internal error"; }
			return new English_CU(args[0]);
		},
		KU: function(args) {
			if (args.length !== 1) { throw "internal error"; }
			return new English_KU(args[0]);
		},
		NU: function(args) {
			if (args.length !== 1) { throw "internal error"; }
			return new English_NU(args[0]);
		},
		MA: function(args) {
			if (args.length !== 1) { throw "internal error"; }
			return new English_NA(args[0]); // There is a typo in camxes.
		},
		GOhA: function(args) {
			if (args.length !== 1) { throw "internal error"; }
			return new English_GOhA(args[0]);
		},
		KOhA: function(args) {
			if (args.length !== 1) { throw "internal error"; }
			return new English_KOhA(args[0]);
		},
		GOI: function(args) {
			if (args.length !== 1) { throw "internal error"; }
			return new English_GOI(args[0]);
		},
		ZAhO: function(args) {
			if (args.length !== 1) { throw "internal error"; }
			return new English_ZAhO(args[0]);
		},
		BY: function(args) {
			if (args.length !== 1) { throw "internal error"; }
			return new English_BY(args[0]);
		},
		PA: function(args) {
			if (args.length !== 1) { throw "internal error"; }
			return new English_PA(args[0]);
		},
		PU: function(args) {
			if (args.length !== 1) { throw "internal error"; }
			return new English_PU(args[0]);
		},
		JOI: function(args) {
			if (args.length !== 1) { throw "internal error"; }
			return new English_JOI(args[0]);
		},
		lerfu_string: function(args) {
			if (args.length === 1) {
				return new English_lerfu_string(args);
			}
			if (args.length === 2) {
				return new English_lerfu_string([args[0]].concat(args[1]));
			}
			throw "internal error";
		},
		number: function(args) {
			if (args.length === 1) {
				return new English_number(args);
			}
			if (args.length === 2) {
				return new English_number([args[0]].concat(args[1]));
			}
			throw "internal error";
		},
		terms: function(args) {
			return new English_terms(args);
		},
		gismu: function(args) {
			if (args.length !== 1) { throw "internal error"; }
			return new English_gismu(args[0]);
		},
		lujvo: function(args) {
			if (args.length !== 1) { throw "internal error"; }
			return new English_lujvo(args[0]);
		},
		BRIVLA: function(args) {
			if (args.length !== 1) { throw "internal error"; }
			return new English_BRIVLA(args[0]);
		},
		selbri_3: function(args) {
			if (args.length === 1) {
				return args[0];
			}
			if (args.every(function(a) { return a.constructor === English_BRIVLA; })) {
				return new English_tanru(args);
			}
			throw "internal error";
		},
		sumti_tail_1: function(args) {
			if (args.length === 1) {
				return args[0];
			}
			if (args.length === 2 && args[1].constructor === English_relative_clauses) {
				args[1].term = args[0];
				return args[1];
			}
			if (args.length === 2 && args[0].constructor === English_number) {
				return new English_number_term(args[0], args[1]);
			}
			throw "internal error";
		},
		term_1: function(args) {
			if (args.length === 1) {
				return args[0];
			}
			if (args.length === 2 && args[0].length === 1 && args[0][0].constructor === English_FA) {
				return new English_FA_term(args[0][0], args[1]);
			}
			if (args.length === 2 && args[0].constructor === English_PU) {
				return new English_PU_term(args[0], args[1]);
			}
			throw "internal error";
		},
		sumti_2: function(args) {
			if (args.length === 1) {
				return args[0];
			}
			if (args.length === 2 && args[1].length === 1 && args[1][0].length === 2 && args[1][0][0].constructor === English_JOI) {
				return new English_joik_jek(args[0], args[1][0][0], args[1][0][1]);
			}
			throw "internal error";
		},
		sumti_5: function(args) {
			if (args.length === 1) {
				return args[0];
			}
			if (args.length === 2 && args[0].constructor === English_number) {
				return new English_number_term(args[0], args[1]);
			}
			throw "internal error";
		},
		sumti_6: function(args) {
			if (args.length === 1) {
				return args[0];
			}
			if (args.length === 2 && args[0].constructor === English_LE) {
				return new English_LE_KU(args[0], args[1]);
			}
			if (args.length === 3 && args[0].constructor === English_LU && args[2].constructor === English_LIhU) {
				return new English_LU_LIhU(args[0], args[1], args[2]);
			}
			if (args.length === 2 && args[0].constructor === English_LU) {
				return new English_LU_LIhU(args[0], args[1], new English_LIhU("li'u"));
			}
			if (args.length === 2 && args[0].constructor === English_LA) {
				return new English_LA_term(args[0], args[1]);
			}
			throw "internal error";
		},
		bridi_tail_3: function(args) {
			if (args.length === 2) {
				return new English_bridi(args[0], args[1]);
			}
			throw "internal error";
		},
		tanru_unit_2: function(args) {
			if (args.length === 1 && args[0].constructor === English_BRIVLA) {
				return args[0];
			}
			if (args.length === 2 && args[0].constructor === English_SE && args[1].constructor === English_BRIVLA) {
				return new English_SE_BRIVLA(args[0], args[1]);
			}
			if (args.length === 1 && args[0].constructor === English_GOhA) {
				return args[0];
			}
			if (args.length === 2 && args[0].constructor === English_NU && args[1].constructor === English_bridi) {
				return new English_NU_bridi(args[0], args[1]);
			}
			throw "internal error";
		},
		sentence: function(args) {
			if (args.length === 1 && args[0].constructor === English_bridi) {
				return args[0];
			}
			if (args.length === 2 && args[0].length === 1 && args[0][0].constructor === English_terms && args[1].constructor === English_bridi) {
				if (args[0][0].terms[args[0][0].terms.length - 1].constructor === English_CU) {
					args[0][0].terms.pop();
				}
				args[1].terms = args[0][0].terms.concat(args[1].terms.slice(1));
				return args[1];
			}
			throw "internal error";
		},
		relative_clause_1: function(args) {
			if (args.length === 2 && args[0].constructor === English_GOI) {
				return new English_relative_clause(args[0], args[1]);
			}
			throw "internal error";
		},
		relative_clause: function(args) {
			if (args.length === 1 && args[0].constructor === English_relative_clause) {
				return new English_relative_clauses(args);
			}
			if (args.length === 2 && args[0].every(function(a) { return a.constructor === English_relative_clause; }) && args[1].constructor === English_relative_clause) {
				return new English_relative_clauses(args[0].concat([args[1]]));
			}
			throw "internal error";
		}
	};

	function to(language, parsed) {
		if (typeof parsed === "string") {
			return parsed;
		}
		if (typeof parsed[0] === "string") {
			var args = parsed.slice(1).map(function(arg) {
				return to(language, arg);
			});
			if (parsed[0] in language) {
				return language[parsed[0]](args);
			}
			if (args.length === 1 && typeof args[0] === "object" && Object.prototype.toString.call(args[0]) !== "[object Array]") {
				return args[0];
			}
			if (args.length === 1 && Object.prototype.toString.call(args[0]) === "[object Array]" && args[0].length === 1 && typeof args[0][0] === "object" && Object.prototype.toString.call(args[0][0]) !== "[object Array]") {
				return args[0][0];
			}
			throw "internal error: unhandled " + parsed[0];
		}
		return parsed.map(function(arg) {
			return to(language, arg);
		});
	}

	return {
		toEnglish: function(text) {
			return to(English, camxes.parse(text));
		}
	};
}(typeof require === "function" ? require("./camxes.js") : this.camxes);

if (typeof exports !== "undefined" && typeof module !== "undefined" && typeof module.exports !== "undefined") {
	module.exports = fanva;
}
