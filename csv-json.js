var csv = require('csv');
var fs = require('fs');
var _ = require('underscore');

var args = process.argv.slice(2);
var inputPath = args[0];
var outputPath = args[1];
if (typeof inputPath !== 'string' || inputPath.length === 0) {
  throw new Error('Invalid input path', inputPath);
}

var csvData = fs.readFileSync(inputPath, 'utf8');

var values = [];
csv.parse(csvData, {columns: true}, function(err, result) {
  if (err) {
    throw err;
  }
  if (outputPath) {
    fs.writeFileSync(outputPath, JSON.stringify(result));
  } else {
    console.log(JSON.stringify(result));
  }
});
