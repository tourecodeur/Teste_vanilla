var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var buble = require('buble')

var HEADER = '/* Generated by `npm run build`, do not edit! */\n\n'

function compile (name, output, fix) {
  console.log(name, '→', output)
  mkdirp.sync(path.dirname(path.join(__dirname, output)))
  var source = fs.readFileSync(require.resolve(name), 'utf8')
  if (fix) source = fix(source)
  var result = buble.transform(source, {
    transforms: {
      dangerousForOf: true
    }
  })
  fs.writeFileSync(path.join(__dirname, output), HEADER + result.code, 'utf8')
}

function privateClassElements (str) {
  return str.replace('acorn-private-class-elements', '../private-class-elements')
}

compile('acorn-bigint', './lib/bigint/index.js')
compile('acorn-numeric-separator', './lib/numeric-separator/index.js')
compile('acorn-dynamic-import', './lib/dynamic-import/index.js')
compile('acorn-import-meta', './lib/import-meta/index.js')
compile('acorn-export-ns-from', './lib/export-ns-from/index.js')
compile('acorn-class-fields', './lib/class-fields/index.js', privateClassElements)
compile('acorn-static-class-features', './lib/static-class-features/index.js', privateClassElements)
compile('acorn-private-class-elements', './lib/private-class-elements/index.js', function (str) {
  return str.replace('class extends Parser', 'class Parser_ extends Parser')
    // it also works with v7
    .replace('if (acorn.version.indexOf("6.") != 0 || acorn.version.indexOf("6.0.") == 0) {', 'if (false) {')
})
