var csv = require('csv');
var fs = require('fs');
var _ = require('underscore');

var args = process.argv.slice(2);
var inputPath = args[0];
var outputPath = args[1];
if (typeof inputPath !== 'string' || inputPath.length === 0) {
  throw new Error('Invalid input path', inputPath);
}

var jsonData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
var headers = {};
var flatRows = _.map(jsonData, function(row) {
  var flatRow = flattenProperties(row);
  _.each(flatRow, function(value, key) {
    headers[key] = true;
  });
  return flatRow;
});
// Add all properties to all rows.
_.each(flatRows, function(flatRow) {
  _.each(headers, function(value, key) {
    flatRow[key] = flatRow[key];
  });
});

var values = [];
var stringifyArgs = {header: true, lineBreaks: 'windows', rowDelimiter: 'windows'};
csv.stringify(flatRows, stringifyArgs, function(err, result) {
  if (err) {
    throw err;
  }
  if (outputPath) {
    fs.writeFileSync(outputPath, result);
  } else {
    console.log(result);
  }
});

function flattenProperties(obj) {
  var flattened = {};
  _.each(obj, function(value, key) {
    if (typeof value === 'object') {
      _.each(flattenProperties(value), function(flatValue, flatKey) {
        flattened[key + '.' + flatKey] = flatValue;
      });
    } else {
      flattened[key] = value;
    }
  });
  return flattened;
}
