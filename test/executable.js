var testdata = require('./testdata.json');

var len = Math.max(testdata.stdout.length, testdata.stderr.length);

for (var i = 0; i < len; i++) {
	if (i < testdata.stdout.length){
		console.log(testdata.stdout[i]);
	}
	if (i < testdata.stderr.length){
		console.error(testdata.stderr[i]);
	}
}
