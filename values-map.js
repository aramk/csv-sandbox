var csv = require('csv');
var fs = require('fs');
var _ = require('underscore');

var args = process.argv.slice(2);
var inputPath = args[0];
var outputPath = args[1];
if (typeof inputPath !== 'string' || inputPath.length === 0) {
  throw new Error('Invalid CSV path', inputPath);
}

var csvData = fs.readFileSync(inputPath, 'utf8');
var excludedHeaders = ['EASTING', ''];

var values = [];
csv.parse(csvData, {columns: true}, function(err, rows) {
  // Second row is also a header.
  rows.shift()
  // rows = rows.splice(0, 10)
  _.each(rows, function(row) {
    _.each(excludedHeaders, function(excludedHeader) {
      delete row[excludedHeader];
    });
    _.each(row, function(value, key) {
      row[key] = parseFloat(value);
    });
    values.push(row);
  });
  if (outputPath) {
    fs.writeFileSync(outputPath, JSON.stringify(values));
  } else {
    console.log(values);
  }
});
