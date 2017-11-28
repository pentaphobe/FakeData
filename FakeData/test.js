// [@todo make this actual tests, rather than an example file]
//

var fd = require('./FakeData');

fd.initialise({
	nameName: '{{name}}{{name}}'
});

// test single generation
console.log(fd.generateSingle('name'));

// test compound generation
console.log(fd.makeMeta([
	'Name: {{name}}',
	'Address: {{streetAddress}}',
	'CC: {{cc}}',
	'CRN: {{crn}}',
	'Balance: {{balance}}',
	'Ph: {{phone_au}}',
].join('\n'))());

// test additional generator passed through initialise()
console.log(fd.generateSingle('nameName'));

// test filters
console.log(fd.makeMeta('{{name,2|toUpperCase}}')() );

// test basic number filters
console.log('Adding commas:', fd.makeMeta('${{bigNumber | toFinancial | addCommas}}')() );


// test structure generator

var myModel = {
	name: '{{name}}',
	crn: '{{crn}}',
	balance: '{{balance}}',
	deposits: {
		array: true,
		count: 10,
		definition: {
			from_name: '{{name}}',
			credit: '{{balance}}'
		}
	}
};
console.log('Model with fixed length array:');
console.dir(fd.generateRecord(myModel));


var myModelRandomLength = {
	name: '{{name}}',
	crn: '{{crn}}',
	balance: '{{balance}}',
	deposits: {
		array: true,
		count: [5, 10],
		definition: {
			from_name: '{{name}}',
			credit: '{{balance}}'
		}
	}
};
console.log('Model with variable length array:');
console.dir(fd.generateRecord(myModelRandomLength));
