/**
* FakeData v0.10
* Generic system for generating test data
*
* Currently needs some refinement, but the basic principle is here
* Was built to have no dependencies, so is more verbose than would be ideal
*
* keilin.olsen@heathwallace.com
*/
(function(root, factory) {
	if (typeof define === "function" && define.amd) {
		define([], factory);
	} else if (typeof exports === "object") {
		module.exports = factory();
	} else {
		root.FakeData = factory();
	}
}(this, function() {


	var fs = require('fs'),
		seedrandom = require('seedrandom'),
		randStack = [], // for when you need a stack of seeded RNGs...
		rand = seedrandom();
		/**
		* The base generator definitions and examples
		* Each generator can be a function, array, or a string (potentially containing references to
		* other generators)
		*
		* @type {Object}
		*/
		examples = {
			integer: function(min, max) {
				min = min || 0;
				max = max || 1000;
				return randIntRange(min, max);
			},
			bigNumber: function(min, max, dp) {
				min = min || 0;
				max = max || 100000;
				dp = dp || 0;
				return randRange(min, max, dp);
			},
			lipsumWord: fs.readFileSync(__dirname + '/lipsum.txt', {encoding:'utf8'}).split(/\s+/),
			lipsum: function(count) {
				// [@todo needs work]
				// [@todo add list processing to FakeData so simplify some of these methods]
				// [@todo add support for passing arguments to generators]
				var
					result = [],
					capitalise = true,
					sentenceLength = 0;

				count = count || 100;
				for (var i=0; i < count; i++) {
					var word = this.generateSingle('lipsumWord');
					if (capitalise) {
						capitalise = false;
						word = word.charAt(0).toUpperCase() + word.slice(1);
					}
					if (sentenceLength > randIntRange(7, 20)) {
						sentenceLength = 0;
						capitalise = true;
						word += '.';
					} else if (sentenceLength > randIntRange(7, 20)) {
						sentenceLength /= 2;
						word += ',';
					}
					sentenceLength++;
					result.push(word);
				}
				return result.join(' ');
			},
			digit: '0123456789'.split(''),
			bigCurrency: function(){ return examples.bigNumber(0, 100000, 2); },
			alpha: 'qwertyuiopasdfghjklzxcvbnm'.split(''),
			alphaUpper: 'QWERTYUIOPASDFGHJKLZXCVBNM'.split(''),
			shortText: function() { return examples.lipsum.apply(this, [20]); },
			boolean: [true, false],
			streetName: 'Forston Tungle High Fordle Grape Batman Merchant Wallace Gramp'.split(' '),
			streetType: 'Lane Street Road Drive Crescent Place Avenue'.split(' '),
			streetTypeShort: 'Ln St Rd Dr Cs Pl Ave'.split(' '),
			street: '{{streetName}} {{streetType}}',
			streetAddress: '{{integer}} {{streetName}} {{streetTypeShort}}',
			town: 'Marsbar Groat Turnipcoat Smalltown Fnarfles Boatboat Saint-Rodolphus'.split(' '),
			state: 'NSW QLD SA TAS VIC WA ACT NT'.split(' '),
			address: '{{streetAddress}} {{town}} {{state}} {{digit, 4}}',
			accountNum: function() { return examples.integer(100000,999999); },
			firstName: 'John Chris Michael Binky Jenny Lisa Maria Mandible Yunta Harold Jeremy Jacob'.split(' '),
			lastName: 'Smith Jones Sturge Grandle Pendleton Fiddlesticks Tiddlesworth Haroldson Fink Mons Grastleburg'.split(' '),
			name: '{{firstName}} {{lastName}}',
			title: 'Mr Mrs Miss Ms Dr'.split(' '),
			fullName: '{{title}} {{name}}',
			maritalStatus: 'Single Married Divorced Widow Widower'.split(' '),
			email: '{{firstName}}.{{lastName}}@example.com',
			bureauCheckType: 'Utility result|Driver licence result|Profit and loss result'.split('|'),

			companyName: ['Burger', 'Chips', 'Previously-Owned Coffins', 'Ironmongers', 'Quality Wares', 'Paper Aeroplanes'],
			suffix: 'Company Co. Ltd Emporium Joint Amalgamated International'.split(' '),
			companyType: ['Incorporated', 'Limited', 'No liability', 'Proprietary Limited Company', 'Unlimited Proprietary', 'Emporium'],
			company: '{{firstName}}\'s {{companyName}} {{suffix}}',
			status: 'Active De-registered'.split(' '),
			report: ['15/06/2013', '12/01/2012', ''],
			anzsic: [
				'0132 Kiwifruit Growing',
				'0193 Beekeeping',
				'0411 Rock Lobster and Crab Potting',
				'0522 Shearing Services',
				'1132 Ice Cream Manufacturing',
				'1191 Potato, Corn and Other Crisp Manufacturing',
				'1311 Wool Scouring',
				'1491 Prefabricated Wooden Building Manufacturing',
				'1811 Industrial Gas Manufacturing',
				'1892 Explosive Manufacturing',
				'2292 Nut, Bolt, Screw and Rivet Manufacturing',
				'3922 Tyre Retailing',
				'5010 Scenic and Sightseeing Transport',
				'5301 Grain Storage Services'
			],
			bsb: '{{digit,3}}-{{digit,3}}',
			crn: '{{digit,9}}',
			acn: '{{digit,3}} {{digit,3}} {{digit,3}}',
			abn: '{{digit,2}} {{acn}}',
			clg: ' - ',
			cc: '4{{digit,3}} {{digit,4}} {{digit,4}} {{digit,4}}',
			balance: '${{bigNumber | toFinancial | addCommas}}',
			kyc: ['Verified', 'Pending', 'Not verified'],

			phoneType: 'Home Mobile Work Fax'.split(' '),
			phone_au: '+61 (0{{digit}})9{{digit,3}}-{{digit,4}}',

			month: function() {
				return ('0' + Math.floor(randRange(1, 12))).substr(-2);
			},
			monthName: 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' '),
			day: function() {
				return ('0' + Math.floor(randRange(1, 30))).substr(-2);
			},
			dayName: 'Mon Tue Wed Thu Fri Sat Sun'.split(' '),
			year: function() {
				return Math.floor(randRange(1970, 2050));
			},
			date: function() {
				return (new Date(2 * rand() * new Date().getTime())).toISOString();
			},
			pastDate: function() {
				return (new Date(rand() * new Date().getTime())).toISOString();
			},
			futureDate: function() {
				return (new Date((1 + rand()) * new Date().getTime())).toISOString();
			},
			applicationStage: ['quote', 'app', 'assess', 'fulfil'],
			applicationStatus: ['Re-work', 'Unsubmitted', 'Approved', 'Approved (offer issued)', 'Re-work', 'Unsubmitted', 'Awaiting assessment', 'Awaiting fulfilment', 'Editing application', 'Awaiting validation', 'Assessment'],
			securityType: ['Individual Guaranty & Indemnity', '1st RM', '2nd RM'],
			securityStatus: ['Held by ANZ', 'To be released'],

            facilityType:['ABL variable', 'ABL fixed', 'Asset Finance'],
			facilityCategory: ['ABL', 'BLA', 'LAB', 'ALB', 'LBA', 'BAL'],
			facilityPurpose: ['Purchase Residential Property', 'Purchase Commercial Property'],
			facilityRepaymentNature: ['Principal and Interest', 'Interest Only', 'Fixed Rate'],

            requiredDocsType: ['Driver license', 'Profit and loss', 'Utility bill', 'Passport', 'Building Deeds', 'Diploma Certificate', 'Ikea Construction Manual'],
            requiredDocsSpec: ['Must be valid', 'Must have been renewed in the last 2 years', 'Must be current', 'Needs to be dated', 'Must be co-signed', 'Must have been witnessed'],

			assetName: ['ANZ Access Account', 'ANZ Cash ISA', 'ANZ Savings Account', 'ANZ Property Account'],
			otherAssetName: ['Other bank accounts', 'Publicly listed shares', 'Property - residence', 'Property - other', 'Motor Vehicle', 'Superannuation', 'Boat', 'Plane'],
			liabilityName: ['ANZ Home loan variable', 'ANZ First Visa', 'ANZ Loan', 'ANZ Overdraft', 'ANZ Mortgage', 'ANZ Debenture'],
			otherLiabilityName: ['Motgage Loans', 'Credit/Store card limits', 'Personal overdrafts', 'Loan', 'Debenture', 'Car repayment plan'],
			expenditureName: ['ANZ repayments'],
			otherExpenditureName: ['Mortgage', 'Rent/Board', 'Other loans', 'General living', 'Credit / Store cards', 'Other', 'Lease / Hire purchase'],

			cts: 'medium secured full'.split(' '),
			applicationType: 'short medium long agri startup'.split(' ')
		};


	//****** UTILS THAT SHOULD BE IN DEPENDENCIES OR SUB_FILES
	// (originally wrote this file to be free of dependencies, but no need now)

	/**
	* Very basic deep extender [@todo I should replace this with underscore once it's in the project]
	*/
	function extend(target) {
		var args = Array.prototype.slice.call(arguments, 1);
		args.forEach(function(obj) {
			for (var k in obj) {
				var val = obj[k];
				if (typeof val === 'object' && typeof target[k] === 'object') {
					target[k] = extend(target[k], val[k]);
				} else {
					target[k] = val;
				}
			}
		});
		return target;
	}

	function randRange(min, max, dp) {
		var num = (rand() * (max - min) + min);
		return dp ? num.toFixed(dp) : num;

	}

	function randIntRange(min, max) {
		return Math.floor(randRange(min, max));
	}


	/**
	* [@todo bring in compose for this]
	*/
	var FakeData = {
		generators: {},
		templates: {},
		filters: {
			toUpperCase: function (txt) { return txt.toUpperCase(); },
			toLowerCase: function (txt) { return txt.toLowerCase(); },
			trim: function(txt) { return txt.trim(); },
			addCommas: function(txt) {
				txt = ''+txt;
				txt = txt.split('.');
				txt[0] = txt[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				return txt.join('.');
			},
			toFinancial: function(txt) {
				var numVal = parseFloat(txt, 10);
				numVal = numVal.toFixed(2);
				return '' + numVal;
			}
		},

		initialise: function(extraGenerators) {
			var generators = extend({}, examples, extraGenerators);
			this.addGenerators(generators);
		},

		/**
		* Adds a single generator to the collection, wraps data arguments in the appropriate
		* generator functions.  (eg. an array becomes a function returning one random element from that array)
		* @param {[type]}   name The name/ID of the generator to create
		* @param {Function, Array, String} fn   The generator function or data
		*/
		addGenerator: function(name, fn) {
			var gen = {
				name: name,
				fn: fn
			};

			if (typeof gen.fn === 'string') {
				gen.fn = this.makeMeta(gen.fn);
			} else if (typeof gen.fn === 'object' && typeof gen.fn.length === 'number') {
				gen.fn = this.makeSelect(gen.fn);
			}
			this.generators[name] = gen;
			return gen;
		},

		/**
		* Adds multiple generators
		* @param {Object} genObj A name->value map of generators
		*/
		addGenerators: function(genObj) {
			for (var k in genObj) {
				if (!genObj.hasOwnProperty(k)) {
					continue;
				}
				this.addGenerator(k, genObj[k]);
			}
		},

		/**
		* Gets the result of calling the named generator once
		* @param  {String} name The generator to call
		* @return {String}      The result
		*/
		generateSingle: function(name) {
			var args = Array.prototype.slice.call(arguments, 1),
				gen = this.generators[name];

			if (!gen) {
				return 'no generator named ' + name;
			}

			return gen.fn.apply(this, args);
		},

		addTemplate: function(name, template) {
			this.templates[name] = template;
			return template;
		},

		/**
		* Generates a result from a named template
		* @param  {String} name Template name
		* @return {String}      The templated result
		*/
		generate: function(name) {
			var result = {};
			var tpl = this.templates[name];
			for (var key in tpl) {
				if (!tpl.hasOwnProperty(key)) {
					continue;
				}
				result[key] = tpl.fn();
			}
			return result;
		},

		/**
		* Splits a template string into an array of parts, each entry being either a static string
		* or a generator function
		* @param  {String} tpl The template text
		* @return {Array}     Array of partials
		*/
		parseParts: function(tpl) {
			var _open = '{{';
			var _close = '}}';
			var parts = [];
			var idx = 0;
			var len = tpl.length;
			while (idx < len) {
				// [@todo use single var pattern, even though it's unpleasant sometimes]
				var openIdx = tpl.indexOf(_open, idx),
					text, closeIdx, templateData, firstSplit, filters,
					args, genName, count, generator;
				if (openIdx === -1) {
					break;
				}

				text = tpl.substring(idx, openIdx);

				if (text.length > 0) {
					parts.push(text);
				}

				closeIdx = tpl.indexOf(_close, openIdx + _open.length);
				if (closeIdx === -1) {
					console.error('unclosed template data, got as far as:', parts, tpl.substring(idx));
					return false;
				}
				templateData = tpl.substring(openIdx + _open.length, closeIdx);
				// separate filters
				firstSplit = templateData.split(/\s*\|\s*/);
				templateData = firstSplit[0];
				filters = firstSplit.slice(1);

				args = templateData.split(/\s*,\s*/);
				genName = args[0];
				count = args[1] || 1;
				generator = this.generators[genName];

				// ensure unique genName rather than reuse
				// jshint -W083
				(function(genName, count, filters) {
					parts.push(function() {
						var result = '';
						for (var i = 0; i < count; i++) {
							var tmp = this.applyFilters(this.generateSingle(genName), filters);
							if (typeof tmp === 'string'){
								result += tmp;
							}else{
								result = tmp;
							}
						}
						return result;
					});
				})(genName, count, filters);
				// jshint +W083

				idx = closeIdx + _close.length;
			}
			if (idx < len) {
				parts.push(tpl.substring(idx));
			}
			return parts;
		},

		/**
		* Applies a filter to the given text
		* @param  {String} txt        The input text
		* @param  {String} filterName The named filter to apply
		* @return {String}            The result
		*/
		applyFilter: function(txt, filterName) {
			// [@todo allow args for filters]
			var filter = this.filters[filterName];
			if (!filter) {
				return txt;
			}
			return filter.call(this, txt);
		},

		/**
		* Applies a series of filters to the given text
		* @param  {String} txt         The input text
		* @param  {Array} filterArray  An aray of filter names
		* @return {String}             The result
		*/
		applyFilters: function(txt, filterArray) {
			var _this = this;

			filterArray.forEach(function(filterName) {
				txt = _this.applyFilter(txt, filterName.trim());
			});
			return txt;
		},

		/**
		* Turns a string template into a generator function
		* @param  {String} tpl The text, containing templated generator references
		* @return {Function}     The resulting generator
		*/
		makeMeta: function(tpl) {
			var meta = this.parseParts(tpl),
				_this = this;

			return function() {
				var mapped = meta.map(function(val) {
					if (typeof val === 'function') {
						return val.call(_this);
					}
					return val;
				});

				if (mapped.length === 1){
					return mapped[0];
				}
				return mapped.join('');
			};
		},

		/**
		* turns an array of strings into a generator function which returns a random
		* entry
		* @param  {Array} arr The input array
		* @return {String}     One element from the array
		*/
		makeSelect: function(arr) {
			// [@todo allow meta templating within array entries]
			arr = arr.slice(0);
			return function() {
				return arr[Math.floor(randRange(0, arr.length))];
			};
		},

		/**
		* Generates a full structure from a template definition
		* @param  {Object} tpl A definition object
		* @param  {String} random number generator seed
		* @return {Object,Array}     The resulting random object
		*/
		generateRecord: function(tpl, seed) {
			var result;
			if (seed) {
				randStack.push(rand);
				rand = seedrandom(seed);
			}
			if (tpl.array) {
				result = this.generateArray(tpl);
			} else {
				result = {
					_id: seed
				};
				for (var k in tpl) {
					var val = tpl[k];
					if (typeof val === 'string') {
						result[k] = this.makeMeta(val)();
					} else if (typeof val === 'object') {
						result[k] = this.generateRecord(val);
					}
				}
			}
			if (seed) {
				rand = randStack.pop();
			}
			return result;
		},

		/**
		* Generates an array from a template definition
		* @param  {Object} tpl A definition object
		* @return {Array}     The random collection/array
		*/
		generateArray: function(tpl) {
			var result = [];
			var start = 0, stop = tpl.count;

			if (typeof stop !== 'number') {
				if (stop.length === 2) {
					
					stop = Math.floor(rand() * (stop[1] - stop[0])) + stop[0];
				} else {
					throw 'Invalid use of "count" in object definition:' + tpl.toString();
				}
			}
			var definition = tpl.definition;
			for (var i=start; i < stop; i++) {
				if (tpl.definition instanceof Array) {
					var index = Math.floor(rand() * tpl.definition.length);
					definition = tpl.definition[index];
				}
				result.push(this.generateRecord(definition, this.makeMeta('{{alpha,16}}')()));
			}
			return result;
		}
	};

	return FakeData;
}));
