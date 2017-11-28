/**
* These data definitions are used to create local URLs that will return generated
* fake data
*
* eg. `module.exports.accountList` associates with `http://localhost:3001/data/accountList`
* and will return an array of account definitions
*
* @type {Object}
*/

var phone = {
		type: '{{phoneType}}',
		number: '{{phone_au}}',
		preferred: '{{boolean}}'
	},
	note = {
		date: '{{pastDate}}',
		note: '{{shortText}}',
		author: '{{name}}',
		mode: 'maintenance'
	},
	securityIndicator = {
		type: '{{securityType}}',
		status: '{{securityStatus}}',
		proposedStatus: '{{securityStatus}}',
		value: '{{bigNumber}}'
	},
	application = {
		accountId: '{{alpha,16}}',
		lendAmount: '{{bigNumber}}',
		stage: '{{applicationStage}}',
		status: '{{applicationStatus}}',
		facilities: {
			array: true,
			count: [1, 4],
			definition: {
				type: '{{facilityType}}',
				category: '{{facilityCategory}}',
				purpose: '{{facilityPurpose}}',
				accountNum: '{{accountNum}}',
				accountHolder: '{{company}}',
				currentBalance: '{{bigCurrency}}',
				requestedIncrease: '{{bigCurrency}}',
				origionalAmount: '{{bigCurrency}}',
				repaymentNature: '{{facilityRepaymentNature}}',
				redrawAvailable: '{{bigCurrency}}'
			}
		},
		statementOfPosition: {
			name: '{{name}}',
			anzAssets: {
				array: true,
				count: [1, 2],
				definition: {
					name: '{{assetName}}',
					value: '{{bigNumber}}'
				}
			},
			otherAssets: {
				array: true,
				count: [1, 6],
				definition: {
					name: '{{otherAssetName}}',
					value: '{{bigNumber}}'
				}
			},
			assetTotal: '{{bigNumber}}',
			anzLiabilities: {
				array: true,
				count: [1, 2],
				definition: {
					name: '{{liabilityName}}',
					value: '{{bigNumber}}'
				}
			},
			otherLiabilities: {
				array: true,
				count: [1, 6],
				definition: {
					name: '{{otherLiabilityName}}',
					value: '{{bigNumber}}'
				}
			},
			liabilityTotal: '{{bigNumber}}',
			income: {
				array: true,
				count: [1, 4],
				definition: {
					name: '{{name}}',
					taxableIncome: '{{bigNumber}}',
					otherIncome: '{{bigNumber}}',
					description: ''
				}
			},
			incomeTotal: '{{bigNumber}}',
			anzExpenditure: {
				array: true,
				count: [1, 2],
				definition: {
					name: '{{expenditureName}}',
					value: '{{bigNumber}}'
				}
			},
			otherExpenditure: {
				array: true,
				count: [3, 6],
				definition: {
					name: '{{otherExpenditureName}}',
					value: '{{bigNumber}}'
				}
			},
			expenditureTotal: '{{bigNumber}}'
		},
		requiredDocs: {
			array: true,
			count: [3, 7],
			definition: {
				id: '{{alphaUpper,3}}{{digit,7}}',
				type: '{{requiredDocsType}}',
				spec: '{{requiredDocsSpec}}'
			}
		},
		documents: {
			array: true,
			count: [2, 6],
			definition: {
				type: '{{requiredDocsType}}',
				version: '{{digit}}.{{digit}}',
				note: '',
				updated: '{{pastDate}}',
				who: '{{name}}'
			}
		},
		securities: {
			array: true,
			count: [0, 3],
			definition: securityIndicator
		},
		guarantors: {
			array: true,
			count: [0, 3],
			definition: {
				firstName: '{{firstName}}',
				lastName: '{{lastName}}',
				dateOfBirth: '{{pastDate}}',
				address: '{{address}}',
				kyc: '{{kyc}}',
				licence: 'YES ({{state}})'
			}
		},
		dualApplication: '{{boolean}}',
		assetFinance: {
			id: '{{alphaUpper,3}}{{digit,7}}',
			amount: '{{digit,3}}'
		},
		mortgages: {
			id: '{{alphaUpper,3}}{{digit,7}}',
			amount: '{{digit,3}}'
		},
		balanceIncrease: '{{bigNumber}}',
		allDirectors: '{{boolean}}',
		securityContinuing: '{{boolean}}',
		regulatedProduct: '{{boolean}}',
		exceptionalCircumstances: '{{boolean}}',
		requirementsMet: '{{boolean}}',
		cts: '{{cts}}',
		type: '{{applicationType}}'
	},
	person = {
		title: '{{title}}',
		name: '{{name}}',
		accountType: 'individual',
		dateOfBirth: '{{pastDate}}',
		address: '{{address}}',
		workAddress: '{{address}}',
		phones: {
			array: true,
			count: [2, 5],
			definition: phone
		},
		email: '{{email}}',
		appointed: '{{pastDate}}',
		kyc: '{{kyc}}',
		licence: 'YES ({{state}})',
		maritalStatus: '{{maritalStatus}}',
		spouseTitle: '{{title}}',
		spouseName: '{{name}}',
		notes: {
			array: true,
			count: [2, 10],
			definition: note
		},
		riskGrade: '{{digit}}{{alphaUpper}}',
		performanceIndicator: '{{digit}}',
		balance: '{{bigNumber}}',
		assetFinance: '{{bigNumber}}',
		mortgages: '{{bigNumber}}',
		commenced: '{{pastDate}}'

	},
	company = {
		name: '{{company}}',
		accountType: 'business',
		type: '{{companyType}}',
		tradingName: '{{company}}',
		commenced: '{{pastDate}}',
		anzsic: '{{anzsic}}',
		address: '{{address}}',
		abn: '{{abn}}',
		acn: '{{acn}}',
		crn: '{{crn}}',
		clg: '{{clg}}',
		kyc: '{{kyc}}',
		status: '{{status}}',
		report: '{{report}}',
		directors: {
			array: true,
			count: [1,5],
			definition: person
		},
		trustees: {
			array: true,
			count: [1,3],
			definition: {
				name: '{{company}}',
				type: '{{companyType}}',
				abn: '{{abn}}',
				status: '{{status}}',
				beneficiaries: {
					array: true,
					count: [1,5],
					definition: {
						name: '{{name}}'
					}
				}
			}
		},
		notes: {
			array: true,
			count: [2, 10],
			definition: note
		},
		bureauCheck: {
			array: true,
			count: [1, 2],
			definition: {
				name: '{{name}}',
				type: '{{bureauCheckType}}',
				amount: '{{integer}}'
			}
		},
		additionalDetails: {
			array: true,
			count: [2, 5],
			definition: {
				name: '{{name}}',
				appointed: '{{pastDate}}',
				contact: {
					home: '{{phone_au}}',
					mobile: '{{phone_au}}',
					fax: '{{phone_au}}',
					email: '{{email}}',
					homeAdd: '{{address}}',
					workAdd: '{{address}}'
				},
				dob: '{{pastDate}}',
				driverLicence: '{{boolean}}',
				marritalStatus: {
					married: '{{boolean}}',
					name: '{{name}}'
				}
			}
		},
		riskGrade: '{{digit}}{{alphaUpper}}',
		performanceIndicator: '{{digit}}',
		balance: '{{bigNumber}}',
		assetFinance: '{{bigNumber}}',
		mortgages: '{{bigNumber}}'
	};

module.exports = {
	accountList: {
		array: true,
		count: [0, 3],
		definition: [person, company]
	},

	applicationList: {
		array: true,
		count: [4, 8],
		definition: application
	},

	person: person,
	
	company: company,
	
	application: application,
	
	securityList: {
		array: true,
		count: [1, 4],
		definition: securityIndicator
	},
	
	companyList: {
		array: true,
		count: [0, 10],
		definition: company
		
	},
	
	lipsum: {
		text: '{{lipsum}}'
	}
};
